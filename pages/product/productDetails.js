import {ITEM_LIST} from '../../src/data.js';
import { generatePrice, formatPrice, costToGP } from '../../src/price.js';

const API_BASE = 'https://www.dnd5eapi.co/api/2014';

// Reading the url
// URL looks like: product.html?type=magic-items&index=bag-of-holding
const params = new URLSearchParams(window.location.search);
const type   = params.get('type');
const index  = params.get('index');

// localStorage functions
function getCart()        { return JSON.parse(localStorage.getItem('cart')     || '[]'); }
function saveCart(c)      { localStorage.setItem('cart', JSON.stringify(c)); }
function getWishlist()    { return JSON.parse(localStorage.getItem('wishlist') || '[]'); }
function saveWishlist(wl) { localStorage.setItem('wishlist', JSON.stringify(wl)); }

function updateHeaderCounts() {
  const total = getCart().reduce((s, i) => s + (i.quantity || 1), 0);
  document.getElementById('cart-count').textContent = total;
  document.getElementById('wl-count').textContent   = getWishlist().length;
}

// loading item details
async function loadItem() {
  if (!type || !index) { showError(); return; }

  try {
    const res  = await fetch(`${API_BASE}/${type}/${index}`);
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();

    // Get category from your item list
    const ref      = ITEM_LIST.find(i => i.index === index);
    const category = ref?.category || 'Equipment';

    const rarity  = type === 'equipment' ? 'Common' : (data.rarity?.name || 'Common');
    const priceGP = type === 'equipment'
      ? (costToGP(data.cost) ?? generatePrice(index, 'Common', category))
      : generatePrice(index, rarity, category);

    const item = {
      index, type, category,
      name:         data.name,
      rarity,
      priceGP,
      priceDisplay: formatPrice(priceGP),
      // desc from the API is an array
      descLines:    Array.isArray(data.desc) ? data.desc : (data.desc ? [data.desc] : []),
    };

    displayItem(item);
    window.__currentItem = item;

  } catch (err) {
    console.error(err);
    showError();
  }
}

function displayItem(item) {
  document.title = `${item.name} — Green's Shop`;

  document.getElementById('detail-name').textContent     = item.name;
  document.getElementById('detail-category').textContent = item.category;
  document.getElementById('detail-rarity').textContent   = item.rarity;
  document.getElementById('detail-price').textContent    = item.priceDisplay;

  const img    = document.getElementById('detail-img');
  const folder = item.category.toLowerCase().replace(' ', '-');
  img.src = `../../assets/items/${folder}/${item.index}.jpeg`;
  console.log(img.src);
  img.alt = item.name;

  // Description — render each string in the array as a bullet point
  const descEl = document.getElementById('detail-desc');
  if (item.descLines.length === 0) {
    descEl.textContent = 'No description available.';
  } else {
    const ul = document.createElement('ul');
    ul.style.paddingLeft = '20px';
    ul.style.display = 'flex';
    ul.style.flexDirection = 'column';
    ul.style.gap = '8px';

    item.descLines.forEach(line => {
      const li = document.createElement('li');
      li.textContent = line;
      ul.appendChild(li);
    });

    descEl.appendChild(ul);
  }

  // Check wishlist state and set heart accordingly
  const inWL = getWishlist().some(i => i.index === item.index);
  document.getElementById('wishlist-btn').textContent = inWL ? '♥' : '♡';

  // Show the content, hide loading
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('detail-content').style.display = 'block';
}

function showError() {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('error-state').style.display   = 'block';
}

// Buttons
window.changeQty = function(delta) {
  const input = document.getElementById('qty-input');
  input.value = Math.max(1, Math.min(99, parseInt(input.value) + delta));
};

window.handleAddToCart = function() {
  const item = window.__currentItem;
  if (!item) return;

  const qty  = parseInt(document.getElementById('qty-input').value) || 1;
  const cart = getCart();
  const ex   = cart.find(i => i.index === item.index);

  if (ex) {
    ex.quantity = (ex.quantity || 1) + qty;
  } else {
    cart.push({
      index:        item.index,
      name:         item.name,
      type:         item.type,
      category:     item.category,
      rarity:       item.rarity,
      priceGP:      item.priceGP,
      priceDisplay: item.priceDisplay,
      quantity:     qty,
    });
  }

  saveCart(cart);
  updateHeaderCounts();

  const btn = document.getElementById('add-cart-btn');
  btn.textContent = '✓ Added to Cart!';
  setTimeout(() => btn.textContent = 'Add to Cart', 1800);
};

window.handleWishlist = function() {
  const item = window.__currentItem;
  if (!item) return;

  let wl  = getWishlist();
  const i = wl.findIndex(x => x.index === item.index);
  const btn = document.getElementById('wishlist-btn');

  if (i >= 0) {
    wl.splice(i, 1);
    btn.textContent = '♡';
  } else {
    wl.push({
      index: item.index, name: item.name, type: item.type,
      category: item.category, rarity: item.rarity,
      priceGP: item.priceGP, priceDisplay: item.priceDisplay,
    });
    btn.textContent = '♥';
  }

  saveWishlist(wl);
  updateHeaderCounts();
};

updateHeaderCounts();
loadItem();

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const tag     = document.activeElement.tagName;
  const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

  // + or = → increase qty (= is the unshifted + key)
  if ((e.key === '+' || e.key === '=') && !inInput) {
    e.preventDefault();
    changeQty(1);
    return;
  }

  // - → decrease qty
  if (e.key === '-' && !inInput) {
    e.preventDefault();
    changeQty(-1);
    return;
  }

  // Alt + C → add to cart
  if (e.altKey && (e.key === 'c' || e.key === 'C')) {
    e.preventDefault();
    handleAddToCart();
    return;
  }

  // Alt + W → toggle wishlist
  if (e.altKey && (e.key === 'w' || e.key === 'W')) {
    e.preventDefault();
    handleWishlist();
    return;
  }
});