import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firebase web config is public client-side. Fallbacks keep production
// working when Vercel env vars are missing.
const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyDDfe2wUwf-TkLtqmm5Jq7axxwega4xWjY",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "dreamdrive-307ed.firebaseapp.com",
  projectId:
    process.env.REACT_APP_FIREBASE_PROJECT_ID || "dreamdrive-307ed",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "dreamdrive-307ed.appspot.com",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "669755502101",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:669755502101:web:32375dd8fcbfcbcb8b281c",
  measurementId:
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-QTMHB127TZ",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, storage };
