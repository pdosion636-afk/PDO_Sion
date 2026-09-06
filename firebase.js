import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https";

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";


// =====================================================
// FIREBASE ADMIN
// =====================================================

initializeApp();

const db = getFirestore();
const messaging = getMessaging();


// =====================================================
// FUNGSI MENGIRIM NOTIFIKASI
// =====================================================

async function sendPush(title, body) {

    const snapshot = await db
        .collection("pushRegistrations")
        .get();


    const tokens = snapshot.docs
        .map(doc => doc.data().token)
        .filter(token => typeof token === "string" && token.length > 0);


    console.log(
        `Jumlah perangkat terdaftar: ${tokens.length}`
    );


    if (tokens.length === 0) {

        return {
            success: false,
            message: "Tidak ada perangkat terdaftar."
        };

    }


    let totalSuccess = 0;
    let totalFailure = 0;


    // Maksimal 500 token per pengiriman
    for (
        let i = 0;
        i < tokens.length;
        i += 500
    ) {

        const batch = tokens.slice(i, i + 500);


        const message = {

            notification: {

                title: title,

                body: body

            },

            webpush: {

                notification: {

                    title: title,

                    body: body

                },

                fcmOptions: {

                    // Untuk sekarang jangan diarahkan ke
                    // DOMAIN publik. Gunakan halaman lokal
                    // saat pengujian.
                    link:
                        "http://127.0.0.1:5500/renungan.html"

                }

            },

            tokens: batch

        };


        try {

            const response =
                await messaging.sendEachForMulticast(
                    message
                );


            totalSuccess +=
                response.successCount;


            totalFailure +=
                response.failureCount;


            console.log(
                `Batch ${Math.floor(i / 500) + 1}:`,
                `Berhasil = ${response.successCount},`,
                `Gagal = ${response.failureCount}`
            );


            // Tampilkan error token yang gagal
            response.responses.forEach(
                (result, index) => {

                    if (!result.success) {

                        console.error(
                            "Token gagal:",
                            batch[index],
                            result.error?.code,
                            result.error?.message
                        );

                    }

                }
            );

        }

        catch (error) {

            console.error(
                "Gagal mengirim batch:",
                error
            );

            totalFailure += batch.length;

        }

    }


    console.log(
        `TOTAL: berhasil=${totalSuccess}, gagal=${totalFailure}`
    );


    return {

        success: totalSuccess > 0,

        totalDevices: tokens.length,

        successCount: totalSuccess,

        failureCount: totalFailure

    };

}


// =====================================================
// FUNGSI TES MANUAL
// =====================================================
//
// Setelah deploy, Firebase akan memberikan URL.
// Membuka URL tersebut akan mengirim notifikasi tes.
//
// =====================================================

export const testNotifikasi = onRequest(

    async (req, res) => {

        try {

            const result =
                await sendPush(

                    "🔔 Tes PDO SION",

                    "Notifikasi dari Cloud Functions berhasil!"

                );


            res.status(200).json({

                success: true,

                message:
                    "Fungsi pengiriman notifikasi berhasil dijalankan.",

                result: result

            });

        }

        catch (error) {

            console.error(
                "ERROR TEST NOTIFIKASI:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Gagal mengirim notifikasi.",

                error:
                    error.message

            });

        }

    }

);


// =====================================================
// NOTIFIKASI OTOMATIS
// =====================================================
//
// 05.00
// 06.00
// 12.00
// 19.00
//
// Semua waktu menggunakan WIB.
// =====================================================

export const pengingatRenungan = onSchedule(

    {

        schedule:
            "0 5,6,12,19 * * *",

        timeZone:
            "Asia/Jakarta"

    },


    async () => {

        const now = new Date();


        const formatter =
            new Intl.DateTimeFormat(
                "en-US",
                {

                    timeZone:
                        "Asia/Jakarta",

                    weekday:
                        "long",

                    hour:
                        "numeric",

                    hourCycle:
                        "h23"

                }
            );


        const parts =
            formatter.formatToParts(now);


        const weekday =
            parts.find(
                item =>
                    item.type === "weekday"
            )?.value;


        const hour =
            Number(
                parts.find(
                    item =>
                        item.type === "hour"
                )?.value
            );


        let title = "";
        let body = "";


        // =================================================
        // SENIN & KAMIS — 05.00
        // =================================================

        if (

            hour === 5 &&

            (
                weekday === "Monday" ||
                weekday === "Thursday"
            )

        ) {

            title =
                "📖 Renungan Baru PDO SION";


            body =
                "Renungan hari ini sudah tersedia. Yuk luangkan waktu untuk membaca Firman Tuhan.";

        }


        // =================================================
        // 06.00
        // =================================================

        else if (hour === 6) {

            title =
                "🙏 Pengingat PDO SION";


            body =
                "Sudahkah kamu membaca renungan hari ini?";

        }


        // =================================================
        // 12.00
        // =================================================

        else if (hour === 12) {

            title =
                "🌿 Pengingat PDO SION";


            body =
                "Luangkan waktu sejenak untuk mengingat Firman Tuhan.";

        }


        // =================================================
        // 19.00
        // =================================================

        else if (hour === 19) {

            title =
                "❤️ Pengingat PDO SION";


            body =
                "Mari kembali merenungkan Firman Tuhan hari ini.";

        }


        else {

            console.log(
                "Tidak ada notifikasi untuk waktu ini."
            );

            return;

        }


        console.log(
            `Mengirim notifikasi ${hour}:00 WIB`
        );


        await sendPush(
            title,
            body
        );

    }

);