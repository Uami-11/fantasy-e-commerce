import { ITEM_LIST } from "../../src/data.js";
import { generatePrice, formatPrice, costToGP } from "../../src/price.js";

const API_BASE = "https://www.dnd5eapi.co/api/2014";

let allItems = [];

async function fetchItem(ref) {
  const url  = `${API_BASE}/${ref.type}/${ref.index}`;
  const res  = await fetch(url);
  const data = await res.json();

  // BUG 1 FIX: was res.type (the HTTP response), should be ref.type (your item ref)
  const rarity = ref.type === "equipment"
    ? "Common"
    : (data.rarity?.name || "Common");

  const priceGP = ref.type === "equipment"
    ? (costToGP(data.cost) ?? generatePrice(ref.index, "Common", ref.category))
    : generatePrice(ref.index, rarity, ref.category);

  const desc = Array.isArray(data.desc)
    ? data.desc.join("\n\n")
    : (data.desc || "");

  return {
    index:        ref.index,
    type:         ref.type,
    category:     ref.category,
    name:         data.name,
    rarity:       rarity,
    priceGP:      priceGP,
    priceDisplay: formatPrice(priceGP),
    desc:         desc,
  };
}

async function loadAllItems() {
  document.querySelector("#item-count").textContent = "Loading items...";
  const results = await Promise.all(ITEM_LIST.map(ref => fetchItem(ref)));
  return results;
}

function renderCard(item) {
  // BUG 5 FIX: use categoryFolder variable, not item.category directly
  const categoryFolder = item.category.toLowerCase().replace(" ", "-");
  const imgSrc         = `../../assets/items/${categoryFolder}/${item.index}.jpeg`;
  const detailURL      = `../product/product.html?type=${item.type}&index=${item.index}`;

  return `
    <div class="product-card">

      <div class="card-img-zone">
        <a href="${detailURL}">
          <img
            src="${imgSrc}"
            alt="${item.name}"
            onerror="this.src='../../assets/general/placeholder.png'"
          >
        </a>
        <button
          class="wishlist-btn"
          data-index="${item.index}"
          onclick="handleWishlist(this)"
        >♡</button>
      </div>

      <div class="card-info">
        <span class="card-category">${item.category}</span>
        <h3 class="card-name">
          <a href="${detailURL}">${item.name}</a>
        </h3>
        <span class="card-rarity">${item.rarity}</span>
        <span class="card-price">${item.priceDisplay}</span>
      </div>

      <div class="card-desc" style="display:none">
        <p>${item.desc || "No description available."}</p>
      </div>
      <button class="desc-toggle" onclick="toggleDesc(this)">▾ Description</button>

    </div>
  `;
}

function renderGrid(items) {
  const grid  = document.querySelector("#grid");
  const count = document.querySelector("#item-count");

  if (items.length === 0) {
    grid.innerHTML    = `<p>No items match your filters.</p>`;
    count.textContent = `0 items`;
    return;
  }

  grid.innerHTML    = items.map(item => renderCard(item)).join("");
  count.textContent = `${items.length} items`;
}

function applyFilters() {
  const searchQuery = document.querySelector("#search-input").value.toLowerCase();
  const minPrice    = parseFloat(document.querySelector("#price-min").value) || 0;
  const maxPrice    = parseFloat(document.querySelector("#price-max").value) || Infinity;
  const sortValue   = document.querySelector("#sort-select").value;

  const checkedRarities   = [...document.querySelectorAll("input[name='rarity']:checked")]
                              .map(cb => cb.value);
  const checkedCategories = [...document.querySelectorAll("input[name='category']:checked")]
                              .map(cb => cb.value);

  let filtered = allItems.slice();

  if (searchQuery) {
    filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery));
  }

  // BUG 2 FIX: was "filterd" (typo) — the price filter was silently doing nothing
  filtered = filtered.filter(item => item.priceGP >= minPrice && item.priceGP <= maxPrice);

  if (checkedRarities.length > 0) {
    filtered = filtered.filter(item => checkedRarities.includes(item.rarity));
  }

  if (checkedCategories.length > 0) {
    filtered = filtered.filter(item => checkedCategories.includes(item.category));
  }

  const RARITY_ORDER = { "Common": 0, "Uncommon": 1, "Rare": 2, "Very Rare": 3, "Legendary": 4 };

  // BUG 3 FIX: all branches need "return", and name-desc was comparing a to a not b
  filtered.sort((a, b) => {
    if (sortValue === "name-asc")    return a.name.localeCompare(b.name);
    if (sortValue === "name-desc")   return b.name.localeCompare(a.name);
    if (sortValue === "price-asc")   return a.priceGP - b.priceGP;
    if (sortValue === "price-desc")  return b.priceGP - a.priceGP;
    if (sortValue === "rarity-asc")  return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
    if (sortValue === "rarity-desc") return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
    return 0;
  });

  renderGrid(filtered);
}

