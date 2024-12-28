// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6QY7k3j0PRoWMxSNVk-2nI7sTqReGvlc",
  authDomain: "scortsprincess.firebaseapp.com",
  projectId: "scortsprincess",
  storageBucket: "scortsprincess.appspot.com",
  messagingSenderId: "599517218900",
  appId: "1:599517218900:web:c51b2ec00e8c7b1fcd45c1"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);