const STATIC_CACHE = "static";
const DYNAMIC_CACHE = "dynamic-v30";

self.addEventListener("install", function (event) {
  console.log("Installed", event);
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./detail.html",
        "./smart.html",
        "./manifest.json",

        "./js/script.js",
        "./smart.js",
        "./js/jquery-3.7.1.min.js",

        "./css/style.css",

        "./images/logo.svg",
        "./images/search.svg",
        "./images/place.svg",

        "./fonts/product_sans_bold-webfont.woff2",
        "./fonts/product_sans_bold-webfont.woff",
        "./fonts/product_sans_regular-webfont.woff2",
        "./fonts/product_sans_regular-webfont.woff",
      ]);
    }),
  );
});

self.addEventListener("activate", function (event) {
  console.log("Activated", event);
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log(key);
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(event.request, networkResponse.clone());

          return networkResponse;
        });
      })

      .catch(() => {
        return caches.match(event.request);
      }),
  );
});
