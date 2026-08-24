/* =========================================
   LOGIN ELEMENTS
========================================= */

const loginForm = document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const showPasswordButton =
    document.getElementById("showPassword");

const loginError =
    document.getElementById("loginError");


/* =========================================
   LOGIN CREDENTIALS
========================================= */

const correctUsername = "rediet";
const correctPassword = "2127";


/* =========================================
   SHOW / HIDE PASSWORD
========================================= */

showPasswordButton.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        showPasswordButton.textContent = "Hide";

        showPasswordButton.setAttribute(
            "aria-label",
            "Hide password"
        );

    } else {

        passwordInput.type = "password";

        showPasswordButton.textContent = "Show";

        showPasswordButton.setAttribute(
            "aria-label",
            "Show password"
        );

    }

});


/* =========================================
   LOGIN
========================================= */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    /* Clear previous message */

    loginError.textContent = "";


    /* =====================================
       CHECK LOGIN
    ===================================== */

    if (
        username === correctUsername &&
        password === correctPassword
    ) {

        loginError.textContent =
            "Login successful!";

        loginError.style.color =
            "#16a34a";


        /*
            Give the user a moment
            to see the success message.
        */

        setTimeout(function () {

            window.location.href =
                "dash.html";

        }, 500);


    } else {

        loginError.textContent =
            "Incorrect username or password.";

        loginError.style.color =
            "#dc2626";


        passwordInput.focus();

    }

});