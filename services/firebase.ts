import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import firestore
<<<<<<< HEAD
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'; // Import App Check

=======
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50


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

<<<<<<< HEAD
// --- ADD THIS BLOCK ---
if (import.meta.env.DEV) {
    // This is the debug token you generated in the Firebase Console
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = 'C7DB532B-10FE-410B-BE85-153F282CF98F';
}
initializeAppCheck(app, {
    // --- THIS IS THE FIX ---
    // Replace the placeholder with the official reCAPTCHA v3 key for localhost testing.
    provider: new ReCaptchaV3Provider('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'),
    // --- END OF FIX ---
    isTokenAutoRefreshEnabled: true
});
// --- END OF BLOCK ---

=======
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
// Initialize and export the Firebase Authentication service so we can use it on the login page
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize and export firestore