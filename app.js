let baseDatos = null;

async function cargarDatos() {
    const contenedor = document.getElementById('resultados-container');
    
    try {
        const respuestaSrv = await fetch(`horarios.json?v=${Date.now()}`);
        const dataNueva = await respuestaSrv.json();

        const ultimaLocal = localStorage.getItem('ultima_update');
        const ultimaServidor = dataNueva.ultima_update;

        if (ultimaServidor !== ultimaLocal) {
            baseDatos = dataNueva;
            localStorage.setItem('baseDatos', JSON.stringify(dataNueva));
            localStorage.setItem('ultima_update', ultimaServidor);
        } else {
            const localStored = localStorage.getItem('baseDatos');
            baseDatos = JSON.parse(localStored);

        }

    } catch (error) {
        console.warn("⚠️ Sin conexión. Intentando usar datos locales...");
        const localStored = localStorage.getItem('baseDatos');
        if (localStored) {
            baseDatos = JSON.parse(localStored);
        } else {
            contenedor.innerHTML = "<p class='no-data'>Primera vez: Necesitas internet para descargar horarios.</p>";
            throw error;
        }
    }
}

async function inicializarApp() {
    try {
        await cargarDatos();
        
        if (!baseDatos) {
            throw new Error("No se pudo cargar la base de datos");
        }

        const origenSelect = document.getElementById('origen-select');
        const destinoSelect = document.getElementById('destino-select');
        const diaSelect = document.getElementById('dia-select');
        const btnBuscar = document.getElementById('buscar-btn');
        const btnSwap = document.getElementById('btn-swap');
        const checkVerTodo = document.getElementById('ver-todo');

        function cargarEstaciones() {
            const todas = [...estacionesEFE["Línea 1"], ...estacionesEFE["Línea 2"]];
            const unicas = todas.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

            const html = unicas.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
            origenSelect.innerHTML = html;
            destinoSelect.innerHTML = html;

            origenSelect.value = "16"; // Concepción
            destinoSelect.value = "35"; // Coronel
        }

        function obtenerViajesSeguros(origen, destino, tipoDia) {
            const key = `${origen}-${destino}`;
            const datos = baseDatos.rutas[key];
            if (!datos) return [];
            return Array.isArray(datos) ? datos : (datos[tipoDia] || []);
        }

        function realizarBusqueda() {
            const origen = origenSelect.value;
            const destino = destinoSelect.value;
            const diaElegido = diaSelect.value;
            const mostrarTodo = checkVerTodo.checked;

            if (origen === destino) {
                alert("Selecciona estaciones diferentes.");
                return;
            }

            const ahora = new Date();
            const hoyIso = ahora.toISOString().split('T')[0];
            const listaFeriados = baseDatos.feriados || [];
            const esFeriado = listaFeriados.includes(hoyIso);
            const diaSemana = ahora.getDay();

            // ⭐ CASO ESPECIAL: Si eligió "HOY" y es feriado
            if (diaElegido === "hoy" && esFeriado) {
                const contenedor = document.getElementById('resultados-container');
                
                let nombreFeriado = "Feriado";
                if (baseDatos.feriados_info) {
                    const feriadoInfo = baseDatos.feriados_info.find(f => f.fecha === hoyIso);
                    if (feriadoInfo) nombreFeriado = feriadoInfo.nombre;
                }
                
                console.log(`🚫 Hoy es feriado (${nombreFeriado}): Biotrén no opera`);
                
                contenedor.innerHTML = `
                    <div class="mensaje-feriado">
                        <div class="icono-feriado">🚫</div>
                        <h3>Biotrén no opera hoy</h3>
                        <p><strong>Hoy es ${nombreFeriado}</strong></p>
                        <p>El servicio de Biotrén <strong>no funciona en feriados</strong>.</p>
                        <div class="sugerencia">
                            💡 <strong>Sugerencia:</strong> Puedes consultar horarios para otros días usando el selector de arriba.
                        </div>
                    </div>
                `;
                
                const contenedorFiltro = document.querySelector('.filtro-tiempo');
                contenedorFiltro.style.display = 'none';
                return;
            }

            let tipoHorario;
            if (diaElegido === "hoy") {
                if (diaSemana === 0) tipoHorario = "festivo";
                else if (diaSemana === 6) tipoHorario = "sabado";
                else tipoHorario = "laboral";
            } else {
                tipoHorario = diaElegido;
            }


            let viajes = obtenerViajesSeguros(origen, destino, tipoHorario);

            if (viajes.length === 0 && origen !== "16" && destino !== "16") {
                console.log("🔄 No hay ruta directa, buscando combinaciones...");
                const tramo1 = obtenerViajesSeguros(origen, "16", tipoHorario);
                const tramo2 = obtenerViajesSeguros("16", destino, tipoHorario);
                
                tramo1.forEach(t1 => {
                    const combina = tramo2.find(t2 => t2.s > t1.ll);
                    if (combina) {
                        viajes.push({
                            s: t1.s,
                            ll: combina.ll,
                            d: "Comb. Concepción",
                            v: parseInt(t1.v) + parseInt(combina.v)
                        });
                    }
                });
                
                if (viajes.length > 0) {
                    console.log(`✅ Encontradas ${viajes.length} combinaciones`);
                }
            }

            const horaActualStr = ahora.getHours().toString().padStart(2, '0') + ":" + 
                                  ahora.getMinutes().toString().padStart(2, '0');

            const hayPasados = diaElegido === "hoy" && viajes.some(t => t.s < horaActualStr);
            
            const contenedorFiltro = document.querySelector('.filtro-tiempo');
            if (diaElegido === "hoy" && hayPasados) {
                contenedorFiltro.style.display = 'flex';
                contenedorFiltro.style.opacity = '1';
                checkVerTodo.disabled = false;
            } else {
                contenedorFiltro.style.display = 'none';
                checkVerTodo.disabled = true;
                checkVerTodo.checked = false;
            }

            let viajesFiltrados = viajes;
            if (diaElegido === "hoy" && !mostrarTodo) {
                viajesFiltrados = viajes.filter(t => t.s >= horaActualStr);
            }

            renderizarHorarios(viajesFiltrados, horaActualStr, diaElegido === "hoy");
        }

        function limpiarResultados() {
            const contenedor = document.getElementById('resultados-container');
            contenedor.innerHTML = "<p class='no-data'>Selecciona tu ruta para ver los próximos trenes.</p>";
            
            const contenedorFiltro = document.querySelector('.filtro-tiempo');
            contenedorFiltro.style.display = 'none';
            checkVerTodo.disabled = true;
            checkVerTodo.checked = false;
        }
        
        btnBuscar.addEventListener('click', realizarBusqueda);
        btnSwap.addEventListener('click', () => {
            const temp = origenSelect.value;
            origenSelect.value = destinoSelect.value;
            destinoSelect.value = temp;
            limpiarResultados();
        });

        origenSelect.addEventListener('change', limpiarResultados);
        destinoSelect.addEventListener('change', limpiarResultados);
        diaSelect.addEventListener('change', limpiarResultados);
        checkVerTodo.addEventListener('change', realizarBusqueda);

        cargarEstaciones();
        verificarFeriado();
        mostrarFecha();
        mostrarUltimaActualizacion();
        inicializarFavoritos();
        

    } catch (error) {
        console.error("❌ Error crítico al inicializar app:", error);
        document.getElementById('resultados-container').innerHTML = 
            "<p class='no-data'>Error al cargar la aplicación. Revisa la consola.</p>";
    }
}

