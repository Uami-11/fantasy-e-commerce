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

  const desc = Array.IsArray(data.desc) ? data.desc.join("\n\n") : (data.desc || "");

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
  const imgSrc = `../../assets/${category}`

  const detailURL = `../product/product.html?type+${item.type}&index=${item.index}`;

  return `
  <div class="product_card">
    <a href="${detailURL}">

      <img src="${imgSrc}" alt="${item.name}">
    </a>

    <div class="card-info">

      <span class="card-category">${item.category}</span>
      <h3 class="card-name">

        <a href="${detailURL}">${item.name}</a>
      </h3>
      <span class="card-rarity">${item.rarity}</span>
      <span class="card-price">${item.priceDisplay}</span>
    </div>

    <div class="card-actions">
      <div class="qty-control">
        <button onclick="changeQty(this, -1)">-</button>
        <input type="number" class="qty-input" value="1" min="1" max="99" readonly>
        <button onclick="changeQty(this, 1)">+</button>
      </div>

      <button class="add-cart-btn" data-index="${item.index}" onclick="handleAddToCart(this)">
        Add to Cart
      </button>
      <button class="wishlist-btn" data-index="${item.index}" onclick="handleWishlist(this)">heart</button>


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

document.querySelector("#reset-btn").addEventListener("click" () => {
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
    // #updateHeaderCounts();

  }
  catch(error){
    console.error('Failed to load items: ' error);
  }
})();


