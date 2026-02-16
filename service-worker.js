const CACHE_NAME = 'biotren-v2.0';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/estaciones.js',
    '/horarios.json',
    '/manifest.json',
    // Iconos (ajusta según los que tengas)
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

// 🔧 INSTALACIÓN: Cachear todos los archivos esenciales
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker v2.0...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cacheando archivos esenciales');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[SW] ✅ Todos los archivos cacheados correctamente');
                return self.skipWaiting(); // Activar inmediatamente
            })
            .catch((error) => {
                console.error('[SW] ❌ Error al cachear archivos:', error);
            })
    );
});

// 🔧 ACTIVACIÓN: Limpiar cachés antiguos
self.addEventListener('activate', (event) => {
    console.log('[SW] Activando Service Worker v2.0...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] 🗑️ Eliminando caché antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] ✅ Service Worker activado');
                return self.clients.claim(); // Tomar control inmediatamente
            })
    );
});

// 🔧 FETCH: Estrategia inteligente según el tipo de archivo
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Ignorar solicitudes a otros dominios
    if (url.origin !== location.origin) {
        return;
    }
    
    // 📊 ESTRATEGIA ESPECIAL para horarios.json: Network First
    if (url.pathname.includes('horarios.json')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Si la red funciona, actualizar el caché
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                            console.log('[SW] 📲 horarios.json actualizado en caché');
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Si falla la red, usar el caché (modo offline)
                    console.log('[SW] 📡 Offline: Usando horarios.json del caché');
                    return caches.match(event.request);
                })
        );
        return;
    }
    
    // 🚀 ESTRATEGIA para archivos estáticos: Cache First (más rápido)
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Encontrado en caché, devolver inmediatamente
                    return cachedResponse;
                }
                
                // No está en caché, intentar red
                return fetch(event.request)
                    .then((response) => {
                        // Si es una respuesta válida, cachearla
                        if (response && response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return response;
                    })
                    .catch((error) => {
                        console.log('[SW] ❌ Error de red:', error);
                        
                        // Página offline de respaldo (opcional)
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// 🔄 SINCRONIZACIÓN en segundo plano (cuando vuelva la conexión)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-horarios') {
        console.log('[SW] 🔄 Sincronizando horarios en segundo plano...');
        
        event.waitUntil(
            fetch('/horarios.json')
                .then((response) => response.json())
                .then((data) => {
                    console.log('[SW] ✅ Horarios sincronizados');
                    
                    // Notificar a todos los clientes abiertos
                    return self.clients.matchAll().then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({
                                type: 'HORARIOS_UPDATED',
                                data: data,
                                timestamp: new Date().toISOString()
                            });
                        });
                    });
                })
                .catch((error) => {
                    console.log('[SW] ⚠️ Error al sincronizar:', error);
                })
        );
    }
});

// 📬 MENSAJES de los clientes
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[SW] 🔄 Forzando actualización...');
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        console.log('[SW] 🗑️ Limpiando caché...');
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});
