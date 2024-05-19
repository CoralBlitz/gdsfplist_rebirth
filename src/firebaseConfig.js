// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPK29eQpipOKls_4ytp-gSA_3JY2Cs5vY",
  authDomain: "gdsfpl.firebaseapp.com",
  projectId: "gdsfpl",
  storageBucket: "gdsfpl.appspot.com",
  messagingSenderId: "85120061267",
  appId: "1:85120061267:web:d4b6a46c16e10ad3d71ba6",
  measurementId: "G-H11QLFNPZ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