function renderizarHorarios(trenes, horaActual, esHoy) {
    const contenedor = document.getElementById('resultados-container');
    if (trenes.length === 0) {
        contenedor.innerHTML = "<p class='no-data'>No hay trenes disponibles para esta ruta.</p>";
        return;
    }

    contenedor.innerHTML = trenes.map(t => `
        <div class="tarjeta-tren ${(esHoy && t.s < horaActual) ? 'pasado' : ''}">
            <div class="hora-principal">
                <div class="bloque-hora">
                    <span class="etiqueta">Salida</span>
                    <span class="valor">${t.s}</span>
                </div>
                <div class="flecha">➔</div>
                <div class="bloque-hora">
                    <span class="etiqueta">Llegada</span>
                    <span class="valor">${t.ll}</span>
                </div>
            </div>
            <div class="info-extra">
                <span>⏱️ ${t.d}</span> | <span>💰 $${t.v}</span>
            </div>
        </div>
    `).join('');
}

function verificarFeriado() {
    const hoy = new Date().toISOString().split('T')[0];
    const aviso = document.getElementById('aviso-feriado');
    const avisoSemana = document.getElementById('aviso-feriados-semana');
    
    // Verificar si HOY es feriado
    if (baseDatos && baseDatos.feriados && baseDatos.feriados.includes(hoy)) {
        let nombreFeriado = "Feriado";
        
        if (baseDatos.feriados_info) {
            const feriadoInfo = baseDatos.feriados_info.find(f => f.fecha === hoy);
            if (feriadoInfo) nombreFeriado = feriadoInfo.nombre;
        }
        
        console.log(`🚫 HOY ES FERIADO: ${nombreFeriado} - Biotrén no opera`);
        
        if(aviso) {
            aviso.innerHTML = `🚫 <strong>HOY ES ${nombreFeriado.toUpperCase()}</strong> - Biotrén NO opera en feriados`;
            aviso.style.display = "block";
            aviso.classList.remove('hidden');
        }
    }
    
    // ⭐ NUEVO: Verificar si MAÑANA es feriado (advertencia preventiva)
    if (baseDatos && baseDatos.feriados_semana && baseDatos.feriados_semana.length > 0) {
        const manana = new Date();
        manana.setDate(manana.getDate() + 1);
        const mananaStr = manana.toISOString().split('T')[0];
        
        const feriadoManana = baseDatos.feriados_semana.find(f => f.fecha === mananaStr);
        
        if (feriadoManana && avisoSemana) {
            avisoSemana.innerHTML = `
                <div style="background: rgba(255, 193, 7, 0.15); border-left: 4px solid #ffc107; padding: 12px; border-radius: 8px;">
                    <strong>⚠️ Mañana es feriado:</strong> ${feriadoManana.nombre} - Biotrén NO operará
                </div>
            `;
            avisoSemana.classList.remove('hidden');
            avisoSemana.style.display = "block";
        }
    }
}

