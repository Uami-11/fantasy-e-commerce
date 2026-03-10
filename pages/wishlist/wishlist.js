import { formatPrice } from '../../src/price.js';

// localStorage functions
function getWishlist()    { return JSON.parse(localStorage.getItem('wishlist') || '[]'); }
function saveWishlist(wl) { localStorage.setItem('wishlist', JSON.stringify(wl)); }
function getCart()        { return JSON.parse(localStorage.getItem('cart')     || '[]'); }
function saveCart(c)      { localStorage.setItem('cart', JSON.stringify(c)); }

function updateHeaderCounts() {
  const total = getCart().reduce((s, i) => s + (i.quantity || 1), 0);
  document.getElementById('cart-count').textContent = total;
  document.getElementById('wl-count').textContent   = getWishlist().length;
}

// Selection function

function getSelectedIndexes() {
  return [...document.querySelectorAll('.row-check:checked')]
    .map(cb => cb.dataset.index)
    .filter(Boolean); // master checkbox has no data-index, filter it out
}

function updateSelectedCount() {
  const count = getSelectedIndexes().length;
  document.getElementById('wl-selected-count').textContent =
    `${count} selected`;

  const allBoxes = document.querySelectorAll('.row-check[data-index]');
  const master   = document.getElementById('master-check');
  master.checked = allBoxes.length > 0 && count === allBoxes.length;
}

// Redner
function render() {
  const wl      = getWishlist();
  const empty   = document.getElementById('wl-empty');
  const content = document.getElementById('wl-content');
  const tbody   = document.getElementById('wl-body');

  if (wl.length === 0) {
    empty.style.display   = 'block';
    content.style.display = 'none';
    return;
  }
  empty.style.display   = 'none';
  content.style.display = 'block';

  tbody.innerHTML = wl.map(item => {
    const folder    = item.category.toLowerCase().replace(' ', '-');
    const imgSrc    = `../../assets/items/${folder}/${item.index}.jpeg`;
    const detailURL = `../product/product.html?type=${item.type}&index=${item.index}`;

    return `
      <tr class="wl-row" data-index="${item.index}">

        <td class="col-check">
          <input
            type="checkbox"
            class="row-check"
            data-index="${item.index}"
            onchange="updateSelectedCount()"
          >
        </td>

        <td class="col-item">
          <div class="wl-item-cell">
            <img
              class="wl-item-img"
              src="${imgSrc}"
              alt="${item.name}"
              onerror="this.src='../../assets/general/placeholder.png'"
            >
            <div class="wl-item-info">
              <a href="${detailURL}" class="wl-item-name">${item.name}</a>
              <span class="wl-item-cat">${item.category}</span>
            </div>
          </div>
        </td>

        <td class="col-price">${item.priceDisplay}</td>

        <td class="col-rarity">${item.rarity}</td>

        <td class="col-remove">
          <button class="btn-remove" onclick="removeFromWishlist('${item.index}')">✕</button>
        </td>

      </tr>`;
  }).join('');

  updateSelectedCount();
}

// Select and deselect
document.getElementById('master-check').addEventListener('change', function() {
  document.querySelectorAll('.row-check[data-index]')
    .forEach(cb => cb.checked = this.checked);
  updateSelectedCount();
});

document.getElementById('btn-select-all').addEventListener('click', () => {
  document.querySelectorAll('.row-check[data-index]')
    .forEach(cb => cb.checked = true);
  updateSelectedCount();
});

document.getElementById('btn-deselect-all').addEventListener('click', () => {
  document.querySelectorAll('.row-check[data-index]')
    .forEach(cb => cb.checked = false);
  updateSelectedCount();
});

// Adding to cart
document.getElementById('btn-add-selected').addEventListener('click', () => {
  const selected = getSelectedIndexes();
  if (selected.length === 0) return;

  const wl   = getWishlist();
  const cart = getCart();

  selected.forEach(index => {
    const item = wl.find(i => i.index === index);
    if (!item) return;

    const existing = cart.find(c => c.index === index);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
  });

  // Remove those items from the wishlist
  const newWL = wl.filter(i => !selected.includes(i.index));

  saveCart(cart);
  saveWishlist(newWL);
  updateHeaderCounts();
  render();
});

// Removing a singel item
window.removeFromWishlist = function(index) {
  saveWishlist(getWishlist().filter(i => i.index !== index));
  updateHeaderCounts();
  render();
};

window.updateSelectedCount = updateSelectedCount;

updateHeaderCounts();
render();


// Keyboard shortcuts

document.addEventListener('keydown', (e) => {
  const tag     = document.activeElement.tagName;
  const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  if (inInput) return;

  if (e.shiftKey && !e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('btn-select-all').click();
    return;
  }

  if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('btn-add-selected').click();
    return;
  }

  if (e.key === 'Delete') {
    e.preventDefault();
    document.getElementById('btn-deselect-all').click();
    return;
  }
});