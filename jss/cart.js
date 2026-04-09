async function load() {
  
  await addcomp('navbar-placeholder', './comps/nav.html');
  await addcomp('searchbar-placeholder', './comps/searchbar.html');
  
  await searchjsfunc();
  
  await addcomp('cartcomp-placeholder', './comps/cartcomp.html');
  await cartInit();

}


load()




function cartInit() {
  
  function getCart() {
    try { return JSON.parse(localStorage.getItem('gk_cart') || '[]'); } catch { return []; }
  }
  
  function saveCart(c) {
    localStorage.setItem('gk_cart', JSON.stringify(c));
    window.dispatchEvent(new Event('storage'));
  }
  
  function parsePrice(str) {
    const n = parseFloat((str || '').replace(/[^\d.]/g, ''));
    return isNaN(n) ? 0 : n;
  }
  
  function formatPrice(n) {
    return '₹' + n.toLocaleString('en-IN');
  }
  
  function render() {
    const list = document.getElementById('cart-list');
    const empty = document.getElementById('cart-empty');
    const footer = document.getElementById('cart-footer');
    const countLabel = document.getElementById('cart-count-label');
    list.innerHTML = '';
    
    const cart = getCart();
    
    if (!cart.length) {
      empty.style.display = 'flex';
      footer.classList.add('hidden');
      countLabel.textContent = '';
      return;
    }
    
    empty.style.display = 'none';
    footer.classList.remove('hidden');
    document.getElementById('cart-clear-btn').style.display = 'block';
    
    let total = 0;
    let totalQty = 0;
    
    cart.forEach((item, idx) => {
      const unit = parsePrice(item.price);
      const subtotal = unit * (item.qty || 1);
      total += subtotal;
      totalQty += (item.qty || 1);
      
      const el = document.createElement('div');
      el.className = 'cart-item';
      
      const imgEl = document.createElement('img');
      imgEl.className = 'cart-item-img';
      imgEl.src = item.url || '';
      imgEl.alt = item.name;
      imgEl.loading = 'lazy';
      imgEl.onerror = function() {
        this.classList.add('fallback');
        this.style.display = 'none';
        this.parentElement.style.background = '#e8dcd5';
      };
      
      el.appendChild(imgEl);
      el.insertAdjacentHTML('beforeend', `
          <div class="cart-item-body">
            <div>
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-unit">Unit: ${item.price}</div>
            </div>
            <div class="cart-item-bottom">
              <div class="qty-wrap">
                <button class="qty-btn qty-minus">−</button>
                <span class="qty-val">${item.qty || 1}</span>
                <button class="qty-btn qty-plus">+</button>
              </div>
              <div class="cart-item-price">${formatPrice(subtotal)}</div>
            </div>
            <button class="cart-remove">Remove</button>
          </div>
        `);
      
      el.querySelector('.qty-minus').addEventListener('click', () => {
        let c = getCart();
        if (c[idx].qty <= 1) return;
        c[idx].qty--;
        saveCart(c);
        render();
      });
      
      el.querySelector('.qty-plus').addEventListener('click', () => {
        let c = getCart();
        c[idx].qty++;
        saveCart(c);
        render();
      });
      
      el.querySelector('.cart-remove').addEventListener('click', () => {
        let c = getCart();
        c.splice(idx, 1);
        saveCart(c);
        render();
      });
      
      list.appendChild(el);
    });
    
    // update footer
    const itemWord = totalQty === 1 ? 'item' : 'items';
    document.getElementById('cart-items-label').textContent = `${totalQty} ${itemWord}`;
    document.getElementById('cart-total').textContent = formatPrice(total);
    countLabel.textContent = `${cart.length} product${cart.length > 1 ? 's' : ''}`;
  }
  
  render();
  
  
  document.getElementById('cart-clear-btn').addEventListener('click', () => {
    saveCart([]);
    render();
  });
  
  // next button — save to gk_checkout and redirect
  document.getElementById('cart-next-btn').addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) return;
    localStorage.setItem('gk_checkout', JSON.stringify({
      items: cart,
      savedAt: Date.now()
    }));
    window.location.href = 'order.html';
  });
  
}