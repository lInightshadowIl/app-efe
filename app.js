// ✅ FIX: Retorna fecha local como "YYYY-MM-DD" (evita bug UTC de toISOString)
function getFechaLocal(fecha = new Date()) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

let baseDatos = null;
let preciosHistorial = null; // Cargado desde precios-historial.json

// Tipo de usuario: 'general' o 'estudiante', persistido en localStorage
function getTipoUsuario() {
    return localStorage.getItem('tipoUsuario') || 'general';
}
function setTipoUsuario(tipo) {
    localStorage.setItem('tipoUsuario', tipo);
}

// ============================================================
// SISTEMA DE DETECCIÓN DE CONECTIVIDAD REAL
// navigator.onLine miente con señal deficiente → usamos ping
// ============================================================

let _hayInternet = false; // Estado interno; arranca como offline hasta verificar

/**
 * Ping real: intenta descargar el favicon de Cloudflare (1.1.1.1).
 * Es de 200 bytes aprox., responde en ~100ms con buena señal.
 * Si falla o tarda más de 2s → sin internet.
 */
async function verificarConectividadReal(timeoutMs = 2000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        // Usamos no-cors para evitar errores CORS; solo nos importa que llegue la respuesta
        await fetch('https://www.gstatic.com/generate_204?_=' + Date.now(), {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store',
            signal: controller.signal
        });
        clearTimeout(timer);
        return true;
    } catch {
        clearTimeout(timer);
        return false;
    }
}

/**
 * Actualiza el indicador de conexión: un pequeño círculo en el footer.
 * Verde = con internet, Rojo = sin internet.
 */
function actualizarIndicadorConexion(estado) {
    const dot = document.getElementById('conexion-dot');
    if (!dot) return;
    dot.style.background = estado === 'online' ? '#22c55e' : '#ef4444';
    _hayInternet = estado === 'online';
}

/**
 * Fetch genérico con timeout estricto y cache: no-store (evita cuelgue en el SW).
 */
async function fetchConTimeout(url, timeoutMs = 3000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const resp = await fetch(`${url}?v=${Date.now()}`, {
            signal: controller.signal,
            cache: 'no-store'
        });
        clearTimeout(timer);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return await resp.json();
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}

async function cargarDatos() {
    const contenedor = document.getElementById('resultados-container');

    // ── PASO 1: Cargar datos locales INMEDIATAMENTE (arranque offline-first) ──
    const localStored = localStorage.getItem('baseDatos');
    if (localStored) {
        try {
            baseDatos = JSON.parse(localStored);
            console.log("💾 Datos locales cargados — app lista offline");
        } catch {
            localStorage.removeItem('baseDatos');
        }
    }

    // ── PASO 2: Verificar conectividad real con ping ──
    const tieneInternet = await verificarConectividadReal(2000);

    if (!tieneInternet) {
        console.warn("📵 Sin internet detectado por ping");
        actualizarIndicadorConexion('offline');

        if (!baseDatos) {
            contenedor.innerHTML = "<p class='no-data'>Primera vez: necesitas internet para descargar los horarios.</p>";
            throw new Error("Sin internet y sin datos locales");
        }
        return; // Usar datos locales, no intentar fetch
    }

    // ── PASO 3: Hay internet real → verificar versión antes de descargar 4MB ──
    _hayInternet = true;
    actualizarIndicadorConexion('online');
    try {
        // Primero descarga version.json (~50 bytes) para comparar
        const { ultima_update: ultimaServidor } = await fetchConTimeout('version.json', 3000);
        const ultimaLocal = localStorage.getItem('ultima_update');

        if (ultimaServidor === ultimaLocal) {
            console.log("✅ Horarios en caché vigentes");

        // Cargar historial de precios en background (no bloquea)
        fetchConTimeout('precios-historial.json', 3000)
            .then(data => { preciosHistorial = data; })
            .catch(() => {}); // Si no existe aún, no pasa nada
            return; // Sin cambios — no descarga los 4MB
        }

        // Versión nueva → ahora sí descargar horarios.json completo
        console.log("🔄 Nueva versión detectada, descargando horarios...");
        const dataNueva = await fetchConTimeout('horarios.json', 10000); // más tiempo para 4MB
        baseDatos = dataNueva;
        localStorage.setItem('baseDatos', JSON.stringify(dataNueva));
        localStorage.setItem('ultima_update', ultimaServidor);
        console.log("✅ Horarios actualizados desde el servidor");

    } catch (error) {
        const esTimeout = error.name === 'AbortError';
        console.warn(esTimeout
            ? "⚠️ Timeout al verificar versión. Usando datos locales..."
            : "⚠️ Error de red. Usando datos locales..."
        );
        if (!baseDatos) {
            contenedor.innerHTML = "<p class='no-data'>Primera vez: necesitas internet para descargar los horarios.</p>";
            throw error;
        }
    }
}

