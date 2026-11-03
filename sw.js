/* JERN service worker — gjør appen brukbar uten nett. */
const CACHE = "jern-v9";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
  "./favicon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window" }).then(list => {
      if (list.length) return list[0].focus();
      return self.clients.openWindow("./index.html");
    })
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  // Sidenavigasjon: prøv nett først, fall tilbake til cache når du er offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req, { cache: "no-cache" })
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Alt annet: cache først — raskt, og fungerer i kjelleren.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === "basic") {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => hit))
  );
});
