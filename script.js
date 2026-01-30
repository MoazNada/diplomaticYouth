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

let game = { roomId: '', isHost: false, type: '', round: 0 };
const questions = {
    kora: [{q:"من هداف العالم؟", a:"رونالدو"}, {q:"بطل 2022؟", a:"الأرجنتين"}],
    fawazir: [{q:"يكتب ولا يقرأ؟", a:"القلم"}],
    spy: ["مطار", "مستشفى", "ملعب"]
};

// وظيفة التنقل
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// ربط الأزرار (هنا حل مشكلة "مش عاوز يدوس")
document.getElementById('online-btn').onclick = () => showScreen('online-lobby');
document.getElementById('local-btn').onclick = () => showScreen('category-screen');

document.getElementById('create-room-btn').onclick = () => {
    const rId = Math.random().toString(36).substring(2, 6).toUpperCase();
    game.roomId = rId;
    game.isHost = true;
    db.ref('rooms/' + rId).set({ status: 'waiting', round: 0, showAnswer: false, gameType: '' })
    .then(() => {
        alert("كود غرفتك: " + rId);
        listenToRoom(rId);
        showScreen('category-screen');
    });
};

document.getElementById('join-room-btn').onclick = () => {
    const rId = document.getElementById('room-input').value.toUpperCase().trim();
    if(!rId) return alert("اكتب الكود الأول!");
    db.ref('rooms/' + rId).once('value', (snap) => {
        if (snap.exists()) {
            game.roomId = rId;
            game.isHost = false;
            listenToRoom(rId);
            showScreen('game-screen');
        } else {
            alert("الكود ده غلط! اتأكد منه تاني.");
        }
    });
};

// اختيار اللعبة
['kora', 'fawazir', 'spy'].forEach(type => {
    document.getElementById(type + '-btn').onclick = () => {
        if (game.isHost && game.roomId) {
            db.ref('rooms/' + game.roomId).update({ gameType: type, status: 'playing' });
            showScreen('game-screen');
        } else {
            game.type = type; // للمحلي
            showScreen('game-screen');
            updateUI(true);
        }
    };
});

function listenToRoom(rId) {
    db.ref('rooms/' + rId).on('value', (snap) => {
        const val = snap.val();
        if (!val) return;
        game.type = val.gameType;
        game.round = val.round;
        
        // التحكم في ظهور الأزرار للمضيف والضيف
        if (game.isHost) {
            document.getElementById('host-controls').classList.remove('hidden');
            document.getElementById('waiting-msg').classList.add('hidden');
        } else {
            document.getElementById('host-controls').classList.add('hidden');
            document.getElementById('waiting-msg').classList.remove('hidden');
            document.getElementById('waiting-msg').innerText = "انتظر المضيف يختار...";
        }

        if (val.showAnswer) {
            document.getElementById('answer-text').classList.remove('hidden');
        } else {
            document.getElementById('answer-text').classList.add('hidden');
        }
        if (game.type) updateUI();
    });
}

function updateUI(local = false) {
    const qList = questions[game.type];
    const current = qList[game.round % qList.length];
    document.getElementById('question-text').innerText = current.q || current;
    document.getElementById('answer-text').innerText = "الإجابة: " + (current.a || "خمن!");
}

document.getElementById('show-btn').onclick = () => {
    if (game.isHost) db.ref('rooms/' + game.roomId).update({ showAnswer: true });
};

document.getElementById('correct-btn').onclick = () => {
    if (game.isHost) db.ref('rooms/' + game.roomId).update({ round: game.round + 1, showAnswer: false });
};
