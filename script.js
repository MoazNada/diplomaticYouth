// ... (خليل كود الـ firebaseConfig والأسئلة زي ما هم فوق) ...

function setConnection(type) {
    state.conn = type;
    if (type === 'online') {
        // لو اختار أونلاين، يظهر شاشة الغرف
        document.getElementById('connection-screen').classList.add('hidden');
        document.getElementById('online-lobby').classList.remove('hidden');
    } else {
        move('connection-screen', 'category-screen');
    }
}

// دالة إنشاء غرفة جديدة
function createRoom() {
    const roomId = Math.random().toString(36).substring(2, 6).toUpperCase(); // كود من 4 حروف
    db.ref('rooms/' + roomId).set({
        status: 'waiting',
        category: '',
        players: {},
        createdAt: Date.now()
    }).then(() => {
        alert("تم إنشاء الغرفة! كود الدخول هو: " + roomId);
        // هنا نقدر ننقله لشاشة اختيار اللعبة بعد ما صحابه يدخلوا
        state.roomId = roomId;
        move('online-lobby', 'category-screen');
    });
}

// دالة الدخول لغرفة موجودة
function joinRoom() {
    const roomId = document.getElementById('room-input').value.toUpperCase();
    db.ref('rooms/' + roomId).once('value', (snapshot) => {
        if (snapshot.exists()) {
            state.roomId = roomId;
            move('online-lobby', 'category-screen');
        } else {
            alert("الكود ده غلط يا بطل، اتأكد منه تاني!");
        }
    });
}
