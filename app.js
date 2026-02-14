let baseDatos = null;


async function cargarDatos() {
    const contenedor = document.getElementById('resultados-container');
    
    try {
        // 1. Intentar obtener la versión del servidor (forzando bypass de caché con el timestamp)
        // Pedimos el archivo pero con un sello de tiempo para saltar el bloqueo del celu
        const respuestaSrv = await fetch(`horarios.json?v=${Date.now()}`);
        const dataNueva = await respuestaSrv.json();

        // 2. Revisar qué versión tenemos guardada en el celular
        const ultimaLocal = localStorage.getItem('ultima_update');
        const ultimaServidor = dataNueva.ultima_update;

        if (ultimaServidor !== ultimaLocal) {
            // ¡Hay datos nuevos! Guardamos en la memoria del celu
            baseDatos = dataNueva;
            localStorage.setItem('baseDatos', JSON.stringify(dataNueva));
            localStorage.setItem('ultima_update', ultimaServidor);
            console.log("App actualizada a la versión: " + ultimaServidor);
        } else {
            // Los datos son iguales, usamos lo que ya teníamos guardado
            const localStored = localStorage.getItem('baseDatos');
            baseDatos = JSON.parse(localStored);
            console.log("Usando datos locales (ya están al día)");
        }

    } catch (error) {
        console.warn("Sin conexión o error. Intentando usar datos locales de emergencia...");
        // 3. Fallback: Si no hay internet, intentar cargar lo que haya en el celu
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
        // 1. Cargar base de datos
        const respuesta = await fetch('horarios.json');
        if (!respuesta.ok) throw new Error("No se pudo cargar horarios.json");
        baseDatos = await respuesta.json();

        const origenSelect = document.getElementById('origen-select');
        const destinoSelect = document.getElementById('destino-select');
        const diaSelect = document.getElementById('dia-select');
        const btnBuscar = document.getElementById('buscar-btn');
        const btnSwap = document.getElementById('btn-swap');
        const checkVerTodo = document.getElementById('ver-todo');

        // 2. Unificar estaciones
        function cargarEstaciones() {
            const todas = [...estacionesEFE["Línea 1"], ...estacionesEFE["Línea 2"]];
            const unicas = todas.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
            //unicas.sort((a, b) => a.nombre.localeCompare(b.nombre));

            const html = unicas.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
            origenSelect.innerHTML = html;
            destinoSelect.innerHTML = html;

            origenSelect.value = "16"; // Concepción
            destinoSelect.value = "35"; // Coronel
        }

        // Función auxiliar para extraer viajes de forma segura
        function obtenerViajesSeguros(origen, destino, tipoDia) {
            const key = `${origen}-${destino}`;
            const datos = baseDatos.rutas[key];
            if (!datos) return [];
            return Array.isArray(datos) ? datos : (datos[tipoDia] || []);
        }

        // 3. Lógica principal de búsqueda
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

            let tipoHorario;
            if (diaElegido === "hoy") {
                if (esFeriado || diaSemana === 0) tipoHorario = "festivo";
                else if (diaSemana === 6) tipoHorario = "sabado";
                else tipoHorario = "laboral";
            } else {
                tipoHorario = diaElegido;
            }

            let viajes = obtenerViajesSeguros(origen, destino, tipoHorario);

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

            // Verificar si hay horarios pasados
            const hayPasados = diaElegido === "hoy" && viajes.some(t => t.s < horaActualStr);
            
            // Controlar el estado del switch
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

        // --- SECCIÓN DE EVENTOS MODIFICADA ---
        
        // Función para limpiar los resultados
        function limpiarResultados() {
            const contenedor = document.getElementById('resultados-container');
            contenedor.innerHTML = "<p class='no-data'>Selecciona tu ruta para ver los próximos trenes.</p>";
            
            // Ocultar el filtro de horarios pasados al limpiar
            const contenedorFiltro = document.querySelector('.filtro-tiempo');
            contenedorFiltro.style.display = 'none';
            checkVerTodo.disabled = true;
            checkVerTodo.checked = false;
        }
        
        // El botón Buscar es ahora el único que dispara la búsqueda
        btnBuscar.addEventListener('click', realizarBusqueda);

        // El botón Swap solo intercambia los valores, ya no busca automáticamente
        btnSwap.addEventListener('click', () => {
            const temp = origenSelect.value;
            origenSelect.value = destinoSelect.value;
            destinoSelect.value = temp;
            limpiarResultados(); // Limpiar resultados al intercambiar
        });

        // Limpiar resultados cuando cambien las selecciones
        origenSelect.addEventListener('change', limpiarResultados);
        destinoSelect.addEventListener('change', limpiarResultados);
        diaSelect.addEventListener('change', limpiarResultados);
        checkVerTodo.addEventListener('change', limpiarResultados);

        cargarEstaciones();
        verificarFeriado();
        mostrarFecha();

    } catch (error) {
        console.error("Error crítico:", error);
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
            aviso.innerHTML = "📅 Hoy es Feriado: Operando con horario de Domingo.";
            aviso.style.display = "block";
            aviso.classList.remove('hidden');
        }
    }
}

function mostrarFecha() {
    const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('fecha-actual').innerText = new Date().toLocaleDateString('es-CL', opciones);
}

document.addEventListener('DOMContentLoaded', inicializarApp);