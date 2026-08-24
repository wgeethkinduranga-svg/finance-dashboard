const CACHE_NAME = "finance-dashboard-v2";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];


/* ================================
   INSTALL
================================ */

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {

        return cache.addAll(
          FILES_TO_CACHE
        );

      })
      .catch(error => {

        console.error(
          "Cache installation failed:",
          error
        );

      })

  );

  self.skipWaiting();

});


/* ================================
   ACTIVATE
================================ */

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys
          .filter(
            key => key !== CACHE_NAME
          )
          .map(
            key => caches.delete(key)
          )

      );

    })

  );

  self.clients.claim();

});


/* ================================
   FETCH
================================ */

self.addEventListener("fetch", event => {

  const request =
    event.request;


  /*
   Only handle GET requests.
  */

  if(request.method !== "GET"){

    return;

  }


  const url =
    new URL(request.url);


  /*
   Do not intercept external
   Firebase/CDN requests.

   This allows Firebase,
   Chart.js, XLSX and jsPDF
   to work normally.
  */

  if(
    url.origin !==
    self.location.origin
  ){

    return;

  }


  /*
   Network first.

   If online:
   return fresh file and update cache.

   If offline:
   return cached file.
  */

  event.respondWith(

    fetch(request)

      .then(response => {

        if(
          response &&
          response.status === 200 &&
          response.type === "basic"
        ){

          const copy =
            response.clone();


          caches.open(
            CACHE_NAME
          ).then(cache => {

            cache.put(
              request,
              copy
            );

          }).catch(error => {

            console.warn(
              "Cache update failed:",
              error
            );

          });

        }


        return response;

      })

      .catch(() => {

        return caches.match(
          request
        ).then(cached => {

          if(cached){

            return cached;

          }


          return new Response(

            "You are currently offline.",

            {

              status:503,

              statusText:"Offline",

              headers:{
                "Content-Type":
                "text/plain; charset=utf-8"
              }

            }

          );

        });

      })

  );

});
