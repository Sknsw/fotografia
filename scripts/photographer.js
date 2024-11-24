import { db, storage, auth } from "./firebase-config.js";
import { ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Referencias
const fileInput = document.getElementById("file-input");
const uploadForm = document.getElementById("upload-form");
const uploadStatus = document.getElementById("upload-status");
const mediaList = document.getElementById("media-list");

// Subir archivos
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const files = fileInput.files;
  if (!files.length) {
    uploadStatus.textContent = "Por favor selecciona archivos para subir.";
    return;
  }

  const user = auth.currentUser;
  const photographerId = user.uid;

  // Comprobar cuántos archivos ya ha subido
  const q = query(collection(db, "photos"), where("photographerId", "==", photographerId));
  const snapshot = await getDocs(q);
  const currentUploads = snapshot.size;

  // Restricciones
  const maxUploads = currentUploads === 0 ? 3 : 10;
  if (files.length + currentUploads > maxUploads) {
    uploadStatus.textContent = `Puedes subir un máximo de ${maxUploads} archivos. Actualmente has subido ${currentUploads}.`;
    return;
  }

  uploadStatus.textContent = "Subiendo archivos...";

  // Subir cada archivo a Firebase Storage
  const uploadPromises = Array.from(files).map(async (file) => {
    const storageRef = ref(storage, `media/${photographerId}/${file.name}`);
    await uploadBytes(storageRef, file);

    // Obtener URL de descarga
    const url = await getDownloadURL(storageRef);

    // Guardar información en Firestore
    await addDoc(collection(db, "photos"), {
      photographerId,
      url,
      title: file.name,
      type: file.type.includes("image") ? "photo" : "video",
      createdAt: new Date(),
      price: Math.random() * 10 + 5 // Precio aleatorio entre 5 y 15€
    });
  });

  await Promise.all(uploadPromises);

  uploadStatus.textContent = "Subida completada con éxito.";
  loadUploadedMedia();
});

// Cargar contenido subido
async function loadUploadedMedia() {
  const user = auth.currentUser;
  const photographerId = user.uid;

  const q = query(collection(db, "photos"), where("photographerId", "==", photographerId));
  const snapshot = await getDocs(q);

  mediaList.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const mediaItem = document.createElement("div");
    mediaItem.innerHTML = `
      <${data.type === "photo" ? "img" : "video"} 
        src="${data.url}" 
        ${data.type === "video" ? "controls" : ""}
        alt="${data.title}" 
        width="200">
      <p>${data.title} - ${data.type}</p>
    `;
    mediaList.appendChild(mediaItem);
  });
}

// Inicializar
auth.onAuthStateChanged((user) => {
  if (user) {
    loadUploadedMedia();
  } else {
    window.location.href = "index.html";
  }
});
const maxUploads = userHasLimitedAccess ? 3 : 10;

if (files.length > maxUploads) {
  uploadStatus.textContent = `Solo puedes subir un máximo de ${maxUploads} archivos.`;
  return;
}

// Subir archivos
uploadStatus.textContent = "Subiendo archivos...";

const userType = files[0].type.includes("video") ? "video" : "photo";
// Lógica para subida similar al paso anterior