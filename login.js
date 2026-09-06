// =====================================================
// PDO SION - LOGIN
// =====================================================


// =====================================================
// EMAILJS CONFIGURATION
// =====================================================

const EMAILJS_PUBLIC_KEY =
    "3nkYkA26YPTnc3nKL";

const EMAILJS_SERVICE_ID =
    "service_izslokl";

const EMAILJS_TEMPLATE_ID =
    "template_vlva54s";


// =====================================================
// INITIALIZE EMAILJS
// =====================================================

emailjs.init({

    publicKey:
        EMAILJS_PUBLIC_KEY

});


// =====================================================
// ELEMENT HTML
// =====================================================

const loginForm =
    document.getElementById(
        "loginForm"
    );


const loginButton =
    document.getElementById(
        "loginButton"
    );


const loginStatus =
    document.getElementById(
        "loginStatus"
    );


// =====================================================
// STATUS
// =====================================================

function setLoginStatus(
    message,
    success = false
) {

    if (!loginStatus) {
        return;
    }


    loginStatus.textContent =
        message;


    loginStatus.className =
        success
            ? "login-status success"
            : "login-status error";

}


// =====================================================
// LOGIN
// =====================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();


            // ---------------------------------------------
            // VALIDASI
            // ---------------------------------------------

            if (!username) {

                setLoginStatus(
                    "Silakan masukkan nama pengguna."
                );

                return;
            }


            if (username.length < 2) {

                setLoginStatus(
                    "Nama pengguna terlalu pendek."
                );

                return;
            }


            // ---------------------------------------------
            // DISABLE BUTTON
            // ---------------------------------------------

            if (loginButton) {

                loginButton.disabled =
                    true;

                loginButton.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

            }


            setLoginStatus(
                "Sedang masuk..."
            );


            // ---------------------------------------------
            // WAKTU LOGIN
            // ---------------------------------------------

            const loginTime =
                new Date();


            const formattedTime =
                loginTime.toLocaleString(
                    "id-ID",
                    {
                        dateStyle:
                            "full",

                        timeStyle:
                            "medium",

                        timeZone:
                            "Asia/Jakarta"
                    }
                );


            try {

                // -----------------------------------------
                // SIMPAN USERNAME
                // -----------------------------------------

               sessionStorage.setItem(
    "pdoUsername",
    username
);

sessionStorage.setItem(
    "pdoLoginTime",
    loginTime.toISOString()
);


                // -----------------------------------------
                // KIRIM EMAIL NOTIFIKASI
                // -----------------------------------------

                const templateParams = {

                    username:
                        username,

                    login_time:
                        formattedTime,

                    message:
                        `Si ${username} login ke website PDO SION.`

                };


                await emailjs.send(

                    EMAILJS_SERVICE_ID,

                    EMAILJS_TEMPLATE_ID,

                    templateParams

                );


                console.log(
                    "Email login berhasil dikirim."
                );


                // -----------------------------------------
                // SUKSES
                // -----------------------------------------

                setLoginStatus(
                    "Login berhasil. Mengarahkan...",
                    true
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "index.html";

                    },
                    700
                );

            }

            catch (error) {

                console.error(
                    "EmailJS Login Error:",
                    error
                );


                /*
                 * Login tetap diperbolehkan walaupun
                 * email notifikasi gagal.
                 */

                setLoginStatus(
                    "Login berhasil. Mengarahkan...",
                    true
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "index.html";

                    },
                    700
                );

            }

        }
    );

}