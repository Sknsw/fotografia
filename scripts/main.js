import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyB6QY7k3j0PRoWMxSNVk-2nI7sTqReGvlc",
  authDomain: "scortsprincess.firebaseapp.com",
  projectId: "scortsprincess",
  storageBucket: "scortsprincess.appspot.com",
  messagingSenderId: "599517218900",
  appId: "1:599517218900:web:c51b2ec00e8c7b1fcd45c1"
};
const photoGrid = document.getElementById('photo-grid');

// Cargar fotos destacadas
async function loadFeaturedPhotos() {
  const querySnapshot = await getDocs(collection(db, "photos"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');
    photoCard.innerHTML = `
      <img src="${data.url}" alt="${data.title}">
      <p>${data.title}</p>
    `;
    photoGrid.appendChild(photoCard);
  });
}

loadFeaturedPhotos();