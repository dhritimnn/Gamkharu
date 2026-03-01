async function products() {
  const box = document.querySelector('#slist');
  const response = await fetch("../database/products.json");
  const data = await response.json(); // Now it's a JS object
  data.forEach(
    (e) => {
      box.innerHTML += `
      <a href=""><img src="
        ../database/${e.url}" alt=""><span class="about"><h6>${e.name}</h6><span class="tags"><p>${e.tags[0]}</p><p>${e.tags[1]}</p></span><h5>${e.price}</h5></span></a>`;
    }
  )
}
products();


let searchspace = document.querySelector('#searchspace');

searchspace.addEventListener('keyup', () => {
    let result = [];
    let input = searchspace.value;
    if (input.length) {
      result = availableKeywords.filter((data) => {
        return keyword.toLowerCase().includes(input.toLowerCase());
      });
      console.log(result);
    }
})




function display(result) {
  const content = result.map((list) => {});
  return "<li>" + list + "</li>";
}