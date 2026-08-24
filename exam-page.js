/* =========================================================
   EXAM PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   SELECTED EXAM
========================================================= */

let selectedExamId =
    sessionStorage.getItem(
        "selectedExamId"
    );


/*
   Refresh-safe fallback.
*/

if (!selectedExamId) {

    selectedExamId =
        localStorage.getItem(
            "selectedExamId"
        );

}


/*
   Default to the first exam.
*/

if (
    !selectedExamId &&
    Array.isArray(exams) &&
    exams.length > 0
) {

    selectedExamId =
        exams[0].id;

}


/*
   Save selected exam in both storage
   locations.
*/

if (selectedExamId) {

    sessionStorage.setItem(
        "selectedExamId",
        selectedExamId
    );

    localStorage.setItem(
        "selectedExamId",
        selectedExamId
    );

}


/* =========================================================
   CURRENT EXAM
========================================================= */

const currentExam =
    exams.find(
        function (exam) {

            return (
                exam.id ===
                selectedExamId
            );

        }
    );


if (!currentExam) {

    alert(
        "The selected examination could not be found."
    );

    window.location.href =
        "dash.html";

}


/* =========================================================
   QUESTIONS
========================================================= */

const questions =
    currentExam.questions;

const totalQuestions =
    questions.length;


/* =========================================================
   EXAM STATE
========================================================= */

let currentQuestionIndex = 0;

let answersGiven =
    new Array(
        totalQuestions
    ).fill(null);


let visitedQuestions =
    new Array(
        totalQuestions
    ).fill(false);


let skippedQuestions =
    new Array(
        totalQuestions
    ).fill(false);


let flaggedQuestions =
    new Array(
        totalQuestions
    ).fill(false);


/* =========================================================
   TIMER
========================================================= */

const EXAM_DURATION =
    currentExam.duration * 60;

let timeRemaining =
    EXAM_DURATION;

let timerInterval =
    null;

let examSubmitted =
    false;


/* =========================================================
   STORAGE KEYS
========================================================= */

const progressKey =
    "examProgress_" +
    currentExam.id;

const historyKey =
    "examHistory";


/* =========================================================
   GET HTML ELEMENTS
========================================================= */

const timerElement =
    document.getElementById(
        "timer"
    );

const warningElement =
    document.getElementById(
        "timeWarning"
    );

const warningTimerElement =
    document.getElementById(
        "warningTimer"
    );

const currentQuestionElement =
    document.getElementById(
        "currentQuestion"
    );

const totalQuestionsElement =
    document.getElementById(
        "totalQuestions"
    );

const questionNumberElement =
    document.getElementById(
        "questionNumber"
    );

const questionTextElement =
    document.getElementById(
        "questionText"
    );

const answersContainer =
    document.getElementById(
        "answers"
    );

const questionNumbersContainer =
    document.getElementById(
        "questionNumbers"
    );

const answeredCountElement =
    document.getElementById(
        "answeredCount"
    );

const remainingCountElement =
    document.getElementById(
        "remainingCount"
    );

const flaggedCountElement =
    document.getElementById(
        "flaggedCount"
    );

const flagButton =
    document.getElementById(
        "flagButton"
    );

const previousButton =
    document.getElementById(
        "previousButton"
    );

const nextButton =
    document.getElementById(
        "nextButton"
    );

const submitButton =
    document.getElementById(
        "submitButton"
    );

const progressFill =
    document.getElementById(
        "progressFill"
    );


/* =========================================================
   SUBMIT MODAL ELEMENTS
========================================================= */

const submitModal =
    document.getElementById(
        "submitModal"
    );

const cancelSubmit =
    document.getElementById(
        "cancelSubmit"
    );

const confirmSubmit =
    document.getElementById(
        "confirmSubmit"
    );

const modalAnswered =
    document.getElementById(
        "modalAnswered"
    );

const modalRemaining =
    document.getElementById(
        "modalRemaining"
    );

const modalFlagged =
    document.getElementById(
        "modalFlagged"
    );


