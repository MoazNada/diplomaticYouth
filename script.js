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

// متغيرات الحالة
let gameStatus = {
    connection: '',
    category: '',
    players: [],
    scores: {},
    round: 0,
    currentPlayerIndex: 0
};

// بنك الأسئلة (10 لكل فئة)
const questionBank = {
    kora: [
        {q: "من هو الهداف التاريخي لكأس العالم؟", a: "ميروسلاف كلوزه"},
        {q: "نادي يلقب بـ 'قلعة الكؤوس' في السعودية؟", a: "الأهلي"},
        {q: "من فاز بكأس العالم 2014؟", a: "ألمانيا"},
        {q: "من هو اللاعب الملقب بـ 'البرغوث'؟", a: "ليونيل ميسي"},
        {q: "أين يلعب محمد صلاح حالياً؟", a: "ليفربول"},
        {q: "كم عدد لاعبي فريق كرة القدم؟", a: "11 لاعب"},
        {q: "من هو بطل دوري أبطال أوروبا 2024؟", a: "ريال مدريد"},
        {q: "أين أقيم كأس العالم 2022؟", a: "قطر"},
        {q: "مدرب النادي الأهلي المصري الحالي؟", a: "مارسيل كولر"},
        {q: "ما هو ملعب نادي الزمالك؟", a: "ستاد القاهرة"}
    ],
    fawazir: [
        {q: "شيء يكتب ولا يقرأ؟", a: "القلم"},
        {q: "شيء ينبض بلا قلب؟", a: "الساعة"},
        {q: "كلما زاد نقص، فما هو؟", a: "العمر"},
        {q: "له أسنان ولا يعض؟", a: "المشط"},
        {q: "يخترق الزجاج ولا يكسره؟", a: "الضوء"},
        {q: "له عين واحدة ولا يرى؟", a: "الإبرة"},
        {q: "يمشي بلا أرجل؟", a: "الزمن"},
        {q: "بحر لا يوجد فيه ماء؟", a: "على الخريطة"},
        {q: "بيت ليس فيه أبواب ولا نوافذ؟", a: "بيت الشعر"},
        {q: "شيء تحمله ويحملك؟", a: "الحذاء"}
    ],
    spy: ["مطار", "مستشفى", "ملعب", "سيرك", "مطعم", "حديقة", "مدرسة", "مسبح", "سينما", "بنك"]
};

// وظائف التنقل
function move(fromId, toId) {
    document.getElementById(fromId).classList.add('hidden');
    document.getElementById(toId).classList.remove('hidden');
}

function setConnection(type) {
    gameStatus.connection = type;
    move('connection-screen', 'category-screen');
}

function setCategory(cat) {
    gameStatus.category = cat;
    move('category-screen', 'setup-screen');
}

function generateInputs() {
    const count = document.getElementById('player-count').value;
    const container = document.getElementById('names-container');
    container.innerHTML = '';
    for(let i = 1; i <= count; i++) {
        container.innerHTML += `<input type="text" placeholder="اسم اللاعب ${i}" class="p-name">`;
    }
}

function startBattle() {
    const inputs = document.querySelectorAll('.p-name');
    gameStatus.players = Array.from(inputs).map((inp, i) => inp.value || `لاعب ${i+1}`);
    gameStatus.players.forEach(p => gameStatus.scores[p] = 0);
    move('setup-screen', 'game-screen');
    loadQuestion();
}

function loadQuestion() {
    document.getElementById('current-p').innerText = gameStatus.players[gameStatus.currentPlayerIndex];
    document.getElementById('a-text').classList.add('hidden');
    document.getElementById('score-controls').classList.add('hidden');
    document.getElementById('show-ans-btn').classList.remove('hidden');

    if(gameStatus.category === 'spy') {
        const place = questionBank.spy[Math.floor(Math.random() * questionBank.spy.length)];
        document.getElementById('q-text').innerText = "المكان السري هو: " + place;
        document.getElementById('a-text').innerText = "الجاسوس عليه التخمين!";
    } else {
        const item = questionBank[gameStatus.category][gameStatus.round % 10];
        document.getElementById('q-text').innerText = item.q;
        document.getElementById('a-text').innerText = "الإجابة: " + item.a;
    }
}

function showAnswer() {
    document.getElementById('a-text').classList.remove('hidden');
    document.getElementById('show-ans-btn').classList.add('hidden');
    document.getElementById('score-controls').classList.remove('hidden');
}

function handleScore(isCorrect) {
    if(isCorrect) gameStatus.scores[gameStatus.players[gameStatus.currentPlayerIndex]]++;
    
    gameStatus.currentPlayerIndex++;
    if(gameStatus.currentPlayerIndex >= gameStatus.players.length) {
        gameStatus.currentPlayerIndex = 0;
        gameStatus.round++;
    }

    if(gameStatus.round < 10) {
        loadQuestion();
    } else {
        showFinalResults();
    }
}

function showFinalResults() {
    move('game-screen', 'result-screen');
    let resultsHtml = gameStatus.players.map(p => `<p>${p}: ${gameStatus.scores[p]} نقطة</p>`).join('');
    document.getElementById('final-table').innerHTML = resultsHtml;
}
