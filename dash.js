/* =========================================================
   DASHBOARD JAVASCRIPT
   ========================================================= */


/* =========================================================
   GET HTML ELEMENTS
   ========================================================= */

const logoutButton =
    document.getElementById("logoutButton");

const examList =
    document.getElementById("examList");

const examHistory =
    document.getElementById("examHistory");

const availableExamCount =
    document.getElementById("availableExamCount");

const totalQuestionCount =
    document.getElementById("totalQuestionCount");

const completedExamCount =
    document.getElementById("completedExamCount");


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const historyKey = "examHistory";

const selectedExamKey = "selectedExamId";


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            /*
               Remove only temporary exam-selection data.

               We intentionally keep:
               - exam progress
               - exam history
               - settings
            */

            sessionStorage.removeItem(
                selectedExamKey
            );

            sessionStorage.removeItem(
                "examResult"
            );


            window.location.href =
                "exam.html";

        }
    );

}


/* =========================================================
   CHECK SAVED EXAM PROGRESS
   ========================================================= */

function hasSavedProgress(examId) {

    const progress =
        localStorage.getItem(
            `examProgress_${examId}`
        );


    return progress !== null;

}


/* =========================================================
   GET SAVED PROGRESS
========================================================= */

function getSavedProgress(examId) {

    const progress =
        localStorage.getItem(
            `examProgress_${examId}`
        );


    if (!progress) {

        return null;

    }


    try {

        return JSON.parse(
            progress
        );

    }

    catch (error) {

        console.error(
            "Invalid saved exam progress:",
            error
        );


        localStorage.removeItem(
            `examProgress_${examId}`
        );


        return null;

    }

}


/* =========================================================
   RENDER AVAILABLE EXAMS
========================================================= */

function renderExams() {

    if (!examList) {

        return;

    }


    examList.innerHTML = "";


    if (
        !Array.isArray(exams) ||
        exams.length === 0
    ) {

        examList.innerHTML = `

            <div class="empty-history">

                <div>
                    📚
                </div>

                <h3>
                    No examinations available
                </h3>

                <p>
                    Examinations will appear here when they are added.
                </p>

            </div>

        `;

        return;

    }


    exams.forEach(
        function (exam) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "exam-card";


            /*
               Check whether this exam
               has unfinished progress.
            */

            const savedProgress =
                getSavedProgress(
                    exam.id
                );


            const hasProgress =
                savedProgress !== null;


            /*
               Determine button text.
            */

            let buttonText =
                "Start Examination →";


            if (hasProgress) {

                buttonText =
                    "Continue Examination →";

            }


            /*
               Create card.
            */

            card.innerHTML = `

                <div class="exam-header">

                    <div class="subject-icon">

                        ${exam.title
                            .charAt(0)
                            .toUpperCase()}

                    </div>


                    <div>

                        <h3>
                            ${exam.title}
                        </h3>

                        <p>
                            ${exam.description}
                        </p>

                    </div>

                </div>


                <div class="exam-details">


                    <div>

                        <span>
                            Questions
                        </span>

                        <strong>
                            ${exam.questions.length}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Duration
                        </span>

                        <strong>
                            ${exam.duration} Minutes
                        </strong>

                    </div>


                    <div>

                        <span>
                            Attempts
                        </span>

                        <strong>
                            ${exam.attempts}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Type
                        </span>

                        <strong>
                            Multiple Choice
                        </strong>

                    </div>


                </div>


                <div class="exam-action">


                    <button
                        class="exam-start-button"
                        type="button"
                        data-exam-id="${exam.id}">

                        ${buttonText}

                    </button>


                </div>

            `;


            examList.appendChild(
                card
            );

        }
    );


    /*
       Connect every exam button.
    */

    const examButtons =
        document.querySelectorAll(
            ".exam-start-button"
        );


    examButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const examId =
                        button.dataset.examId;


                    /*
                       Make the selected exam
                       persist through refreshes.
                    */

                    sessionStorage.setItem(
                        selectedExamKey,
                        examId
                    );

                    localStorage.setItem(
                        selectedExamKey,
                        examId
                    );


                    /*
                       Go to examination page.
                    */

                    window.location.href =
                        "exam-page.html";

                }
            );

        }
    );

}


/* =========================================================
   RENDER EXAM HISTORY
========================================================= */