/* =========================================================
   TOTAL QUESTIONS
========================================================= */

if (totalQuestionsElement) {

    totalQuestionsElement.textContent =
        totalQuestions;

}


/* =========================================================
   SAVE PROGRESS
========================================================= */

function saveProgress() {

    if (examSubmitted) {

        return;

    }


    const progress = {

        examId:
            currentExam.id,

        currentQuestionIndex:
            currentQuestionIndex,

        answersGiven:
            [...answersGiven],

        visitedQuestions:
            [...visitedQuestions],

        skippedQuestions:
            [...skippedQuestions],

        flaggedQuestions:
            [...flaggedQuestions],

        timeRemaining:
            timeRemaining,

        savedAt:
            Date.now()

    };


    try {

        localStorage.setItem(
            progressKey,
            JSON.stringify(progress)
        );

    }

    catch (error) {

        console.error(
            "Unable to save exam progress:",
            error
        );

    }

}


/* =========================================================
   RESTORE PROGRESS
========================================================= */

function restoreProgress() {

    const saved =
        localStorage.getItem(
            progressKey
        );


    if (!saved) {

        return false;

    }


    try {

        const progress =
            JSON.parse(saved);


        if (
            progress.examId !==
            currentExam.id
        ) {

            return false;

        }


        if (
            Array.isArray(
                progress.answersGiven
            ) &&
            progress.answersGiven.length ===
            totalQuestions
        ) {

            answersGiven =
                progress.answersGiven;

        }


        if (
            Array.isArray(
                progress.visitedQuestions
            ) &&
            progress.visitedQuestions.length ===
            totalQuestions
        ) {

            visitedQuestions =
                progress.visitedQuestions;

        }


        if (
            Array.isArray(
                progress.skippedQuestions
            ) &&
            progress.skippedQuestions.length ===
            totalQuestions
        ) {

            skippedQuestions =
                progress.skippedQuestions;

        }


        if (
            Array.isArray(
                progress.flaggedQuestions
            ) &&
            progress.flaggedQuestions.length ===
            totalQuestions
        ) {

            flaggedQuestions =
                progress.flaggedQuestions;

        }


        if (
            Number.isInteger(
                progress.currentQuestionIndex
            )
        ) {

            currentQuestionIndex =
                Math.max(
                    0,
                    Math.min(
                        progress.currentQuestionIndex,
                        totalQuestions - 1
                    )
                );

        }


        if (
            typeof progress.timeRemaining ===
            "number"
        ) {

            timeRemaining =
                Math.max(
                    0,
                    Math.min(
                        progress.timeRemaining,
                        EXAM_DURATION
                    )
                );

        }


        return true;

    }

    catch (error) {

        console.error(
            "Unable to restore exam progress:",
            error
        );


        localStorage.removeItem(
            progressKey
        );


        return false;

    }

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );

    const remainingSeconds =
        seconds % 60;


    return (
        String(minutes).padStart(
            2,
            "0"
        )
        +
        ":"
        +
        String(
            remainingSeconds
        ).padStart(
            2,
            "0"
        )
    );

}


/* =========================================================
   TIMER DISPLAY
========================================================= */

function updateTimerDisplay() {

    if (timerElement) {

        timerElement.textContent =
            formatTime(
                timeRemaining
            );

    }


    if (
        timeRemaining <= 300
    ) {

        if (warningElement) {

            warningElement.classList.add(
                "show"
            );

        }


        if (warningTimerElement) {

            warningTimerElement.textContent =
                formatTime(
                    timeRemaining
                );

        }


        if (timerElement) {

            timerElement.classList.add(
                "danger"
            );

        }

    }

    else {

        if (timerElement) {

            timerElement.classList.remove(
                "danger"
            );

        }

    }

}


/* =========================================================
   TIMER
========================================================= */

