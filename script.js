// إعدادات Firebase الخاصة بمعاذ - من صورك
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

// تشغيل Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// وظيفة بسيطة للتجربة
function createRoom() {
    const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    alert("كود غرفتك: " + roomId);
    database.ref('rooms/' + roomId).set({ status: 'open' });
}
