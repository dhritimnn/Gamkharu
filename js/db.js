// ─── JSONBin config ───────────────────────────────────────────────────────────
const JSONBIN_BIN_ID = '69b81d69aa77b81da9ed0990';
const JSONBIN_API_KEY = '$2a$10$qhehl1VRgwk3H3w5Kw7EAO6siI2FVcD0WsLqyS5oGy/CO6ZrnhXqa';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// ─── Read database ────────────────────────────────────────────────────────────
async function dbRead() {
  const res = await fetch(JSONBIN_URL + '/latest', {
    headers: { 'X-Master-Key': JSONBIN_API_KEY }
  });
  const data = await res.json();
  const records = Array.isArray(data.record) ? data.record : [];
  return records.filter(p => !p.init); // strip placeholder
}

// ─── Write database ───────────────────────────────────────────────────────────
async function dbWrite(products) {
  const res = await fetch(JSONBIN_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY
    },
    body: JSON.stringify(products)
  });
  return res.ok;
}

// ─── Drop-in replacement for fetch('database.json') ──────────────────────────
async function loadProducts() {
  return await dbRead();
}
