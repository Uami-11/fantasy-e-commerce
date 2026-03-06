import {ITEM_LIST} from "../../src/data.js"
import {generatePrice, formatPrice, costToGP} from "../../src/price.js"

const API_BASE = "https://www.dnd5eapi.co/api/2014";

let allItems = [];

async function fetchItem(ref){
  const url = `${API_BASE}/${ref.type}/${ref.index}`;
  const res = await fetch(url);
  const data = await res.json();


  const rarity = res.type === "equipment" ? "Common" : (data.rarity?.name || "Common");

  const priceGP = ref.type === "equipment" ? (costToGP(data.cost) ?? generatePrice(ref.index, "Common", ref.category)) : generatePrice(ref.index, rarity, ref.category);

  const desc = Array.isArray(data.desc) ? data.desc.join("\n\n") : (data.desc || "");

  return{
    index: ref.index,
    type: ref.type,
    category: ref.category,
    name: data.name,
    rarity: rarity,
    priceGP: priceGP,
    priceDisplay: formatPrice(priceGP),
    desc: desc
  };
}

async function loadAllItems(){
  document.querySelector("#item-count").textContent = "Loading items...";

  const results = await Promise.all(
    ITEM_LIST.map(ref => fetchItem(ref))
  );

  return results;
}

function renderCard(item){
  const categoryFolder = item.category.toLowerCase().replace(" ", "-");
  const imgSrc = `../../assets/items/${item.category}/${item.index}.jpeg`

  const detailURL = `../product/product.html?type+${item.type}&index=${item.index}`;

  return `
  <div class="product_card">
    <div style="width:auto; height:200px; overflow:hidden; background:#f5f5f5; position:relative;">
      <a href="${detailURL}">
        <img 
          src="${imgSrc}" 
          alt="${item.name}"
          onerror="this.src='../../assets/general/placeholder.png'"
          style="width:100%; height:100%; object-fit:contain; padding:8px;"
        >
      </a>
  <button 
    class="wishlist-btn"
    data-index="${item.index}"
    onclick="handleWishlist(this)">♡</button>
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
      <p>${item.desc || 'No description available.'}</p>
    </div>

    <button class="desc-toggle" onclick="toggleDesc(this)">^ Description</button>
    
  </div>
`;
}

function renderGrid(items){
  const grid = document.querySelector("#grid");
  const count = document.querySelector("#item-count");

  if (items.length === 0){
    grid.innerHTML = `<p>No items match your filters.</p>`
    count.textContent = `0 items`;
    return;
  }


  grid.innerHTML = items.map(item => renderCard(item)).join('');
  count.textContent = `${items.length} items`;
}

function applyFilters(){
  const searchQuery = document.querySelector("#search-input").value.toLowerCase();
  const minPrice = parseFloat(document.querySelector("#price-min").value) || 0;
  const maxPrice = parseFloat(document.querySelector("#price-max").value) || Infinity;
  const sortValue = document.querySelector("#sort-select").value;


  const checkedRarities = [...document.querySelectorAll("input[name='rarity']:checked")].map(cb => cb.value);

  const checkedCategories = [...document.querySelectorAll("input[name='category']:checked")].map(cb => cb.value);

  let filtered = allItems.slice();

  if (searchQuery){
    filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery));
  }

  filterd = filtered.filter(item => item.priceGP >= minPrice && item.priceGP <= maxPrice);

  if (checkedRarities.length > 0){
    filtered = filtered.filter(item => checkedRarities.includes(item.rarity));
  }

  if (checkedCategories.length > 0){
    filtered = filtered.filter(item => checkedCategories.includes(item.category));
  }

  const RARITY_ORDER = {"Common": 0, "Uncommon": 1, "Rare": 2, "Very Rare": 3, "Legendary": 4};


  filtered.sort((a, b) => {
    if (sortValue == "name-asc")
      a.name.localeCompare(b.name);

    if (sortValue == "name-desc")
      a.name.localeCompare(a.name);

    if (sortValue == "price-asc")
      return a.priceGP - b.priceGP;

    if (sortValue == "price-desc")
      return b.priceGP - a.priceGP;

    if (sortValue == "rarity-asc")
      return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];

    if (sortValue == "rarity-desc")
      return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];

    return 0

  });

  renderGrid(filtered);
}

