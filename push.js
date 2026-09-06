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

// MASUKKAN PUBLIC VAPID KEY DARI FIREBASE CONSOLE
const VAPID_KEY =
    "BOMz8V2lZP42nPQQ_kkTkz07p9HVPanJPsMyhH4gjMQnHErIaEp1w-2enSD1cNIkbkOZEpNFWjh-GPycM0RDWlw";


// =====================================================
// FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

const db = getFirestore(app);


// =====================================================
// ELEMENT HTML
// =====================================================

const notificationButton =
    document.getElementById("notificationButton");

const notificationStatus =
    document.getElementById("notificationStatus");


// =====================================================
// STATUS
// =====================================================

function setStatus(text) {

    if (notificationStatus) {
        notificationStatus.textContent = text;
    }

    console.log("[PDO SION]", text);
}


// =====================================================
// AKTIFKAN NOTIFIKASI
// =====================================================

async function setupPush() {

    try {

        console.log("Memulai pengaturan notifikasi...");

        setStatus("Meminta izin notifikasi...");


        // -------------------------------------------------
        // CEK SUPPORT
        // -------------------------------------------------

        if (!("Notification" in window)) {

            setStatus(
                "Browser tidak mendukung notifikasi."
            );

            return;
        }


        // -------------------------------------------------
        // PERMISSION
        // -------------------------------------------------

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
                "/firebase-messaging-sw.js"
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
                    vapidKey: VAPID_KEY,
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
            localStorage.getItem(
                "pdoUsername"
            ) || "Pengguna";


        // -------------------------------------------------
        // SIMPAN KE FIRESTORE
        // -------------------------------------------------

        await setDoc(

            doc(
                db,
                "pushRegistrations",
                token
            ),

            {

                token: token,

                username: username,

                notifications: true,

                timestamp:
                    serverTimestamp()

            }

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

        new Notification(

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


        setStatus(
            "❌ Gagal mengaktifkan notifikasi. Cek Console."
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


        new Notification(

            title,

            {
                body: body
            }

        );

    }
);