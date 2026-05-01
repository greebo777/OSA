const CACHE_NAME = "sporttimer-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "index.html",
  "manifest.json",
  "start-sound.mp3",
  "signal-sound.mp3",
  "end-sound.mp3",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(keyList.map((key) => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  // Wenn Startseite ("/" oder "/index.html"), immer index.html aus dem Cache zurückgeben
  if (
    evt.request.mode === "navigate" ||
    (evt.request.method === "GET" &&
      evt.request.headers.get("accept")?.includes("text/html"))
  ) {
    evt.respondWith(
      caches.match("index.html").then((response) => response || fetch(evt.request))
    );
    return;
  }
  // Alle anderen Anfragen normal aus dem Cache bedienen
  evt.respondWith(
    caches.match(evt.request).then((response) => response || fetch(evt.request))
  );
});
