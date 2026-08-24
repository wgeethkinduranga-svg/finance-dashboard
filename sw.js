const CACHE_NAME = "finance-dashboard-v1";

self.addEventListener("install", event => {
    console.log("Finance Dashboard SW installed");
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    console.log("Finance Dashboard SW activated");

    event.waitUntil(
        self.clients.claim()
    );
});

/*
 Do NOT intercept Firebase, Firestore, authentication,
 Chart.js, XLSX or other external requests.
*/