// ── Monitoreo continuo de conexión (sondeo cada 30s) ──
function iniciarMonitoreoConexion() {
    async function chequear() {
        const antes = _hayInternet;
        const ahora = await verificarConectividadReal(2000);

        if (!antes && ahora) {
            // Recuperó internet → sincronizar en background
            console.log('🌐 Conexión recuperada, sincronizando...');
            actualizarIndicadorConexion('online');
            cargarDatos().catch(() => {});
        } else if (antes && !ahora) {
            actualizarIndicadorConexion('offline');
        }
        _hayInternet = ahora;
    }

    // Solo intervalo — el estado inicial lo establece cargarDatos() al arrancar
    setInterval(chequear, 30000);

    // Aprovechar los eventos del navegador como disparador adicional (no como fuente principal)
    window.addEventListener('online',  () => chequear());
    window.addEventListener('offline', () => actualizarIndicadorConexion('offline'));
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
            const hoyIso = getFechaLocal(ahora); // ✅ FIX: era toISOString() que usaba UTC
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

            const rutaKey = `${origen}-${destino}`;
            const rutaData = baseDatos.rutas[rutaKey];
            const precio = getPrecioRuta(rutaData);
            renderizarHorarios(viajesFiltrados, horaActualStr, diaElegido === "hoy", precio, rutaKey);
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
        inicializarSwitchUsuario();
        verificarFeriado();
        mostrarFecha();
        mostrarUltimaActualizacion();
        inicializarFavoritos();
        iniciarMonitoreoConexion();
        

    } catch (error) {
        console.error("❌ Error crítico al inicializar app:", error);
        document.getElementById('resultados-container').innerHTML = 
            "<p class='no-data'>Error al cargar la aplicación. Revisa la consola.</p>";
    }
}

function renderizarHorarios(trenes, horaActual, esHoy, precioRuta = null, rutaKey = null) {
    const contenedor = document.getElementById('resultados-container');
    if (trenes.length === 0) {
        contenedor.innerHTML = "<p class='no-data'>No hay trenes disponibles para esta ruta.</p>";
        return;
    }

    contenedor.innerHTML = trenes.map(t => {
        let precioHtml;
        const tipo = getTipoUsuario();
        const sinPrecioEstudiante = tipo === 'estudiante' && (!precioRuta?.valor || precioRuta?.pendiente);

        if (sinPrecioEstudiante) {
            // Precio estudiante aún no scrapeado → mostrar pendiente con reloj
            precioHtml = `<span class="precio-pendiente" title="Precio estudiante pendiente de actualización">🕐 <span class="precio-tag">pendiente</span></span>`;
        } else {
            const valorMostrar = precioRuta?.valor || t.v;
            precioHtml = `<span>💰 $${valorMostrar}</span>`;
        }
        return `
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
                <span>⏱️ ${t.d}</span> | ${precioHtml}
            </div>
        </div>`;
    }).join('');
}

function inicializarSwitchUsuario() {
    const switchEl = document.getElementById('switch-usuario');
    if (!switchEl) return;

    const opts = document.querySelectorAll('.switch-usuario-opt');
    const [optGeneral, optEstudiante] = opts;

    function actualizarTexto() {
        const esEstudiante = switchEl.checked;
        if (optGeneral)   optGeneral.style.fontWeight   = esEstudiante ? '400' : '700';
        if (optGeneral)   optGeneral.style.color        = esEstudiante ? '' : 'var(--azul-efe, #4f8ef7)';
        if (optEstudiante) optEstudiante.style.fontWeight = esEstudiante ? '700' : '400';
        if (optEstudiante) optEstudiante.style.color     = esEstudiante ? 'var(--azul-efe, #4f8ef7)' : '';
    }

    switchEl.checked = getTipoUsuario() === 'estudiante';
    actualizarTexto();

    switchEl.addEventListener('change', () => {
        setTipoUsuario(switchEl.checked ? 'estudiante' : 'general');
        actualizarTexto();
    });
}

