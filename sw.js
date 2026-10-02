/* =========================================================================
   SUPER STUM â sw.js Â· Service Worker (PWA)

   Estrategia por tipo de peticiÃ³n:
   â¢ NavegaciÃ³n (index.html)  â red primero, con respaldo en cachÃ© (offline).
   â¢ Recursos propios (css/js/Ã­conos/fotos) â stale-while-revalidate:
     se sirve al instante desde cachÃ© y se actualiza en segundo plano.
   â¢ Google Fonts              â cachÃ© primero (valen igual siempre).
   â¢ PeerJS (CDN)              â se deja pasar por la red; si un CDN
     falla, la app reintenta sola con el respaldo desde js/app.js.

   Para publicar una nueva versiÃ³n: sube el nÃºmero de VERSION.
   ========================================================================= */

const VERSION = "v2.1.0";
const CACHE_NAME = "super-stum-" + VERSION;

/* shell de la app: lo mÃ­nimo para abrir y jugar el modo prÃ¡ctica sin red */
const APP_SHELL = [
    "./",
    "./index.html",
    "./css/styles.css",
    "./js/app.js",
    "./manifest.json",
    "./icons/icon.svg",
    "./icons/icon-maskable.svg"
];

/* ------------------------------ instalación ------------------------------ */
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(url))))
            .then(() => self.skipWaiting())
    );
});

/* ------------------------------- activación ------------------------------ */
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((k) => k.startsWith("super-stum-") && k !== CACHE_NAME)
                    .map((k) => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

/* permitir actualizar el SW sin esperar (mensaje "SKIP_WAITING") */
self.addEventListener("message", (event) => {
    if (event.data === "SKIP_WAITING") self.skipWaiting();
});

/* --------------------------------- fetch --------------------------------- */
self.addEventListener("fetch", (event) => {
    const req = event.request;
    if (req.method !== "GET") return;

    const url = new URL(req.url);

    /* 1. Navegación: red primero, caché como respaldo offline */
    if (req.mode === "navigate") {
        event.respondWith(networkFirstPage(req));
        return;
    }

    /* 2. Fuentes de Google: cachÃ© primero */
    if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
        event.respondWith(cacheFirst(req));
        return;
    }

    /* 3. PeerJS (CDN): se intenta por red; la app tiene respaldo propio */
    if (url.hostname === "unpkg.com" || url.hostname === "cdn.jsdelivr.net") {
        event.respondWith(fetch(req).catch(() => caches.match(req, { ignoreSearch: true })));
        return;
    }

    /* 4. Recursos del propio sitio: stale-while-revalidate */
    if (url.origin === self.location.origin) {
        event.respondWith(staleWhileRevalidate(req));
    }
});

/* ------------------------------ estrategias ------------------------------ */

async function networkFirstPage(req) {
    try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await caches.match(req, { ignoreSearch: true });
        return cached || (await caches.match("./index.html")) ||
            new Response("Sin conexiÃ³n y sin copia guardada de SUPER STUM.", {
                status: 503,
                headers: { "Content-Type": "text/plain; charset=utf-8" }
            });
    }
}

async function cacheFirst(req) {
    const cached = await caches.match(req);
    if (cached) return cached;
    const fresh = await fetch(req);
    try {
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
    } catch (e) { /* respuesta opaca: se devuelve igual */ }
    return fresh;
}

async function staleWhileRevalidate(req) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, { ignoreSearch: true });
    const network = fetch(req)
        .then((fresh) => {
            if (fresh && fresh.ok) cache.put(req, fresh.clone());
            return fresh;
        })
        .catch(() => null);
    return cached || (await network) || new Response("", { status: 504 });
}