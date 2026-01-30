let players = [];
let currentPlayerIndex = 0;
let scores = {};
let currentQuestions = [];
let currentQuestionIndex = 0;

const allData = {
    kora: [
        {q: "من هو الهداف التاريخي للنصر السعودي؟", a: "ماجد عبد الله"},
        {q: "من فاز بالكرة الذهبية 2023؟", a: "ليونيل ميسي"},
        {q: "نادي يلقب بـ 'العميد' في السعودية؟", a: "الاتحاد"}
    ],
    fawazir: [
        {q: "حاجة بتمشي ومعندهاش رجلين؟", a: "الساعة"},
        {q: "إيه هو الشيء اللي له عين واحدة ومبيشوفش؟", a: "الإبرة"}
    ],
    spy: ["مطار", "مستشفى", "ملعب", "سيرك"]
};

function updatePlayerInputs() {
    const count = document.getElementById('player-count').value;
    document.getElementById('player-count-display').innerText = count;
    const container = document.getElementById('names-container');
    container.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        container.innerHTML += `<input type="text" placeholder="اسم اللاعب ${i}" class="player-name">`;
    }
}

function goToMenu() {
    const nameInputs = document.querySelectorAll('.player-name');
    players = Array.from(nameInputs).map(input => input.value || `لاعب ${Math.random().toString(10).substr(2,2)}`);
    players.forEach(p => scores[p] = 0);
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
}

function startGame(type) {
    currentQuestions = allData[type];
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    document.getElementById('current-player-name').innerText = players[currentPlayerIndex];
    document.getElementById('question-text').innerText = currentQuestions[currentQuestionIndex].q;
    document.getElementById('answer-text').innerText = currentQuestions[currentQuestionIndex].a;
    document.getElementById('answer-text').classList.add('hidden');
    document.getElementById('show-answer-btn').classList.remove('hidden');
    document.getElementById('score-controls').classList.add('hidden');
}

function showAnswer() {
    document.getElementById('answer-text').classList.remove('hidden');
    document.getElementById('show-answer-btn').classList.add('hidden');
    document.getElementById('score-controls').classList.remove('hidden');
}

function addScore(isCorrect) {
    if (isCorrect) scores[players[currentPlayerIndex]]++;
    
    currentPlayerIndex++;
    if (currentPlayerIndex >= players.length) {
        currentPlayerIndex = 0;
        currentQuestionIndex++;
    }

    if (currentQuestionIndex >= currentQuestions.length) {
        showFinalResults();
    } else {
        showQuestion();
    }
}

function showFinalResults() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    let resultsHtml = '';
    for (let p in scores) {
        resultsHtml += `<p>${p}: ${scores[p]} نقطة</p>`;
    }
    document.getElementById('final-scores').innerHTML = resultsHtml;
}
