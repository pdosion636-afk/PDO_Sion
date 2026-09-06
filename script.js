/* =====================================================
   PDO SION - RENUNGAN
===================================================== */


/* =====================================================
   DATA RENUNGAN

   1 OBJECT = 1 RENUNGAN
   AYAT + REFLEKSI + DOA
===================================================== */

const renungan = [

    {
        ayat:
            "TUHAN adalah gembalaku, takkan kekurangan aku.",

        referensi:
            "Mazmur 23:1",

        refleksi:
            "Tuhan adalah Gembala yang memelihara dan menuntun hidup kita. Ketika kita tidak mengetahui langkah berikutnya, kita dapat belajar untuk percaya bahwa Tuhan mengetahui jalan terbaik bagi kita.",

        doa:
            "Tuhan, tuntunlah langkah kami hari ini. Berikan kami hati yang percaya kepada-Mu dan ajarlah kami untuk selalu mengandalkan Engkau dalam setiap keadaan. Amin."
    },


    {
        ayat:
            "Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.",

        referensi:
            "Filipi 4:13",

        refleksi:
            "Ada masa ketika kita merasa lemah dan tidak sanggup menghadapi persoalan. Firman Tuhan mengingatkan bahwa kita tidak harus menghadapi semuanya dengan kekuatan sendiri.",

        doa:
            "Tuhan, berikan kami kekuatan ketika kami merasa lemah. Tolong kami untuk tetap percaya kepada-Mu dan tidak menyerah dalam setiap proses kehidupan. Amin."
    },


    {
        ayat:
            "Percayalah kepada TUHAN dengan segenap hatimu.",

        referensi:
            "Amsal 3:5",

        refleksi:
            "Kita sering ingin mengetahui seluruh jawaban sebelum mengambil keputusan. Namun Tuhan mengajarkan kita untuk tetap percaya kepada-Nya meskipun kita belum mengetahui seluruh jalan yang ada di depan.",

        doa:
            "Bapa, ajarlah kami untuk mempercayai-Mu lebih daripada mengandalkan pemikiran kami sendiri. Pimpin setiap keputusan dan langkah kami. Amin."
    },


    {
        ayat:
            "Mintalah, maka akan diberikan kepadamu.",

        referensi:
            "Matius 7:7",

        refleksi:
            "Doa adalah kesempatan untuk datang kepada Tuhan dan membawa isi hati kita kepada-Nya. Di dalam doa kita belajar berserah, berharap, dan semakin dekat dengan Tuhan.",

        doa:
            "Tuhan, ajar kami menjadi pribadi yang tekun berdoa. Tolong kami untuk menyerahkan setiap pergumulan kepada-Mu dan percaya kepada kehendak-Mu. Amin."
    },


    {
        ayat:
            "Aku menyertai kamu senantiasa sampai kepada akhir zaman.",

        referensi:
            "Matius 28:20",

        refleksi:
            "Dalam perjalanan hidup, kita mungkin merasa sendirian. Tetapi Tuhan menjanjikan penyertaan-Nya. Kita tidak berjalan sendirian karena Tuhan selalu hadir bersama kita.",

        doa:
            "Tuhan Yesus, terima kasih karena Engkau selalu menyertai kami. Tolong kami untuk terus berjalan bersama-Mu dan menyadari kehadiran-Mu setiap hari. Amin."
    }

];


/* =====================================================
   WAKTU WIB
===================================================== */

function getWIBDate() {

    const now =
        new Date();


    const parts =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone:
                    "Asia/Jakarta",

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hourCycle:
                    "h23"
            }
        )
        .formatToParts(now);


    const value =
        type =>
            parts.find(
                part =>
                    part.type === type
            )?.value;


    return new Date(

        Number(
            value("year")
        ),

        Number(
            value("month")
        ) - 1,

        Number(
            value("day")
        ),

        Number(
            value("hour")
        ),

        Number(
            value("minute")
        ),

        Number(
            value("second")
        )

    );

}


/* =====================================================
   TANGGAL AKTIF

   Sebelum 05.00:
   gunakan hari sebelumnya.
===================================================== */

function getActiveDate() {

    const date =
        getWIBDate();


    if (
        date.getHours() < 5
    ) {

        date.setDate(
            date.getDate() - 1
        );

    }


    return date;

}


/* =====================================================
   TENTUKAN INDEX RENUNGAN

   Senin 05.00
   Kamis 05.00
===================================================== */

function getRenunganIndex() {

    const current =
        getActiveDate();


    /*
       Senin pertama sebagai titik awal
       sistem.

       5 Januari 2026
    */

    const startDate =
        new Date(
            2026,
            0,
            5,
            5,
            0,
            0
        );


    const day =
        current.getDay();


    let lastChange =
        new Date(
            current
        );


    /*
       SENIN
    */

    if (
        day === 1
    ) {

        lastChange.setDate(
            current.getDate()
        );

    }


    /*
       SELASA
    */

    else if (
        day === 2
    ) {

        lastChange.setDate(
            current.getDate() - 1
        );

    }


    /*
       RABU
    */

    else if (
        day === 3
    ) {

        lastChange.setDate(
            current.getDate() - 2
        );

    }


    /*
       KAMIS
    */

    else if (
        day === 4
    ) {

        lastChange.setDate(
            current.getDate()
        );

    }


    /*
       JUMAT
    */

    else if (
        day === 5
    ) {

        lastChange.setDate(
            current.getDate() - 1
        );

    }


    /*
       SABTU
    */

    else if (
        day === 6
    ) {

        lastChange.setDate(
            current.getDate() - 2
        );

    }


    /*
       MINGGU
    */

    else {

        lastChange.setDate(
            current.getDate() - 3
        );

    }


    lastChange.setHours(
        5,
        0,
        0,
        0
    );


    const difference =
        lastChange.getTime() -
        startDate.getTime();


    const days =
        Math.floor(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    /*
       Setiap 7 hari terdapat 2 pergantian.
    */

    const weeks =
        Math.floor(
            days / 7
        );


    const isThursday =
        lastChange.getDay() === 4;


    const slot =
        (
            weeks * 2
        ) +
        (
            isThursday
                ? 1
                : 0
        );


    return (
        slot %
        renungan.length
    );

}


/* =====================================================
   TAMPILKAN RENUNGAN
===================================================== */

function tampilkanRenungan() {

    const verse =
        document.getElementById(
            "dailyVerse"
        );


    if (!verse) {

        return;

    }


    const reference =
        document.getElementById(
            "dailyReference"
        );


    const reflection =
        document.getElementById(
            "dailyReflection"
        );


    const prayer =
        document.getElementById(
            "dailyPrayer"
        );


    const dateElement =
        document.getElementById(
            "dailyDate"
        );


    const index =
        getRenunganIndex();


    const current =
        renungan[index];


    verse.textContent =
        `“${current.ayat}”`;


    if (reference) {

        reference.textContent =
            current.referensi;

    }


    if (reflection) {

        reflection.textContent =
            current.refleksi;

    }


    if (prayer) {

        prayer.textContent =
            current.doa;

    }


    if (dateElement) {

        const date =
            getActiveDate();


        dateElement.textContent =
            date.toLocaleDateString(
                "id-ID",
                {
                    weekday:
                        "long",

                    day:
                        "numeric",

                    month:
                        "long",

                    year:
                        "numeric"
                }
            );

    }

}


/* =====================================================
   RUN
===================================================== */

tampilkanRenungan();