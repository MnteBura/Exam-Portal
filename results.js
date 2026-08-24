const resultData =
    JSON.parse(
        sessionStorage.getItem("examResult")
    );


const scoreElement =
    document.getElementById("score");

const correctElement =
    document.getElementById("correct");

const incorrectElement =
    document.getElementById("incorrect");

const unansweredElement =
    document.getElementById("unanswered");

const flaggedElement =
    document.getElementById("flagged");

const finalScoreElement =
    document.getElementById("finalScore");

const percentageElement =
    document.getElementById("percentage");

const performanceElement =
    document.getElementById("performance");

const scoreTextElement =
    document.getElementById("scoreText");


if (resultData) {

    const score =
        resultData.score;

    const total =
        resultData.total;

    const answered =
        resultData.answered;

    const unanswered =
        resultData.unanswered;

    const flagged =
        resultData.flagged;

    const percentage =
        resultData.percentage;


    const incorrect =
        answered - score;


    scoreElement.textContent =
        percentage;

    correctElement.textContent =
        score;

    incorrectElement.textContent =
        incorrect;

    unansweredElement.textContent =
        unanswered;

    flaggedElement.textContent =
        flagged;

    finalScoreElement.textContent =
        score + " / " + total;

    percentageElement.textContent =
        percentage + "%";


    if (percentage >= 90) {

        performanceElement.textContent =
            "Outstanding! 🏆";

        scoreTextElement.textContent =
            "Excellent performance. You really know your stuff!";

    }

    else if (percentage >= 75) {

        performanceElement.textContent =
            "Great Work! 🎉";

        scoreTextElement.textContent =
            "You performed very well on this examination.";

    }

    else if (percentage >= 50) {

        performanceElement.textContent =
            "Good Effort! 👍";

        scoreTextElement.textContent =
            "You passed, but there is still room to improve.";

    }

    else {

        performanceElement.textContent =
            "Keep Learning! 💪";

        scoreTextElement.textContent =
            "Don't give up. Review the material and try again.";

    }

}


/* RETAKE */

document
    .getElementById("retakeButton")
    .addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "examResult"
            );

            window.location.href =
                "exam-page.html";

        }
    );


/* DASHBOARD */

document
    .getElementById("dashboardButton")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "dash.html";

        }
    );