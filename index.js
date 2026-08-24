/* =========================================================
   FAMILY SCHOOL — STUDENT PLATFORM
========================================================= */


/* =========================================================
   HEADER
========================================================= */

const siteHeader =
    document.getElementById(
        "siteHeader"
    );


window.addEventListener(
    "scroll",
    function () {

        if (
            window.scrollY > 25
        ) {

            siteHeader.classList.add(
                "scrolled"
            );

        }

        else {

            siteHeader.classList.remove(
                "scrolled"
            );

        }

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
    document.getElementById(
        "menuButton"
    );

const navbar =
    document.querySelector(
        ".navbar"
    );


if (menuButton) {

    menuButton.addEventListener(
        "click",
        function () {

            navbar.classList.toggle(
                "menu-open"
            );

        }
    );

}


document
    .querySelectorAll(".nav-link")
    .forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    navbar.classList.remove(
                        "menu-open"
                    );

                }
            );

        }
    );


/* =========================================================
   SETTINGS
========================================================= */

const settingsButton =
    document.getElementById(
        "settingsButton"
    );

const settingsPanel =
    document.getElementById(
        "settingsPanel"
    );

const settingsOverlay =
    document.getElementById(
        "settingsOverlay"
    );

const closeSettings =
    document.getElementById(
        "closeSettings"
    );


function openSettings() {

    settingsPanel.classList.add(
        "open"
    );

    settingsOverlay.classList.add(
        "active"
    );

}


function closeSettingsPanel() {

    settingsPanel.classList.remove(
        "open"
    );

    settingsOverlay.classList.remove(
        "active"
    );

}


if (settingsButton) {

    settingsButton.addEventListener(
        "click",
        openSettings
    );

}


if (closeSettings) {

    closeSettings.addEventListener(
        "click",
        closeSettingsPanel
    );

}


if (settingsOverlay) {

    settingsOverlay.addEventListener(
        "click",
        closeSettingsPanel
    );

}


/* =========================================================
   LIGHT / DARK MODE
========================================================= */

const lightMode =
    document.getElementById(
        "lightMode"
    );

const darkMode =
    document.getElementById(
        "darkMode"
    );


const savedTheme =
    localStorage.getItem(
        "familySchoolTheme"
    );


if (
    savedTheme === "light"
) {

    document.body.classList.add(
        "light-mode"
    );

}


if (lightMode) {

    lightMode.addEventListener(
        "click",
        function () {

            document.body.classList.add(
                "light-mode"
            );

            localStorage.setItem(
                "familySchoolTheme",
                "light"
            );

        }
    );

}


if (darkMode) {

    darkMode.addEventListener(
        "click",
        function () {

            document.body.classList.remove(
                "light-mode"
            );

            localStorage.setItem(
                "familySchoolTheme",
                "dark"
            );

        }
    );

}


/* =========================================================
   ZOOM
========================================================= */

const zoomIn =
    document.getElementById(
        "zoomIn"
    );

const zoomOut =
    document.getElementById(
        "zoomOut"
    );

const resetZoom =
    document.getElementById(
        "resetZoom"
    );

const zoomLevel =
    document.getElementById(
        "zoomLevel"
    );


let currentZoom =
    Number(
        localStorage.getItem(
            "familySchoolZoom"
        )
    ) || 100;


function updateZoom() {

    document.documentElement.style.fontSize =
        currentZoom + "%";


    if (zoomLevel) {

        zoomLevel.textContent =
            currentZoom + "%";

    }


    localStorage.setItem(
        "familySchoolZoom",
        currentZoom
    );

}


if (zoomIn) {

    zoomIn.addEventListener(
        "click",
        function () {

            if (
                currentZoom < 150
            ) {

                currentZoom += 10;

                updateZoom();

            }

        }
    );

}


if (zoomOut) {

    zoomOut.addEventListener(
        "click",
        function () {

            if (
                currentZoom > 80
            ) {

                currentZoom -= 10;

                updateZoom();

            }

        }
    );

}


if (resetZoom) {

    resetZoom.addEventListener(
        "click",
        function () {

            currentZoom =
                100;

            updateZoom();

        }
    );

}


updateZoom();


/* =========================================================
   MOTION CONTROL
========================================================= */

const motionToggle =
    document.getElementById(
        "motionToggle"
    );


const savedMotion =
    localStorage.getItem(
        "familySchoolMotion"
    );


if (
    savedMotion === "off"
) {

    document.body.classList.add(
        "no-motion"
    );

    motionToggle.textContent =
        "OFF";

    motionToggle.classList.remove(
        "active"
    );

}


if (motionToggle) {

    motionToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "no-motion"
            );


            const disabled =
                document.body.classList.contains(
                    "no-motion"
                );


            motionToggle.textContent =
                disabled
                    ? "OFF"
                    : "ON";


            motionToggle.classList.toggle(
                "active",
                !disabled
            );


            localStorage.setItem(
                "familySchoolMotion",
                disabled
                    ? "off"
                    : "on"
            );

        }
    );

}


/* =========================================================
   HERO POINTER INTERACTION
========================================================= */

const heroVisual =
    document.getElementById(
        "heroVisual"
    );


window.addEventListener(
    "mousemove",
    function (event) {

        if (
            window.innerWidth < 850 ||
            !heroVisual ||
            document.body.classList.contains(
                "no-motion"
            )
        ) {

            return;

        }


        const x =
            (
                event.clientX /
                window.innerWidth -
                0.5
            ) * 10;


        const y =
            (
                event.clientY /
                window.innerHeight -
                0.5
            ) * 10;


        heroVisual.style.transform =
            `translate(${x}px, ${y}px)`;

    }
);


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );


const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


const sectionObserver =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(
                function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        navLinks.forEach(
                            function (link) {

                                link.classList.remove(
                                    "active"
                                );

                            }
                        );


                        const matchingLink =
                            document.querySelector(
                                `.nav-link[href="#${entry.target.id}"]`
                            );


                        if (matchingLink) {

                            matchingLink.classList.add(
                                "active"
                            );

                        }

                    }

                }
            );

        },
        {
            rootMargin:
                "-35% 0px -55% 0px"
        }
    );


sections.forEach(
    function (section) {

        sectionObserver.observe(
            section
        );

    }
);


/* =========================================================
   FOCUS SESSION DEMO
========================================================= */

const focusButton =
    document.getElementById(
        "focusButton"
    );


if (focusButton) {

    focusButton.addEventListener(
        "click",
        function () {

            alert(
                "Focus mode is ready to be developed as a full study tool."
            );

        }
    );

}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeSettingsPanel();

            navbar.classList.remove(
                "menu-open"
            );

        }

    }
);
