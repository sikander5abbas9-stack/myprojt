const cacheName = 'v1';
const cacheAssets = ['index.html'];

// Install Event
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            cache.addAll(cacheAssets);
        })
    );
});

// Fetch Event (Offline kaam karne ke liye)
self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
