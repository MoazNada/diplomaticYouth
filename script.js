// إعدادات Firebase الخاصة بمشروعك
const firebaseConfig = {
    apiKey: "AIzaSyAESCjnKsQxNX_IKH9Fm_ePpIsbb9C_NsE",
    authDomain: "diplomatic-games.firebaseapp.com",
    projectId: "diplomatic-games",
    storageBucket: "diplomatic-games.firebasestorage.app",
    messagingSenderId: "726415224604",
    appId: "1:726415224604:web:3f436ef230254a5ee914d9",
    databaseURL: "https://diplomatic-games-default-rtdb.firebaseio.com"
};

// تشغيل Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// متغيرات اللعبة
let game = { type: '', players: [], scores: {}, currentIdx: 0, round: 0 };

const data = {
    kora: [{q:"من هو هداف العالم التاريخي؟", a:"كريستيانو رونالدو"}, {q:"من فاز بكأس العالم 2022؟", a:"الأرجنتين"}, {q:"نادي القرن في أفريقيا؟", a:"الأهلي"}],
    fawazir: [{q:"شيء يكتب ولا يقرأ؟", a:"القلم"}, {q:"ينبض بلا قلب؟", a:"الساعة"}],
    spy: ["مطار", "مستشفى", "ملعب", "مطعم", "حديقة"]
};

// وظائف التنقل (الأونلاين والمحلي)
window.showScreen = function(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

window.createNewRoom = function() {
    const rId = Math.random().toString(36).substring(2, 6).toUpperCase();
    db.ref('rooms/' + rId).set({ status: 'waiting', createdAt: Date.now() })
    .then(() => {
        alert("تم إنشاء الغرفة! كود غرفتك هو: " + rId);
        window.showScreen('category-screen');
    }).catch(err => alert("مشكلة في الاتصال: " + err));
}

window.joinRoom = function() {
    const rId = document.getElementById('room-input').value.toUpperCase();
    db.ref('rooms/' + rId).once('value', (snapshot) => {
        if (snapshot.exists()) {
            alert("تم الدخول للغرفة!");
            window.showScreen('category-screen');
        } else {
            alert("الكود ده غلط يا بطل!");
        }
    });
}

window.setGame = function(t) { 
    game.type = t; 
    window.showScreen('setup-screen'); 
}

window.genInputs = function() {
    const n = document.getElementById('p-count').value;
    const box = document.getElementById('names-box');
    box.innerHTML = '';
    for(let i=1; i<=n; i++) {
        box.innerHTML += `<input type="text" placeholder="اسم اللاعب ${i}" class="p-name-in">`;
    }
}

window.startBattle = function() {
    const ins = document.querySelectorAll('.p-name-in');
    game.players = Array.from(ins).map(i => i.value || "لاعب مجهول");
    game.players.forEach(p => game.scores[p] = 0);
    window.showScreen('game-screen');
    loadQ();
}

function loadQ() {
    document.getElementById('player-display').innerText = game.players[game.currentIdx];
    document.getElementById('answer-text').classList.add('hidden');
    document.getElementById('score-btns').classList.add('hidden');
    document.getElementById('show-btn').classList.remove('hidden');
    
    if(game.type === 'spy') {
        const randomPlace = data.spy[Math.floor(Math.random() * data.spy.length)];
        document.getElementById('question-text').innerText = "المكان السري (محدش يشوف): " + randomPlace;
        document.getElementById('answer-text').innerText = "الجاسوس لازم يخمن المكان!";
    } else {
        const item = data[game.type][game.round % data[game.type].length];
        document.getElementById('question-text').innerText = item.q;
        document.getElementById('answer-text').innerText = "الإجابة: " + item.a;
    }
}

window.revealAnswer = function() {
    document.getElementById('answer-text').classList.remove('hidden');
    document.getElementById('show-btn').classList.add('hidden');
    document.getElementById('score-btns').classList.remove('hidden');
    document.getElementById('score-btns').style.display = 'flex';
}

window.handleNext = function(win) {
    if(win) game.scores[game.players[game.currentIdx]]++;
    game.currentIdx++;
    if(game.currentIdx >= game.players.length) { 
        game.currentIdx = 0; 
        game.round++; 
    }
    if(game.round < 5) loadQ(); else alert("انتهى التحدي! مبروك للأبطال.");
}
