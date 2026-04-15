async function load() {
  
  await addcomp('navbar-placeholder', './comps/nav.html');
  await addcomp('searchbar-placeholder', './comps/searchbar.html');
  await searchjsfunc();
  await addcomp('header-placeholder', './comps/header.html');
  await headerCarousel();
  await addcomp('limsercomp', './comps/limservice.html');
  await addcomp('catagory-placeholder', './comps/catagory.html');
  await addcomp('featured-placeholder', './comps/featured.html');
  await featuredInit();
  await addcomp('loc-placeholder', './comps/location.html');
  await addcomp('footer-placeholder', './comps/footer.html');

}



load()






async function featuredInit() {
  const FALLBACK = '#e8dcd5';
  let db = [];
  try {
    db = await fetchJSON('./database.json');
  } catch (e) { return; }
  
  const items = [...db].reverse().slice(0, 6);
  const grid = document.getElementById('featured-grid');
  
  items.forEach(p => {
    const card = document.createElement('div');
    card.className = 'ft-card';
    card.innerHTML = `<img src="${p.urlsm || ''}" alt="${p.name}" loading="lazy"
        onerror="this.style.display='none';this.parentElement.style.background='${FALLBACK}'" ste>`;
    card.addEventListener('click', () => window.location.href = `product.html?id=${p.id}`);
    grid.appendChild(card);
  });
}



function headerCarousel() {

    const SLIDES = [
      { img: './rootimg/2.webp' },
      { img: './rootimg/3.webp' },
      { img: './rootimg/4.webp' },
      { img: './rootimg/5.webp' },
      { img: './rootimg/6.webp' },
      { img: './rootimg/7.webp' },
    ];

    const AUTOPLAY_MS = 3000;

    const track = document.getElementById('hc-track');
    const dotsWrap = document.getElementById('hc-dots');
    let cur = 0, timer;

    // build slides & dots
    SLIDES.forEach((s, i) => {
      const slide = document.createElement('div');
      slide.className = 'hc-slide';
      slide.style.backgroundImage = `url('${s.img}')`;
      track.appendChild(slide);

      const dot = document.createElement('div');
      dot.className = 'hc-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => { goTo(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    });

    function goTo(n) {
      cur = (n + SLIDES.length) % SLIDES.length;
      track.style.transform = `translateX(-${cur * 100}%)`;
      dotsWrap.querySelectorAll('.hc-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
    }

    function next() { goTo(cur + 1); }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, AUTOPLAY_MS);
    }

    // touch swipe
    let ts = 0;
    track.addEventListener('touchstart', e => { ts = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - ts;
      if (Math.abs(dx) > 40) goTo(cur + (dx < 0 ? 1 : -1));
      resetTimer();
    }, { passive: true });

    resetTimer();
  }