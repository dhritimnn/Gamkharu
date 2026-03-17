// ── Load data ──
/*async function loadDatabase() {
  const response = await fetch('database.json');
  return await response.json();
}
*/

// ─── Tag match ───
function tagMatch(product, tag) {
  if (!product.cat) return false;
  return product.cat.toLowerCase().split(/\s+/).includes(tag.toLowerCase());
}


// ─── Build a featured card ───
function buildFeaturedCard(product) {
  const isWishlisted = JSON.parse(localStorage.getItem('wishlist') || '[]').includes(product.id);
  
  return `
    <div class="card rounded-4 flex-shrink-0" style="width: 11.5rem; cursor: pointer; height: 18rem;"
      onclick="window.location.href='product?id=${product.id}'">
        <button
          onclick="toggleWishlist(event, ${product.id}, this)"
          class="position-absolute top-0 end-0 btn border-0 bg-white m-0"
          style="z-index:1; font-size:1.3rem; color:${isWishlisted ? '#FF6435' : '#aaa'}; border-radius: 0 10px 0 10px; height:27px; width: 35px; display: flex; justify-content: center; align-items: center;">
          <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
        </button>

      <img src="${product.url}" class="card-img-top rounded-4 imgq" alt="${product.name}"
        onerror="this.src='https://picsum.photos/300/351'">
      <div class="card-body">
        <p class="card-text mb-0">${product.name}</p>
        <p class="card-text" style="color:#FF6435;">${product.price}</p>
      </div>
    </div>
  `;
}

function toggleWishlist(event, id, btn) {
  event.stopPropagation(); // prevents navigating to product page
  let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(i => i !== id);
    btn.innerHTML = '<i class="bi bi-heart"></i>';
    btn.style.color = '#aaa';
  } else {
    wishlist.push(id);
    btn.innerHTML = '<i class="bi bi-heart-fill"></i>';
    btn.style.color = '#FF6435';
  }
  
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}



// ─── Build the "Explore More" card ────
function buildExploreCard() {
  return `
    <div class="card rounded-4 flex-shrink-0 d-flex align-items-center justify-content-center"
      style="width: 12rem; min-height: 16rem; cursor: pointer; background: rgba(255,255,255,0.15); border: 2px dashed white;"
      onclick="window.location.href='search?q=featured'">
      <div class="text-center text-white p-3">
        <div style="font-size: 2rem;">→</div>
        <p class="mt-2 fw-bold">Explore More</p>
      </div>
    </div>
  `;
}


// ─── Build the "Explore More of Catagory" card ──
function buildCatExploreCard(tag) {
  return `
    <div class="col">
      <div class="cat-card d-flex align-items-center justify-content-center"
        style="background:#fff3f0; border: 2px dashed #FF6435; min-height:100%;"
        onclick="window.location.href='search?q=${encodeURIComponent(tag)}'">
        <div class="text-center p-2">
          <div style="font-size:1.5rem; color:#FF6435;">→</div>
          <p style="font-size:0.8rem; color:#FF6435; margin:0; font-weight:600;">View All</p>
        </div>
      </div>
    </div>
  `;
}


// ─── Render featured items ────
function renderFeatured(products) {
  const container = document.getElementById('featured');
  const featuredItems = products.filter(p =>
    p.cat && p.cat.toLowerCase().split(/\s+/).includes('featured')
  );
  
  if (featuredItems.length === 0) {
    container.innerHTML = `<p class="text-white">No featured items yet.</p>`;
    return;
  }
  
  container.innerHTML = featuredItems.map(buildFeaturedCard).join('') + buildExploreCard();
}


// ─── Build a category section card (2-col grid) ───
function buildCatCard(product) {
  const isWishlisted = JSON.parse(localStorage.getItem('wishlist') || '[]').includes(product.id);
  
  return `
    <div class="col">
      <div class="cat-card" onclick="window.location.href='product?id=${product.id}'">
        <button
          onclick="toggleWishlist(event, ${product.id}, this)"
          class="btn border-0 bg-white m-0"
          style="z-index:1; font-size:1.3rem; color:${isWishlisted ? '#FF6435' : '#aaa'}; border-radius: 0 10px 0 10px; height:27px; width: 35px; display: flex; justify-content: center; align-items: center;">
          <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
        </button>
        <img src="${product.url}" alt="${product.name}"
          onerror="this.src='https://picsum.photos/300/351'">
        <div class="cat-card-body">
          <p class="cat-card-name">${product.name}</p>
          <p class="cat-card-price">${product.price}</p>
        </div>
      </div>
    </div>
  `;
}