function timerTick() {

    if (examSubmitted) {

        return;

    }


    if (
        timeRemaining <= 0
    ) {

        timeRemaining = 0;

        updateTimerDisplay();

        submitExam(true);

        return;

    }


    updateTimerDisplay();


    timeRemaining--;


    /*
       Save every second.
    */

    saveProgress();

}


function startTimer() {

    updateTimerDisplay();


    timerInterval =
        setInterval(
            timerTick,
            1000
        );

}


/* =========================================================
   LOAD QUESTION
========================================================= */

function loadQuestion(index) {

    if (
        index < 0 ||
        index >= totalQuestions
    ) {

        return;

    }


    currentQuestionIndex =
        index;


    /*
       Viewing a question makes it visited.
    */

    visitedQuestions[index] =
        true;


    const question =
        questions[index];


    /* QUESTION NUMBER */

    if (currentQuestionElement) {

        currentQuestionElement.textContent =
            index + 1;

    }


    if (questionNumberElement) {

        questionNumberElement.textContent =
            index + 1;

    }


    /* QUESTION TEXT */

    if (questionTextElement) {

        questionTextElement.textContent =
            question.question;

    }


    /* ANSWERS */

    if (answersContainer) {

        answersContainer.innerHTML =
            "";


        question.answers.forEach(
            function (
                answerText,
                answerIndex
            ) {

                const answerButton =
                    document.createElement(
                        "button"
                    );


                answerButton.type =
                    "button";


                answerButton.className =
                    "answer";


                const letter =
                    String.fromCharCode(
                        65 + answerIndex
                    );


                answerButton.innerHTML = `
                    <span>
                        ${letter}
                    </span>

                    <p>
                        ${answerText}
                    </p>
                `;


                /*
                   Restore selected answer.
                */

                if (
                    answersGiven[index] ===
                    answerIndex
                ) {

                    answerButton.classList.add(
                        "selected"
                    );

                }


                answerButton.addEventListener(
                    "click",
                    function () {

                        selectAnswer(
                            index,
                            answerIndex
                        );

                    }
                );


                answersContainer.appendChild(
                    answerButton
                );

            }
        );

    }


    updateFlagButton();

    updateQuestionNumbers();

    updateStatistics();

    updateProgressBar();

    updateNavigationButtons();

}


/* =========================================================
   SELECT ANSWER
========================================================= */

function selectAnswer(
    questionIndex,
    answerIndex
) {

    if (examSubmitted) {

        return;

    }


    answersGiven[
        questionIndex
    ] =
        answerIndex;


    visitedQuestions[
        questionIndex
    ] =
        true;


    /*
       Answering removes skipped state.
    */

    skippedQuestions[
        questionIndex
    ] =
        false;


    loadQuestion(
        questionIndex
    );


    saveProgress();

}


/* =========================================================
   FLAG
========================================================= */

function toggleFlag() {

    if (examSubmitted) {

        return;

    }


    flaggedQuestions[
        currentQuestionIndex
    ] =
        !flaggedQuestions[
            currentQuestionIndex
        ];


    updateFlagButton();

    updateQuestionNumbers();

    updateStatistics();

    saveProgress();

}


/* =========================================================
   UPDATE FLAG BUTTON
========================================================= */

function updateFlagButton() {

    if (!flagButton) {

        return;

    }


    if (
        flaggedQuestions[
            currentQuestionIndex
        ]
    ) {

        flagButton.classList.add(
            "flagged"
        );


        flagButton.innerHTML = `
            <span>⚑</span>
            Flagged
        `;

    }

    else {

        flagButton.classList.remove(
            "flagged"
        );


        flagButton.innerHTML = `
            <span>⚑</span>
            Flag Question
        `;

    }

}


/* =========================================================
   QUESTION NAVIGATION
========================================================= */

