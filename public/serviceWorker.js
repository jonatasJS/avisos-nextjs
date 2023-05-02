const staticDevCoffee = "avisos-sim-v1";
const assets = [
  "/",
  "/index",
  "/dashboard",
  "/css/style.css",
  "/js/app.js",
  "/images/icon-512-512.png",
  "/images/icon-192-192.png",
  "/images/icon-144-144.png",
  "/images/icon-96-96.png",
  "/images/icon-72-72.png",
  "/images/icon-48-48.png",
  "/logo-sim-500-215.png",
  "/logo-sim.png"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});