// ─── Render all category product sections ───
function renderCatSections(products) {
  const sections = document.querySelectorAll('[data-tag]');
  
  sections.forEach(container => {
    const tag = container.getAttribute('data-tag');
    const max = parseInt(container.getAttribute('data-max')) || 6;
    
    const items = products
      .filter(p => tagMatch(p, tag))
      .slice(0, max - 1); // only 5 real items
    
    if (items.length === 0) {
      const section = container.closest('.cat-section');
      if (section) section.style.display = 'none';
      return;
    }
    
    container.innerHTML = items.map(buildCatCard).join('') + buildCatExploreCard(tag);
  });
}


// ─── Fuzzy search ───
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function phonetic(str) {
  return str
    .replace(/kh/g, 'k').replace(/ph/g, 'f').replace(/gh/g, 'g')
    .replace(/sh/g, 's').replace(/th/g, 't').replace(/ch/g, 'c')
    .replace(/ck/g, 'k').replace(/x/g, 'ks')
    .replace(/[aeiou]+/g, 'a')
    .replace(/(.)\1+/g, '$1');
}

function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ?
      dp[i - 1][j - 1] :
      1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function allowedDist(len) {
  if (len <= 2) return 0;
  if (len <= 4) return 1;
  if (len <= 7) return 2;
  return 3;
}

function wordFuzzyMatch(nameWord, queryWord) {
  const maxDist = allowedDist(queryWord.length);
  if (levenshtein(nameWord, queryWord) <= maxDist) return true;
  if (levenshtein(phonetic(nameWord), phonetic(queryWord)) <= Math.max(1, maxDist - 1)) return true;
  if (nameWord.length >= queryWord.length) {
    for (let i = 0; i <= nameWord.length - queryWord.length; i++) {
      const slice = nameWord.slice(i, i + queryWord.length);
      if (levenshtein(slice, queryWord) <= maxDist) return true;
    }
  }
  if (nameWord.length > queryWord.length) {
    const prefix = nameWord.slice(0, queryWord.length);
    if (levenshtein(prefix, queryWord) <= Math.max(1, maxDist - 1)) return true;
  }
  return false;
}

function approximateMatch(productName, query) {
  const name = normalize(productName);
  const q = normalize(query);
  if (name.includes(q)) return true;
  const nameWords = name.split(/\s+/).filter(Boolean);
  const queryWords = q.split(/\s+/).filter(Boolean);
  return queryWords.every(qWord =>
    nameWords.some(nWord => wordFuzzyMatch(nWord, qWord))
  );
}


// ─── Suggestions ────
function initSuggestions(products) {
  const input = document.querySelector('input[type="text"]');
  const box = document.getElementById('suggestions');
  
  input.addEventListener('input', () => {
    const query = input.value.trim();
    
    if (!query) { box.style.display = 'none'; return; }
    
    const matches = products
      .filter(p => approximateMatch(p.name, query))
      .slice(0, 6);
    
    if (matches.length === 0) { box.style.display = 'none'; return; }
    
    box.innerHTML = matches.map(p => `
      <div onclick="window.location.href='product?id=${p.id}'"
        class="d-flex align-items-center gap-3 px-3 py-2 border-bottom"
        style="cursor:pointer;"
        onmouseover="this.style.background='#fff3f0'"
        onmouseout="this.style.background='white'">
        <img src="${p.url}" onerror="this.src='https://picsum.photos/40/40'"
          style="width:40px; height:40px; object-fit:cover; border-radius:8px;">
        <div>
          <div style="font-size:0.9rem;">${p.name}</div>
          <div style="font-size:0.8rem; color:#FF6435;">${p.price}</div>
        </div>
      </div>
    `).join('');
    
    box.style.display = 'block';
  });
  
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !box.contains(e.target)) {
      box.style.display = 'none';
    }
  });
  
  const searchButton = document.getElementById('button-addon2');
  
  function doSearch() {
    const val = input.value.trim();
    if (val) window.location.href = 'search?q=' + encodeURIComponent(val);
  }
  
  searchButton.addEventListener('click', doSearch);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
}





// ─── Main ───

async function init() {
  const products = await loadProducts();
  renderFeatured(products);
  renderCatSections(products);
  initSuggestions(products);
}

document.addEventListener('DOMContentLoaded', init);