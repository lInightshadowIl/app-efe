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
            console.log("✅ App actualizada a la versión: " + ultimaServidor);
            mostrarNotificacion("📲 Horarios actualizados correctamente");
        } else {
            const localStored = localStorage.getItem('baseDatos');
            baseDatos = JSON.parse(localStored);
            console.log("💾 Usando datos locales (ya están al día)");
        }

    } catch (error) {
        console.warn("⚠️ Sin conexión. Intentando usar datos locales...");
        const localStored = localStorage.getItem('baseDatos');
        if (localStored) {
            baseDatos = JSON.parse(localStored);
            mostrarNotificacion("📱 Modo offline: usando datos guardados", 'warning');
        } else {
            contenedor.innerHTML = "<p class='no-data'>Primera vez: Necesitas internet para descargar horarios.</p>";
            throw error;
        }
    }
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    let notif = document.getElementById('notificacion-app');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'notificacion-app';
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${tipo === 'success' ? '#4CAF50' : tipo === 'error' ? '#f44336' : '#FF9800'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
        `;
        document.body.appendChild(notif);
    }
    
    notif.textContent = mensaje;
    notif.style.display = 'block';
    
    setTimeout(() => {
        notif.style.display = 'none';
    }, 3000);
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

        // ⭐ NUEVA FUNCIÓN: Verificar si HOY es feriado
        function verificarSiHoyEsFeriado() {
            const hoy = new Date().toISOString().split('T')[0];
            const listaFeriados = baseDatos.feriados || [];
            return listaFeriados.includes(hoy);
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
                
                // Buscar el nombre del feriado en feriados.json si existe
                let nombreFeriado = "Feriado";
                if (baseDatos.feriados_info) {
                    const feriadoInfo = baseDatos.feriados_info.find(f => f.fecha === hoyIso);
                    if (feriadoInfo) nombreFeriado = feriadoInfo.nombre;
                }
                
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
                
                // Ocultar filtro de horarios pasados
                const contenedorFiltro = document.querySelector('.filtro-tiempo');
                contenedorFiltro.style.display = 'none';
                return;
            }

            let tipoHorario;
            if (diaElegido === "hoy") {
                // No es feriado, determinar tipo de día normal
                if (diaSemana === 0) tipoHorario = "festivo"; // Domingo
                else if (diaSemana === 6) tipoHorario = "sabado"; // Sábado
                else tipoHorario = "laboral"; // Lunes a Viernes
            } else {
                tipoHorario = diaElegido;
            }

            let viajes = obtenerViajesSeguros(origen, destino, tipoHorario);

            // Combinaciones si no hay ruta directa
            if (viajes.length === 0 && origen !== "16" && destino !== "16") {
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

    } catch (error) {
        console.error("❌ Error crítico:", error);
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
    if (baseDatos && baseDatos.feriados && baseDatos.feriados.includes(hoy)) {
        if(aviso) {
            // Buscar nombre del feriado
            let nombreFeriado = "Feriado";
            if (baseDatos.feriados_info) {
                const feriadoInfo = baseDatos.feriados_info.find(f => f.fecha === hoy);
                if (feriadoInfo) nombreFeriado = feriadoInfo.nombre;
            }
            
            aviso.innerHTML = `🚫 <strong>HOY ES ${nombreFeriado.toUpperCase()}</strong> - Biotrén NO opera en feriados`;
            aviso.style.display = "block";
            aviso.classList.remove('hidden');
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

document.addEventListener('DOMContentLoaded', inicializarApp);
