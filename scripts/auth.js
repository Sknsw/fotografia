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
// Importar Firebase y Auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_BUCKET",
  messagingSenderId: "TU_MESSAGING_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase y Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Alternar entre Registro e Inicio de Sesión
const registerTab = document.getElementById("register-tab");
const loginTab = document.getElementById("login-tab");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const authMessage = document.getElementById("auth-message");

registerTab.addEventListener("click", () => {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
});

loginTab.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
});

// Registro de Usuario
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    authMessage.textContent = "Registro exitoso. Ahora puedes iniciar sesión.";
    authMessage.style.color = "green";
    registerForm.reset();
  } catch (error) {
    authMessage.textContent = error.message;
    authMessage.style.color = "red";
  }
});

// Inicio de Sesión
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    authMessage.textContent = "Inicio de sesión exitoso.";
    authMessage.style.color = "green";
    // Redirige al usuario
    window.location.href = "dashboard.html";
  } catch (error) {
    authMessage.textContent = error.message;
    authMessage.style.color = "red";
  }
});

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "auth.html"; // Redirige a la página de login
  }
});
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const forgotPasswordLink = document.getElementById("forgot-password");
const resetPasswordContainer = document.getElementById("reset-password-container");
const resetPasswordBtn = document.getElementById("reset-password-btn");
const backToLogin = document.getElementById("back-to-login");
const resetMessage = document.getElementById("reset-message");

forgotPasswordLink.addEventListener("click", () => {
  registerForm.classList.add("hidden");
  loginForm.classList.add("hidden");
  resetPasswordContainer.classList.remove("hidden");
});

backToLogin.addEventListener("click", () => {
  resetPasswordContainer.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

resetPasswordBtn.addEventListener("click", async () => {
  const email = document.getElementById("reset-email").value;

  try {
    await sendPasswordResetEmail(auth, email);
    resetMessage.textContent = "Correo de restablecimiento enviado. Revisa tu bandeja de entrada.";
    resetMessage.style.color = "green";
  } catch (error) {
    resetMessage.textContent = error.message;
    resetMessage.style.color = "red";
  }
});
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const db = getFirestore(app);

// Registro de Usuario y Asignación de Rol
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guarda el rol del usuario en Firestore
    const role = "buyer"; // Por defecto
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: role
    });

    authMessage.textContent = "Registro exitoso. Ahora puedes iniciar sesión.";
    authMessage.style.color = "green";
    registerForm.reset();
  } catch (error) {
    authMessage.textContent = error.message;
    authMessage.style.color = "red";
  }
});
import { getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Verifica el rol del usuario
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role;

      if (role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else if (role === "curator") {
        window.location.href = "curator-dashboard.html";
      } else if (role === "photographer") {
        window.location.href = "photographer-dashboard.html";
      } else {
        window.location.href = "buyer-dashboard.html";
      }
    }
  } catch (error) {
    authMessage.textContent = error.message;
    authMessage.style.color = "red";
  }
});
async function checkUserRole(requiredRole) {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists() && userDoc.data().role === requiredRole) {
    return true;
  } else {
    window.location.href = "unauthorized.html"; // Página de error de permisos
  }
}

// Ejemplo: proteger una página de administración
checkUserRole("admin");