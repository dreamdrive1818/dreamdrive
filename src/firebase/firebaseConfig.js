import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage'; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc,getDoc,onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDfe2wUwf-TkLtqmm5Jq7axxwega4xWjY",
  authDomain: "dreamdrive-307ed.firebaseapp.com",
  projectId: "dreamdrive-307ed",
  storageBucket: "dreamdrive-307ed.firebasestorage.app",
  messagingSenderId: "669755502101",
  appId: "1:669755502101:web:32375dd8fcbfcbcb8b281c",
  measurementId: "G-QTMHB127TZ"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); 

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, setDoc,getDoc, doc,storage,onSnapshot };
