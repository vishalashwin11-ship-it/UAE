import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc,
  updateDoc,
  deleteDoc,
  collection, 
  query, 
  where, 
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCdenwcq9Ci1TK7v9mTJHI9pIphBm3j9PA",
  authDomain: "upbeat-abroad-education.firebaseapp.com",
  projectId: "upbeat-abroad-education",
  storageBucket: "upbeat-abroad-education.firebasestorage.app",
  messagingSenderId: "717923638028",
  appId: "1:717923638028:web:b19cac3a0463aa7098c729"
};

// Initialize Firebase (singleton pattern)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged,
  doc, 
  getDoc, 
  setDoc, 
  addDoc,
  updateDoc,
  deleteDoc,
  collection, 
  query, 
  where, 
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp
};
export type { FirebaseUser };
