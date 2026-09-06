/* =====================================================
   PDO SION - AUTH SYSTEM
===================================================== */


const pdoUsername =
    localStorage.getItem(
        "pdoUsername"
    );


/* =====================================================
   CEK LOGIN
===================================================== */

if (
    !pdoUsername
) {

    window.location.href =
        "login.html";

}


/* =====================================================
   TAMPILKAN USERNAME
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const elements =
            document.querySelectorAll(
                "[data-username]"
            );


        elements.forEach(
            function(element) {

                element.textContent =
                    pdoUsername;

            }
        );

    }
);


/* =====================================================
   LOGOUT
===================================================== */

function logoutPDO() {

    localStorage.removeItem(
        "pdoUsername"
    );

    localStorage.removeItem(
        "pdoLoginTime"
    );

    localStorage.removeItem(
        "pdoFCMRegistered"
    );


    window.location.href =
        "login.html";

}