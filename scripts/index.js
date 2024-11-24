import { doc, setDoc, deleteField } from "firebase/firestore";

const resultsGrid = document.getElementById("results-grid");

resultsGrid.addEventListener("click", async (e) => {
  if (e.target.classList.contains("favorite-btn")) {
    const fileId = e.target.dataset.id;
    const userId = firebase.auth().currentUser.uid;

    const favoriteRef = doc(db, "favorites", userId);

    try {
      // Alternar favoritos
      const docSnap = await getDoc(favoriteRef);
      if (docSnap.exists() && docSnap.data()[fileId]) {
        await updateDoc(favoriteRef, { [fileId]: deleteField() });
        e.target.textContent = "❤️ Favorito";
      } else {
        await updateDoc(favoriteRef, { [fileId]: true });
        e.target.textContent = "💔 Quitar";
      }
    } catch (error) {
      console.error("Error al actualizar favoritos: ", error);
    }
  }
});
import { collection, query, where, onSnapshot } from "firebase/firestore";

function listenForNotifications(userId) {
  const notificationsRef = collection(db, "notifications");
  const q = query(notificationsRef, where("userId", "==", userId), where("read", "==", false));

  onSnapshot(q, (snapshot) => {
    snapshot.forEach((doc) => {
      const notification = doc.data();
      showNotification(notification.message);
      // Marca como leída tras mostrar
      updateDoc(doc.ref, { read: true });
    });
  });
}

function showNotification(message) {
  const notificationBox = document.createElement("div");
  notificationBox.className = "notification";
  notificationBox.textContent = message;
  document.body.appendChild(notificationBox);

  setTimeout(() => {
    notificationBox.remove();
  }, 5000); // Desaparece tras 5 segundos
}

// Inicia la escucha al cargar
firebase.auth().onAuthStateChanged((user) => {
  if (user) listenForNotifications(user.uid);
});
const darkModeToggle = document.getElementById("dark-mode-toggle");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// Aplica preferencia guardada
window.onload = () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
};