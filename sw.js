// Houdt de app bruikbaar zonder internet. Eerst het netwerk, anders de bewaarde kopie.
const CACHE = 'prijskaartjes-v1';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const kopie = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, kopie));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
