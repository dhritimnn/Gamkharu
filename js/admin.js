// ─── PIN Protection ───────────────────────────────────────────────────────────
const ADMIN_PIN = '6765';

function checkPin() {
  const entered = document.getElementById('pinInput').value;
  if (entered === ADMIN_PIN) {
    document.getElementById('pinScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadAdmin();
  } else {
    document.getElementById('pinError').style.display = 'block';
  }
}

// ─── State ────────────────────────────────────────────────────────────────────
let products = [];

// ─── Load from JSONBin on admin open ─────────────────────────────────────────
async function loadAdmin() {
  showStatus('Loading database...', 'info');
  products = await dbRead();
  renderTable();
  updateAutoId();
  showStatus('Database loaded. ' + products.length + ' products.', 'success');
}

// ─── Auto ID ─────────────────────────────────────────────────────────────────
function updateAutoId() {
  const maxId = products.reduce((max, p) => Math.max(max, p.id || 0), 0);
  document.getElementById('fieldId').value = maxId + 1;
}

// ─── Render product table ─────────────────────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById('productTable');
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No products yet.</td></tr>';
    return;
  }
  tbody.innerHTML = products.map((p, i) => `
    <tr>
      <td>${p.id}</td>
      <td><img src="${p.url}" style="width:45px;height:45px;object-fit:cover;border-radius:8px;" onerror="this.src='https://picsum.photos/45'"></td>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>
        <span class="badge ${p.featured ? 'bg-warning text-dark' : 'bg-secondary'}">
          ${p.featured ? 'Featured' : 'Normal'}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct(${i})">Edit</button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${i})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ─── Live preview ─────────────────────────────────────────────────────────────
function updatePreview() {
  const name = document.getElementById('fieldName').value || 'Product Name';
  const price = document.getElementById('fieldPrice').value || '0₹';
  const url = document.getElementById('fieldUrl').value || 'https://picsum.photos/300/351';
  const featured = document.getElementById('fieldFeatured').checked;

  document.getElementById('previewImg').src = url;
  document.getElementById('previewName').textContent = name;
  document.getElementById('previewPrice').textContent = price;
  document.getElementById('previewBadge').style.display = featured ? 'inline-block' : 'none';
}

// ─── Add / Update product ─────────────────────────────────────────────────────
let editingIndex = null;

function submitProduct() {
  const id = parseInt(document.getElementById('fieldId').value);
  const name = document.getElementById('fieldName').value.trim();
  const price = document.getElementById('fieldPrice').value.trim();
  const url = document.getElementById('fieldUrl').value.trim();
  const url2 = document.getElementById('fieldUrl2').value.trim();
  const cat = document.getElementById('fieldCat').value.trim();
  const featured = document.getElementById('fieldFeatured').checked;

  if (!name || !price || !url) {
    showStatus('Name, price and image URL are required.', 'danger');
    return;
  }

  const product = { id, name, url, price };
  if (url2) product.url2 = url2;
  if (cat) product.cat = cat;
  if (featured) product.featured = true;

  if (editingIndex !== null) {
    products[editingIndex] = product;
    editingIndex = null;
    document.getElementById('submitBtn').textContent = 'Add Product';
    document.getElementById('cancelBtn').style.display = 'none';
  } else {
    products.push(product);
  }

  renderTable();
  resetForm();
  updateAutoId();
  showStatus('Product saved locally. Click "Save to Database" to push changes.', 'warning');
}

function editProduct(i) {
  const p = products[i];
  document.getElementById('fieldId').value = p.id;
  document.getElementById('fieldName').value = p.name;
  document.getElementById('fieldPrice').value = p.price;
  document.getElementById('fieldUrl').value = p.url;
  document.getElementById('fieldUrl2').value = p.url2 || '';
  document.getElementById('fieldCat').value = p.cat || '';
  document.getElementById('fieldFeatured').checked = p.featured || false;
  editingIndex = i;
  document.getElementById('submitBtn').textContent = 'Update Product';
  document.getElementById('cancelBtn').style.display = 'inline-block';
  updatePreview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
  editingIndex = null;
  document.getElementById('submitBtn').textContent = 'Add Product';
  document.getElementById('cancelBtn').style.display = 'none';
  resetForm();
  updateAutoId();
}

function deleteProduct(i) {
  if (!confirm('Delete "' + products[i].name + '"?')) return;
  products.splice(i, 1);
  renderTable();
  showStatus('Deleted locally. Click "Save to Database" to push changes.', 'warning');
}

function resetForm() {
  document.getElementById('fieldName').value = '';
  document.getElementById('fieldPrice').value = '';
  document.getElementById('fieldUrl').value = '';
  document.getElementById('fieldUrl2').value = '';
  document.getElementById('fieldCat').value = '';
  document.getElementById('fieldFeatured').checked = false;
  updatePreview();
}

// ─── Save to JSONBin ──────────────────────────────────────────────────────────
async function saveToDatabase() {
  showStatus('Saving to database...', 'info');
  const ok = await dbWrite(products);
  if (ok) {
    showStatus('✓ Saved successfully to JSONBin! ' + products.length + ' products live.', 'success');
  } else {
    showStatus('✗ Save failed. Check your API key or internet connection.', 'danger');
  }
}

// ─── Status bar ──────────────────────────────────────────────────────────────
function showStatus(msg, type) {
  const bar = document.getElementById('statusBar');
  bar.textContent = msg;
  bar.className = 'alert alert-' + type + ' py-2 mb-3';
  bar.style.display = 'block';
}

// ─── PIN enter on keydown ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pinInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkPin();
  });
});