// --- localStorage helpers ---
// localStorage stores everything as strings, so we JSON.stringify when saving
// and JSON.parse when reading

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist') || '[]');
}
function saveWishlist(wl) {
  localStorage.setItem('wishlist', JSON.stringify(wl));
}

// Update the number badges in the header
function updateHeaderCounts() {
  const cart     = getCart();
  const wishlist = getWishlist();
  // Sum up quantities (someone might have added 3 of an item)
  const cartTotal = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.getElementById('cart-count').textContent = cartTotal;
  document.getElementById('wl-count').textContent   = wishlist.length;
}

// Called when clicking "Add to Cart"
// 'btn' is the button element that was clicked
// Called when clicking the heart ♡ button
window.handleWishlist = function(btn) {
  const index = btn.dataset.index;
  const item  = allItems.find(i => i.index === index);
  if (!item) return;

  let wishlist = getWishlist();
  const idx    = wishlist.findIndex(i => i.index === index);

  if (idx >= 0) {
    // Already in wishlist — remove it
    wishlist.splice(idx, 1);
    btn.textContent = '♡';
  } else {
    // Add it
    wishlist.push({
      index:        item.index,
      name:         item.name,
      type:         item.type,
      category:     item.category,
      rarity:       item.rarity,
      priceGP:      item.priceGP,
      priceDisplay: item.priceDisplay,
    });
    btn.textContent = '♥';
  }

  saveWishlist(wishlist);
  updateHeaderCounts();
};


// Toggle the description block below the card
window.toggleDesc = function(btn) {
  const desc = btn.previousElementSibling; // the .card-desc div right above the button
  const isOpen = desc.style.display !== 'none';
  desc.style.display = isOpen ? 'none' : 'block';
  btn.textContent    = isOpen ? '▾ Description' : '▴ Description';
};

document.querySelector("#search-input").addEventListener("input", applyFilters);
document.querySelector("#price-min").addEventListener("input", applyFilters);
document.querySelector("#price-max").addEventListener("input", applyFilters);
document.querySelector("#sort-select").addEventListener("change", applyFilters);


document.querySelectorAll("input[name='rarity']").forEach(element => {
  element.addEventListener("change", applyFilters);
});

document.querySelectorAll("input[name='category']").forEach(element => {
  element.addEventListener("change", applyFilters);
});

document.querySelector("#reset-btn").addEventListener("click", () => {
  document.querySelector("#search-input").value = "";
  document.querySelector("#price-min").value = "";
  document.querySelector("#price-max").value = "";
  document.querySelector("#sort-select").value = "name-asc";

  document.querySelectorAll("input[name='rarity']").foreach(element => element.checeked = false);
  document.querySelectorAll("input[name='category']").foreach(element => element.checeked = false);
  
  applyFilters();
  
});


(async function init() {
  try {
    allItems = await loadAllItems();
    renderGrid(allItems);
    updateHeaderCounts();
    // Mark wishlist items with filled hearts
    const wishlist = getWishlist();
    wishlist.forEach(wlItem => {
      const btn = document.querySelector(`.wishlist-btn[data-index="${wlItem.index}"]`);
      if (btn) btn.textContent = '♥';
    });

  }
  catch(error){
    console.error('Failed to load items:', error);
    document.getElementById('item-count').textContent = 'Failed to load. Check your connection.';
  }
})();


// Add this near your other window functions
window.toggleAdvanced = function() {
  const panel = document.getElementById('advanced-panel');
  const btn   = document.getElementById('advanced-btn');
  const isOpen = panel.style.display !== 'none';

  panel.style.display = isOpen ? 'none' : 'block';
  btn.textContent     = isOpen ? 'Advanced ▾' : 'Advanced ▴'; // arrow flips
};