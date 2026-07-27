// firebase.js

import { initializeApp } from "firebase/app";

import { 
  getAuth 
} from "firebase/auth";

import {
  getFirestore
} from "firebase/firestore";





const firebaseConfig = {


  apiKey: "AIzaSyBIESVck4K5JjFFRsodAi1YXZFh1bV9se8",

  authDomain: "learnlens-ai-final.firebaseapp.com",

  projectId: "learnlens-ai-final",

  storageBucket: "learnlens-ai-final.firebasestorage.app",

  messagingSenderId: "88651896673",

  appId: "1:88651896673:web:4ef1f878c79915f6ff9720"


};







// Initialize Firebase

const app = initializeApp(firebaseConfig);






// Firebase Authentication

export const auth = getAuth(app);






// Firestore Database

export const db = getFirestore(app);