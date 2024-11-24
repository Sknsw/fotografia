const notificationList = document.getElementById("notification-list");

async function loadNotifications() {
  const q = query(collection(db, "notifications"), where("status", "==", "pending"));
  const snapshot = await getDocs(q);

  notificationList.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const notification = document.createElement("div");
    notification.innerHTML = `
      <p>Nueva subida por fotógrafo ${data.photographerId}</p>
      <button data-id="${doc.id}" class="approve-btn">Aprobar</button>
      <button data-id="${doc.id}" class="reject-btn">Rechazar</button>
    `;
    notificationList.appendChild(notification);
  });

  document.querySelectorAll(".approve-btn").forEach(button => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await updateDoc(doc(db, "notifications", id), { status: "approved" });
      alert("Contenido aprobado.");
      loadNotifications();
    });
  });

  document.querySelectorAll(".reject-btn").forEach(button => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await updateDoc(doc(db, "notifications", id), { status: "rejected" });
      alert("Contenido rechazado.");
      loadNotifications();
    });
  });
}

// Inicializar
loadNotifications();