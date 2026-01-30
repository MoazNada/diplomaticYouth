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

let game = { roomId: '', type: '', players: [], scores: {}, currentIdx: 0, round: 0, isHost: false };

const dataBank = {
    kora: [{q:"من هداف العالم التاريخي؟", a:"رونالدو"}, {q:"بطل كأس العالم 2022؟", a:"الأرجنتين"}],
    fawazir: [{q:"شيء يكتب ولا يقرأ؟", a:"القلم"}, {q:"ينبض بلا قلب؟", a:"الساعة"}],
    spy: ["مطار", "مستشفى", "ملعب", "مطعم"]
};

// 1. وظائف التنقل
window.showScreen = function(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// 2. إنشاء غرفة (المضيف)
window.createNewRoom = function() {
    const rId = Math.random().toString(36).substring(2, 6).toUpperCase();
    game.roomId = rId;
    game.isHost = true;
    
    db.ref('rooms/' + rId).set({
        status: 'waiting',
        currentIdx: 0,
        round: 0,
        showAnswer: false,
        gameType: ''
    }).then(() => {
        alert("كود الغرفة: " + rId);
        listenToRoom(rId);
        window.showScreen('category-screen');
    });
}

// 3. الدخول لغرفة (اللاعب التاني)
window.joinRoom = function() {
    const rId = document.getElementById('room-input').value.toUpperCase();
    db.ref('rooms/' + rId).once('value', (snapshot) => {
        if (snapshot.exists()) {
            game.roomId = rId;
            game.isHost = false;
            listenToRoom(rId);
            window.showScreen('game-screen');
        } else {
            alert("الكود ده غلط!");
        }
    });
}

// 4. الاستماع للتغييرات (المزامنة)
function listenToRoom(rId) {
    db.ref('rooms/' + rId).on('value', (snapshot) => {
        const remoteData = snapshot.val();
        if (!remoteData) return;

        game.currentIdx = remoteData.currentIdx;
        game.round = remoteData.round;
        game.type = remoteData.gameType;

        // مزامنة إظهار الإجابة
        if (remoteData.showAnswer) {
            document.getElementById('answer-text').classList.remove('hidden');
            document.getElementById('show-btn').classList.add('hidden');
            if (game.isHost) document.getElementById('score-btns').style.display = 'flex';
        } else {
            document.getElementById('answer-text').classList.add('hidden');
            document.getElementById('show-btn').classList.remove('hidden');
            document.getElementById('score-btns').style.display = 'none';
        }

        updateUI();
    });
}

// 5. تحديث الشاشة
function updateUI() {
    if (!game.type) return;
    const currentQuestion = dataBank[game.type][game.round % dataBank[game.type].length];
    document.getElementById('question-text').innerText = currentQuestion.q;
    document.getElementById('answer-text').innerText = "الإجابة: " + currentQuestion.a;
    document.getElementById('player-display').innerText = "جاري اللعب...";
}

// 6. اختيار اللعبة (للمضيف)
window.setGame = function(t) {
    if (game.isHost) {
        db.ref('rooms/' + game.roomId).update({ gameType: t });
        window.showScreen('setup-screen');
    }
}

// 7. إظهار الإجابة (للمضيف)
window.revealAnswer = function() {
    if (game.isHost) {
        db.ref('rooms/' + game.roomId).update({ showAnswer: true });
    }
}

// 8. النقل للسؤال التالي
window.handleNext = function(win) {
    if (game.isHost) {
        db.ref('rooms/' + game.roomId).update({
            currentIdx: game.currentIdx + 1,
            round: game.round + 1,
            showAnswer: false
        });
    }
}