function mostrarFecha() {
    const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
    const fechaEl = document.getElementById('fecha-actual');
    if (fechaEl) {
        fechaEl.innerText = new Date().toLocaleDateString('es-CL', opciones);
    }
}

function mostrarUltimaActualizacion() {
    if (baseDatos && baseDatos.ultima_update) {
        console.log(`📅 Última actualización: ${baseDatos.ultima_update}`);
        
        if (baseDatos.advertencias && baseDatos.advertencias.length > 0) {
            console.warn("⚠️ Advertencias:");
            baseDatos.advertencias.forEach(adv => console.warn("  -", adv));
        }
    }
}

// ⭐ Escuchar mensajes del Service Worker (solo logs)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'HORARIOS_UPDATED') {
            console.log('📲 Service Worker: Nuevos horarios disponibles');
            
            // Recargar datos automáticamente en segundo plano
            cargarDatos().then(() => {
                console.log('✅ Datos recargados automáticamente');
            }).catch(err => {
                console.error('❌ Error al recargar datos:', err);
            });
        }
    });
}

// ⭐ Detectar cambios de conexión (solo logs)
window.addEventListener('online', () => {
    console.log('🌐 Conexión restaurada');
    
    // Sincronizar automáticamente
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
            return registration.sync.register('sync-horarios');
        }).then(() => {
            console.log('🔄 Sincronización en segundo plano registrada');
        }).catch((error) => {
            console.warn('⚠️ No se pudo registrar sync:', error);
            // Fallback: cargar manualmente
            cargarDatos();
        });
    } else {
        console.log('ℹ️ Background Sync no soportado, cargando manualmente');
        cargarDatos();
    }
});