function mostrarDetallePrecio(rutaKey) {
    const h = preciosHistorial?.[rutaKey];
    if (!h?.anterior || !h?.actual) return;

    const tipo = getTipoUsuario();
    const campo = tipo === 'estudiante' ? 'estudiante' : 'general';
    const anterior = parseInt(h.anterior[campo]);
    const actual = parseInt(h.actual[campo]);
    const diff = actual - anterior;
    const subio = diff > 0;

    // Eliminar modal previo si existe
    document.getElementById('modal-precio-hist')?.remove();

    const modal = document.createElement('div');
    modal.id = 'modal-precio-hist';
    modal.innerHTML = `
        <div class="modal-precio-backdrop" onclick="document.getElementById('modal-precio-hist').remove()"></div>
        <div class="modal-precio-box">
            <div class="modal-precio-titulo">Historial de precio</div>
            <div class="modal-precio-fila">
                <span class="modal-precio-fecha">${h.anterior.fecha}</span>
                <span class="modal-precio-valor">$${anterior}</span>
            </div>
            <div class="modal-precio-fila modal-precio-actual">
                <span class="modal-precio-fecha">${h.actual.fecha}</span>
                <span class="modal-precio-valor">$${actual}
                    <span class="modal-precio-diff ${subio ? 'subio' : 'bajo'}">
                        ${subio ? '▲' : '▼'} $${Math.abs(diff)}
                    </span>
                </span>
            </div>
            <button class="modal-precio-cerrar" onclick="document.getElementById('modal-precio-hist').remove()">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function getTendenciaPrecio(rutaKey) {
    if (!preciosHistorial) return null;
    const h = preciosHistorial[rutaKey];
    if (!h?.anterior || !h?.actual) return null;

    const tipo = getTipoUsuario();
    const campo = tipo === 'estudiante' ? 'estudiante' : 'general';
    const anterior = parseInt(h.anterior[campo]);
    const actual = parseInt(h.actual[campo]);

    if (isNaN(anterior) || isNaN(actual) || anterior === actual) return null;

    const diff = actual - anterior;
    const fechaAnterior = h.anterior.fecha;
    return {
        subio: diff > 0,
        diff: Math.abs(diff),
        fechaAnterior,
        anterior,
        actual
    };
}

function getPrecioRuta(ruta) {
    const tipo = getTipoUsuario();
    const precios = ruta?.precios;

    // Datos viejos (antes de implementar precios por separado): usar t.v como antes
    if (!precios) return { valor: null, pendiente: false };

    if (tipo === 'estudiante') {
        if (precios.estudiante) return { valor: precios.estudiante, pendiente: false };
        // Aún no hay precio estudiante (worker no ejecutado todavía)
        return { valor: precios.general, pendiente: true };
    }
    return { valor: precios.general || null, pendiente: false };
}

function verificarFeriado() {
    const hoy = getFechaLocal(); // ✅ FIX: era toISOString() que usaba UTC
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
        const mananaStr = getFechaLocal(manana); // ✅ FIX: era toISOString() que usaba UTC
        
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

        // Mostrar solo la fecha (antes del primer espacio o coma) en el footer
        const soloFecha = baseDatos.ultima_update.split(',')[0].trim();
        const el = document.getElementById('footer-ultima-update');
        if (el) el.textContent = soloFecha;

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
    const hoyIso = getFechaLocal(ahora); // ✅ FIX: era toISOString() que usaba UTC
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
    const rutaFavData = baseDatos.rutas[`${fav.origen}-${fav.destino}`];
    const precioRutaFav = getPrecioRuta(rutaFavData);

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
                        ${(getTipoUsuario() === 'estudiante' && (!precioRutaFav?.valor || precioRutaFav?.pendiente))
                            ? `<span class="precio-pendiente" title="Precio estudiante pendiente de actualización">🕐 <span class="precio-tag">pendiente</span></span>`
                            : `<span>💰 $${precioRutaFav?.valor || t.v}</span>`
                        }
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

    // Solución para iOS: cuando aparece el teclado, hacer scroll en el input enfocado
    const selectFavOrigen = document.getElementById('fav-origen');
    const selectFavDestino = document.getElementById('fav-destino');
    const modalInputs = [inputNombre, selectFavOrigen, selectFavDestino];
    
    modalInputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            setTimeout(() => {
                // Hacer scroll del elemento enfocado para que sea visible
                e.target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                });
            }, 400);
        });
    });
}

document.addEventListener('DOMContentLoaded', inicializarApp);
