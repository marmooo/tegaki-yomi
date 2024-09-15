const CACHE_NAME = "2024-09-15 13:27";
const urlsToCache = [
  "/tegaki-yomi/",
  "/tegaki-yomi/index.js",
  "/tegaki-yomi/worker.js",
  "/tegaki-yomi/model/model.json",
  "/tegaki-yomi/model/group1-shard1of1.bin",
  "/tegaki-yomi/mp3/correct3.mp3",
  "/tegaki-yomi/mp3/end.mp3",
  "/tegaki-yomi/favicon/favicon.svg",
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.21.0/dist/tf.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