function updateQuestionNumbers() {

    if (
        !questionNumbersContainer
    ) {

        return;

    }


    questionNumbersContainer.innerHTML =
        "";


    for (
        let i = 0;
        i < totalQuestions;
        i++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.textContent =
            i + 1;


        /*
           VISITED
        */

        if (
            visitedQuestions[i]
        ) {

            button.classList.add(
                "visited"
            );

        }


        /*
           ANSWERED
        */

        if (
            answersGiven[i] !==
            null
        ) {

            button.classList.add(
                "answered"
            );

        }


        /*
           SKIPPED
        */

        else if (
            skippedQuestions[i]
        ) {

            button.classList.add(
                "skipped"
            );

        }


        /*
           FLAGGED
        */

        if (
            flaggedQuestions[i]
        ) {

            button.classList.add(
                "flagged"
            );

        }


        /*
           Current question gets an outline.
           It does NOT get a special color.
        */

        if (
            i === currentQuestionIndex
        ) {

            button.classList.add(
                "active"
            );

        }


        button.addEventListener(
            "click",
            function () {

                loadQuestion(i);

                saveProgress();

            }
        );


        questionNumbersContainer
            .appendChild(button);

    }

}


/* =========================================================
   STATISTICS
========================================================= */

function getStatistics() {

    let answered = 0;

    let flagged = 0;


    for (
        let i = 0;
        i < totalQuestions;
        i++
    ) {

        if (
            answersGiven[i] !==
            null
        ) {

            answered++;

        }


        if (
            flaggedQuestions[i]
        ) {

            flagged++;

        }

    }


    return {

        answered:
            answered,

        remaining:
            totalQuestions -
            answered,

        flagged:
            flagged

    };

}


function updateStatistics() {

    const statistics =
        getStatistics();


    if (answeredCountElement) {

        answeredCountElement.textContent =
            statistics.answered;

    }


    if (remainingCountElement) {

        remainingCountElement.textContent =
            statistics.remaining;

    }


    if (flaggedCountElement) {

        flaggedCountElement.textContent =
            statistics.flagged;

    }

}


/* =========================================================
   PROGRESS BAR
========================================================= */

function updateProgressBar() {

    if (!progressFill) {

        return;

    }


    const answered =
        answersGiven.filter(
            function (answer) {

                return answer !==
                    null;

            }
        ).length;


    const percentage =
        totalQuestions === 0
            ? 0
            : (
                answered /
                totalQuestions
            ) * 100;


    progressFill.style.width =
        percentage + "%";

}


/* =========================================================
   NAVIGATION BUTTONS
========================================================= */

function updateNavigationButtons() {

    if (previousButton) {

        previousButton.disabled =
            currentQuestionIndex ===
            0;

    }


    if (nextButton) {

        nextButton.disabled =
            currentQuestionIndex ===
            totalQuestions - 1;

    }

}


/* =========================================================
   PREVIOUS
========================================================= */

function goToPreviousQuestion() {

    if (
        currentQuestionIndex > 0
    ) {

        loadQuestion(
            currentQuestionIndex - 1
        );


        saveProgress();

    }

}


/* =========================================================
   NEXT
========================================================= */

function goToNextQuestion() {

    if (
        currentQuestionIndex <
        totalQuestions - 1
    ) {


        /*
           Next without an answer
           creates RED skipped state.
        */

        if (
            answersGiven[
                currentQuestionIndex
            ] === null
        ) {

            skippedQuestions[
                currentQuestionIndex
            ] =
                true;

        }


        saveProgress();


        loadQuestion(
            currentQuestionIndex + 1
        );

    }

}


/* =========================================================
   OPEN SUBMIT MODAL
========================================================= */

