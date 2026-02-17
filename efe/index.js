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

// ⭐ MEJORADO: Función que valida feriados TODA LA SEMANA
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
    
    const formatearFecha = (fecha) => {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const viernesFecha = formatearFecha(viernes);
    const sabadoFecha = formatearFecha(sabado);
    const domingoFecha = formatearFecha(domingo);
    
    // ⭐ NUEVO: Validar TODA la semana (lunes a domingo)
    const lunes = new Date(viernes);
    lunes.setDate(viernes.getDate() - 4); // 4 días antes del viernes
    
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const feriadosEnSemana = [];
    
    // Revisar cada día de lunes a domingo
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
    
    // VALIDAR SI SON FERIADOS (días a scrapear)
    const viernesEsFeriado = feriadosArray.includes(viernesFecha);
    const sabadoEsFeriado = feriadosArray.includes(sabadoFecha);
    
    // Solo mostrar si hay feriados
    if (feriadosEnSemana.length > 0) {
        console.log(`\n⚠️  Feriados detectados en la semana:`);
        feriadosEnSemana.forEach(f => {
            console.log(`   - ${f.dia} ${f.fecha}: ${f.nombre}`);
        });
        console.log('');
    }
    
    return {
        viernes: viernesFecha,
        sabado: sabadoFecha,
        domingo: domingoFecha,
        viernesEsFeriado,
        sabadoEsFeriado,
        feriadosEnSemana // ⭐ NUEVO: Lista completa de feriados
    };
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
        // 1. Cargar estaciones
        if (!fs.existsSync(RUTA_ESTACIONES)) {
            const errorMsg = `❌ Error: No se encuentra ${RUTA_ESTACIONES}`;
            console.error(errorMsg);
            await notificarDiscord(errorMsg, true);
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
                
                // ⭐ FILTRAR: Excluir feriados bancarios (Biotrén SÍ opera el 31 de diciembre)
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
                
                // Verificar si se excluyó el 31 de diciembre
                const excluidos = feriadosData.feriados.filter(f => f.tipo === "bancario");
                if (excluidos.length > 0) {
                    console.log(`ℹ️  Feriados bancarios excluidos (Biotrén SÍ opera):`);
                    excluidos.forEach(f => console.log(`   - ${f.fecha}: ${f.nombre}`));
                }
                
            } catch (e) {
                console.warn('⚠️ No se pudieron cargar feriados');
            }
        }

        // 3. Obtener fechas y VALIDAR si son feriados
        const fechas = obtenerFechasSemanaActual(feriadosChile, feriadosInfo);
        
        // 4. Construir fases según disponibilidad
        const fases = [];
        const advertencias = []; // ⭐ FIX: Definir ANTES de usar
        
        // VIERNES - Solo si NO es feriado
        if (!fechas.viernesEsFeriado) {
            fases.push({ id: 'laboral', fecha: fechas.viernes });
        } else {
            const feriadoInfo = feriadosInfo.find(f => f.fecha === fechas.viernes);
            const nombreFeriado = feriadoInfo ? feriadoInfo.nombre : 'Feriado';
            advertencias.push(`⚠️ VIERNES ${fechas.viernes} es ${nombreFeriado} - Biotrén NO opera, se omite scraping`);
        }
        
        // SÁBADO - Solo si NO es feriado
        if (!fechas.sabadoEsFeriado) {
            fases.push({ id: 'sabado', fecha: fechas.sabado });
        } else {
            const feriadoInfo = feriadosInfo.find(f => f.fecha === fechas.sabado);
            const nombreFeriado = feriadoInfo ? feriadoInfo.nombre : 'Feriado';
            advertencias.push(`⚠️ SÁBADO ${fechas.sabado} es ${nombreFeriado} - Biotrén NO opera, se omite scraping`);
        }
        
        // DOMINGO - Siempre scrapear
        fases.push({ id: 'festivo', fecha: fechas.domingo });

        if (advertencias.length > 0) {
            console.log('\n⚠️ ADVERTENCIAS:');
            advertencias.forEach(adv => console.log(adv));
            console.log('');
        }

        if (fases.length === 0) {
            const mensajeError = '❌ CRÍTICO: Todos los días son feriados. No hay nada que scrapear.';
            console.error(mensajeError);
            await notificarDiscord(mensajeError, true);
            return;
        }

        console.log(`📅 Fechas a scrapear (${fases.length} días):`);
        fases.forEach(f => console.log(`   ${f.id}: ${f.fecha}`));

        // 5. Inicializar base de datos
        let baseDeDatos = {
            ultima_update: obtenerFechaChile(),
            fechas_scrapeadas: {
                viernes: fechas.viernes,
                sabado: fechas.sabado,
                domingo: fechas.domingo
            },
            feriados: feriadosChile,
            feriados_info: feriadosInfo,
            feriados_semana: fechas.feriadosEnSemana, // ⭐ NUEVO: Feriados detectados en la semana
            advertencias: advertencias,
            rutas: {}
        };

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

        // 6. EJECUCIÓN POR DÍAS (solo días válidos)
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

        console.log("\n✨ ¡PROCESO FINALIZADO CON ÉXITO!");
        console.log(`📁 Archivo generado en: ${RUTA_SALIDA}`);
        
        // Notificar éxito
        let mensajeExito = `
**Scraping completado exitosamente** 🎉

📅 **Fechas procesadas:**
- Viernes ${fechas.viernes}: ${fechas.viernesEsFeriado ? '❌ FERIADO (omitido)' : '✅ Scrapeado'}
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

        // ⭐ NUEVO: Mostrar feriados detectados en la semana
        if (fechas.feriadosEnSemana && fechas.feriadosEnSemana.length > 0) {
            mensajeExito += `\n\n🎊 **Feriados esta semana (${fechas.feriadosEnSemana.length}):**\n`;
            fechas.feriadosEnSemana.forEach(f => {
                mensajeExito += `- ${f.dia} ${f.fecha}: ${f.nombre}\n`;
            });
        }

        if (advertencias.length > 0) {
            mensajeExito += `\n\n⚠️ **Advertencias:**\n${advertencias.join('\n')}`;
        }
        
        await notificarDiscord(mensajeExito, erroresEncontrados > 100 || advertencias.length > 0);

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
