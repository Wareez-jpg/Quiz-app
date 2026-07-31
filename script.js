console.log("script loaded");
let timeLeft = 20;
let timer;
let score = 0;
let currentQuestion = 0;
let questionsArray = [];
let selectedCategory = 17;
let selectedDifficulty = "easy";
let questionAmount = 10

const subjectNames = {
    17: "Science",
    18: "Computer Science",
    19: "Mathematics",
    22: "Geography",
    23: "History",
};

const questionNumber = document.getElementById("question-number");
const timerDisplay = document.getElementById("timer");
const quizSubject = document.getElementById("quiz-subject");
const finalScore = document.getElementById("final-score");
const scoreMessage = document.getElementById("score-message");
const scoreSubject = document.getElementById("score-subject");
const scoreEmoji = document.getElementById("score-emoji");

function startQuiz() {
    console.log("startQuiz running");
    
    score = 0;
    currentQuestion = 0;

    selectedCategory = document.getElementById("subject").value;
    selectedDifficulty = document.getElementById("difficulty").value;
    questionAmount = document.getElementById("amount").value;

    quizSubject.textContent = subjectNames[selectedCategory];

    if (
        !selectedCategory ||
        !selectedDifficulty ||
        !questionAmount
    ) {
        alert("Please complete all quiz settings.");
        return;
    }

    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('score-container').style.display = 'none';

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
            const correct = questionsArray[currentQuestion].correct_answer;
            const buttons = document.querySelectorAll(".answer-btn");
            buttons.forEach(function(button) {
                button.disabled= true;
                if(button.textContent === correct) {
                    button.style.backgroundColor = "green";
                }
            });
            document.getElementById("next-btn").disabled = false;
        }
    }, 1000);
}

function showQuestion(question) {
    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questionsArray.length}`;

        document.getElementById("next-btn").disabled = true;

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
            document.getElementById("next-btn").disabled = false;
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

        scoreSubject.textContent = subjectNames[selectedCategory];
        finalScore.textContent = `${score} / ${questionsArray.length}`;

        const percentage = (score / questionsArray.length) * 100;

        if (percentage ===100) {
            scoreEmoji.textContent = "👑";
            scoreMessage.textContent = "Perfect score! You're unstoppable!"
        }

        else if (percentage >= 80) {
            scoreEmoji.textContent = "🏆";
            scoreMessage.textContent = "Excellent work!";
        }

        else if (percentage >= 60) {
            scoreEmoji.textContent = "👏";
            scoreMessage.textContent = "Good job! Keep practicing.";
        }

        else if (percentage >= 40) {
            scoreEmoji.textContent = "📚";
            scoreMessage.textContent = "Not bad. A little more revision and you'll improve.";
        }

        else {
            scoreEmoji.textContent = "💪";
            scoreMessage.textContent = "Don't give up! Every expert started somewhere.";
        }
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

    document.getElementById("subject").selectedIndex = 0;
    document.getElementById("difficulty").selectedIndex = 0;
    document.getElementById("amount").selectedIndex = 0;

    document.getElementById("selected-topic").textContent = "";
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