function renderHistory() {

    if (!examHistory) {

        return;

    }


    const storedHistory =
        localStorage.getItem(
            historyKey
        );


    let history = [];


    /*
       Safely read history.
    */

    if (storedHistory) {

        try {

            history =
                JSON.parse(
                    storedHistory
                );


            if (!Array.isArray(history)) {

                history = [];

            }

        }

        catch (error) {

            console.error(
                "Could not read exam history:",
                error
            );


            history = [];

        }

    }


    examHistory.innerHTML = "";


    /*
       Completed exam counter.
    */

    if (completedExamCount) {

        completedExamCount.textContent =
            history.length;

    }


    /*
       No results yet.
    */

    if (history.length === 0) {

        examHistory.innerHTML = `

            <div class="empty-history">

                <div>
                    📊
                </div>

                <h3>
                    No exam results yet
                </h3>

                <p>
                    Complete an examination and
                    your results will appear here.
                </p>

            </div>

        `;

        return;

    }


    /*
       Show newest result first.
    */

    history
        .slice()
        .reverse()
        .forEach(
            function (result) {

                const historyItem =
                    document.createElement(
                        "div"
                    );


                historyItem.className =
                    "history-item";


                /*
                   Find matching exam.
                */

                const exam =
                    exams.find(
                        function (item) {

                            return (
                                item.id ===
                                result.examId
                            );

                        }
                    );


                const examTitle =
                    exam
                        ? exam.title
                        : (
                            result.examTitle ||
                            "Examination"
                        );


                /*
                   Format date.
                */

                let formattedDate =
                    "Date unavailable";


                if (result.date) {

                    const date =
                        new Date(
                            result.date
                        );


                    if (
                        !Number.isNaN(
                            date.getTime()
                        )
                    ) {

                        formattedDate =
                            date.toLocaleString();

                    }

                }


                /*
                   Create result item.
                */

                historyItem.innerHTML = `

                    <div class="history-main">

                        <div class="history-icon">
                            ✓
                        </div>


                        <div>

                            <strong>
                                ${examTitle}
                            </strong>

                            <span>
                                ${formattedDate}
                            </span>

                        </div>

                    </div>


                    <div class="history-score">

                        <strong>
                            ${result.percentage}%
                        </strong>

                        <span>
                            ${result.score}/${result.total}
                        </span>

                    </div>

                `;


                examHistory.appendChild(
                    historyItem
                );

            }
        );

}


/* =========================================================
   UPDATE DASHBOARD STATISTICS
========================================================= */

function updateDashboardStats() {

    /*
       Available exams.
    */

    if (availableExamCount) {

        availableExamCount.textContent =
            exams.length;

    }


    /*
       Total questions across
       all available exams.
    */

    if (totalQuestionCount) {

        const totalQuestions =
            exams.reduce(
                function (
                    total,
                    exam
                ) {

                    return (
                        total +
                        exam.questions.length
                    );

                },
                0
            );


        totalQuestionCount.textContent =
            totalQuestions;

    }


    /*
       Completed exams.

       This is based on the stored
       result history.
    */

    if (completedExamCount) {

        const storedHistory =
            localStorage.getItem(
                historyKey
            );


        let history = [];


        if (storedHistory) {

            try {

                history =
                    JSON.parse(
                        storedHistory
                    );

            }

            catch (error) {

                history = [];

            }

        }


        completedExamCount.textContent =
            Array.isArray(history)
                ? history.length
                : 0;

    }

}


/* =========================================================
   REMOVE INVALID SELECTED EXAM
========================================================= */

function validateSelectedExam() {

    const selectedExamId =
        localStorage.getItem(
            selectedExamKey
        );


    if (!selectedExamId) {

        return;

    }


    const exists =
        exams.some(
            function (exam) {

                return (
                    exam.id ===
                    selectedExamId
                );

            }
        );


    if (!exists) {

        localStorage.removeItem(
            selectedExamKey
        );

        sessionStorage.removeItem(
            selectedExamKey
        );

    }

}


/* =========================================================
   REFRESH DASHBOARD
========================================================= */

function refreshDashboard() {

    validateSelectedExam();

    renderExams();

    renderHistory();

    updateDashboardStats();

}


/* =========================================================
   INITIALIZE
========================================================= */

refreshDashboard();