import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getMessaging,
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging.js";

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {

    apiKey: "AIzaSyBcCOHUllPhCPquEhIDC5fLKHhkpI418kM",

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
};


// =====================================================
// VAPID KEY
// =====================================================

const VAPID_KEY =
    "BOMz8V2lZP42nPQQ_kkTkz07p9HVPanJPsMyhH4gjMQnHErIaEp1w-2enSD1cNIkbkOZEpNFWjh-GPycM0RDWlw";


// =====================================================
// FIREBASE
// =====================================================

const app =
    initializeApp(firebaseConfig);

const messaging =
    getMessaging(app);

const db =
    getFirestore(app);


// =====================================================
// ELEMENT HTML
// =====================================================

const notificationButton =
    document.getElementById(
        "notificationButton"
    );

const notificationStatus =
    document.getElementById(
        "notificationStatus"
    );


// =====================================================
// STATUS
// =====================================================

function setStatus(text) {

    if (notificationStatus) {

        notificationStatus.textContent =
            text;

    }

    console.log(
        "[PDO SION]",
        text
    );
}


// =====================================================
// AKTIFKAN NOTIFIKASI
// =====================================================

async function setupPush() {

    try {

        console.log(
            "Memulai pengaturan notifikasi..."
        );


        console.log(
            "URL halaman:",
            window.location.href
        );


        console.log(
            "Origin:",
            window.location.origin
        );


        // -------------------------------------------------
        // CEK NOTIFICATION SUPPORT
        // -------------------------------------------------

        if (!("Notification" in window)) {

            setStatus(
                "Browser tidak mendukung notifikasi."
            );

            return;
        }


        console.log(
            "Notification permission:",
            Notification.permission
        );


        // -------------------------------------------------
        // CEK SERVICE WORKER SUPPORT
        // -------------------------------------------------

        if (!("serviceWorker" in navigator)) {

            setStatus(
                "Browser tidak mendukung Service Worker."
            );

            return;
        }


        console.log(
            "Service Worker supported:",
            true
        );


        // -------------------------------------------------
        // PERMISSION
        // -------------------------------------------------

        setStatus(
            "Meminta izin notifikasi..."
        );


        const permission =
            await Notification.requestPermission();


        console.log(
            "Notification permission:",
            permission
        );


        if (permission !== "granted") {

            setStatus(
                "Izin notifikasi ditolak."
            );

            return;
        }


        // -------------------------------------------------
        // SERVICE WORKER
        // -------------------------------------------------

        setStatus(
            "Mendaftarkan service worker..."
        );


        const registration =
            await navigator.serviceWorker.register(
                "./firebase-messaging-sw.js",
                {
                    scope: "./"
                }
            );


        console.log(
            "Service Worker berhasil:",
            registration
        );


        // -------------------------------------------------
        // AMBIL FCM TOKEN
        // -------------------------------------------------

        setStatus(
            "Menghubungkan ke Firebase..."
        );


        const token =
            await getToken(
                messaging,
                {
                    vapidKey:
                        VAPID_KEY,

                    serviceWorkerRegistration:
                        registration
                }
            );


        console.log(
            "FCM TOKEN:",
            token
        );


        if (!token) {

            setStatus(
                "Token Firebase tidak ditemukan."
            );

            return;
        }


        // -------------------------------------------------
        // USERNAME
        // -------------------------------------------------

        const username =
            sessionStorage.getItem(
                "pdoUsername"
            ) || "Pengguna";


        console.log(
            "Username:",
            username
        );


        // -------------------------------------------------
        // SIMPAN KE FIRESTORE
        // -------------------------------------------------

        setStatus(
            "Menyimpan perangkat ke Firebase..."
        );


        await setDoc(

            doc(
                db,
                "pushRegistrations",
                token
            ),

            {

                fid:
                    token,

                token:
                    token,

                username:
                    username,

                notifications:
                    true,

                timestamp:
                    serverTimestamp()

            }

        );


        console.log(
            "Registrasi perangkat berhasil disimpan."
        );


        // -------------------------------------------------
        // BERHASIL
        // -------------------------------------------------

        setStatus(
            "✅ Pengingat renungan berhasil diaktifkan."
        );


        if (notificationButton) {

            notificationButton.innerHTML =
                '<i class="fa-solid fa-bell"></i> Pengingat Aktif';

        }


        // -------------------------------------------------
        // TES NOTIFIKASI
        // -------------------------------------------------

        await registration.showNotification(
    "PDO SION",
    {
        body:
            "Pengingat renungan berhasil diaktifkan."
    }
);

    }

    catch (error) {

        console.error(
            "ERROR PUSH NOTIFICATION:",
            error
        );


        const errorCode =
            error?.code ||
            "Tidak diketahui";


        const errorMessage =
            error?.message ||
            String(error);


        setStatus(
            `❌ Gagal: ${errorCode} - ${errorMessage}`
        );

    }

}


// =====================================================
// KLIK TOMBOL
// =====================================================

if (notificationButton) {

    notificationButton.addEventListener(
        "click",
        setupPush
    );

} else {

    console.error(
        "Tombol notificationButton tidak ditemukan."
    );

}


// =====================================================
// PESAN SAAT WEBSITE TERBUKA
// =====================================================

onMessage(
    messaging,
    (payload) => {

        console.log(
            "Pesan Firebase diterima:",
            payload
        );


        const title =
            payload.notification?.title ||
            "PDO SION";


        const body =
            payload.notification?.body ||
            "Ada pengingat renungan.";


        navigator.serviceWorker.ready.then(
    (registration) => {

        registration.showNotification(
            title,
            {
                body:
                    body
            }
        );

    }
);

    }
);