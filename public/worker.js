var CACHE_NAME = "FlowPlan";
var urlsToCache = [
    "index.html",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
    "flowplan.svg",
    "manifest.json",
    "maskable_icon.png",
    "maskable_icon_x192.png",
    "maskable_icon_x384.png",
    "screenshot_treeview.png",
    "screenshot_mobile.jpg",
    "worker.js",
    "robots.txt",
    "assets/bg-1.png",
    "assets/bg-2.png",
    "assets/bg-3.jpg",
    "assets/core.js",
    "assets/index.css",
    "assets/index.js",
];

// Install a service worker
self.addEventListener("install", (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Update a service worker
self.addEventListener("activate", (event) => {
  var cacheWhitelist = ["FlowPlan"];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});