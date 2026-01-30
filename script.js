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

const dataBank = {
    kora: [{q:"من هداف العالم التاريخي؟", a:"رونالدو"}, {q:"بطل كأس العالم 2022؟", a:"الأرجنتين"}],
    fawazir: [{q:"شيء يكتب ولا يقرأ؟", a:"القلم"}, {q:"ينبض بلا قلب؟", a:"الساعة"}],
    spy: ["مطار", "مستشفى", "مطعم", "حديقة"]
};

window.showScreen = function(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

window.createNewRoom = function() {
    const rId = Math.random().toString(36).substring(2, 6).toUpperCase();
    game.roomId = rId;
    game.isHost = true;
    db.ref('rooms/' + rId).set({ status: 'waiting', round: 0, showAnswer: false, gameType: '' })
    .then(() => {
        alert("كود الغرفة: " + rId);
        listenToRoom(rId);
        window.showScreen('category-screen');
    });
}

window.joinRoom = function() {
    const rId = document.getElementById('room-input').value.toUpperCase();
    db.ref('rooms/' + rId).once('value', (snapshot) => {
        if (snapshot.exists()) {
            game.roomId = rId;
            game.isHost = false;
            listenToRoom(rId);
            window.showScreen('game-screen');
        } else { alert("الكود غلط!"); }
    });
}

function listenToRoom(rId) {
    db.ref('rooms/' + rId).on('value', (snapshot) => {
        const val = snapshot.val();
        if (!val) return;

        game.type = val.gameType;
        game.round = val.round;

        // تحديث واجهة اللاعب التاني (الضيف)
        if (!game.isHost) {
            document.getElementById('host-controls').classList.add('hidden');
            document.getElementById('waiting-msg').classList.remove('hidden');
        } else {
            document.getElementById('host-controls').classList.remove('hidden');
            document.getElementById('waiting-msg').classList.add('hidden');
        }

        // مزامنة إظهار الإجابة
        if (val.showAnswer) {
            document.getElementById('answer-text').classList.remove('hidden');
        } else {
            document.getElementById('answer-text').classList.add('hidden');
        }

        if (game.type) updateQuestionUI();
    });
}

window.setGameType = function(t) {
    if (game.isHost) {
        db.ref('rooms/' + game.roomId).update({ gameType: t, status: 'playing' });
        window.showScreen('game-screen');
    }
}

function updateQuestionUI() {
    const qList = dataBank[game.type];
    const current = qList[game.round % qList.length];
    document.getElementById('question-text').innerText = current.q || current;
    document.getElementById('answer-text').innerText = "الإجابة: " + (current.a || "خمن المكان!");
}

window.revealAnswer = function() {
    if (game.isHost) db.ref('rooms/' + game.roomId).update({ showAnswer: true });
}

window.handleNext = function(isCorrect) {
    if (game.isHost) {
        db.ref('rooms/' + game.roomId).update({
            round: game.round + 1,
            showAnswer: false
        });
    }
}
