self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handler fetch robuste : ne pas intercepter les API ni les requêtes non-GET
self.addEventListener('fetch', (event) => {
  try {
    const url = new URL(event.request.url);

    // Bypass des API et des requêtes non-GET
    if (url.pathname.startsWith('/api') || event.request.method !== 'GET') {
      return event.respondWith(fetch(event.request));
    }

    // Navigation (page) : tenter le réseau, sinon renvoyer un fallback HTML
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request)
          .then((resp) => resp)
          .catch(() =>
            new Response(
              '<!doctype html><html><head><meta charset="utf-8"><title>Offline</title></head><body><h1>Hors ligne</h1><p>La ressource est indisponible.</p></body></html>',
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/html' },
              }
            )
          )
      );
      return;
    }

    // Pour les autres GET : network-first, puis cache fallback
    event.respondWith(
      fetch(event.request)
        .then((resp) => resp)
        .catch(() => caches.match(event.request).then((cached) => cached || new Response(null, { status: 503 })))
    );
  } catch (err) {
    event.respondWith(new Response(null, { status: 503, statusText: 'Service Unavailable' }));
  }
});
