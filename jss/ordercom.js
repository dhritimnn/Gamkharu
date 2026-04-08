function orderCompInit() {
  
  function getCart() {
    try { return JSON.parse(localStorage.getItem('gk_cart') || '[]'); }
    catch { return []; }
  }
  
  function parsePrice(priceStr) {
    return parseFloat(String(priceStr).replace(/[^0-9.]/g, '')) || 0;
  }
  
  function renderOrderSummary() {
    const cart = getCart();
    const itemsEl = document.getElementById('order-items');
    const totalEl = document.getElementById('order-total');
    
    if (cart.length === 0) {
      itemsEl.innerHTML = `<p id="order-empty">No items in cart.</p>`;
      totalEl.textContent = '₹0';
      return;
    }
    
    itemsEl.innerHTML = cart.map(item => {
      const qty = item.qty || 1;
      const itemTotal = parsePrice(item.price) * qty;
      return `
        <div class="order-item-row">
          <img class="order-item-img"
            src="${item.url || ''}"
            onerror="this.style.display='none'"
            alt="${item.name}">
          <div style="flex:1; min-width:0;">
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-meta">Qty: ${qty}</div>
          </div>
          <div class="order-item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
        </div>
      `;
    }).join('');
    
    const total = cart.reduce((sum, item) =>
      sum + parsePrice(item.price) * (item.qty || 1), 0);
    totalEl.textContent = '₹' + total.toLocaleString('en-IN');
  }
  
  function fillOrderDetails() {
    const cart = getCart();
    if (!cart.length) return;
    
    const lines = cart.map(item => {
      const qty = item.qty || 1;
      const itemTotal = parsePrice(item.price) * qty;
      return `[ID: ${item.id}] ${item.name} | Qty: ${qty} | Price: ${item.price} | Subtotal: ₹${itemTotal.toLocaleString('en-IN')}`;
    });
    
    const total = cart.reduce((sum, item) =>
      sum + parsePrice(item.price) * (item.qty || 1), 0);
    lines.push('');
    lines.push('Total: ₹' + total.toLocaleString('en-IN'));
    
    document.getElementById('order-details-hidden').value = lines.join('\n');
  }
  
  function saveFormData() {
    const data = {
      firstName: document.querySelector('[name="Name_First"]').value,
      lastName: document.querySelector('[name="Name_Last"]').value,
      phone: document.querySelector('[name="PhoneNumber_countrycode"]').value,
      address1: document.querySelector('[name="Address_AddressLine1"]').value,
      address2: document.querySelector('[name="Address_AddressLine2"]').value,
      city: document.querySelector('[name="Address_City"]').value,
      region: document.querySelector('[name="Address_Region"]').value,
      zip: document.querySelector('[name="Address_ZipCode"]').value,
    };
    localStorage.setItem('gk_user_info', JSON.stringify(data));
  }
  
  function loadFormData() {
    try {
      const data = JSON.parse(localStorage.getItem('gk_user_info') || '{}');
      if (data.firstName) document.querySelector('[name="Name_First"]').value = data.firstName;
      if (data.lastName) document.querySelector('[name="Name_Last"]').value = data.lastName;
      if (data.phone) document.querySelector('[name="PhoneNumber_countrycode"]').value = data.phone;
      if (data.address1) document.querySelector('[name="Address_AddressLine1"]').value = data.address1;
      if (data.address2) document.querySelector('[name="Address_AddressLine2"]').value = data.address2;
      if (data.city) document.querySelector('[name="Address_City"]').value = data.city;
      if (data.region) document.querySelector('[name="Address_Region"]').value = data.region;
      if (data.zip) document.querySelector('[name="Address_ZipCode"]').value = data.zip;
    } catch {}
  }
  
  // ── Init ──
  renderOrderSummary();
  loadFormData();
  
  document.getElementById('zoho-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    fillOrderDetails();
    saveFormData();
    
    const formData = new FormData(e.target);
    try {
      await fetch(e.target.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });
    } catch {}
    
    window.location.href = '/thankyou.html';
  });
  
}