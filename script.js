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

let state = { conn: '', cat: '', players: [], scores: {}, round: 0, currentIdx: 0 };
const questions = {
    kora: [
        {q: "من هو الهداف التاريخي لكأس العالم؟", a: "ميروسلاف كلوزه (16 هدف)"},
        {q: "نادي يلقب بـ 'قلعة الكؤوس'؟", a: "الأهلي السعودي"},
        {q: "من فاز بكأس العالم 2014؟", a: "ألمانيا"},
        {q: "كم عدد بطولات الزمالك في دوري أبطال أفريقيا؟", a: "5 بطولات"},
        {q: "من هو مدرب منتخب مصر الحالي؟", a: "حسام حسن"}
    ],
    fawazir: [
        {q: "شيء تلمسه ولا تراه، فما هو؟", a: "الهواء"},
        {q: "ما هو الشيء الذي ينبض بلا قلب؟", a: "الساعة"},
        {q: "حاجة لها سنان ومبتعضش؟", a: "المشط"}
    ],
    spy: ["مستشفى", "مطار", "مطعم", "مدرسة", "ملعب", "سينما", "حديقة"]
};

function setConnection(c) { state.conn = c; move('connection-screen', 'category-screen'); }
function setCategory(cat) { state.cat = cat; move('category-screen', 'setup-screen'); generateInputs(); }

function generateInputs() {
    const n = document.getElementById('player-count').value;
    const container = document.getElementById('names-container');
    container.innerHTML = '';
    for(let i=1; i<=n; i++) container.innerHTML += `<input type="text" placeholder="اسم اللاعب ${i}" class="p-name">`;
}

function startBattle() {
    const inputs = document.querySelectorAll('.p-name');
    state.players = Array.from(inputs).map((inp, i) => inp.value || `لاعب ${i+1}`);
    state.players.forEach(p => state.scores[p] = 0);
    move('setup-screen', 'game-screen');
    loadTurn();
}

function loadTurn() {
    document.getElementById('current-p').innerText = state.players[state.currentIdx];
    document.getElementById('a-text').classList.add('hidden');
    document.getElementById('score-controls').classList.add('hidden');
    document.getElementById('show-ans-btn').classList.remove('hidden');

    if(state.cat === 'spy') {
        const place = questions.spy[Math.floor(Math.random()*questions.spy.length)];
        document.getElementById('q-text').innerText = "المكان السري (لا تخبر أحداً): " + place;
        document.getElementById('a-text').innerText = "الآن ابدأ بالأسئلة لكشف الجاسوس!";
    } else {
        const item = questions[state.cat][state.round % questions[state.cat].length];
        document.getElementById('q-text').innerText = item.q;
        document.getElementById('a-text').innerText = "الإجابة: " + item.a;
    }
}

function showAnswer() {
    document.getElementById('a-text').classList.remove('hidden');
    document.getElementById('show-ans-btn').classList.add('hidden');
    document.getElementById('score-controls').classList.remove('hidden');
}

function handleScore(isWin) {
    if(isWin) state.scores[state.players[state.currentIdx]]++;
    state.currentIdx++;
    if(state.currentIdx >= state.players.length) { state.currentIdx = 0; state.round++; }
    if(state.round < 5) loadTurn(); else showFinal();
}

function showFinal() {
    move('game-screen', 'result-screen');
    let html = state.players.map(p => `<p>${p}: ${state.scores[p]} نقطة</p>`).join('');
    document.getElementById('final-table').innerHTML = html;
}

function move(oldS, newS) {
    document.getElementById(oldS).classList.add('hidden');
    document.getElementById(newS).classList.remove('hidden');
}
