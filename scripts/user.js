<main>
  <section id="photo-list">
    <h2>Comprar Fotos</h2>
    <div id="photos-grid"></div>
  </section>

  <section id="cart">
    <h2>Carrito</h2>
    <div id="cart-items"></div>
    <p>Total: <span id="cart-total">0</span>€</p>
    <button id="checkout">Finalizar Compra</button>
  </section>
</main>
import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let cart = [];
const photosGrid = document.getElementById("photos-grid");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Cargar fotos para comprar
async function loadPhotos() {
  const querySnapshot = await getDocs(collection(db, "photos"));
  photosGrid.innerHTML = "";

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const photoCard = document.createElement("div");
    photoCard.classList.add("photo-card");
    photoCard.innerHTML = `
      <img src="${data.url}" alt="${data.title}">
      <p>${data.title} - ${data.price}€</p>
      <button data-id="${doc.id}" data-price="${data.price}" class="add-to-cart">Añadir al carrito</button>
    `;
    photosGrid.appendChild(photoCard);
  });

  // Añadir eventos a botones
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const price = parseFloat(e.target.dataset.price);

      cart.push({ id, price });
      updateCart();
    });
  });
}

// Actualizar carrito
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.textContent = `Foto ${item.id} - ${item.price}€`;
    cartItems.appendChild(cartItem);
    total += item.price;
  });

  cartTotal.textContent = total.toFixed(2);
}

// Finalizar compra
document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) return alert("El carrito está vacío");
  alert("Compra realizada con éxito");
  cart = [];
  updateCart();
});

// Inicializar
loadPhotos();