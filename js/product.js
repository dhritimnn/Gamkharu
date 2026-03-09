// ─── Load database ────────────────────────────────────────────────────────────

async function loadDatabase() {
  const response = await fetch('database.json');
  return await response.json();
}

// ─── Cart helpers (localStorage) ─────────────────────────────────────────────

function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function isInCart(id) {
  return getCart().some(item => item.id === id);
}

function addToCart(product) {
  const cart = getCart();
  if (!isInCart(product.id)) {
    cart.push({ id: product.id, name: product.name, price: product.price, url: product.url });
    saveCart(cart);
  }
}

// ─── Wishlist helpers (localStorage) ─────────────────────────────────────────

function getWishlist() {
  try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
}

function saveWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function isWishlisted(id) {
  return getWishlist().includes(id);
}

function toggleWishlist(id) {
  let wishlist = getWishlist();
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(i => i !== id);
  } else {
    wishlist.push(id);
  }
  saveWishlist(wishlist);
  return wishlist.includes(id);
}

// ─── Render carousel ──────────────────────────────────────────────────────────

function renderCarousel(product) {
  const imagesEl = document.getElementById('carousel-images');
  const dotsEl = document.getElementById('carousel-dots');
  
  // Collect images: url and url2 (deduplicated)
  const images = [product.url];
  if (product.url2 && product.url2 !== product.url) images.push(product.url2);
  
  imagesEl.innerHTML = images.map((src, i) => `
    <div class="carousel-item ${i === 0 ? 'active' : ''}">
      <img src="${src}" class="d-block w-100 imgp" alt="${product.name} image ${i + 1}"
        onerror="this.src='https://picsum.photos/600/951'">
    </div>
  `).join('');
  
  dotsEl.innerHTML = images.map((_, i) => `
    <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="${i}"
      ${i === 0 ? 'aria-current="true"' : ''}
      aria-label="Slide ${i + 1}"
      class="${i === 0 ? 'active' : ''} rounded-circle border-0 p-0"
      style="width:10px; height:10px; background-color:rgba(255,255,255,0.5);">
    </button>
  `).join('');
}

// ─── Render product info ───────────────────────────────────────────────────────

function renderInfo(product) {
  document.title = product.name + ' — Gamkharu';
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').textContent = product.price;
  
  // Tags from cat field
  const tagsEl = document.getElementById('product-tags');
  if (product.cat) {
    const tags = product.cat.split(/\s+/).filter(Boolean);
    tagsEl.innerHTML = tags.map(tag => `
      <a href="search.html?q=${encodeURIComponent(tag)}" class="tag-pill">#${tag}</a>
    `).join('');
  }
}

// ─── Render wishlist button ───────────────────────────────────────────────────

function renderWishlist(product) {
  const btn = document.getElementById('wishlist-btn');
  if (isWishlisted(product.id)) btn.classList.add('wishlisted');
  
  btn.addEventListener('click', () => {
    const nowWishlisted = toggleWishlist(product.id);
    btn.classList.toggle('wishlisted', nowWishlisted);
  });
}

// ─── Render cart button ───────────────────────────────────────────────────────

function renderCartButton(product) {
  const addBtn = document.getElementById('add-to-cart-btn');
  const goBtn = document.getElementById('go-to-cart-btn');
  
  function updateState() {
  if (isInCart(product.id)) {
    addBtn.style.opacity = '0';
    addBtn.style.transform = 'scale(0.9)';
    addBtn.style.pointerEvents = 'none';
    goBtn.style.opacity = '1';
    goBtn.style.transform = 'scale(1)';
    goBtn.style.pointerEvents = '';
  } else {
    addBtn.style.opacity = '1';
    addBtn.style.transform = 'scale(1)';
    addBtn.style.pointerEvents = '';
    goBtn.style.opacity = '0';
    goBtn.style.transform = 'scale(0.9)';
    goBtn.style.pointerEvents = 'none';
  }
}
  
  updateState();
  
  addBtn.addEventListener('click', () => {
    addToCart(product);
    updateState();
  });
}

// ─── Render suggestions ───────────────────────────────────────────────────────

function renderSuggestions(product, allProducts) {
  const container = document.getElementById('suggestions-container');
  
  if (!product.cat) {
    container.closest('.p-4').style.display = 'none';
    return;
  }
  
  const productTags = product.cat.toLowerCase().split(/\s+/).filter(Boolean);
  
  const related = allProducts.filter(p => {
    if (p.id === product.id) return false;
    if (!p.cat) return false;
    const pTags = p.cat.toLowerCase().split(/\s+/).filter(Boolean);
    return pTags.some(t => productTags.includes(t));
  });
  
  if (related.length === 0) {
    container.closest('.p-4').style.display = 'none';
    return;
  }
  
  container.innerHTML = related.map(p => `
    <div class="card rounded-4 flex-shrink-0 suggestion-card" style="width:10rem;"
      onclick="window.location.href='product.html?id=${p.id}'">
      <img src="${p.url}" class="card-img-top rounded-4"
        style="height:170px; object-fit:cover;"
        alt="${p.name}" onerror="this.src='https://picsum.photos/300/351'">
      <div class="card-body p-2">
        <p class="mb-0" style="font-size:0.85rem;">${p.name}</p>
        <p class="mb-0" style="font-size:0.8rem; color:#FF6435;">${p.price}</p>
      </div>
    </div>
  `).join('');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  
  const allProducts = await loadDatabase();
  const product = allProducts.find(p => p.id === id);
  
  if (!product) {
    document.getElementById('product-content').style.display = 'none';
    document.getElementById('not-found').style.display = 'block';
    return;
  }
  
  renderCarousel(product);
  renderInfo(product);
  renderWishlist(product);
  renderCartButton(product);
  renderSuggestions(product, allProducts);
}

document.addEventListener('DOMContentLoaded', init);