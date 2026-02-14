const CACHE_NAME = 'biotren-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './estaciones.js',
    './horarios.json',
    './manifest.json'
];

// Instalación: Guarda los archivos en el teléfono
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Estrategia: Intentar red, si falla usar lo guardado (Modo Offline)
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const resClone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
