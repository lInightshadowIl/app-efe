const ACCESS_TOKEN = self.__BIOTREN_TOKEN__;

function _addHeader(request) {
  const url = new URL(request.url);
  const bypassPaths = [
    "/horarios.json",
    "/precios-historial.json",
    "/version.json",
    "/app.js",
    "/estaciones.js"
  ];
  const needsToken = bypassPaths.some(path => url.pathname.includes(path));

  if (needsToken) {
    // Clone headers and add auth token
    const headers = {};
    for (const [key, value] of request.headers.entries()) {
      headers[key] = value;
    }
    headers["x-biotren-client"] = ACCESS_TOKEN;
    return new Request(request, { headers });
  }
  return request;
}

const CACHE_VERSION = "biotren-v3.4.7";
const ASSETS_OFFLINE = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/estaciones.js",
  "/manifest.json",
  "/icons/icon-32x32.png",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-180x180.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png"
];

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cachedResponse = await cache.match(request);
  const fetchPromise = fetch(_addHeader(request))
    .then(networkResponse => {
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);
  return cachedResponse ?? await fetchPromise;
}

async function networkFirstConCache(request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const networkResponse = await fetch(_addHeader(request), { signal: controller.signal });
    clearTimeout(timeoutId);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    console.log("[SW] Red no disponible o timeout, usando cache para:", request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    if (request.mode === "navigate") {
      return caches.match("/index.html");
    }
  }
}

async function cacheFirstConRed(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;
  try {
    const networkResponse = await fetch(_addHeader(request));
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("[SW] Error de red y sin cache:", error);
  }
}

self.addEventListener("install", event => {
  console.log("[SW] Instalando", CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(ASSETS_OFFLINE))
      .then(() => {
        console.log("[SW] Assets cacheados para uso offline");
        // No llamamos a self.skipWaiting() aquí para permitir que index.html controle la actualización
      })
      .catch(err => console.error("[SW] Error al cachear:", err))
  );
});

self.addEventListener("activate", event => {
  console.log("[SW] Activando", CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => {
            console.log("[SW] Eliminando cache viejo:", key);
            return caches.delete(key);
          })
      )
    ).then(() => {
      console.log("[SW] Cache limpio, tomando control");
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin) {
    if (url.pathname.includes("version.json") || url.pathname.includes("horarios.json")) {
      event.respondWith(networkFirstConCache(event.request));
    } else if (
      url.pathname.endsWith(".html") ||
      url.pathname.endsWith(".js") ||
      url.pathname.endsWith(".css") ||
      url.pathname === "/"
    ) {
      event.respondWith(staleWhileRevalidate(event.request));
    } else {
      event.respondWith(cacheFirstConRed(event.request));
    }
  }
});

self.addEventListener("sync", event => {
  if (event.tag === "sync-horarios") {
    event.waitUntil(
      fetch(_addHeader(new Request("/horarios.json")))
        .then(res => res.json())
        .then(data => {
          console.log("[SW] Horarios sincronizados en segundo plano");
          return self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({
                type: "HORARIOS_UPDATED",
                data: data,
                timestamp: new Date().toISOString()
              });
            });
          });
        })
        .catch(err => console.warn("[SW] Error al sincronizar:", err))
    );
  }
});

self.addEventListener("message", event => {
  if (event.data) {
    if (event.data.type === "SKIP_WAITING") {
      console.log("[SW] Forzando actualizacion...");
      self.skipWaiting();
    }
    if (event.data.type === "CLEAR_CACHE") {
      console.log("[SW] Limpiando cache a pedido...");
      event.waitUntil(
        caches.keys().then(keys =>
          Promise.all(keys.map(key => caches.delete(key)))
        )
      );
    }
    if (event.data.type === "GET_VERSION") {
      event.source.postMessage({
        type: "SW_VERSION",
        version: CACHE_VERSION
      });
    }
  }
});
