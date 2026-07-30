console.log("script loaded");
let timeLeft = 20;
let timer;
let score = 0;
let currentQuestion = 0;
let questionsArray = [];
let selectedCategory = 17;
let selectedDifficulty = "easy";
let questionAmount = 10

const questionNumber = document.getElementById("question-number");
const timerDisplay = document.getElementById("timer");

function startQuiz() {
    console.log("startQuiz running");
    
    score = 0;
    currentQuestion = 0;

    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('score-container').style.display = 'none';

    selectedCategory = document.getElementById("subject").value;
    selectedDifficulty = document.getElementById("difficulty").value;
    questionAmount = document.getElementById("amount").value;

    fetch(`https://opentdb.com/api.php?amount=${questionAmount}&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            questionsArray = data.results;
            if (questionsArray.length === 0) {
                alert("Couldn't load quiz questions. Please wait a few seconds and try again.");
                return;
            }
            showQuestion(questionsArray[0]);
        });
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 20;
    timerDisplay.textContent = `${timeLeft}s`;
    timer = setInterval(function() {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function showQuestion(question) {
    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questionsArray.length}`;

    startTimer();

    document.getElementById('question').textContent = question.question;

    const allAnswers = [...question.incorrect_answers, question.correct_answer].sort(function() {
        return Math.random() - 0.5;
    });

    const answerButtonsContainer = document.getElementById('answer-buttons');
    const oldButtons = answerButtonsContainer.querySelectorAll('.answer-btn');

    const newButtons = [];
    oldButtons.forEach(function(button, index) {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.disabled = false;
        newButton.style.backgroundColor = '';
        newButton.textContent = allAnswers[index];

        newButtons.push(newButton);
    });

    newButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            clearInterval(timer);

            const correct = question.correct_answer;
            newButtons.forEach(function(btn) {
                btn.disabled = true;
                if (btn.textContent === correct) {
                    btn.style.backgroundColor = 'green';
                }
            });

            if (button.textContent !== correct) {
                button.style.backgroundColor = 'red';
            } else {
                score++;
            }
        });
    });
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questionsArray.length) {
        showQuestion(questionsArray[currentQuestion]);
    } else {
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('score-container').style.display = 'block';
        document.getElementById('score-text').textContent =
            'You scored ' + score + ' out of ' + questionsArray.length;
    }
}


function goHome() {
    clearInterval(timer);

    score = 0;
    currentQuestion= 0;
    questionsArray = [];

    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("score-container").style.display = "none";
    document.getElementById("intro-screen").style.display = "block";
}

document.getElementById('next-btn').addEventListener('click', function() {
    clearInterval(timer);
    nextQuestion();
});

console.log(document.getElementById("start-btn"));

document.getElementById('start-btn').addEventListener('click', function () {
    console.log("Start button clicked");
    startQuiz();
});
document.getElementById('restart-btn').addEventListener('click', startQuiz);
document.getElementById("home-btn").addEventListener("click",goHome);
document.getElementById("score-home-btn").addEventListener("click", goHome);