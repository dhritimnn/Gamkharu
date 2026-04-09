async function load() {
  
  await addcomp('navbar-placeholder', './comps/nav.html');
  await addcomp('searchbar-placeholder', './comps/searchbar.html');
  
  await searchjsfunc();
  
  await addcomp('ordercomp-placeholder', './comps/ordercomp.html');
  await orderCompInit();
  
  await addcomp('footer-placeholder', './comps/footer.html');

}



load()