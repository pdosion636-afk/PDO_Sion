/* =====================================================
   PDO SION - PWA SERVICE WORKER
===================================================== */

const CACHE_NAME =
    "pdo-sion-v1";


const FILES_TO_CACHE = [

    "./",

    "./login.html",
    "./login.js",
    "./auth.js",

    "./index.html",
    "./kegiatan.html",
    "./renungan.html",
    "./doa.html",
    "./kontak.html",

    "./PDO SION.css",

    "./script.js",
    "./push.js",

    "./manifest.json",

    "./PDO SION 1.jpg"

];


self.addEventListener(
    "install",
    function(event) {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(
                function(cache) {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                }
            )

        );


        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    function(event) {

        event.waitUntil(

            caches.keys()
                .then(
                    function(keys) {

                        return Promise.all(

                            keys
                                .filter(
                                    function(key) {

                                        return (
                                            key !==
                                            CACHE_NAME
                                        );

                                    }
                                )
                                .map(
                                    function(key) {

                                        return caches.delete(
                                            key
                                        );

                                    }
                                )

                        );

                    }
                )

        );


        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    function(event) {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(
                function(cached) {

                    return (
                        cached ||
                        fetch(event.request)
                    );

                }
            )

        );

    }
);