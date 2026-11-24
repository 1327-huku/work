// オフライン用キャッシュ。ファイルを更新したら VERSION を変えてください。
const VERSION = 'studyquest-v1';
const FILES = [
  './', 'index.html', 'css/style.css', 'js/store.js', 'js/confetti.js', 'js/app.js',
  'manifest.webmanifest', 'icons/icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ネットが使えるときは最新を取得、だめならキャッシュ
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
