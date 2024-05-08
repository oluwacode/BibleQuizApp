const startBtn = document.querySelector(".s-btn button");
const infoBox = document.querySelector(".info-box");
const exitBtn = document.querySelector(".buttons .quit");
const continueBtn = document.querySelector(".buttons .restart");
const resultBox = document.querySelector(".result-box");
const timeText = document.querySelector(".timer .time-left");
const quizBox = document.querySelector(".quiz-box");
const nextBtn = document.querySelector("footer .next-btn");

let timerInterval;
let queCount = 0;
let userScore = 0;

// Function to start the quiz
startBtn.onclick = () => {
    infoBox.style.display = "block";
    startBtn.style.display = "none";
};

// Function to exit the quiz
exitBtn.onclick = () => {
    window.location.reload(); // Reload the page to quit the quiz
};

// Function to handle the quit button at the end of the quiz
const quitQuizButton = resultBox.querySelector(".buttons .quit");
quitQuizButton.onclick = () => {
    window.location.reload(); // Reload the page to quit the quiz
};

// Function to continue the quiz
continueBtn.onclick = () => {
    quizBox.style.display = "block";
    infoBox.style.display = "none";
    showQuestion(queCount);
    startTimer(15);
};

// Function to restart the quiz
function restartQuiz() {
    resultBox.style.display = "none";
    infoBox.style.display = "block";
    queCount = 0;
    userScore = 0;

    timeLeft = timeValue;


    clearInterval(timerInterval);
    resetOptions();
    showQuestion(queCount);
    startTimer(15);
    timeText.textContent = "Time left";
    nextBtn.classList.remove("show");
}

// Attach the restartQuiz function to the restart button click event
const restartButton = resultBox.querySelector(".buttons .restart");
restartButton.onclick = restartQuiz;

// Function to reset all options to their initial state
function resetOptions() {
    const options = document.querySelectorAll(".option");
    options.forEach(option => {
        option.classList.remove("correct", "incorrect", "disabled");
        option.innerHTML = option.textContent.trim();
    });
}

// Function to handle the next button click
nextBtn.onclick = () => {
    if (queCount < questions.length - 1) {
        queCount++;
        showQuestion(queCount);
        clearInterval(timerInterval);
        startTimer(15);
        timeText.textContent = "Time left";
        nextBtn.classList.remove("show");
    } else {
        clearInterval(timerInterval);
        showResult();
    }
};

// Function to display the questions
function showQuestion(index) {
    const queText = document.querySelector(".que-text");
    const optionList = document.querySelector(".option-list");
    const queTag = '<span>' + questions[index].numb + ". " + questions[index].question + '</span>';
    const optionTags = questions[index].options.map(option => {
        return '<div class="option"><span>' + option + '</span></div>';
    }).join('');
    queText.innerHTML = queTag;
    optionList.innerHTML = optionTags;
    const options = optionList.querySelectorAll(".option");
    options.forEach(option => {
        option.addEventListener("click", function() {
            optionSelected(option);
        });
    });
}

// Function to display the result
function showResult() {
    infoBox.style.display = "none";
    quizBox.style.display = "none";
    resultBox.style.display = "block";
    const scoreText = document.querySelector(".score-text");
    if (userScore > 9) {
        scoreText.innerHTML = '<span> and Congrats!!!🎉, You got <p>' + userScore + '</p> out of <p>' + questions.length + '</p></span>';
    } else if (userScore > 7) {
        scoreText.innerHTML = '<span> and Nice!!!😎, You got <p>' + userScore + '</p> out of <p>' + questions.length + '</p></span>';
    } else {
        scoreText.innerHTML = '<span> and Sorry!!! 😔, You got only <p class="failed-score">' + userScore + '</p> out of <p>' + questions.length + '</p></span>';
    }
}

// Function to auto-select the correct option
function autoSelectCorrectOption() {
    const correctAns = questions[queCount].answer;
    const options = document.querySelectorAll(".option");
    options.forEach(option => {
        if (option.textContent.trim() === correctAns) {
            option.classList.add("correct");
            option.innerHTML += '<i class="fas fa-check"></i>';
            console.log("Auto selected correct answer");
        }
    });
}

// Function to start the timer
function startTimer(duration) {
    let timeLeft = duration;
    const timerDisplay = document.querySelector(".time-sec");
    function updateTimerDisplay() {
        const formattedTime = timeLeft < 10 ? "0" + timeLeft : timeLeft;
        timerDisplay.textContent = formattedTime;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            autoSelectCorrectOption();
        }
        timeLeft--;
    }
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

// Function to handle option selection
// Function to handle option selection
function optionSelected(answer) {
    clearInterval(timerInterval);
    const userAns = answer.textContent.trim();
    const correctAns = questions[queCount].answer;
    const options = document.querySelectorAll(".option");
    
    // Check if the option has already been selected
    if (answer.classList.contains("disabled")) {
        return; // Exit the function if the option is already disabled (i.e., already selected)
    }

    let userSelected = false; // Flag to track if the user has selected an option
    
    // Check if the selected answer is correct or incorrect
    if (userAns === correctAns) {
        answer.classList.add("correct");
        answer.innerHTML += '<i class="fas fa-check"></i>';
        console.log("Correct Answer");
        userScore += 1;
        console.log("Your Correct Answers: " + userScore);
        userSelected = true;
    } else {
        answer.classList.add("incorrect");
        answer.innerHTML += '<i class="fas fa-times"></i>';
        console.log("Wrong Answer");
        // Auto-select the correct answer
        options.forEach(option => {
            if (option.textContent.trim() === correctAns) {
                option.classList.add("correct");
                option.innerHTML += '<i class="fas fa-check"></i>';
                console.log("Auto selected correct answer");
            }
        });
    }
    
    // Disable all options to prevent multiple clicks
    options.forEach(option => {
        option.classList.add("disabled");
    });
    
    if (!userSelected) {
        nextBtn.classList.add("show");
    }
}
