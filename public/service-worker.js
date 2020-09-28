const FILES_TO_CACHE = [
 "/",
 "/index.html",
 "/styles.css",
 "/index.js",
 "/manifest.json",
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//Install the cache
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(PRECACHE).then(cache => {
        return cache.addAll(FILES_TO_CACHE)
    })
  );
  self.skipWaiting();
});

//