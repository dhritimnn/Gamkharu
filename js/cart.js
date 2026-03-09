// ─── Cart helpers ─────────────────────────────────────────────────────────────

function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
}

// ─── Parse price ──────────────────────────────────────────────────────────────

function parsePrice(priceStr) {
  return parseFloat(String(priceStr).replace(/[^0-9.]/g, '')) || 0;
}

// ─── Render cart ──────────────────────────────────────────────────────────────

function renderCart() {
  const cart = getCart();
  const listEl = document.getElementById('cart-list');
  const emptyEl = document.getElementById('empty-cart');
  const summaryEl = document.getElementById('cart-summary');
  const buyEl = document.getElementById('buy-section');
  const countEl = document.getElementById('item-count');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  
  if (cart.length === 0) {
    emptyEl.style.display = 'block';
    listEl.style.display = 'none';
    summaryEl.style.display = 'none';
    buyEl.style.display = 'none';
    countEl.textContent = '';
    return;
  }
  
  emptyEl.style.display = 'none';
  listEl.style.display = 'block';
  summaryEl.style.display = 'block';
  buyEl.style.display = 'block';
  countEl.textContent = cart.length + ' item' + (cart.length > 1 ? 's' : '');
  
  listEl.innerHTML = cart.map(item => `
    <div class="cart-item d-flex align-items-center gap-3 p-3 mb-2 rounded-4 bg-white shadow-sm" data-id="${item.id}">
      <img src="${item.url}" onerror="this.src='https://picsum.photos/80/80'"
        style="width:72px; height:72px; object-fit:cover; border-radius:12px; flex-shrink:0;">
      <div class="flex-grow-1">
        <p class="mb-0 fw-semibold" style="font-size:0.95rem;">${item.name}</p>
        <p class="mb-0" style="color:#FF6435; font-size:0.9rem;">${item.price}</p>
      </div>
      <button class="remove-btn" onclick="handleRemove(${item.id}, this)" title="Remove">
        <i class="bi bi-trash3"></i>
      </button>
    </div>
  `).join('');
  
  // Calculate total
  const total = cart.reduce((sum, item) => sum + parsePrice(item.price), 0);
  subtotalEl.textContent = '₹' + total.toLocaleString('en-IN');
  totalEl.textContent = '₹' + total.toLocaleString('en-IN');
}

// ─── Remove with animation ────────────────────────────────────────────────────

function handleRemove(id, btn) {
  const itemEl = btn.closest('.cart-item');
  itemEl.classList.add('removing');
  setTimeout(() => {
    removeFromCart(id);
    renderCart();
  }, 300);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', renderCart);