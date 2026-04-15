async function load() {
  
  await addcomp('navbar-placeholder', '../comps/nav.html');
  await addcomp('searchbar-placeholder', '../comps/searchbar.html');
  
  await searchjsfunc();
  
  await addcomp('footer-placeholder', '../comps/footer.html');
  
  
}

load()




function submitContact() {
  const name = document.getElementById('cf-name').value.trim();
  const phone = document.getElementById('cf-phone').value.trim();
  const msg = document.getElementById('cf-msg').value.trim();

  if (!name || !msg) {
    alert('Please enter your name and message.');
    return;
  }

  const text = `Hi Gamkharu! I'm ${name}${phone ? ' (' + phone + ')' : ''}.\n\n${msg}`;
  window.open(`https://wa.me/919678657989?text=${encodeURIComponent(text)}`, '_blank');
}