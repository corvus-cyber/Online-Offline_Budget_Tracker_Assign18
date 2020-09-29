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
      caches.open(CACHE_NAME).then(cache => {
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

//Fetch 
self.addEventListener("fetch", function(event) {
    // cache successful requests to the API
    if (event.request.url.includes("/api/")) {
      event.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(event.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }
  
              return response;
            })
            .catch(error => {
              // Network request failed, try to get it from the cache.
              return cache.match(event.request);
            });
        }).catch(error => console.log(error))
      );
  
      return;
    }
  
    // if the request is not for the API, serve static assets using "offline-first" approach.
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
