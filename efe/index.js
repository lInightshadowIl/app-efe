const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');

// Configuración de Sigilo
const DELAY_MIN = 1500; 
const DELAY_MAX = 3500; 
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Rutas de archivos
const RUTA_ESTACIONES = path.join(__dirname, 'estaciones.json');
const RUTA_FERIADOS = path.join(__dirname, 'feriados.json');
const RUTA_SALIDA = path.join(__dirname, '..', 'horarios.json');

function obtenerFechasSemanaActual() {
    const hoy = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' }));
    const diaSemana = hoy.getDay();
    
    let diasHastaViernes = 5 - diaSemana;
    if (diasHastaViernes <= 0) diasHastaViernes += 7;
    
    const viernes = new Date(hoy);
    viernes.setDate(hoy.getDate() + diasHastaViernes);
    
    const sabado = new Date(viernes);
    sabado.setDate(viernes.getDate() + 1);
    
    const domingo = new Date(viernes);
    domingo.setDate(viernes.getDate() + 2);
    
    const formatearFecha = (fecha) => {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    return {
        viernes: formatearFecha(viernes),
        sabado: formatearFecha(sabado),
        domingo: formatearFecha(domingo)
    };
}

function obtenerFechaChile() {
    return new Date().toLocaleString('es-CL', { 
        timeZone: 'America/Santiago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

async function notificarDiscord(mensaje, esError = false) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.log('⚠️ No hay webhook de Discord configurado');
        return;
    }

    const embed = {
        title: esError ? '❌ Error en Scraper Biotrén' : '✅ Scraper Biotrén Completado',
        description: mensaje,
        color: esError ? 15158332 : 3066993,
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Scraper Automático | Hora Chile'
        }
    };

    try {
        await axios.post(webhookUrl, {
            username: 'Biotrén Bot',
            embeds: [embed]
        });
    } catch (error) {
        console.error('Error al enviar notificación a Discord:', error.message);
    }
}

async function iniciarScraper() {
    console.log("🚀 Iniciando Scraper por Fases: Cruce Total de Líneas");
    console.log(`🕐 Hora actual en Chile: ${obtenerFechaChile()}`);
    console.log(`📁 Directorio de trabajo: ${__dirname}`);

    try {
        // 1. Cargar estaciones desde JSON
        if (!fs.existsSync(RUTA_ESTACIONES)) {
            const errorMsg = `❌ Error: No se encuentra ${RUTA_ESTACIONES}`;
            console.error(errorMsg);
            await notificarDiscord(errorMsg, true);
            return;
        }

        const estacionesData = JSON.parse(fs.readFileSync(RUTA_ESTACIONES, 'utf-8'));
        
        // Combinar ambas líneas en un solo array
        const estaciones = [
            ...estacionesData.lineas["Línea 1"],
            ...estacionesData.lineas["Línea 2"]
        ];
        
        console.log(`📍 Cargadas ${estaciones.length} estaciones desde JSON`);

        // 2. Cargar feriados
        let feriadosChile = [];
        if (fs.existsSync(RUTA_FERIADOS)) {
            try {
                const feriadosData = JSON.parse(fs.readFileSync(RUTA_FERIADOS, 'utf-8'));
                feriadosChile = feriadosData.feriados.map(f => f.fecha);
                console.log(`📅 Cargados ${feriadosChile.length} feriados de Chile`);
            } catch (e) {
                console.warn('⚠️ No se pudieron cargar feriados, continuando sin ellos');
            }
        }

        // 3. Obtener fechas dinámicas
        const fechas = obtenerFechasSemanaActual();
        const fases = [
            { id: 'laboral', fecha: fechas.viernes },
            { id: 'sabado', fecha: fechas.sabado },
            { id: 'festivo', fecha: fechas.domingo }
        ];

        console.log(`📅 Fechas de esta semana (próximo fin de semana):`);
        console.log(`   Viernes (laboral): ${fechas.viernes}`);
        console.log(`   Sábado: ${fechas.sabado}`);
        console.log(`   Domingo (festivo): ${fechas.domingo}`);

        // 4. Inicializar base de datos
        let baseDeDatos = {
            ultima_update: obtenerFechaChile(),
            fechas_scrapeadas: {
                viernes: fechas.viernes,
                sabado: fechas.sabado,
                domingo: fechas.domingo
            },
            feriados: feriadosChile, // Array simple de fechas
            feriados_info: [], // ⭐ NUEVO: Información completa de feriados
            advertencias: advertencias,
            rutas: {}
        };

        if (fs.existsSync(RUTA_FERIADOS)) {
            try {
                const feriadosData = JSON.parse(fs.readFileSync(RUTA_FERIADOS, 'utf-8'));
                baseDeDatos.feriados_info = feriadosData.feriados.map(f => ({
                    fecha: f.fecha,
                    nombre: f.nombre,
                    dia: f.dia,
                    irrenunciable: f.irrenunciable || false
                }));
                console.log(`📋 Agregada información de ${baseDeDatos.feriados_info.length} feriados`);
            } catch (e) {
                console.warn('⚠️ No se pudo cargar info detallada de feriados');
            }
        }

        // Pre-poblar estructura
        estaciones.forEach(o => {
            estaciones.forEach(d => {
                if (o.id !== d.id) {
                    baseDeDatos.rutas[`${o.id}-${d.id}`] = { 
                        laboral: [], 
                        sabado: [], 
                        festivo: [] 
                    };
                }
            });
        });

        const totalRutasPorDia = estaciones.length * (estaciones.length - 1);
        const progressBar = new cliProgress.SingleBar({
            format: '🚂 {fase} | [{bar}] {percentage}% | {value}/{total} Rutas | {info}',
        }, cliProgress.Presets.shades_classic);

        let erroresEncontrados = 0;
        let rutasCompletadas = 0;

        // 5. EJECUCIÓN POR DÍAS
        for (const fase of fases) {
            console.log(`\n--- TRABAJANDO DÍA: ${fase.id.toUpperCase()} (${fase.fecha}) ---`);
            progressBar.start(totalRutasPorDia, 0);

            for (let o of estaciones) {
                for (let d of estaciones) {
                    if (o.id === d.id) continue;

                    progressBar.update(null, { 
                        fase: fase.id.toUpperCase(), 
                        info: `${o.nombre} -> ${d.nombre}` 
                    });

                    try {
                        const res = await axios.get(`https://www.efe.cl/planificador/`, {
                            params: { 
                                empresa: 6, 
                                origen: o.id, 
                                destino: d.id, 
                                salida: fase.fecha, 
                                usuario: 1, 
                                ida: 1 
                            },
                            headers: { 
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                                'Cache-Control': 'no-cache'
                            },
                            timeout: 12000
                        });

                        const $ = cheerio.load(res.data);
                        let viajes = [];

                        $('.tablaTren tbody tr').each((_, el) => {
                            const tds = $(el).find('td');
                            if (tds.length >= 4) {
                                viajes.push({
                                    s: $(tds[0]).text().trim(),
                                    ll: $(tds[1]).text().trim(),
                                    d: $(tds[2]).text().trim(),
                                    v: $(tds[3]).text().replace(/[^0-9]/g, '')
                                });
                            }
                        });

                        baseDeDatos.rutas[`${o.id}-${d.id}`][fase.id] = viajes;
                        rutasCompletadas++;

                    } catch (e) {
                        baseDeDatos.rutas[`${o.id}-${d.id}`][fase.id] = [];
                        erroresEncontrados++;
                    }

                    // Guardado incremental
                    fs.writeFileSync(RUTA_SALIDA, JSON.stringify(baseDeDatos, null, 2));

                    await sleep(Math.random() * (DELAY_MAX - DELAY_MIN) + DELAY_MIN);
                    progressBar.increment();
                }
            }
            progressBar.stop();
            console.log(`✅ Día ${fase.id} completado.`);
        }

        console.log("\n✨ ¡PROCESO FINALIZADO CON ÉXITO!");
        console.log(`📁 Archivo generado en: ${RUTA_SALIDA}`);
        
        // Notificar éxito
        const mensajeExito = `
**Scraping completado exitosamente** 🎉

📅 **Fechas procesadas (próximo fin de semana):**
- Viernes (laboral): ${fechas.viernes}
- Sábado: ${fechas.sabado}
- Domingo (festivo): ${fechas.domingo}

📊 **Estadísticas:**
- Rutas completadas: ${rutasCompletadas}
- Errores encontrados: ${erroresEncontrados}
- Estaciones procesadas: ${estaciones.length}
- Feriados cargados: ${feriadosChile.length}

🕒 **Última actualización:** ${baseDeDatos.ultima_update}
📍 **Zona horaria:** Santiago, Chile
📁 **Archivo:** horarios.json (raíz del proyecto)
        `;
        
        await notificarDiscord(mensajeExito, erroresEncontrados > 100);

    } catch (error) {
        const errorMsg = `
**Error crítico en el scraper** ⚠️

❌ ${error.message}

\`\`\`
${error.stack}
\`\`\`

🕒 Hora del error: ${obtenerFechaChile()}
        `;
        console.error(error);
        await notificarDiscord(errorMsg, true);
        throw error;
    }
}

iniciarScraper();