// ===========================
// SISTEMA DE RUTAS FAVORITAS
// ===========================

const FAVORITOS_KEY = 'biotren_favoritos';

// --- Persistencia localStorage (online + offline) ---
function cargarFavoritos() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITOS_KEY)) || [];
    } catch {
        return [];
    }
}

function guardarFavoritos(favs) {
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favs));
}

function obtenerNombreEstacion(id) {
    const todas = [...estacionesEFE["Línea 1"], ...estacionesEFE["Línea 2"]];
    const est = todas.find(e => e.id === id);
    return est ? est.nombre : id;
}

function poblarSelectsFavorito(origenId, destinoId) {
    const todas = [...estacionesEFE["Línea 1"], ...estacionesEFE["Línea 2"]]
        .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
    const html = todas.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
    const selOrigen = document.getElementById('fav-origen');
    const selDestino = document.getElementById('fav-destino');
    selOrigen.innerHTML = html;
    selDestino.innerHTML = html;
    selOrigen.value  = origenId  || "16";
    selDestino.value = destinoId || "35";
}

// --- Render principal de la lista ---
function renderizarFavoritos() {
    const favs  = cargarFavoritos();
    const lista  = document.getElementById('favoritos-lista');
    const vacio  = document.getElementById('favoritos-vacio');
    const badge  = document.getElementById('fav-badge');

    badge.textContent = favs.length;
    badge.style.display = favs.length > 0 ? 'inline' : 'none';

    lista.querySelectorAll('.favorito-card').forEach(el => el.remove());

    if (favs.length === 0) {
        vacio.style.display = 'block';
        return;
    }
    vacio.style.display = 'none';

    favs.forEach((fav, idx) => {
        const card = document.createElement('div');
        card.className = 'favorito-card';
        card.dataset.idx = idx;

        const nombreOrigen  = obtenerNombreEstacion(fav.origen);
        const nombreDestino = obtenerNombreEstacion(fav.destino);

        card.innerHTML = `
            <div class="favorito-trigger">
                <div class="favorito-info">
                    <div class="favorito-nombre">${fav.nombre}</div>
                    <div class="favorito-ruta">
                        ${nombreOrigen}<span class="separador-ruta">→</span>${nombreDestino}
                    </div>
                </div>
                <div class="favorito-acciones">
                    <button class="btn-consultar-fav" data-idx="${idx}">Consultar</button>
                    <button class="btn-editar-fav"   data-idx="${idx}" title="Editar ruta">✏️</button>
                    <button class="btn-eliminar-fav" data-idx="${idx}" title="Eliminar ruta">✕</button>
                </div>
            </div>
            <div class="favorito-resultados" id="fav-res-${idx}"></div>
        `;
        lista.appendChild(card);
    });

    // Eventos
    lista.querySelectorAll('.btn-consultar-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            consultarFavorito(parseInt(btn.dataset.idx), btn);
        });
    });

    lista.querySelectorAll('.btn-editar-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            abrirModalEditar(parseInt(btn.dataset.idx));
        });
    });

    lista.querySelectorAll('.btn-eliminar-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            eliminarFavorito(parseInt(btn.dataset.idx));
        });
    });
}

// --- Eliminar ---
function eliminarFavorito(idx) {
    if (!confirm('¿Eliminar esta ruta favorita?')) return;
    const favs = cargarFavoritos();
    favs.splice(idx, 1);
    guardarFavoritos(favs);
    renderizarFavoritos();
}

