import fs   from 'fs';
import path from 'path';

const RUTAS = {
    '/horarios.json':          'horarios.json',
    '/version.json':           'version.json',
    '/app.js':                 'app.js',
    '/estaciones.js':          'estaciones.js'
};

const MIME = {
    '.json': 'application/json; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8'
};

export default function handler(req, res) {
    const tokenEsperado = process.env.BIOTREN_TOKEN;
    const tokenRecibido = req.headers['x-biotren-client'];

    if (!tokenEsperado || tokenRecibido !== tokenEsperado) {
        return res.status(403).end('Acceso denegado');
    }

    const urlLimpia = req.url.split('?')[0];
    const archivo = Object.keys(RUTAS).find(r => urlLimpia.endsWith(r));

    if (!archivo) return res.status(404).end('No encontrado');

    const rutaFisica = path.join(process.cwd(), RUTAS[archivo]);
    if (!fs.existsSync(rutaFisica)) return res.status(404).end('Archivo no encontrado');

    const ext = path.extname(archivo);
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).end(fs.readFileSync(rutaFisica));
}
