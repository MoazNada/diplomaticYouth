// إعدادات Firebase الخاصة بمعاذ
const firebaseConfig = {
  apiKey: "AIzaSyAESCjnKsQxNX_IKH9Fm_ePpIsbb9C_NsE",
  authDomain: "diplomatic-games.firebaseapp.com",
  projectId: "diplomatic-games",
  storageBucket: "diplomatic-games.firebasestorage.app",
  messagingSenderId: "726415224604",
  appId: "1:726415224604:web:3f436ef230254a5ee914d9",
  measurementId: "G-7JS2KL7VCV",
  databaseURL: "https://diplomatic-games-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let currentRoom = null;
let playerName = prompt("ادخل اسمك للعب:") || "لاعب مجهول";

const bank = {
    kora: [
        { q: "من هو النادي الملقب بنادي القرن في أفريقيا؟", a: "الاهلي", options: ["الاهلي", "الزمالك", "الترجي", "صن داونز"] },
        { q: "كم عدد كرات رونالدو الذهبية؟", a: "5", options: ["4", "5", "6", "7"] },
        { q: "في أي بلد أقيمت أول نسخة كأس عالم؟", a: "الاوروجواي", options: ["البرازيل", "الاوروجواي", "ايطاليا", "فرنسا"] },
        { q: "من هو الهداف التاريخي للدوري الانجليزي؟", a: "آلان شيرر", options: ["صلاح", "روني", "شيرر", "هاري كين"] }
        // يمكنك إضافة المزيد هنا لتصل لـ 20
    ],
    fawazir: [
        { q: "ما هو الشيء الذي يكتب ولا يقرأ؟", a: "القلم", options: ["الكتاب", "القلم", "الورقة", "العقل"] },
        { q: "من هو خال أولاد عمتك؟", a: "أبوك", options: ["خالك", "عمك", "أبوك", "جدك"] }
    ]
};

function setMode(m) {
    document.getElementById('connection-menu').classList.add('hidden');
    document.getElementById(m === 'online' ? 'online-screen' : 'main-menu').classList.remove('hidden');
}

function createRoom() {
    const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const count = document.getElementById('q-count').value;
    currentRoom = roomId;
    database.ref('rooms/' + roomId).set({
        status: 'waiting',
        category: 'kora',
        maxQuestions: count,
        currentIdx: 0,
        players: { [playerName]: 0 }
    });
    alert("كود غرفتك: " + roomId);
    startLobby(roomId);
}

function joinRoom() {
    const roomId = document.getElementById('room-id').value.toUpperCase();
    currentRoom = roomId;
    database.ref('rooms/' + roomId + '/players/' + playerName).set(0);
    startLobby(roomId);
}

function startLobby(roomId) {
    document.getElementById('online-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    database.ref('rooms/' + roomId).on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        
        const q = bank.kora[data.currentIdx];
        document.getElementById('question-text').innerText = q.q;
        renderOptions(q.options, q.a, roomId);
        renderLeaderboard(data.players);
    });
}

function renderOptions(options, correct, roomId) {
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'game-card';
        btn.innerText = opt;
        btn.onclick = () => {
            if (opt === correct) {
                database.ref('rooms/' + roomId + '/players/' + playerName).transaction(s => (s || 0) + 10);
                alert("إجابة صحيحة! +10 نقاط");
            } else {
                alert("خطأ! الإجابة هي: " + correct);
            }
            nextQuestion(roomId);
        };
        container.appendChild(btn);
    });
}

function renderLeaderboard(players) {
    const board = document.getElementById('points-board');
    board.innerHTML = '<h3>الترتيب الحالي:</h3>';
    for (let p in players) {
        board.innerHTML += `<p>${p}: ${players[p]} نقطة</p>`;
    }
}

function nextQuestion(roomId) {
    database.ref('rooms/' + roomId + '/currentIdx').transaction(idx => (idx + 1));
}
