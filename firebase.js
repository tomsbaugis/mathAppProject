// Import the functions you need from the SDKs you need
import * as firebase from 'firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbWRAkbiN3DT9Lj5MXqoKUXgQRnKPVkqY",
  authDomain: "new-math-app.firebaseapp.com",
  projectId: "new-math-app",
  storageBucket: "new-math-app.appspot.com",
  messagingSenderId: "628251869787",
  appId: "1:628251869787:web:ad3fa85731f83cba53357e"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}
const auth = firebase.auth();

export { auth }