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
        console.log("installing cache")
        return cache.addAll(FILES_TO_CACHE)
    })
  );
  self.skipWaiting();
});

//Activate will clean up our previous caches
self.addEventListener('activate', (event) =>{
    console.log("beginning the search for older cached data")
    const cacheDuo = [CACHE_NAME, DATA_CACHE_NAME];
    event.waitUntil(caches.keys().then(keyList =>{
        keyList.map(key => {
            if (key !== cacheDuo){
                console.log("cleaning up older iteration of cached data", key);
                return caches.delete(key)
            };
        });
    }));
});