function openSubmitModal() {

    if (
        !submitModal ||
        examSubmitted
    ) {

        return;

    }


    /*
       Save before opening.
    */

    saveProgress();


    const statistics =
        getStatistics();


    if (modalAnswered) {

        modalAnswered.textContent =
            statistics.answered;

    }


    if (modalRemaining) {

        modalRemaining.textContent =
            statistics.remaining;

    }


    if (modalFlagged) {

        modalFlagged.textContent =
            statistics.flagged;

    }


    submitModal.classList.add(
        "open"
    );


    /*
       Prevent the page from scrolling
       while the confirmation is open.
    */

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE SUBMIT MODAL
========================================================= */

function closeSubmitModal() {

    if (!submitModal) {

        return;

    }


    submitModal.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   SUBMIT EXAM
========================================================= */

function submitExam(
    autoSubmit = false
) {

    if (examSubmitted) {

        return;

    }


    /*
       Manual submission has already been
       confirmed through the custom modal.

       Automatic submission happens when
       the timer reaches zero.
    */

    if (
        !autoSubmit &&
        submitModal &&
        submitModal.classList.contains(
            "open"
        )
    ) {

        closeSubmitModal();

    }


    examSubmitted =
        true;


    if (timerInterval) {

        clearInterval(
            timerInterval
        );

    }


    /* CALCULATE SCORE */

    let score = 0;


    for (
        let i = 0;
        i < totalQuestions;
        i++
    ) {

        if (
            answersGiven[i] ===
            questions[i].correct
        ) {

            score++;

        }

    }


    /* COUNTS */

    const statistics =
        getStatistics();


    const percentage =
        totalQuestions === 0
            ? 0
            : Math.round(
                (
                    score /
                    totalQuestions
                ) * 100
            );


    /* RESULT OBJECT */

    const result = {

        examId:
            currentExam.id,

        examTitle:
            currentExam.title,

        score:
            score,

        total:
            totalQuestions,

        answered:
            statistics.answered,

        unanswered:
            statistics.remaining,

        flagged:
            statistics.flagged,

        percentage:
            percentage,

        date:
            new Date().toISOString()

    };


    /*
       Save current result.
    */

    sessionStorage.setItem(
        "examResult",
        JSON.stringify(result)
    );


    /*
       Add to history.
    */

    let history = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    historyKey
                )
            ) || [];


        if (!Array.isArray(history)) {

            history = [];

        }

    }

    catch (error) {

        history = [];

    }


    history.push(result);


    localStorage.setItem(
        historyKey,
        JSON.stringify(history)
    );


    /*
       Remove unfinished progress only
       after actual submission.
    */

    localStorage.removeItem(
        progressKey
    );


    /*
       Go to results page.
    */

    window.location.href =
        "results.html";

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

if (flagButton) {

    flagButton.addEventListener(
        "click",
        toggleFlag
    );

}


if (previousButton) {

    previousButton.addEventListener(
        "click",
        goToPreviousQuestion
    );

}


if (nextButton) {

    nextButton.addEventListener(
        "click",
        goToNextQuestion
    );

}


/*
   IMPORTANT:
   Submit button opens the custom modal.
*/

if (submitButton) {

    submitButton.addEventListener(
        "click",
        openSubmitModal
    );

}


/*
   Cancel button.
*/

if (cancelSubmit) {

    cancelSubmit.addEventListener(
        "click",
        closeSubmitModal
    );

}


/*
   Confirm button.
*/

if (confirmSubmit) {

    confirmSubmit.addEventListener(
        "click",
        function () {

            submitExam(false);

        }
    );

}


/*
   Click outside modal to close.
*/

if (submitModal) {

    submitModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                submitModal
            ) {

                closeSubmitModal();

            }

        }
    );

}


/* =========================================================
   ESCAPE TO CLOSE MODAL
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            submitModal &&
            submitModal.classList.contains(
                "open"
            )
        ) {

            closeSubmitModal();

        }

    }
);


/* =========================================================
   SAVE BEFORE REFRESH / CLOSE
========================================================= */

window.addEventListener(
    "beforeunload",
    function () {

        if (!examSubmitted) {

            saveProgress();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

const progressWasRestored =
    restoreProgress();


loadQuestion(
    currentQuestionIndex
);


if (
    timeRemaining <= 0
) {

    submitExam(true);

}

else {

    startTimer();

}


/* =========================================================
   DEBUG
========================================================= */

console.log(
    "Exam loaded:",
    currentExam.title
);

console.log(
    "Number of questions:",
    totalQuestions
);

console.log(
    "Saved progress restored:",
    progressWasRestored
);