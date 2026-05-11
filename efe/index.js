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
const RUTA_VERSION = path.join(__dirname, '..', 'version.json');

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

const formatearFecha = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Busca el primer día hábil no feriado retrocediendo desde el viernes.
 * Orden de búsqueda: viernes → jueves → miércoles → martes → lunes
 * Retorna null si toda la semana laboral es feriado.
 */
function obtenerFechaLaboral(viernesDate, feriadosArray) {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    for (let retroceso = 0; retroceso <= 4; retroceso++) {
        const candidato = new Date(viernesDate);
        candidato.setDate(viernesDate.getDate() - retroceso);
        const fechaStr = formatearFecha(candidato);

        if (!feriadosArray.includes(fechaStr)) {
            return {
                fecha: fechaStr,
                dia: diasSemana[candidato.getDay()],
                retrocesoDias: retroceso   // 0 = viernes, 1 = jueves, etc.
            };
        }
    }

    return null; // Toda la semana laboral es feriado
}

function obtenerFechasSemanaActual(feriadosArray, feriadosInfo) {
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
    
    const viernesFecha = formatearFecha(viernes);
    const sabadoFecha = formatearFecha(sabado);
    const domingoFecha = formatearFecha(domingo);
    
    const lunes = new Date(viernes);
    lunes.setDate(viernes.getDate() - 4);
    
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const feriadosEnSemana = [];
    
    for (let i = 0; i < 7; i++) {
        const diaActual = new Date(lunes);
        diaActual.setDate(lunes.getDate() + i);
        const fechaStr = formatearFecha(diaActual);
        const nombreDia = diasSemana[diaActual.getDay()];
        
        if (feriadosArray.includes(fechaStr)) {
            const feriadoInfo = feriadosInfo.find(f => f.fecha === fechaStr);
            const nombreFeriado = feriadoInfo ? feriadoInfo.nombre : 'Feriado';
            
            feriadosEnSemana.push({
                fecha: fechaStr,
                dia: nombreDia,
                nombre: nombreFeriado,
                tipo: feriadoInfo ? feriadoInfo.tipo : 'desconocido'
            });
        }
    }
    
    // ⭐ Buscar fecha laboral de referencia (viernes → jueves → ... → lunes)
    const laboralRef = obtenerFechaLaboral(viernes, feriadosArray);
    
    const sabadoEsFeriado = feriadosArray.includes(sabadoFecha);
    
    if (feriadosEnSemana.length > 0) {
        console.log(`\n⚠️  Feriados detectados en la semana:`);
        feriadosEnSemana.forEach(f => {
            console.log(`   - ${f.dia} ${f.fecha}: ${f.nombre}`);
        });
        console.log('');
    }

    if (laboralRef && laboralRef.retrocesoDias > 0) {
        console.log(`📅 Viernes ${viernesFecha} es feriado → usando ${laboralRef.dia} ${laboralRef.fecha} como referencia laboral`);
    }
    
    return {
        viernes: viernesFecha,
        sabado: sabadoFecha,
        domingo: domingoFecha,
        laboralRef,            // { fecha, dia, retrocesoDias } | null
        sabadoEsFeriado,
        feriadosEnSemana
    };
}

