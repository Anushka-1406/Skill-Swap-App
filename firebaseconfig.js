import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiE7Oi2Gx63NKz8aZ0inLoVYHoXC6lHjY",
  authDomain: "skill-swap-a76cf.firebaseapp.com",
  projectId: "skill-swap-a76cf",
  storageBucket: "skill-swap-a76cf.appspot.com", // ✅ corrected
  messagingSenderId: "769206886763",
  appId: "1:769206886763:web:57ffbf5666a43c47942c2e",
  measurementId: "G-PZZ17PMPDJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

export { auth };
