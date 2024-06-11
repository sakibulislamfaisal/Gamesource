import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDUu0EFOT-STxa_zdtfC-K00toTeR9nbJQ",
    authDomain: "gamesource-2e0a5.firebaseapp.com",
    projectId: "gamesource-2e0a5",
    storageBucket: "gamesource-2e0a5.appspot.com",
    messagingSenderId: "662870913830",
    appId: "1:662870913830:web:24930953bb7e20826a47e7",
    measurementId: "G-VGM00TERXJ"
  };


  initializeApp(firebaseConfig)


  const DB = getFirestore();
  const AUTH = getAuth();

  export { AUTH, DB };

