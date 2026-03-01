window.addEventListener('load', function() {
  document.querySelector('#loader').style.display = 'none';
});



async function featured() {
  const box = document.querySelector('#ftrdbtns');
  const response = await fetch("database/featured.json");
  const data = await response.json(); // Now it's a JS object
  data.forEach(
    (e) => {
      box.innerHTML += `
      <a href=""><img src="
        database/${e.url}" alt=""><span class="about"><h6>${e.name}</h6><span class="tags"><p>${e.tags[0]}</p><p>${e.tags[1]}</p></span><h5>${e.price}</h5></span></a>`;
    }
  )
  box.innerHTML += `
            <a href="" style="padding: 0 4rem;"><h4>
          Explore More
            </h4> </a>
      `
}
featured();







async function carousel() {
  const box = document.querySelector('#crcl');
  const response = await fetch("database/carousel.json");
  const data = await response.json(); // Now it's a JS object
  data.forEach(
    (e) => {
      box.innerHTML += `
      <div class="carousel-item active">
          <img src="database/${e}" class="d-block w-100" alt="...">
        </div>
      `
    }
  )
}
carousel();




  /*      
*/
