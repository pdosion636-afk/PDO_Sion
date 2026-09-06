// =====================================================
// PDO SION - AUTHENTICATION
// =====================================================


// =====================================================
// CEK LOGIN
// =====================================================

const username =
    localStorage.getItem(
        "pdoUsername"
    );


// =====================================================
// JIKA BELUM LOGIN
// =====================================================

if (!username) {

    window.location.replace(
        "login.html"
    );

}


// =====================================================
// TAMPILKAN USERNAME
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const userElements =
            document.querySelectorAll(
                "[data-username]"
            );


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

    localStorage.removeItem(
        "pdoUsername"
    );


    localStorage.removeItem(
        "pdoLoginTime"
    );


    window.location.replace(
        "login.html"
    );

}