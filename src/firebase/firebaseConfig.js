import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage'; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc,getDoc,onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPCQLH-FZkQe5aSw8moiaNbOrjqQxdvWw",
  authDomain: "dreamdrive-e3fca.firebaseapp.com",
  projectId: "dreamdrive-e3fca",
  storageBucket: "dreamdrive-e3fca.firebasestorage.app",
  messagingSenderId: "92154295508",
  appId: "1:92154295508:web:ec0f8628ad0794aa497741",
  measurementId: "G-QRHH1V2058"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); 

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, setDoc,getDoc, doc,storage,onSnapshot };
