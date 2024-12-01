// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIGj7-qtDP4pVDXpJ2ckmTMhO5x2KQVeA",
  authDomain: "scort-glamur.firebaseapp.com",
  projectId: "scort-glamur",
  storageBucket: "scort-glamur.appspot.com",
  messagingSenderId: "971144857909",
  appId: "1:971144857909:web:353b6cb5590bc261c9647c"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);