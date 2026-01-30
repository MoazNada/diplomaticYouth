// إعدادات Firebase
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

let gameStatus = {
    connection: '',
    roomId: '',
    category: '',
    players: [],
    scores: {},
    round: 0,
    currentPlayerIndex: 0
};

// --- دالات الأونلاين الجديدة ---

function setConnection(type) {
    gameStatus.connection = type;
    if (type === 'online') {
        // لو اختار أونلاين، نظهر شاشة الغرف
        move('connection-screen', 'online-screen'); 
    } else {
        // لو محلي، يدخل على الألعاب علطول
        move('connection-screen', 'category-screen');
    }
}

function createRoom() {
    // إنشاء كود عشوائي من 5 حروف
    const id = Math.random().toString(36).substring(2, 7).toUpperCase();
    gameStatus.roomId = id;
    alert("كود غرفتك الجديد: " + id);
    
    // تسجيل الغرفة في Firebase
    db.ref('rooms/' + id).set({
        status: 'waiting',
        players: []
    });
    
    move('online-screen', 'category-screen');
}

function joinRoom() {
    const id = document.getElementById('room-input').value.toUpperCase();
    if (!id) return alert("ادخل الكود أولاً");
    
    db.ref('rooms/' + id).once('value', (snapshot) => {
        if (snapshot.exists()) {
            gameStatus.roomId = id;
            move('online-screen', 'category-screen');
        } else {
            alert("الكود غلط أو الغرفة مش موجودة");
        }
    });
}

// --- باقي وظائف اللعبة (معدلة للتنقل الصح) ---

function setCategory(cat) {
    gameStatus.category = cat;
    move('category-screen', 'setup-screen');
    generateInputs();
}

function move(fromId, toId) {
    document.getElementById(fromId).classList.add('hidden');
    document.getElementById(toId).classList.remove('hidden');
}

// ... كمل باقي الدوال (generateInputs, startBattle, loadQuestion) زي ما هي من الكود اللي فات ...
