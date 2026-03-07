// ─── Load products from database.json ───────────────────────────────────────

async function loadProducts() {
  const response = await fetch('database.json');
  const products = await response.json();
  return products;
}

// ─── Build a product card HTML string ────────────────────────────────────────

function buildCard(product) {
  return `
    <div class="col">
      <div class="card rounded-4 w-100 flex-shrink-0">
        <img src="${product.url}" class="card-img-top rounded-4" alt="${product.name}" onerror="this.src='https://picsum.photos/300/351'">
        <div class="card-body">
          <p class="card-text mb-0">${product.name}</p>
          <h4 class="card-text ml-2">${product.price}</h4>
        </div>
      </div>
    </div>
  `;
}

// ─── Render products into #container ─────────────────────────────────────────

function renderProducts(products) {
  const container = document.getElementById('container');
  if (products.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-white text-center py-4">
        <i class="bi bi-search" style="font-size:2rem;"></i>
        <p class="mt-2">No products found.</p>
      </div>`;
    return;
  }
  container.innerHTML = products.map(buildCard).join('');
}

// ─── Fuzzy / approximate search ──────────────────────────────────────────────

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Phonetic flattening: collapse common sound-alike letter groups so
// "mekela" and "mekhela" sound identical after this step
function phonetic(str) {
  return str
    .replace(/kh/g, 'k').replace(/ph/g, 'f').replace(/gh/g, 'g')
    .replace(/sh/g, 's').replace(/th/g, 't').replace(/ch/g, 'c')
    .replace(/ck/g, 'k').replace(/x/g, 'ks')
    .replace(/[aeiou]+/g, 'a')    // collapse all vowels → 'a'
    .replace(/(.)\1+/g, '$1');    // remove consecutive duplicate chars
}

// Levenshtein edit distance
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

// How many typos to tolerate based on query word length
function allowedDist(len) {
  if (len <= 2) return 0;
  if (len <= 4) return 1;
  if (len <= 7) return 2;
  return 3;
}

function wordFuzzyMatch(nameWord, queryWord) {
  const maxDist = allowedDist(queryWord.length);

  // 1. Direct Levenshtein on full words
  if (levenshtein(nameWord, queryWord) <= maxDist) return true;

  // 2. Phonetic match — collapses similar-sounding letters before comparing
  //    This catches: mekela→mekhela, sadhor→sador, riha→riha etc.
  if (levenshtein(phonetic(nameWord), phonetic(queryWord)) <= Math.max(1, maxDist - 1)) return true;

  // 3. Sliding window — fuzzy substring match
  //    Catches partial typing: "mekhe" should still match "mekhela"
  if (nameWord.length >= queryWord.length) {
    for (let i = 0; i <= nameWord.length - queryWord.length; i++) {
      const slice = nameWord.slice(i, i + queryWord.length);
      if (levenshtein(slice, queryWord) <= maxDist) return true;
    }
  }

  // 4. Prefix fuzzy match — user typed beginning of word with typos
  if (nameWord.length > queryWord.length) {
    const prefix = nameWord.slice(0, queryWord.length);
    if (levenshtein(prefix, queryWord) <= Math.max(1, maxDist - 1)) return true;
  }

  return false;
}

function approximateMatch(productName, query) {
  const name = normalize(productName);
  const q = normalize(query);

  // Fast path: direct substring
  if (name.includes(q)) return true;

  // Every query word must fuzzy-match at least one name word
  const nameWords = name.split(/\s+/).filter(Boolean);
  const queryWords = q.split(/\s+/).filter(Boolean);

  return queryWords.every(qWord =>
    nameWords.some(nWord => wordFuzzyMatch(nWord, qWord))
  );
}

function filterProducts(products, query) {
  if (!query || query.trim() === '') return products;
  return products.filter(p => approximateMatch(p.name, query));
}

// ─── Sort logic ───────────────────────────────────────────────────────────────

function parsePrice(priceStr) {
  return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
}

function sortProducts(products, method) {
  const sorted = [...products];
  switch (method) {
    case 'price-high':
      return sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    case 'price-low':
      return sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    case 'az':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'za':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}

// ─── Sort panel toggle ────────────────────────────────────────────────────────

function initSortToggle() {
  const sortPanel = document.getElementById('sortlist');
  const sortBtn = document.getElementById('sortbtn');
  const closeBtn = sortPanel.querySelector('.btn-outline-danger');

  // Set hidden position IMMEDIATELY (no transition yet) so there's no drop on load.
  // Two nested rAFs ensure the position is painted first, THEN transition is enabled.
  sortPanel.style.transform = 'translateY(100%)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      sortPanel.style.transition = 'transform 0.3s ease';
    });
  });

  sortBtn.addEventListener('click', () => {
    sortPanel.style.transform = 'translateY(0)';
  });

  closeBtn.addEventListener('click', () => {
    sortPanel.style.transform = 'translateY(100%)';
  });
}

// ─── Search bar ───────────────────────────────────────────────────────────────

function initSearchBar() {
  const searchInput = document.querySelector('input[type="text"]');
  const searchButton = document.getElementById('button-addon2');

  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';
  if (query) searchInput.value = query;

  function doSearch() {
    const val = searchInput.value.trim();
    if (val) {
      window.location.href = `?q=${encodeURIComponent(val)}`;
    } else {
      window.location.href = window.location.pathname;
    }
  }

  searchButton.addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

let allProducts = [];
let currentQuery = '';
let currentSort = '';

async function init() {
  initSortToggle();
  initSearchBar();

  allProducts = await loadProducts();

  const params = new URLSearchParams(window.location.search);
  currentQuery = params.get('q') || '';

  const heading = document.querySelector('.border-bottom');
  if (heading) {
    heading.textContent = currentQuery
      ? `Results for "${currentQuery}"`
      : 'All Items';
  }

  let displayed = filterProducts(allProducts, currentQuery);
  renderProducts(displayed);

  const sortButtons = document.querySelectorAll('#sortlist .btn:not(.btn-outline-danger)');
  const sortMap = ['price-high', 'price-low', 'az', 'za'];

  sortButtons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      currentSort = sortMap[i];

      sortButtons.forEach(b => b.classList.remove('fw-bold', 'text-danger'));
      btn.classList.add('fw-bold', 'text-danger');

      let result = filterProducts(allProducts, currentQuery);
      result = sortProducts(result, currentSort);
      renderProducts(result);

      document.getElementById('sortlist').style.transform = 'translateY(100%)';
    });
  });
}

document.addEventListener('DOMContentLoaded', init);