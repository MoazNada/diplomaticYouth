// بيانات Firebase الخاصة بك
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

// دالة تبديل الشاشات (هي دي اللي هتظهر الألعاب)
function setMode(mode) {
    // إخفاء شاشة البداية
    document.getElementById('connection-menu').classList.add('hidden');
    
    if (mode === 'online') {
        document.getElementById('online-screen').classList.remove('hidden');
    } else {
        // إظهار قائمة الألعاب فوراً عند اختيار لعب محلي
        document.getElementById('main-menu').classList.remove('hidden');
    }
}

// دالة بدء اللعبة وإظهار الأسئلة
function startGame(gameType) {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    const qText = document.getElementById('question-text');
    if(gameType === 'kora') qText.innerText = "من هو هداف العالم حالياً؟";
    if(gameType === 'fawazir') qText.innerText = "ما هو الشيء الذي يكتب ولا يقرأ؟";
    if(gameType === 'spy') qText.innerText = "أنت الآن في: (المستشفى)";
}// ... كود Firebase بتاعك في الأول ...

function setMode(mode) {
    // إخفاء شاشة البداية
    document.getElementById('connection-menu').classList.add('hidden');
    
    if (mode === 'online') {
        document.getElementById('online-screen').classList.remove('hidden');
    } else {
        // إظهار قائمة الألعاب فوراً (لعب محلي)
        document.getElementById('main-menu').classList.remove('hidden');
    }
}

function startGame(gameType) {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    const qText = document.getElementById('question-text');
    if(gameType === 'kora') qText.innerText = "من هو هداف العالم حالياً؟";
    if(gameType === 'fawazir') qText.innerText = "ما هو الشيء الذي يكتب ولا يقرأ؟";
    if(gameType === 'spy') qText.innerText = "أنت الآن في: (المستشفى)";
}

