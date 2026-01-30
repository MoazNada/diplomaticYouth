// بيانات الـ Firebase الخاصة بك
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

let gameData = { type: '', players: [], scores: {}, round: 0, pIdx: 0 };

// الأسئلة
const questions = {
    kora: [{q: "من هداف العالم؟", a: "كريستيانو رونالدو"}, {q: "نادي القرن الأفريقي؟", a: "الأهلي"}],
    fawazir: [{q: "يكتب ولا يقرأ؟", a: "القلم"}, {q: "ينبض بلا قلب؟", a: "الساعة"}],
    spy: ["مطار", "مستشفى", "ملعب", "مطعم"]
};

// وظائف الأزرار (تأكد من مطابقة الأسماء مع HTML)
window.openLobby = function() { hideScreens(); document.getElementById('online-lobby').classList.remove('hidden'); }
window.openCategories = function() { hideScreens(); document.getElementById('category-screen').classList.remove('hidden'); }
window.goToSetup = function(t) { gameData.type = t; hideScreens(); document.getElementById('setup-screen').classList.remove('hidden'); }

window.createNewRoom = function() {
    const rId = Math.random().toString(36).substring(2, 6).toUpperCase();
    db.ref('rooms/' + rId).set({ status: 'waiting' }).then(() => {
        alert("كود غرفتك هو: " + rId);
        window.openCategories();
    });
}

window.makeInputs = function() {
    const n = document.getElementById('player-count').value;
    const box = document.getElementById('names-container');
    box.innerHTML = '';
    for(let i=1; i<=n; i++) box.innerHTML += `<input type="text" placeholder="اسم اللاعب ${i}" class="p-name">`;
}

window.startNow = function() {
    const inputs = document.querySelectorAll('.p-name');
    gameData.players = Array.from(inputs).map((inp, i) => inp.value || `لاعب ${i+1}`);
    gameData.players.forEach(p => gameData.scores[p] = 0);
    hideScreens();
    document.getElementById('game-screen').classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    document.getElementById('current-p').innerText = gameData.players[gameData.pIdx];
    document.getElementById('a-text').classList.add('hidden');
    document.getElementById('score-controls').classList.add('hidden');
    document.getElementById('show-ans-btn').classList.remove('hidden');
    
    if(gameData.type === 'spy') {
        document.getElementById('q-text').innerText = "المكان السري: " + questions.spy[Math.floor(Math.random()*questions.spy.length)];
        document.getElementById('a-text').innerText = "الجاسوس لازم يخمن المكان!";
    } else {
        const item = questions[gameData.type][gameData.round % questions[gameData.type].length];
        document.getElementById('q-text').innerText = item.q;
        document.getElementById('a-text').innerText = "الإجابة: " + item.a;
    }
}

window.showAns = function() {
    document.getElementById('a-text').classList.remove('hidden');
    document.getElementById('show-ans-btn').classList.add('hidden');
    document.getElementById('score-controls').classList.remove('hidden');
}

window.nextP = function(win) {
    if(win) gameData.scores[gameData.players[gameData.pIdx]]++;
    gameData.pIdx++;
    if(gameData.pIdx >= gameData.players.length) { gameData.pIdx = 0; gameData.round++; }
    if(gameData.round < 5) loadQuestion(); else alert("خلصنا التحدي!");
}

function hideScreens() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
}
