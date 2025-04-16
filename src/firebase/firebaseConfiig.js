// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPCQLH-FZkQe5aSw8moiaNbOrjqQxdvWw",
  authDomain: "dreamdrive-e3fca.firebaseapp.com",
  projectId: "dreamdrive-e3fca",
  storageBucket: "dreamdrive-e3fca.firebasestorage.app",
  messagingSenderId: "92154295508",
  appId: "1:92154295508:web:ec0f8628ad0794aa497741",
  measurementId: "G-QRHH1V2058"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);