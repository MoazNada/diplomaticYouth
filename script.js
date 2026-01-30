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

let game = { type: '', players: [], scores: {}, round: 0, pIdx: 0, roomId: '' };

const questions = {
    kora: [{q: "من هداف العالم التاريخي؟", a: "كريستيانو رونالدو"}, {q: "نادي القرن في أفريقيا؟", a: "الأهلي"}],
    fawazir: [{q: "شيء يكتب ولا يقرأ؟", a: "القلم"}],
    spy: ["مطار", "مستشفى", "مطعم"]
};

// وظائف التنقل (الجديدة والمضمونة)
function goToOnlineLobby() {
    document.getElementById('connection-screen').classList.add('hidden');
    document.getElementById('online-lobby').classList.remove('hidden');
}

function goToLocalCategories() {
    document.getElementById('connection-screen').classList.add('hidden');
    document.getElementById('category-screen').classList.remove('hidden');
}

function createRoom() {
    const rId = Math.random().toString(36).substring(2, 6).toUpperCase();
    db.ref('rooms/' + rId).set({ status: 'waiting', createdAt: Date.now() })
    .then(() => {
        alert("كود غرفتك هو: " + rId);
        game.roomId = rId;
        document.getElementById('online-lobby').classList.add('hidden');
        document.getElementById('category-screen').classList.remove('hidden');
    });
}

function setupPlayers(cat) {
    game.type = cat;
    document.getElementById('category-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
}

function updateInputs() {
    const n = document.getElementById('player-count').value;
    const container = document.getElementById('names-container');
    container.innerHTML = '';
    for(let i=1; i<=n; i++) container.innerHTML += `<input type="text" placeholder="اسم اللاعب ${i}" class="p-name">`;
}

function startPlay() {
    const inputs = document.querySelectorAll('.p-name');
    game.players = Array.from(inputs).map((inp, i) => inp.value || `لاعب ${i+1}`);
    game.players.forEach(p => game.scores[p] = 0);
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    loadQ();
}

function loadQ() {
    document.getElementById('current-p').innerText = game.players[game.pIdx];
    document.getElementById('a-text').classList.add('hidden');
    document.getElementById('score-controls').classList.add('hidden');
    document.getElementById('show-ans-btn').classList.remove('hidden');
    const item = questions[game.type][game.round % questions[game.type].length];
    document.getElementById('q-text').innerText = (game.type === 'spy') ? "المكان السري: " + questions.spy[Math.floor(Math.random()*3)] : item.q;
    document.getElementById('a-text').innerText = (game.type === 'spy') ? "الجاسوس لازم يخمن" : "الإجابة: " + item.a;
}

function revealAns() {
    document.getElementById('a-text').classList.remove('hidden');
    document.getElementById('show-ans-btn').classList.add('hidden');
    document.getElementById('score-controls').classList.remove('hidden');
}

function nextPlayer(win) {
    if(win) game.scores[game.players[game.pIdx]]++;
    game.pIdx++;
    if(game.pIdx >= game.players.length) { game.pIdx = 0; game.round++; }
    if(game.round < 5) loadQ(); else alert("انتهت اللعبة!");
}
