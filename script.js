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

let currentPlay = { type: '', players: [], scores: {}, round: 0, idx: 0 };
const qBank = {
    kora: [{q: "من هداف العالم؟", a: "كريستيانو رونالدو"}, {q: "بطل كأس العالم 2022؟", a: "الأرجنتين"}, {q: "نادي القرن الأفريقي؟", a: "الأهلي"}],
    fawazir: [{q: "يكتب ولا يقرأ؟", a: "القلم"}, {q: "ينبض بلا قلب؟", a: "الساعة"}],
    spy: ["مطار", "مستشفى", "ملعب", "مطعم"]
};

// وظائف التحكم في الشاشات
function openLobby() { hideAll(); document.getElementById('online-lobby').classList.remove('hidden'); }
function openCategories() { hideAll(); document.getElementById('category-screen').classList.remove('hidden'); }
function goToSetup(type) { currentPlay.type = type; hideAll(); document.getElementById('setup-screen').classList.remove('hidden'); }

function createNewRoom() {
    const rId = Math.random().toString(36).substring(2, 6).toUpperCase();
    db.ref('rooms/' + rId).set({ status: 'waiting' }).then(() => {
        alert("كود غرفتك: " + rId);
        openCategories();
    });
}

function makeNameInputs() {
    const val = document.getElementById('player-count').value;
    const box = document.getElementById('names-container');
    box.innerHTML = '';
    for(let i=1; i<=val; i++) box.innerHTML += `<input type="text" placeholder="اسم اللاعب ${i}" class="p-name">`;
}

function startTheGame() {
    const inputs = document.querySelectorAll('.p-name');
    currentPlay.players = Array.from(inputs).map((inp, i) => inp.value || `لاعب ${i+1}`);
    currentPlay.players.forEach(p => currentPlay.scores[p] = 0);
    hideAll();
    document.getElementById('game-screen').classList.remove('hidden');
    refreshQ();
}

function refreshQ() {
    document.getElementById('current-p').innerText = currentPlay.players[currentPlay.idx];
    document.getElementById('a-text').classList.add('hidden');
    document.getElementById('score-controls').classList.add('hidden');
    document.getElementById('show-ans-btn').classList.remove('hidden');
    
    if(currentPlay.type === 'spy') {
        document.getElementById('q-text').innerText = "المكان السري: " + qBank.spy[Math.floor(Math.random()*qBank.spy.length)];
        document.getElementById('a-text').innerText = "الجاسوس عليه التخمين!";
    } else {
        const item = qBank[currentPlay.type][currentPlay.round % qBank[currentPlay.type].length];
        document.getElementById('q-text').innerText = item.q;
        document.getElementById('a-text').innerText = "الإجابة: " + item.a;
    }
}

function reveal() {
    document.getElementById('a-text').classList.remove('hidden');
    document.getElementById('show-ans-btn').classList.add('hidden');
    document.getElementById('score-controls').classList.remove('hidden');
}

function recordPoint(win) {
    if(win) currentPlay.scores[currentPlay.players[currentPlay.idx]]++;
    currentPlay.idx++;
    if(currentPlay.idx >= currentPlay.players.length) { currentPlay.idx = 0; currentPlay.round++; }
    if(currentPlay.round < 5) refreshQ(); else alert("خلصنا! شوف النتيجة.");
}

function hideAll() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
}
