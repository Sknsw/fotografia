import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_BUCKET",
  messagingSenderId: "TU_MESSAGING_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Verificar si el usuario es administrador
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists() || userDoc.data().role !== "admin") {
    window.location.href = "unauthorized.html";
    return;
  }

  // Si es administrador, cargar la lista de usuarios
  loadUsers();
});

// Cargar usuarios desde Firestore
async function loadUsers() {
  const userList = document.getElementById("user-list");
  userList.innerHTML = ""; // Limpiar lista

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const user = doc.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <select class="role-select" data-id="${doc.id}">
          <option value="buyer" ${user.role === "buyer" ? "selected" : ""}>Comprador</option>
          <option value="photographer" ${user.role === "photographer" ? "selected" : ""}>Fotógrafo</option>
          <option value="curator" ${user.role === "curator" ? "selected" : ""}>Curador</option>
        </select>
        <button class="save-role-btn" data-id="${doc.id}">Guardar</button>
      </td>
    `;

    userList.appendChild(row);
  });

  // Asignar eventos a los botones de guardar
  document.querySelectorAll(".save-role-btn").forEach((button) => {
    button.addEventListener("click", updateUserRole);
  });
}

// Actualizar el rol del usuario en Firestore
async function updateUserRole(event) {
  const userId = event.target.getAttribute("data-id");
  const newRole = document.querySelector(`.role-select[data-id="${userId}"]`).value;

  try {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    alert("Rol actualizado correctamente.");
  } catch (error) {
    alert("Error al actualizar el rol: " + error.message);
  }
}
import { deleteUser } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { deleteDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Función para cargar usuarios (actualizada con botón de eliminación)
async function loadUsers() {
  const userList = document.getElementById("user-list");
  userList.innerHTML = ""; // Limpiar lista

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const user = doc.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="delete-user-btn" data-id="${doc.id}">Eliminar</button>
      </td>
    `;

    userList.appendChild(row);
  });

  // Asignar eventos a los botones de eliminar
  document.querySelectorAll(".delete-user-btn").forEach((button) => {
    button.addEventListener("click", deleteUserAccount);
  });
}

// Función para eliminar un usuario
async function deleteUserAccount(event) {
  const userId = event.target.getAttribute("data-id");

  if (confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
    try {
      // Eliminar datos del usuario en Firestore
      await deleteDoc(doc(db, "users", userId));
      alert("Usuario eliminado correctamente.");
      loadUsers(); // Recargar la lista de usuarios
    } catch (error) {
      alert("Error al eliminar el usuario: " + error.message);
    }
  }
}
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_BUCKET",
  messagingSenderId: "TU_MESSAGING_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Verificar si el usuario es administrador
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists() || userDoc.data().role !== "admin") {
    window.location.href = "unauthorized.html";
    return;
  }

  // Si es administrador, cargar la lista de usuarios
  loadUsers();
});

// Cargar usuarios desde Firestore
async function loadUsers() {
  const userList = document.getElementById("user-list");
  userList.innerHTML = ""; // Limpiar lista

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const user = doc.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <select class="role-select" data-id="${doc.id}">
          <option value="buyer" ${user.role === "buyer" ? "selected" : ""}>Comprador</option>
          <option value="photographer" ${user.role === "photographer" ? "selected" : ""}>Fotógrafo</option>
          <option value="curator" ${user.role === "curator" ? "selected" : ""}>Curador</option>
        </select>
        <button class="save-role-btn" data-id="${doc.id}">Guardar</button>
      </td>
    `;

    userList.appendChild(row);
  });

  // Asignar eventos a los botones de guardar
  document.querySelectorAll(".save-role-btn").forEach((button) => {
    button.addEventListener("click", updateUserRole);
  });
}

// Actualizar el rol del usuario en Firestore
async function updateUserRole(event) {
  const userId = event.target.getAttribute("data-id");
  const newRole = document.querySelector(`.role-select[data-id="${userId}"]`).value;

  try {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    alert("Rol actualizado correctamente.");
  } catch (error) {
    alert("Error al actualizar el rol: " + error.message);
  }
}