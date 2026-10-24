// Offline support. Network first so new versions show up right away; the cache is the fallback.
// If you change files, bump VERSION so old caches are cleared.
const VERSION = 'sash-v1';
const CORE = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest',
  'js/app.js', 'js/program.js', 'js/figures.js', 'js/vault.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/apple-touch-icon.png',
  'fonts/fraunces.woff2', 'fonts/fraunces-italic.woff2', 'fonts/outfit-400.woff2', 'fonts/outfit-500.woff2', 'fonts/outfit-600.woff2',
  'fonts/aref-ruqaa-400.woff2', 'fonts/aref-ruqaa-700.woff2', 'fonts/amiri-400.woff2',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('index.html')))
  );
});
