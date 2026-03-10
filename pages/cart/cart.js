import { formatPrice } from '../../src/price.js';

// Local Storage Functions
function getCart()        { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(c)      { localStorage.setItem('cart', JSON.stringify(c)); }
function getWishlist()    { return JSON.parse(localStorage.getItem('wishlist') || '[]'); }

function updateHeaderCounts() {
  const total = getCart().reduce((s, i) => s + (i.quantity || 1), 0);
  document.getElementById('cart-count').textContent = total;
  document.getElementById('wl-count').textContent   = getWishlist().length;
}

// Rendering items
function render() {
  const cart    = getCart();
  const empty   = document.getElementById('cart-empty');
  const content = document.getElementById('cart-content');
  const tbody   = document.getElementById('cart-body');

  // Toggle which section is visible
  if (cart.length === 0) {
    empty.style.display   = 'block';
    content.style.display = 'none';
    return;
  }
  empty.style.display   = 'none';
  content.style.display = 'grid';

  // Build each row
  tbody.innerHTML = cart.map(item => {
    const folder   = item.category.toLowerCase().replace(' ', '-');
    const imgSrc   = `../../assets/items/${folder}/${item.index}.jpeg`;
    const subtotal = formatPrice(item.priceGP * (item.quantity || 1));
    const detailURL = `../product/product.html?type=${item.type}&index=${item.index}`;

    return `
      <tr class="cart-row" data-index="${item.index}">

        <td class="col-item">
          <div class="cart-item-cell">
            <img
              class="cart-item-img"
              src="${imgSrc}"
              alt="${item.name}"
              onerror="this.src='../../assets/general/placeholder.png'"
            >
            <div class="cart-item-info">
              <a href="${detailURL}" class="cart-item-name">${item.name}</a>
              <span class="cart-item-cat">${item.category}</span>
              <span class="cart-item-rarity">${item.rarity}</span>
            </div>
          </div>
        </td>

        <td class="col-price">${item.priceDisplay}</td>

        <td class="col-qty">
          <div class="qty-control">
            <button onclick="changeQty('${item.index}', -1)">−</button>
            <input
              type="number"
              value="${item.quantity || 1}"
              min="1"
              max="99"
              readonly
              class="qty-input"
              data-index="${item.index}"
            >
            <button onclick="changeQty('${item.index}', 1)">+</button>
          </div>
        </td>

        <td class="col-subtotal">${subtotal}</td>

        <td class="col-remove">
          <button class="btn-remove" onclick="removeItem('${item.index}')">✕</button>
        </td>

      </tr>`;
  }).join('');

  // Update summary
  const totalQty = cart.reduce((s, i) => s + (i.quantity || 1), 0);
  const totalGP  = cart.reduce((s, i) => s + i.priceGP * (i.quantity || 1), 0);

  document.getElementById('summary-count').textContent = `${totalQty} item${totalQty !== 1 ? 's' : ''}`;
  document.getElementById('summary-total').textContent = formatPrice(totalGP);
}

// Quantity Change
window.changeQty = function(index, delta) {
  const cart = getCart();
  const item = cart.find(i => i.index === index);
  if (!item) return;

  item.quantity = Math.max(1, Math.min(99, (item.quantity || 1) + delta));
  saveCart(cart);
  updateHeaderCounts();
  render();
};

// Remove item
window.removeItem = function(index) {
  const cart = getCart().filter(i => i.index !== index);
  saveCart(cart);
  updateHeaderCounts();
  render();
};

// Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
  const cart     = getCart();
  const totalGP  = cart.reduce((s, i) => s + i.priceGP * (i.quantity || 1), 0);
  const totalQty = cart.reduce((s, i) => s + (i.quantity || 1), 0);

  document.getElementById('modal-confirm-text').textContent =
    `You are purchasing ${totalQty} item${totalQty !== 1 ? 's' : ''} for ${formatPrice(totalGP)}. Confirm?`;

  document.getElementById('checkout-modal').style.display = 'flex';
});

document.getElementById('btn-confirm').addEventListener('click', () => {
  // Clear the cart
  saveCart([]);
  updateHeaderCounts();

  // Hide confirm modal, show success modal
  document.getElementById('checkout-modal').style.display = 'none';
  document.getElementById('success-modal').style.display  = 'flex';
});

document.getElementById('btn-cancel').addEventListener('click', () => {
  document.getElementById('checkout-modal').style.display = 'none';
});

// Close modal if user clicks the dark backdrop
document.getElementById('checkout-modal').addEventListener('click', function(e) {
  if (e.target === this) this.style.display = 'none';
});


updateHeaderCounts();
render();


// Keyboard shortcuts

document.addEventListener('keydown', (e) => {
  const tag     = document.activeElement.tagName;
  const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  if (inInput) return;

  const checkoutModal = document.getElementById('checkout-modal');
  const successModal  = document.getElementById('success-modal');
  const modalOpen     = checkoutModal.style.display === 'flex';
  const successOpen   = successModal.style.display  === 'flex';

  if (e.key === 'Enter') {
    e.preventDefault();

    if (modalOpen) {
      document.getElementById('btn-confirm').click();
    } else if (!successOpen) {
      document.getElementById('checkout-btn').click();
    }
    return;
  }

  if (e.key === 'Escape') {
    if (modalOpen) {
      e.preventDefault();
      document.getElementById('btn-cancel').click();
    }
    return;
  }
});