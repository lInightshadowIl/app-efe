// Incrementa este número cada vez que hagas un deploy
const CACHE_VERSION = 'biotren-v3.3.0';

const ASSETS_OFFLINE = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/estaciones.js',
    '/version.json',
    '/horarios.json',
    '/manifest.json',
    '/icons/icon-32x32.png',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-180x180.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

// INSTALACIÓN
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando', CACHE_VERSION);
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => cache.addAll(ASSETS_OFFLINE))
            .then(() => {
                console.log('[SW] Assets cacheados para uso offline');
                return self.skipWaiting();
            })
            .catch(err => console.error('[SW] Error al cachear:', err))
    );
});

// ACTIVACIÓN
self.addEventListener('activate', (event) => {
    console.log('[SW] Activando', CACHE_VERSION);
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key !== CACHE_VERSION)
                    .map(key => {
                        console.log('[SW] Eliminando cache viejo:', key);
                        return caches.delete(key);
                    })
            ))
            .then(() => {
                console.log('[SW] Cache limpio, tomando control');
                return self.clients.claim();
            })
    );
});

// FETCH
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Ignorar solicitudes a otros dominios
    if (url.origin !== location.origin) return;

    // version.json y horarios.json: Network First con timeout (datos críticos)
    if (url.pathname.includes('version.json') || url.pathname.includes('horarios.json')) {
        event.respondWith(networkFirstConCache(event.request));
        return;
    }

    // App shell (HTML, JS, CSS): Stale-While-Revalidate
    if (
        url.pathname.endsWith('.html') ||
        url.pathname.endsWith('.js')   ||
        url.pathname.endsWith('.css')  ||
        url.pathname === '/'
    ) {
        event.respondWith(staleWhileRevalidate(event.request));
        return;
    }

    // Iconos y assets estáticos: Cache First
    event.respondWith(cacheFirstConRed(event.request));
});

// ESTRATEGIAS

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(request);

    const networkUpdate = fetch(request)
        .then(response => {
            if (response && response.status === 200) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);

    return cached ?? await networkUpdate;
}

async function networkFirstConCache(request) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    try {
        const respuesta = await fetch(request, { signal: controller.signal });
        clearTimeout(timer);
        if (respuesta && respuesta.status === 200) {
            const cache = await caches.open(CACHE_VERSION);
            cache.put(request, respuesta.clone());
        }
        return respuesta;
    } catch {
        clearTimeout(timer);
        console.log('[SW] Red no disponible o timeout, usando cache para:', request.url);
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
            return caches.match('/index.html');
        }
    }
}

async function cacheFirstConRed(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const respuesta = await fetch(request);
        if (respuesta && respuesta.status === 200) {
            const cache = await caches.open(CACHE_VERSION);
            cache.put(request, respuesta.clone());
        }
        return respuesta;
    } catch (err) {
        console.log('[SW] Error de red y sin cache:', err);
    }
}

// SINCRONIZACIÓN EN SEGUNDO PLANO
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-horarios') {
        event.waitUntil(
            fetch('/horarios.json')
                .then(r => r.json())
                .then(data => {
                    console.log('[SW] Horarios sincronizados en segundo plano');
                    return self.clients.matchAll().then(clients => {
                        clients.forEach(client => client.postMessage({
                            type: 'HORARIOS_UPDATED',
                            data,
                            timestamp: new Date().toISOString()
                        }));
                    });
                })
                .catch(err => console.warn('[SW] Error al sincronizar:', err))
        );
    }
});

// MENSAJES DESDE LA APP
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[SW] Forzando actualizacion...');
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        console.log('[SW] Limpiando cache a pedido...');
        event.waitUntil(
            caches.keys().then(keys =>
                Promise.all(keys.map(k => caches.delete(k)))
            )
        );
    }
});
