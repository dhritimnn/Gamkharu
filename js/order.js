// ─── Cart helpers ─────────────────────────────────────────────────────────────

function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
}

function parsePrice(priceStr) {
  return parseFloat(String(priceStr).replace(/[^0-9.]/g, '')) || 0;
}

// ─── Render order summary ─────────────────────────────────────────────────────

function renderOrderSummary() {
  const cart = getCart();
  const itemsEl = document.getElementById('order-items');
  const totalEl = document.getElementById('order-total');
  
  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="text-muted text-center py-2">No items in cart.</p>`;
    totalEl.textContent = '₹0';
    return;
  }
  
  itemsEl.innerHTML = cart.map(item => {
    const qty = item.qty || 1;
    const itemTotal = parsePrice(item.price) * qty;
    return `
      <div class="order-item-row">
        <img src="${item.url}" onerror="this.src='https://picsum.photos/48/48'"
          style="width:48px;height:48px;object-fit:cover;border-radius:10px;flex-shrink:0;">
        <div class="flex-grow-1">
          <p class="mb-0" style="font-size:0.9rem; font-weight:600;">${item.name}</p>
          <p class="mb-0 text-muted" style="font-size:0.8rem;">ID: ${item.id} &nbsp;·&nbsp; Qty: ${qty}</p>
        </div>
        <span style="color:#FF6435; font-size:0.9rem; font-weight:600;">₹${itemTotal.toLocaleString('en-IN')}</span>
      </div>
    `;
  }).join('');
  
  const total = cart.reduce((sum, item) => sum + parsePrice(item.price) * (item.qty || 1), 0);
  totalEl.textContent = '₹' + total.toLocaleString('en-IN');
}

// ─── Auto-fill hidden Zoho textarea ──────────────────────────────────────────

function fillOrderDetails() {
  const cart = getCart();
  if (cart.length === 0) return;
  
  const lines = cart.map(item => {
    const qty = item.qty || 1;
    const itemTotal = parsePrice(item.price) * qty;
    return `[ID: ${item.id}] ${item.name} | Qty: ${qty} | Price: ${item.price} | Subtotal: ₹${itemTotal.toLocaleString('en-IN')}`;
  });
  
  const total = cart.reduce((sum, item) => sum + parsePrice(item.price) * (item.qty || 1), 0);
  lines.push('');
  lines.push('Total: ₹' + total.toLocaleString('en-IN'));
  
  document.getElementById('order-details-hidden').value = lines.join('\n');
}

// ─── Save form data to localStorage ──────────────────────────────────────────

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

// ─── Pre-fill form from localStorage ─────────────────────────────────────────

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

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderOrderSummary();
  loadFormData();
  
  const form = document.getElementById('zoho-form');
  form.addEventListener('submit', () => {
    fillOrderDetails();
    saveFormData();
  });
});