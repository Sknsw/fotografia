import { db } from "./firebase-config.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Referencias a elementos
const totalSalesEl = document.getElementById("total-sales");
const totalPhotosEl = document.getElementById("total-photos");
const activePhotographersEl = document.getElementById("active-photographers");
const photographerListEl = document.getElementById("photographer-list");

// Cargar estadísticas generales
async function loadStats() {
  let totalSales = 0;
  let totalPhotos = 0;

  // Ventas totales
  const salesSnapshot = await getDocs(collection(db, "sales"));
  salesSnapshot.forEach(doc => {
    totalSales += doc.data().amount;
    totalPhotos += 1;
  });

  // Fotógrafos activos
  const photographersSnapshot = await getDocs(collection(db, "users"));
  const activePhotographers = photographersSnapshot.docs.filter(doc => doc.data().role === "photographer").length;

  // Actualizar estadísticas
  totalSalesEl.textContent = totalSales.toFixed(2);
  totalPhotosEl.textContent = totalPhotos;
  activePhotographersEl.textContent = activePhotographers;
}

// Cargar lista de fotógrafos
async function loadPhotographers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  photographerListEl.innerHTML = "";

  querySnapshot.forEach(doc => {
    const data = doc.data();
    if (data.role === "photographer") {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name || "Sin nombre"}</td>
        <td>${data.email}</td>
        <td>
          <input type="number" value="${data.percentage || 50}" min="0" max="100" data-id="${doc.id}" class="percentage-input">
        </td>
        <td>
          <button class="update-percentage" data-id="${doc.id}">Actualizar</button>
        </td>
      `;
      photographerListEl.appendChild(row);
    }
  });

  // Añadir eventos a botones de actualización
  document.querySelectorAll(".update-percentage").forEach(button => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const percentage = document.querySelector(`.percentage-input[data-id="${id}"]`).value;
      await updateDoc(doc(db, "users", id), { percentage: parseInt(percentage) });
      alert("Porcentaje actualizado");
    });
  });
}
import { db } from "./firebase-config.js";
import { collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const weeklyEarningsEl = document.getElementById("weekly-earnings");
const monthlyEarningsEl = document.getElementById("monthly-earnings");
const annualEarningsEl = document.getElementById("annual-earnings");
const photographerTable = document.getElementById("photographer-table");

async function loadSalesData() {
  const salesSnapshot = await getDocs(collection(db, "sales"));
  const now = new Date();
  let weekly = 0, monthly = 0, annual = 0;

  salesSnapshot.forEach(doc => {
    const sale = doc.data();
    const saleDate = new Date(sale.date);

    if (now - saleDate <= 7 * 24 * 60 * 60 * 1000) {
      weekly += sale.price;
    }
    if (now.getMonth() === saleDate.getMonth() && now.getFullYear() === saleDate.getFullYear()) {
      monthly += sale.price;
    }
    if (now.getFullYear() === saleDate.getFullYear()) {
      annual += sale.price;
    }
  });

  weeklyEarningsEl.textContent = `€${weekly.toFixed(2)}`;
  monthlyEarningsEl.textContent = `€${monthly.toFixed(2)}`;
  annualEarningsEl.textContent = `€${annual.toFixed(2)}`;
}

async function loadPhotographerData() {
  const photographersSnapshot = await getDocs(collection(db, "photographers"));
  photographerTable.innerHTML = "";

  photographersSnapshot.forEach(doc => {
    const photographer = doc.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${photographer.name}</td>
      <td>${photographer.earningsPercentage}%</td>
      <td>${photographer.uploadedPhotos}</td>
      <td>${photographer.success}</td>
      <td>
        <button class="edit-percentage" data-id="${doc.id}" data-percentage="${photographer.earningsPercentage}">Editar</button>
      </td>
    `;

    photographerTable.appendChild(row);
  });

  document.querySelectorAll(".edit-percentage").forEach(button => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const newPercentage = prompt("Introduce el nuevo porcentaje de ganancias:", e.target.dataset.percentage);

      if (newPercentage !== null) {
        await updateDoc(doc(db, "photographers", id), {
          earningsPercentage: parseFloat(newPercentage)
        });
        alert("Porcentaje actualizado con éxito.");
        loadPhotographerData();
      }
    });
  });
}
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

async function loadStatistics() {
  const statsContainer = document.getElementById("stats-container");

  // Archivos más vendidos
  const topFilesQuery = query(collection(db, "files"), orderBy("sales", "desc"), limit(5));
  const topFilesSnapshot = await getDocs(topFilesQuery);

  let topFilesHTML = "<h3>Archivos más vendidos:</h3><ul>";
  topFilesSnapshot.forEach((doc) => {
    const file = doc.data();
    topFilesHTML += `<li>${file.title} - ${file.sales} ventas</li>`;
  });
  topFilesHTML += "</ul>";

  // Usuarios más activos
  const activeUsersQuery = query(collection(db, "users"), orderBy("uploads", "desc"), limit(5));
  const activeUsersSnapshot = await getDocs(activeUsersQuery);

  let activeUsersHTML = "<h3>Usuarios más activos:</h3><ul>";
  activeUsersSnapshot.forEach((doc) => {
    const user = doc.data();
    activeUsersHTML += `<li>${user.name} - ${user.uploads} archivos subidos</li>`;
  });
  activeUsersHTML += "</ul>";

  statsContainer.innerHTML = topFilesHTML + activeUsersHTML;
}
import { jsPDF } from "jspdf";

document.getElementById("export-pdf").addEventListener("click", async () => {
  const pdf = new jsPDF();
  pdf.text("Reporte de Ventas", 10, 10);

  // Obtén datos de Firestore
  const salesSnapshot = await getDocs(collection(db, "sales"));

  let yOffset = 20;
  salesSnapshot.forEach((doc) => {
    const sale = doc.data();
    pdf.text(`ID Venta: ${doc.id} - Total: ${sale.total}€`, 10, yOffset);
    yOffset += 10;
  });

  pdf.save("reporte_ventas.pdf");
});

loadStatistics();
// Inicializar los datos
loadSalesData();
loadPhotographerData();
// Inicializar funciones
loadStats();
loadPhotographers();