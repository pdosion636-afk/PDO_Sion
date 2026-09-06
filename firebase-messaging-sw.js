/* =====================================================
   PDO SION - FIREBASE MESSAGING SERVICE WORKER
===================================================== */


importScripts(
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js"
);


importScripts(
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js"
);


/* =====================================================
   FIREBASE CONFIG
===================================================== */

firebase.initializeApp({

    apiKey:
        "AIzaSyAcBIcMq_R7JdD4kkDcwWJNwhT2o_QWWQE",

    authDomain:
        "pdo-sion.firebaseapp.com",

    projectId:
        "pdo-sion",

    storageBucket:
        "pdo-sion.firebasestorage.app",

    messagingSenderId:
        "989426579191",

    appId:
        "1:989426579191:web:6fd11aada40675e75805f2",

    measurementId:
        "G-EWTTBM8CLD"

});


const messaging =
    firebase.messaging();


/* =====================================================
   BACKGROUND NOTIFICATION
===================================================== */

messaging.onBackgroundMessage(
    function(payload) {

        console.log(
            "Background message:",
            payload
        );


        const title =
            payload.notification?.title ||
            payload.data?.title ||
            "PDO SION";


        const body =
            payload.notification?.body ||
            payload.data?.body ||
            "Renungan PDO SION tersedia.";


        self.registration.showNotification(

            title,

            {

                body:
                    body,

                icon:
                    "/PDO%20SION%201.jpg",

                badge:
                    "/PDO%20SION%201.jpg",

                data:
                {

                    url:
                        "/renungan.html"

                }

            }

        );

    }
);


/* =====================================================
   KLIK NOTIFIKASI
===================================================== */

self.addEventListener(
    "notificationclick",
    function(event) {

        event.notification.close();


        event.waitUntil(

            clients.openWindow(
                "/renungan.html"
            )

        );

    }
);