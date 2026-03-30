// ── Load data ──
async function loadProducts() {
  const response = await fetch('database.json');
  return await response.json();
}


// ─── Wishlist helpers ───
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
}

function saveWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function removeFromWishlist(id) {
  saveWishlist(getWishlist().filter(i => i !== id));
}


// ─── Render ────
async function renderWishlist() {
  const wishlistIds = getWishlist();
  const gridEl = document.getElementById('wishlist-grid');
  const emptyEl = document.getElementById('empty-wishlist');
  const countEl = document.getElementById('item-count');
  
  if (wishlistIds.length === 0) {
    emptyEl.style.display = 'block';
    gridEl.style.display = 'none';
    countEl.textContent = '';
    return;
  }
  
  // Load database to get product details
  const allProducts = await loadProducts();
  
  const items = wishlistIds
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean);
  
  if (items.length === 0) {
    emptyEl.style.display = 'block';
    gridEl.style.display = 'none';
    countEl.textContent = '';
    return;
  }
  
  emptyEl.style.display = 'none';
  gridEl.style.display = '';
  countEl.textContent = items.length + ' item' + (items.length > 1 ? 's' : '');
  
  gridEl.innerHTML = items.map(product => `
    <div class="col">
      <div class="wish-card card rounded-4 w-100 position-relative" data-id="${product.id}"
        onclick="window.location.href='product.html?id=${product.id}'">

        <!-- Remove button -->
        <button class="wish-remove-btn" title="Remove from wishlist"
          onclick="event.stopPropagation(); handleRemove(${product.id}, this)">
          <i class="bi bi-x"></i>
        </button>

        <img src="${product.url}" class="card-img-top rounded-4"
          style="height:200px; object-fit:cover;"
          alt="${product.name}"
          onerror="this.src='https://picsum.photos/300/351'">
        <div class="card-body p-2">
          <p class="card-text mb-0" style="font-size:0.9rem;">${product.name}</p>
          <p class="card-text" style="color:#FF6435; font-size:0.85rem;">${product.price}</p>
        </div>
      </div>
    </div>
  `).join('');
}


// ─── Remove with animation ───
function handleRemove(id, btn) {
  const cardEl = btn.closest('.wish-card');
  cardEl.classList.add('removing');
  setTimeout(() => {
    removeFromWishlist(id);
    renderWishlist();
  }, 300);
}


// ─── Init ────
document.addEventListener('DOMContentLoaded', renderWishlist);