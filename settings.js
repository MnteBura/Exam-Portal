// ==========================================
// SETTINGS SYSTEM
// ==========================================


// ==========================================
// GET SETTINGS ELEMENTS
// ==========================================

const settingsButton =
    document.getElementById("settingsButton");

const settingsPanel =
    document.getElementById("settingsPanel");

const settingsOverlay =
    document.getElementById("settingsOverlay");

const closeSettings =
    document.getElementById("closeSettings");

const lightMode =
    document.getElementById("lightMode");

const darkMode =
    document.getElementById("darkMode");

const zoomIn =
    document.getElementById("zoomIn");

const zoomOut =
    document.getElementById("zoomOut");

const resetZoom =
    document.getElementById("resetZoom");

const zoomLevel =
    document.getElementById("zoomLevel");


// ==========================================
// SETTINGS EXISTS
// ==========================================

if (settingsButton && settingsPanel) {


    // ======================================
    // OPEN SETTINGS
    // ======================================

    settingsButton.addEventListener("click", function () {

        settingsPanel.classList.add("open");

        if (settingsOverlay) {

            settingsOverlay.classList.add("active");

        }

    });


    // ======================================
    // CLOSE SETTINGS
    // ======================================

    function closeSettingsPanel() {

        settingsPanel.classList.remove("open");

        if (settingsOverlay) {

            settingsOverlay.classList.remove("active");

        }

    }


    // ======================================
    // CLOSE BUTTON
    // ======================================

    if (closeSettings) {

        closeSettings.addEventListener(
            "click",
            closeSettingsPanel
        );

    }


    // ======================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ======================================

    if (settingsOverlay) {

        settingsOverlay.addEventListener(
            "click",
            closeSettingsPanel
        );

    }


    // ======================================
    // LIGHT MODE
    // ======================================

    if (lightMode) {

        lightMode.addEventListener(
            "click",
            function () {

                document.body.classList.remove("dark-mode");

                localStorage.setItem(
                    "theme",
                    "light"
                );

            }
        );

    }


    // ======================================
    // DARK MODE
    // ======================================

    if (darkMode) {

        darkMode.addEventListener(
            "click",
            function () {

                document.body.classList.add("dark-mode");

                localStorage.setItem(
                    "theme",
                    "dark"
                );

            }
        );

    }


    // ======================================
    // LOAD SAVED THEME
    // ======================================

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

    }

    else {

        document.body.classList.remove("dark-mode");

    }


    // ======================================
    // ZOOM SYSTEM
    // ======================================

    let currentZoom =
        Number(localStorage.getItem("zoom")) || 100;


    // ======================================
    // UPDATE ZOOM
    // ======================================

    function updateZoom() {

        document.documentElement.style.fontSize =
            currentZoom + "%";


        if (zoomLevel) {

            zoomLevel.textContent =
                currentZoom + "%";

        }


        localStorage.setItem(
            "zoom",
            currentZoom
        );

    }


    // ======================================
    // ZOOM IN
    // ======================================

    if (zoomIn) {

        zoomIn.addEventListener(
            "click",
            function () {

                if (currentZoom < 150) {

                    currentZoom += 10;

                    updateZoom();

                }

            }
        );

    }


    // ======================================
    // ZOOM OUT
    // ======================================

    if (zoomOut) {

        zoomOut.addEventListener(
            "click",
            function () {

                if (currentZoom > 80) {

                    currentZoom -= 10;

                    updateZoom();

                }

            }
        );

    }


    // ======================================
    // RESET ZOOM
    // ======================================

    if (resetZoom) {

        resetZoom.addEventListener(
            "click",
            function () {

                currentZoom = 100;

                updateZoom();

            }
        );

    }


    // ======================================
    // APPLY SAVED ZOOM
    // ======================================

    updateZoom();

}