const CACHE_NAME = "finance-dashboard-v1";

self.addEventListener("install", event => {
    console.log("Finance Dashboard service worker installed");
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    console.log("Finance Dashboard service worker activated");
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
