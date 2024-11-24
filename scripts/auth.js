import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

async function registerUser(email, password, role) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Asignar rol en Firestore
  await setDoc(doc(db, "users", user.uid), { email, role });
}

async function loginUser(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
  console.log("Inicio de sesión exitoso");
}