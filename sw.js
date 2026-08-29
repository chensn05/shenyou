// 神游 · Service Worker — 离线缓存静态资源
const CACHE_NAME = 'shenyou-v1'
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  // 网络优先，失败则读缓存
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        if (resp.ok && e.request.method === 'GET') {
          const clone = resp.clone()
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone))
        }
        return resp
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  )
})
