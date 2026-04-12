async function load() {
  
  await addcomp('navbar-placeholder', './comps/nav.html');
  await addcomp('searchbar-placeholder', './comps/searchbar.html');
  await searchjsfunc();
  await addcomp('header-placeholder', './comps/header.html');
  await addcomp('catagory-placeholder', './comps/catagory.html');
  await addcomp('featured-placeholder', './comps/featured.html');
  await featuredInit();
  await addcomp('footer-placeholder', './comps/footer.html');

}



load()






async function featuredInit() {
  const FALLBACK = '#e8dcd5';
  let db = [];
  try {
    const res = await fetch('./database.json');
    db = await res.json();
  } catch (e) { return; }
  
  const items = [...db].reverse().slice(0, 6);
  const grid = document.getElementById('featured-grid');
  
  items.forEach(p => {
    const card = document.createElement('div');
    card.className = 'ft-card';
    card.innerHTML = `<img src="${p.url || ''}" alt="${p.name}" loading="lazy"
        onerror="this.style.display='none';this.parentElement.style.background='${FALLBACK}'">`;
    card.addEventListener('click', () => window.location.href = `product.html?id=${p.id}`);
    grid.appendChild(card);
  });
}