// ── localStorage helpers ───────────────────────────────────────
function getCart()        { return JSON.parse(localStorage.getItem("cart")     || "[]"); }
function saveCart(cart)   { localStorage.setItem("cart", JSON.stringify(cart)); }
function getWishlist()    { return JSON.parse(localStorage.getItem("wishlist") || "[]"); }
function saveWishlist(wl) { localStorage.setItem("wishlist", JSON.stringify(wl)); }

function updateHeaderCounts() {
  const cartTotal = getCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.getElementById("cart-count").textContent = cartTotal;
  document.getElementById("wl-count").textContent   = getWishlist().length;
}

window.handleWishlist = function(btn) {
  const index = btn.dataset.index;
  const item  = allItems.find(i => i.index === index);
  if (!item) return;

  let wishlist = getWishlist();
  const idx    = wishlist.findIndex(i => i.index === index);

  if (idx >= 0) {
    wishlist.splice(idx, 1);
    btn.textContent = "♡";
  } else {
    wishlist.push({
      index:        item.index,
      name:         item.name,
      type:         item.type,
      category:     item.category,
      rarity:       item.rarity,
      priceGP:      item.priceGP,
      priceDisplay: item.priceDisplay,
    });
    btn.textContent = "♥";
  }

  saveWishlist(wishlist);
  updateHeaderCounts();
};

window.toggleDesc = function(btn) {
  const desc   = btn.previousElementSibling;
  const isOpen = desc.style.display !== "none";
  desc.style.display = isOpen ? "none" : "block";
  btn.textContent    = isOpen ? "▾ Description" : "▴ Description";
};

window.toggleAdvanced = function() {
  const panel  = document.getElementById("advanced-panel");
  const btn    = document.getElementById("advanced-btn");
  const isOpen = panel.style.display !== "none";
  panel.style.display = isOpen ? "none" : "block";
  btn.textContent     = isOpen ? "Advanced ▾" : "Advanced ▴";
};

// ── Event listeners ────────────────────────────────────────────
// "input" fires on every keystroke — this is what makes search live
document.querySelector("#search-input").addEventListener("input",  applyFilters);
document.querySelector("#price-min").addEventListener("input",     applyFilters);
document.querySelector("#price-max").addEventListener("input",     applyFilters);
document.querySelector("#sort-select").addEventListener("change",  applyFilters);
document.querySelectorAll("input[name='rarity']").forEach(el   => el.addEventListener("change", applyFilters));
document.querySelectorAll("input[name='category']").forEach(el => el.addEventListener("change", applyFilters));

document.querySelector("#reset-btn").addEventListener("click", () => {
  document.querySelector("#search-input").value = "";
  document.querySelector("#price-min").value    = "";
  document.querySelector("#price-max").value    = "";
  document.querySelector("#sort-select").value  = "name-asc";

  // BUG 4 FIX: was "foreach" (lowercase) and "checeked" (typo)
  document.querySelectorAll("input[name='rarity']").forEach(el   => el.checked = false);
  document.querySelectorAll("input[name='category']").forEach(el => el.checked = false);

  applyFilters();
});

// ── Init ───────────────────────────────────────────────────────
(async function init() {
  try {
    allItems = await loadAllItems();
    renderGrid(allItems);
    updateHeaderCounts();

    const wishlist = getWishlist();
    wishlist.forEach(wlItem => {
      const btn = document.querySelector(`.wishlist-btn[data-index="${wlItem.index}"]`);
      if (btn) btn.textContent = "♥";
    });

  } catch (error) {
    console.error("Failed to load items:", error);
    document.getElementById("item-count").textContent = "Failed to load. Check your connection.";
  }
})();