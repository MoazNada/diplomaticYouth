// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAESCjnKsQxNX_IKH9Fm_ePpIsbb9C_NsE",
  authDomain: "diplomatic-games.firebaseapp.com",
  projectId: "diplomatic-games",
  storageBucket: "diplomatic-games.firebasestorage.app",
  messagingSenderId: "726415224604",
  appId: "1:726415224604:web:3f436ef230254a5ee914d9",
  databaseURL: "https://diplomatic-games-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// متغيرات اللعبة
let players = [];
let scores = {};
let gameData = { kora: [], fawazir: [], spy: [] };
let currentRound = 0;
let currentPlayerIdx = 0;
let selectedCategory = '';

// 10 أسئلة لكل نوع (تم التأكد من الربط)
gameData.kora = [
    {q: "من هو الهداف التاريخي للمنتخبات؟", a: "كريستيانو رونالدو"},
    {q: "نادي يلقب بـ 'العميد' في السعودية؟", a: "الاتحاد"},
    {q: "من فاز بكأس العالم 2010؟", a: "إسبانيا"},
    {q: "أين يلعب محمد صلاح؟", a: "ليفربول"},
    {q: "كم عدد لاعبي فريق كرة القدم؟", a: "11 لاعب"},
    {q: "من هو بطل دوري أبطال أوروبا 2024؟", a: "ريال مدريد"},
    {q: "أين أقيم كأس العالم 2022؟", a: "قطر"},
    {q: "لاعب يلقب بـ 'البرغوث'؟", a: "ليونيل ميسي"},
    {q: "ما هو ملعب نادي الزمالك؟", a: "ستاد القاهرة"},
    {q: "من هو مدرب الأهلي الحالي؟", a: "مارسيل كولر"}
];
gameData.fawazir = [
    {q: "شيء يكتب ولا يقرأ؟", a: "القلم"},
    {q: "شيء ينبض بلا قلب؟", a: "الساعة"},
    {q: "كلما زاد نقص، فما هو؟", a: "العمر"},
    {q: "له أسنان ولا يعض؟", a: "المشط"},
    {q: "يخترق الزجاج ولا يكسره؟", a: "الضوء"},
    {q: "له عين واحدة ولا يرى؟", a: "الإبرة"},
    {q: "يمشي بلا أرجل؟", a: "الزمن"},
    {q: "شهر هجري نصوم فيه؟", a: "رمضان"},
    {q: "بحر لا يوجد فيه ماء؟", a: "البحر على الخريطة"},
    {q: "شيء يملك مدن بلا بيوت؟", a: "الخريطة"}
];
gameData.spy = ["مطار", "مستشفى", "ملعب", "سيرك", "مطعم", "حديقة", "مدرسة", "مسبح", "سينما", "بنك"];

// وظائف النظام
function generateNameInputs() {
    const val = document.getElementById('player-count').value;
    const container = document.getElementById('names-container');
    container.innerHTML = '';
    for(let i=1; i<=val; i++) {
        container.innerHTML += `<input type="text" placeholder="اسم اللاعب ${i}" class="player-name-input">`;
    }
}

function savePlayersAndGoToMenu() {
    const inputs = document.querySelectorAll('.player-name-input');
    players = Array.from(inputs).map((inp, i) => inp.value || `لاعب ${i+1}`);
    players.forEach(p => scores[p] = 0);
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
}

function startGame(type) {
    selectedCategory = type;
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    loadTurn();
}

function loadTurn() {
    if (currentRound >= 10) return endGame();
    document.getElementById('current-player-display').innerText = players[currentPlayerIdx];
    document.getElementById('answer-text').classList.add('hidden');
    document.getElementById('score-btns').classList.add('hidden');
    document.getElementById('show-btn').classList.remove('hidden');

    if(selectedCategory === 'spy') {
        document.getElementById('question-text').innerText = "المكان السري هو: " + gameData.spy[currentRound];
        document.getElementById('answer-text').innerText = "الجاسوس عليه التخمين!";
    } else {
        const item = gameData[selectedCategory][currentRound];
        document.getElementById('question-text').innerText = item.q;
        document.getElementById('answer-text').innerText = "الإجابة: " + item.a;
    }
}

function revealAnswer() {
    document.getElementById('answer-text').classList.remove('hidden');
    document.getElementById('show-btn').classList.add('hidden');
    document.getElementById('score-btns').classList.remove('hidden');
}

function handleScore(isCorrect) {
    if(isCorrect) scores[players[currentPlayerIdx]]++;
    
    currentPlayerIdx++;
    if(currentPlayerIdx >= players.length) {
        currentPlayerIdx = 0;
        currentRound++;
    }

    if(currentRound < 10) loadTurn();
    else endGame();
}

function endGame() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    let html = players.map(p => `<p>${p}: ${scores[p]} نقطة</p>`).join('');
    document.getElementById('final-table').innerHTML = html;
}
