async function load() {
  
  await addcomp('navbar-placeholder', './comps/nav.html');
  await addcomp('searchbar-placeholder', './comps/searchbar.html');
  
  await searchjsfunc();
  
  await addcomp('cartcomp-placeholder', './comps/cartcomp.html');
  await cartInit();



}



load()