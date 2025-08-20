import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import firestore


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4TciuyuzAD5kYj6_0oHYvxmTWkSBfLsc",
    authDomain: "the-fun-867a2.firebaseapp.com",
    projectId: "the-fun-867a2",
    storageBucket: "the-fun-867a2.appspot.com",
    messagingSenderId: "639643717370",
    appId: "1:639643717370:web:ac6115e846c9d204238343",
    measurementId: "G-4PDPFGFCG4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the Firebase Authentication service so we can use it on the login page
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize and export firestore