async function notificarDiscord(mensaje, estado = 'exito') {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.log('⚠️ No hay webhook de Discord configurado');
        return;
    }

    const config = {
        error:      { title: '❌ Error en Scraper Biotrén',          color: 15158332 },
        advertencia:{ title: '⚠️ Scraper Biotrén - Con advertencias', color: 16776960 },
        exito:      { title: '✅ Scraper Biotrén Completado',          color: 3066993  },
    };

    const { title, color } = config[estado] ?? config.exito;

    const embed = {
        title,
        description: mensaje,
        color,
        timestamp: new Date().toISOString(),
        footer: { text: 'Scraper Automático | Hora Chile' }
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
        // 1. Cargar estaciones
        if (!fs.existsSync(RUTA_ESTACIONES)) {
            const errorMsg = `❌ Error: No se encuentra ${RUTA_ESTACIONES}`;
            console.error(errorMsg);
            await notificarDiscord(errorMsg, 'error');
            return;
        }

        const estacionesData = JSON.parse(fs.readFileSync(RUTA_ESTACIONES, 'utf-8'));
        const estaciones = [
            ...estacionesData.lineas["Línea 1"],
            ...estacionesData.lineas["Línea 2"]
        ];
        console.log(`📍 Cargadas ${estaciones.length} estaciones`);

        // 2. Cargar feriados (EXCLUYENDO feriados bancarios)
        let feriadosChile = [];
        let feriadosInfo = [];
        
        if (fs.existsSync(RUTA_FERIADOS)) {
            try {
                const feriadosData = JSON.parse(fs.readFileSync(RUTA_FERIADOS, 'utf-8'));
                
                const feriadosReales = feriadosData.feriados.filter(f => f.tipo !== "bancario");
                
                feriadosChile = feriadosReales.map(f => f.fecha);
                feriadosInfo = feriadosReales.map(f => ({
                    fecha: f.fecha,
                    nombre: f.nombre,
                    dia: f.dia,
                    irrenunciable: f.irrenunciable || false,
                    tipo: f.tipo
                }));
                
                console.log(`📅 Cargados ${feriadosChile.length} feriados reales (excluyendo bancarios)`);
                
                const excluidos = feriadosData.feriados.filter(f => f.tipo === "bancario");
                if (excluidos.length > 0) {
                    console.log(`ℹ️  Feriados bancarios excluidos (Biotrén SÍ opera):`);
                    excluidos.forEach(f => console.log(`   - ${f.fecha}: ${f.nombre}`));
                }
                
            } catch (e) {
                console.warn('⚠️ No se pudieron cargar feriados');
            }
        }

        // 3. Obtener fechas y validar si son feriados
        const fechas = obtenerFechasSemanaActual(feriadosChile, feriadosInfo);
        
        // 4. Construir fases según disponibilidad
        const fases = [];
        const advertencias = [];
        
        // ⭐ CAMBIO PRINCIPAL: usar laboralRef en vez de verificar solo el viernes
        if (fechas.laboralRef) {
            const { fecha, dia, retrocesoDias } = fechas.laboralRef;

            if (retrocesoDias === 0) {
                // Viernes disponible — comportamiento normal
                fases.push({ id: 'laboral', fecha });
            } else {
                // Viernes feriado → usando un día anterior como referencia
                const feriadoViernes = feriadosInfo.find(f => f.fecha === fechas.viernes);
                const nombreFeriado = feriadoViernes ? feriadoViernes.nombre : 'Feriado';
                advertencias.push(
                    `⚠️ VIERNES ${fechas.viernes} es ${nombreFeriado} — usando ${dia} ${fecha} como referencia de horario LABORAL`
                );
                fases.push({ id: 'laboral', fecha });
            }
        } else {
            // Toda la semana laboral (lun-vie) son feriados
            advertencias.push(`⚠️ Toda la semana laboral es feriado — no se scrapeará horario LABORAL`);
        }
        
        if (!fechas.sabadoEsFeriado) {
            fases.push({ id: 'sabado', fecha: fechas.sabado });
        } else {
            const feriadoInfo = feriadosInfo.find(f => f.fecha === fechas.sabado);
            const nombreFeriado = feriadoInfo ? feriadoInfo.nombre : 'Feriado';
            advertencias.push(`⚠️ SÁBADO ${fechas.sabado} es ${nombreFeriado} — se omite scraping de SÁBADO`);
        }
        
        // Domingo siempre se scrapea (es festivo por definición)
        fases.push({ id: 'festivo', fecha: fechas.domingo });

        if (advertencias.length > 0) {
            console.log('\n⚠️ ADVERTENCIAS:');
            advertencias.forEach(adv => console.log(adv));
            console.log('');
        }

        if (fases.length === 0) {
            const mensajeError = '❌ CRÍTICO: No hay ningún día disponible para scrapear.';
            console.error(mensajeError);
            await notificarDiscord(mensajeError, 'error');
            return;
        }

        console.log(`📅 Fechas a scrapear (${fases.length} días):`);
        fases.forEach(f => console.log(`   ${f.id}: ${f.fecha}`));

        // 5. Inicializar base de datos
        // ⭐ Guardamos qué fecha se usó realmente como referencia laboral
        const laboralUsado = fechas.laboralRef
            ? { fecha: fechas.laboralRef.fecha, dia: fechas.laboralRef.dia }
            : null;

        let baseDeDatos = {
            ultima_update: obtenerFechaChile(),
            fechas_scrapeadas: {
                viernes: fechas.viernes,
                sabado: fechas.sabado,
                domingo: fechas.domingo,
                laboral_referencia: laboralUsado  // ej: { fecha: "2026-04-02", dia: "Jueves" }
            },
            feriados: feriadosChile,
            feriados_info: feriadosInfo,
            feriados_semana: fechas.feriadosEnSemana,
            advertencias: advertencias,
            rutas: {}
        };

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

        // 6. Ejecución por días
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

                    fs.writeFileSync(RUTA_SALIDA, JSON.stringify(baseDeDatos, null, 2));
                    await sleep(Math.random() * (DELAY_MAX - DELAY_MIN) + DELAY_MIN);
                    progressBar.increment();
                }
            }
            progressBar.stop();
            console.log(`✅ Día ${fase.id} completado.`);
        }

        // Escribir version.json con solo ultima_update (~50 bytes)
        // La app lo usa para evitar descargar los 4MB de horarios.json si la versión no cambió
        const versionData = { ultima_update: baseDeDatos.ultima_update };
        fs.writeFileSync(RUTA_VERSION, JSON.stringify(versionData));
        console.log(`📋 version.json generado: ${baseDeDatos.ultima_update}`);

        console.log("\n✨ ¡PROCESO FINALIZADO CON ÉXITO!");
        console.log(`📁 Archivo generado en: ${RUTA_SALIDA}`);
        
        let estadoNotificacion;
        if (erroresEncontrados > 100) {
            estadoNotificacion = 'error';
        } else if (advertencias.length > 0) {
            estadoNotificacion = 'advertencia';
        } else {
            estadoNotificacion = 'exito';
        }

        // Descripción legible de qué fecha se usó para el horario laboral
        let laboralDesc;
        if (!fechas.laboralRef) {
            laboralDesc = '❌ Toda la semana laboral es feriado (omitido)';
        } else if (fechas.laboralRef.retrocesoDias === 0) {
            laboralDesc = `✅ Scrapeado (${fechas.viernes})`;
        } else {
            laboralDesc = `⚠️ Viernes feriado → referencia: ${fechas.laboralRef.dia} ${fechas.laboralRef.fecha}`;
        }

        let mensajeExito = `
**Scraping completado exitosamente** 🎉

📅 **Fechas procesadas:**
- Laboral: ${laboralDesc}
- Sábado ${fechas.sabado}: ${fechas.sabadoEsFeriado ? '❌ FERIADO (omitido)' : '✅ Scrapeado'}
- Domingo ${fechas.domingo}: ✅ Scrapeado

📊 **Estadísticas:**
- Días procesados: ${fases.length}/3
- Rutas completadas: ${rutasCompletadas}
- Errores: ${erroresEncontrados}
- Estaciones: ${estaciones.length}
- Feriados totales: ${feriadosChile.length}

🕒 **Última actualización:** ${baseDeDatos.ultima_update}
📍 **Zona horaria:** Santiago, Chile
        `;

        if (fechas.feriadosEnSemana && fechas.feriadosEnSemana.length > 0) {
            mensajeExito += `\n\n🎊 **Feriados esta semana (${fechas.feriadosEnSemana.length}):**\n`;
            fechas.feriadosEnSemana.forEach(f => {
                mensajeExito += `- ${f.dia} ${f.fecha}: ${f.nombre}\n`;
            });
        }

        if (advertencias.length > 0) {
            mensajeExito += `\n\n⚠️ **Advertencias:**\n${advertencias.join('\n')}`;
        }
        
        await notificarDiscord(mensajeExito, estadoNotificacion);

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
        await notificarDiscord(errorMsg, 'error');
        throw error;
    }
}

iniciarScraper();
