let score = 0
let currentQuestion = 0
let questionsArray = []

fetch ('https://opentdb.com/api.php?amount=10&category=17&type=multiple')
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        questionsArray = data.results
        showQuestion(questionsArray[0])
    })

function showQuestion(question) {
    const buttons = document.querySelectorAll('.answer-btn')
    buttons.forEach(function(button) {
        button.style.backgroundColor = ''
    })
    document.getElementById('question').textContent = question.question

    const allAnswers = [...question.incorrect_answers, question.correct_answer].sort(function() {
        return Math.random() - 0.5
    })

    buttons.forEach(function(button, index) {
        button.textContent = allAnswers[index]
    })
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            const correct = question.correct_answer
            if (button.textContent === correct) {
                button.style.backgroundColor = 'green'
                score++
            } else {
                button.style.backgroundColor = 'red'
            }
        })
    })
}
document.getElementById('next-btn').addEventListener('click', function() {
    currentQuestion++

    if (currentQuestion < questionsArray.length) {
        showQuestion(questionsArray[currentQuestion]) 
    } else {
        document.getElementById('quiz-container').style.display = 'none'
        document.getElementById('score-container').style.display = 'block'
        document.getElementById('score-text').textContent = 'you scored' + score + 'out of' + questionsArray.length
    }
})