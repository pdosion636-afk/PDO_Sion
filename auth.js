// =====================================================
// PDO SION - AUTHENTICATION
// =====================================================

// Setiap kali halaman yang dilindungi dibuka,
// pengguna harus sudah login pada sesi browser saat ini.

const username = sessionStorage.getItem("pdoUsername");


// =====================================================
// JIKA BELUM LOGIN
// =====================================================

if (!username) {

    window.location.replace("login.html");

}


// =====================================================
// TAMPILKAN USERNAME
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const userElements =
            document.querySelectorAll("[data-username]");

        userElements.forEach(
            function (element) {

                element.textContent =
                    username || "";

            }
        );

    }
);


// =====================================================
// LOGOUT
// =====================================================

function logoutPDO() {

    sessionStorage.removeItem("pdoUsername");
    sessionStorage.removeItem("pdoLoginTime");

    window.location.replace("login.html");

}