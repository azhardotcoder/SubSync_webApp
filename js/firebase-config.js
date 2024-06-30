var firebaseConfig = {
    apiKey: "AIzaSyBxLfxmu2HQcdsZA2_mBUcMXHX_ncgc52E",
    authDomain: "subsync-18cc5.firebaseapp.com",
    projectId: "subsync-18cc5",
    storageBucket: "subsync-18cc5.appspot.com",
    messagingSenderId: "113700041480",
    appId: "1:113700041480:web:f15c9cd1f6508efd6b32bd",
    measurementId: "G-749LMR44FS",
    databaseURL: "https://subsync-18cc5-default-rtdb.firebaseio.com"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}
