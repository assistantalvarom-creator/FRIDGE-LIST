import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
  getDoc, getDocs, onSnapshot, query, orderBy, limit, serverTimestamp, increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { catalog } from "./catalog.js";

// ── Setup check ─────────────────────────────────────────────────────────
const isConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_");
if (!isConfigured) {
  document.getElementById("setup-banner").classList.remove("hidden");
}

let db = null;
if (isConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

const listCol = () => collection(db, "shoppingList");
const historyDoc = (key) => doc(db, "history", key);

// ── State ───────────────────────────────────────────────────────────────
let currentItems = [];   // [{id, name, checked, addedAt}]
let historyItems = [];   // [{id, name, count, lastAdded}]

// ── DOM refs ────────────────────────────────────────────────────────────
const addForm = document.getElementById("add-form");
const itemInput = document.getElementById("item-input");
const suggestionsBox = document.getElementById("suggestions");
const historyChips = document.getElementById("history-chips");
const historyEmpty = document.getElementById("history-empty");
const cartList = document.getElementById("cart-list");
const cartEmpty = document.getElementById("cart-empty");
const clearBtn = document.getElementById("clear-btn");
const cartCountBadge = document.getElementById("cart-count");
const connStatus = document.getElementById("conn-status");
const toast = document.getElementById("toast");
const tabs = document.querySelectorAll(".tab");
const screens = document.querySelectorAll(".screen");

// ── Toast helper ────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
}

// ── Tab navigation ──────────────────────────────────────────────────────
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    screens.forEach(s => s.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`screen-${tab.dataset.screen}`).classList.add("active");
  });
});

// ── Add item ────────────────────────────────────────────────────────────
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = itemInput.value.trim();
  if (!name) return;
  itemInput.value = "";
  hideSuggestions();
  await addItem(name);
});

// ── Catalog autocomplete ────────────────────────────────────────────────
function hideSuggestions() {
  suggestionsBox.classList.add("hidden");
  suggestionsBox.innerHTML = "";
}

function renderSuggestions(matches) {
  suggestionsBox.innerHTML = "";
  if (matches.length === 0) {
    hideSuggestions();
    return;
  }
  for (const item of matches) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "suggestion-row";
    row.innerHTML = `<span class="suggestion-icon">${item.icon}</span><span>${item.name}</span>`;
    row.addEventListener("mousedown", (e) => e.preventDefault()); // keep focus, avoid blur before click
    row.addEventListener("click", async () => {
      itemInput.value = "";
      hideSuggestions();
      await addItem(item.name);
    });
    suggestionsBox.appendChild(row);
  }
  suggestionsBox.classList.remove("hidden");
}

itemInput.addEventListener("input", () => {
  const q = itemInput.value.trim().toLowerCase();
  if (!q) {
    hideSuggestions();
    return;
  }
  const matches = catalog
    .filter(p => p.name.toLowerCase().includes(q))
    .slice(0, 8);
  renderSuggestions(matches);
});

itemInput.addEventListener("blur", () => {
  setTimeout(hideSuggestions, 150);
});

async function addItem(rawName) {
  if (!db) return showToast("Falta configuración — mira el README.md");
  const name = rawName.trim();
  if (!name) return;
  const key = name.toLowerCase();

  const alreadyInCart = currentItems.some(i => i.name.toLowerCase() === key);
  if (alreadyInCart) {
    showToast(`"${name}" ya está en la lista`);
    flashChip(key);
    return;
  }

  await addDoc(listCol(), { name, checked: false, addedAt: serverTimestamp() });

  const ref = historyDoc(key);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { count: increment(1), lastAdded: serverTimestamp(), name });
  } else {
    await setDoc(ref, { name, count: 1, lastAdded: serverTimestamp() });
  }

  showToast(`Añadido "${name}"`);
  flashChip(key);
}

function flashChip(key) {
  const chip = historyChips.querySelector(`[data-key="${CSS.escape(key)}"]`);
  if (chip) {
    chip.classList.add("just-added");
    setTimeout(() => chip.classList.remove("just-added"), 600);
  }
}

// ── Toggle checked ──────────────────────────────────────────────────────
async function toggleChecked(item) {
  await updateDoc(doc(db, "shoppingList", item.id), { checked: !item.checked });
}

// ── Remove single item ──────────────────────────────────────────────────
async function removeItem(item) {
  await deleteDoc(doc(db, "shoppingList", item.id));
}

// ── Clear whole list (two-tap confirm) ─────────────────────────────────
let confirmingClear = false;
let confirmTimer;
clearBtn.addEventListener("click", async () => {
  if (!confirmingClear) {
    confirmingClear = true;
    clearBtn.textContent = "Toca otra vez para confirmar";
    clearBtn.classList.add("confirming");
    confirmTimer = setTimeout(resetClearBtn, 3000);
    return;
  }
  resetClearBtn();
  const snap = await getDocs(listCol());
  await Promise.all(snap.docs.map(d => deleteDoc(doc(db, "shoppingList", d.id))));
  showToast("Lista vaciada");
});
function resetClearBtn() {
  confirmingClear = false;
  clearTimeout(confirmTimer);
  clearBtn.textContent = "Vaciar lista";
  clearBtn.classList.remove("confirming");
}

// ── Rendering ───────────────────────────────────────────────────────────
function renderCart() {
  cartList.innerHTML = "";
  if (currentItems.length === 0) {
    cartEmpty.classList.remove("hidden");
    clearBtn.classList.add("hidden");
  } else {
    cartEmpty.classList.add("hidden");
    clearBtn.classList.remove("hidden");
  }

  for (const item of currentItems) {
    const li = document.createElement("li");
    li.className = "cart-item" + (item.checked ? " checked" : "");

    const checkbox = document.createElement("div");
    checkbox.className = "checkbox";
    checkbox.textContent = item.checked ? "✓" : "";
    checkbox.addEventListener("click", () => toggleChecked(item));

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = item.name;
    name.addEventListener("click", () => toggleChecked(item));

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => removeItem(item));

    li.append(checkbox, name, removeBtn);
    cartList.appendChild(li);
  }

  const count = currentItems.length;
  if (count > 0) {
    cartCountBadge.textContent = count;
    cartCountBadge.classList.remove("hidden");
  } else {
    cartCountBadge.classList.add("hidden");
  }
}

function renderHistory() {
  historyChips.innerHTML = "";
  if (historyItems.length === 0) {
    historyEmpty.classList.remove("hidden");
    return;
  }
  historyEmpty.classList.add("hidden");

  const inCartKeys = new Set(currentItems.map(i => i.name.toLowerCase()));

  for (const h of historyItems) {
    const key = h.id;
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (inCartKeys.has(key) ? " in-cart" : "");
    chip.dataset.key = key;
    chip.textContent = h.name;
    chip.addEventListener("click", () => addItem(h.name));
    historyChips.appendChild(chip);
  }
}

// ── Firestore listeners ─────────────────────────────────────────────────
if (db) {
  onSnapshot(
    query(listCol(), orderBy("addedAt", "asc")),
    (snap) => {
      currentItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderCart();
      renderHistory();
      connStatus.classList.remove("offline");
      connStatus.classList.add("online");
    },
    (err) => {
      console.error(err);
      connStatus.classList.remove("online");
      connStatus.classList.add("offline");
      showToast("Error de conexión — revisa la configuración de Firestore");
    }
  );

  onSnapshot(
    query(collection(db, "history"), orderBy("count", "desc"), limit(15)),
    (snap) => {
      historyItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderHistory();
    }
  );
}

renderCart();
renderHistory();
