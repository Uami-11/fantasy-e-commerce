document.addEventListener('keydown', (e) => {
  // Ignore if the user is focused on any input, textarea, or select
  const tag = document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

  // Ignore if any modifier key is held (so alt+c for add-to-cart still works)
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  if (e.key === 'w' || e.key === 'W') {
    window.location.href = '../wishlist/wishlist.html';
  }

  if (e.key === 'c' || e.key === 'C') {
    window.location.href = '../cart/cart.html';
  }
});