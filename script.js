// 1. إعدادات Firebase الخاصة بك (المفتاح السري)
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

// 2. بنك الأسئلة (كورة، فوازير، الجاسوس)
const gamesData = {
    kora: [
        { q: "من هو الهداف التاريخي للنادي الأهلي؟", a: "محمود الخطيب" },
        { q: "كم مرة فاز الزمالك بدوري أبطال أفريقيا؟", a: "5 مرات" },
        { q: "من هو اللاعب الملقب بـ 'العقرب'؟", a: "أشرف بن شرقي" }
    ],
    fawazir: [
        { q: "ما هو الشيء الذي يكتب ولا يقرأ؟", a: "القلم" },
        { q: "ماهو الشيء الذي كلما زاد نقص؟", a: "العمر" }
    ],
    spy: ["المستشفى", "المطعم", "المدرسة", "النادي", "الطائرة"]
};

// 3. وظائف التنقل (تصليح الزراير)
function setMode(m) {
    document.getElementById('connection-menu').classList.add('hidden');
    if (m === 'online') {
        document.getElementById('online-screen').classList.remove('hidden');
    } else {
        document.getElementById('main-menu').classList.remove('hidden');
    }
}

function startGame(gameType) {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    const area = document.getElementById('game-area');
    
    if(gameType === 'kora') {
        let quest = gamesData.kora[Math.floor(Math.random() * gamesData.kora.length)];
        area.innerHTML = `<h3>سؤال كورة:</h3><p>${quest.q}</p>
        <button class="action-btn" onclick="alert('الإجابة هي: ${quest.a}')">إظهار الإجابة</button>`;
    } else if(gameType === 'spy') {
        let place = gamesData.spy[Math.floor(Math.random() * gamesData.spy.length)];
        area.innerHTML = `<h3>لعبة الجاسوس:</h3><p>المكان هو: ${place}</p>
        <p>مرر الموبايل للاعب التالي واكتم السر!</p>`;
    }
}

// 4. وظائف الأونلاين (Firebase)
function createRoom() {
    const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    database.ref('rooms/' + roomId).set({
        status: 'waiting',
        gameType: 'none'
    });
    alert("كود غرفتك: " + roomId);
    joinRoom(roomId);
}

function joinRoom(id) {
    const roomId = id || document.getElementById('room-id').value;
    if(!roomId) return alert("اكتب الكود!");
    
    database.ref('rooms/' + roomId).on('value', (snapshot) => {
        if(snapshot.val()) {
            document.getElementById('online-screen').classList.add('hidden');
            document.getElementById('main-menu').classList.remove('hidden');
        } else {
            alert("الغرفة غير موجودة!");
        }
    });
}
