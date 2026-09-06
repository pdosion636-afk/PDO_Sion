/* =====================================================
   PDO SION - LOGIN SYSTEM
===================================================== */


/* =====================================================
   EMAILJS
===================================================== */

const EMAILJS_PUBLIC_KEY =
    "3nkYkA26YPTnc3nKL";

const EMAILJS_SERVICE_ID =
    "service_izslokl";

const EMAILJS_TEMPLATE_ID =
    "template_vlva54s";


/* =====================================================
   INIT EMAILJS
===================================================== */

emailjs.init({
    publicKey:
        EMAILJS_PUBLIC_KEY
});


/* =====================================================
   ELEMENT
===================================================== */

const loginForm =
    document.getElementById(
        "loginForm"
    );

const usernameInput =
    document.getElementById(
        "username"
    );

const loginButton =
    document.getElementById(
        "loginButton"
    );

const loginButtonText =
    document.getElementById(
        "loginButtonText"
    );

const loginMessage =
    document.getElementById(
        "loginMessage"
    );


/* =====================================================
   CEK LOGIN
===================================================== */

if (
    localStorage.getItem(
        "pdoUsername"
    )
) {

    window.location.href =
        "index.html";

}


/* =====================================================
   WAKTU INDONESIA BARAT
===================================================== */

function getWIBTime() {

    return new Date().toLocaleString(
        "id-ID",
        {
            timeZone:
                "Asia/Jakarta",

            dateStyle:
                "full",

            timeStyle:
                "medium"
        }
    );

}


/* =====================================================
   KIRIM EMAIL LOGIN
===================================================== */

async function sendLoginEmail(
    username
) {

    const params = {

        username:
            username,

        login_time:
            getWIBTime(),

        message:
            `Si ${username} login ke website PDO SION.`,

        website:
            "PDO SION"

    };


    try {

        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            params
        );


        return true;

    }

    catch (error) {

        console.error(
            "EmailJS Error:",
            error
        );


        return false;

    }

}


/* =====================================================
   LOGIN
===================================================== */

loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const username =
            usernameInput.value.trim();


        /* Validasi */

        if (
            username.length < 2
        ) {

            loginMessage.textContent =
                "Nama minimal 2 karakter.";

            loginMessage.className =
                "login-message error";

            return;

        }


        if (
            !/^[a-zA-ZÀ-ÿ0-9 ._-]+$/
                .test(username)
        ) {

            loginMessage.textContent =
                "Username mengandung karakter yang tidak diperbolehkan.";

            loginMessage.className =
                "login-message error";

            return;

        }


        loginButton.disabled =
            true;


        loginButtonText.textContent =
            "Memproses...";


        /*
           Kirim email ke:
           pdosion636@gmail.com

           sesuai konfigurasi template
           EmailJS Anda.
        */

        const emailSent =
            await sendLoginEmail(
                username
            );


        /*
           Tetap simpan login walaupun
           pengiriman email sedang gagal.
        */

        localStorage.setItem(
            "pdoUsername",
            username
        );


        localStorage.setItem(
            "pdoLoginTime",
            getWIBTime()
        );


        if (
            emailSent
        ) {

            loginMessage.textContent =
                `Selamat datang, ${username}!`;

        }

        else {

            loginMessage.textContent =
                `Selamat datang, ${username}!`;

        }


        loginMessage.className =
            "login-message success";


        setTimeout(
            () => {

                window.location.href =
                    "index.html";

            },
            700
        );

    }
);