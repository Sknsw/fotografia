import { db } from "./firebase-config.js";
import { collection, addDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

function renderCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cartItems.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.innerHTML = `
      <p>${item.title} - €${item.price}</p>
      <button class="remove-btn" data-index="${index}">Eliminar</button>
    `;
    total += item.price;
    cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.textContent = `€${total.toFixed(2)}`;
}

cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.dataset.index;
    cartItems.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    renderCart();
  }
});

checkoutBtn.addEventListener("click", async () => {
  for (const item of cartItems) {
    await addDoc(collection(db, "sales"), {
      ...item,
      date: new Date(),
      buyerId: "usuario_actual"
    });
  }

  alert("Compra realizada con éxito.");
  localStorage.removeItem("cart");
  renderCart();
});

renderCart();