// --- Abrir modal en modo EDITAR ---
function abrirModalEditar(idx) {
    const favs = cargarFavoritos();
    const fav  = favs[idx];
    if (!fav) return;

    poblarSelectsFavorito(fav.origen, fav.destino);
    document.getElementById('fav-nombre').value = fav.nombre;

    // Marcar modal en modo edición
    const modal = document.getElementById('modal-favorito');
    modal.dataset.editIdx = idx;
    modal.dataset.modo = 'editar';
    document.getElementById('modal-titulo-txt').textContent = 'Editar Ruta';
    document.getElementById('btn-modal-guardar').textContent = '💾 Guardar cambios';

    modal.classList.add('visible');
    document.getElementById('fav-nombre').focus();
}

async function consultarFavorito(idx, btnEl) {
    if (!baseDatos) return;

    const favs = cargarFavoritos();
    const fav = favs[idx];
    if (!fav) return;

    const resContainer = document.getElementById(`fav-res-${idx}`);
    const card = resContainer.closest('.favorito-card');

    // Toggle: si ya está abierto, cerrar
    if (resContainer.classList.contains('visible')) {
        resContainer.classList.remove('visible');
        card.classList.remove('activo');
        return;
    }

    // Cerrar otros abiertos
    document.querySelectorAll('.favorito-resultados.visible').forEach(el => {
        el.classList.remove('visible');
        el.closest('.favorito-card').classList.remove('activo');
    });

    card.classList.add('activo');
    resContainer.classList.add('visible');
    resContainer.innerHTML = `<div class="fav-loading"><div class="spinner-mini"></div> Consultando…</div>`;

    // Pequeño delay para mostrar el spinner
    await new Promise(r => setTimeout(r, 100));

    const ahora = new Date();
    const hoyIso = ahora.toISOString().split('T')[0];
    const listaFeriados = baseDatos.feriados || [];
    const esFeriado = listaFeriados.includes(hoyIso);
    const diaSemana = ahora.getDay();

    // Es feriado hoy → mostrar mensaje
    if (esFeriado) {
        let nombreFeriado = "Feriado";
        if (baseDatos.feriados_info) {
            const fi = baseDatos.feriados_info.find(f => f.fecha === hoyIso);
            if (fi) nombreFeriado = fi.nombre;
        }
        resContainer.innerHTML = `
            <div class="fav-feriado-aviso">
                <strong>🚫 Hoy es ${nombreFeriado}</strong>
                El Biotrén no opera en feriados.
            </div>
        `;
        return;
    }

    // Tipo de horario según día
    let tipoHorario;
    if (diaSemana === 0) tipoHorario = "festivo";
    else if (diaSemana === 6) tipoHorario = "sabado";
    else tipoHorario = "laboral";

    const horaActualStr = ahora.getHours().toString().padStart(2, '0') + ":" +
                          ahora.getMinutes().toString().padStart(2, '0');

    // Obtener viajes (misma lógica que la búsqueda principal)
    const key = `${fav.origen}-${fav.destino}`;
    const datos = baseDatos.rutas[key];
    let viajes = [];
    if (datos) {
        viajes = Array.isArray(datos) ? datos : (datos[tipoHorario] || []);
    }

    // Combinaciones si no hay ruta directa
    if (viajes.length === 0 && fav.origen !== "16" && fav.destino !== "16") {
        const t1 = baseDatos.rutas[`${fav.origen}-16`];
        const t2 = baseDatos.rutas[`16-${fav.destino}`];
        const tramo1 = t1 ? (Array.isArray(t1) ? t1 : (t1[tipoHorario] || [])) : [];
        const tramo2 = t2 ? (Array.isArray(t2) ? t2 : (t2[tipoHorario] || [])) : [];
        tramo1.forEach(x1 => {
            const combina = tramo2.find(x2 => x2.s > x1.ll);
            if (combina) {
                viajes.push({ s: x1.s, ll: combina.ll, d: "Comb. Concepción", v: parseInt(x1.v) + parseInt(combina.v) });
            }
        });
    }

    // Solo próximos trenes (desde ahora)
    const proximos = viajes.filter(t => t.s >= horaActualStr);

    if (proximos.length === 0 && viajes.length === 0) {
        resContainer.innerHTML = `<div class="fav-no-trenes">No hay trenes disponibles para esta ruta hoy.</div>`;
        return;
    }

    if (proximos.length === 0) {
        resContainer.innerHTML = `<div class="fav-no-trenes">No quedan más trenes por hoy. 🌙</div>`;
        return;
    }

    // ⭐ CAMBIO: Mostrar TODOS los próximos trenes en lugar de solo 4
    const aRenderizar = proximos;

    resContainer.innerHTML = `
        <div class="fav-trenes">
            ${aRenderizar.map(t => `
                <div class="fav-tren-item">
                    <div class="fav-hora-bloque">
                        <span class="fav-hora">${t.s}</span>
                        <span class="fav-flecha">→</span>
                        <span class="fav-hora">${t.ll}</span>
                    </div>
                    <div class="fav-meta">
                        <span>⏱ ${t.d}</span>
                        <span>💰 $${t.v}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function inicializarFavoritos() {
    poblarSelectsFavorito();
    renderizarFavoritos();

    const modal     = document.getElementById('modal-favorito');
    const btnNueva  = document.getElementById('btn-nueva-ruta');
    const btnCancelar = document.getElementById('btn-modal-cancelar');
    const btnGuardar  = document.getElementById('btn-modal-guardar');
    const inputNombre = document.getElementById('fav-nombre');

    function resetModal() {
        modal.dataset.modo    = 'crear';
        modal.dataset.editIdx = '';
        document.getElementById('modal-titulo-txt').textContent = 'Nueva Ruta Favorita';
        btnGuardar.textContent = '⭐ Guardar ruta';
        inputNombre.value = '';
        poblarSelectsFavorito();
    }

    function cerrarModal() {
        modal.classList.remove('visible');
        resetModal();
    }

    // Abrir modal en modo CREAR
    btnNueva.addEventListener('click', () => {
        resetModal();
        modal.classList.add('visible');
        inputNombre.focus();
    });

    btnCancelar.addEventListener('click', cerrarModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });

    // Guardar (crear o editar)
    btnGuardar.addEventListener('click', () => {
        const nombre  = inputNombre.value.trim();
        const origen  = document.getElementById('fav-origen').value;
        const destino = document.getElementById('fav-destino').value;

        if (!nombre) {
            inputNombre.focus();
            inputNombre.style.borderColor = 'var(--rojo-vibrante)';
            setTimeout(() => inputNombre.style.borderColor = '', 1500);
            return;
        }
        if (origen === destino) {
            alert("Selecciona estaciones diferentes.");
            return;
        }

        const favs = cargarFavoritos();
        const modo  = modal.dataset.modo;

        if (modo === 'editar') {
            const idx = parseInt(modal.dataset.editIdx);
            favs[idx] = { nombre, origen, destino };
        } else {
            favs.push({ nombre, origen, destino });
        }

        guardarFavoritos(favs);
        renderizarFavoritos();
        cerrarModal();
    });

    // Enter en nombre
    inputNombre.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') btnGuardar.click();
    });

    // Auto-scroll cuando se enfoca un input para que los botones queden visibles
    const modalInputs = [inputNombre, selectFavOrigen, selectFavDestino];
    modalInputs.forEach(input => {
        input.addEventListener('focus', () => {
            setTimeout(() => {
                const modalBox = document.querySelector('.modal-box');
                if (modalBox) {
                    // Hace scroll hasta el final del modal para que los botones sean visibles
                    modalBox.scrollTop = modalBox.scrollHeight;
                }
            }, 300); // Delay para esperar que aparezca el teclado
        });
    });
}

document.addEventListener('DOMContentLoaded', inicializarApp);
