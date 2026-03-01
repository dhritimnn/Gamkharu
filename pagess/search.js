let data = [];

async function products() {
  const response = await fetch("../database/products.json");
  data = await response.json();
  
  display(data); // show all products initially
}

products();

function display(result) {
  const box = document.querySelector('#slist');
  box.innerHTML = "";
  
  if (result.length === 0) {
    box.innerHTML = "<p>No products found</p>";
    return;
  }
  
  result.forEach((item) => {
    box.innerHTML += `
      <a href="">
        <img src="../database/${item.url}" alt="">
        <span class="about">
          <h6>${item.name}</h6>
          <span class="tags">
            <p>${item.tags[0]}</p>
            <p>${item.tags[1]}</p>
          </span>
          <h5>${item.price}</h5>
        </span>
      </a>`;
  });
}

let searchBtn = document.querySelector('#searchBtn');
let searchspace = document.querySelector('#searchspace');

searchBtn.addEventListener("click", function() {
  let input = searchspace.value.toLowerCase().trim();
  
  if (!input.length) {
    display(data);
    return;
  }
  
  let words = input.split(" ");
  
  let result = data.filter((item) => {
    let searchableText = `
      ${item.name}
      ${item.tags.join(" ")}
      ${item.price}
    `.toLowerCase();
    
    return words.every(word => searchableText.includes(word));
  });
  
  display(result);
});




let suggestionsBox = document.querySelector('#suggestions');

searchspace.addEventListener("keyup", function() {
  let input = this.value.toLowerCase().trim();
  suggestionsBox.innerHTML = "";
  
  if (!input.length) {
    suggestionsBox.style.display = "none";
    return;
  }
  
  let words = input.split(" ");
  
  let matches = data.filter((item) => {
    let searchableText = `
      ${item.name}
      ${item.tags.join(" ")}
      ${item.price}
    `.toLowerCase();
    
    return words.every(word => searchableText.includes(word));
  });
  
  // Limit to 5 suggestions
  matches.slice(0, 5).forEach((item) => {
    let div = document.createElement("div");
    div.textContent = item.name;
    
    div.onclick = function() {
      searchspace.value = item.name;
      suggestionsBox.style.display = "none";
      display([item]); // show only selected product
    };
    
    suggestionsBox.appendChild(div);
  });
  
  suggestionsBox.style.display = matches.length ? "block" : "none";
});











let sortToggle = document.querySelector("#sortToggle");
let sortPanel = document.querySelector("#sortPanel");



function getNumericPrice(price) {
  return Number(price.replace(/[^0-9.]/g, ""));
}





sortToggle.addEventListener("click", function() {
  sortPanel.classList.toggle("active");
});

document.querySelectorAll("#sortPanel p").forEach(option => {
  option.addEventListener("click", function() {
    
    let type = this.dataset.sort;
    let sortedData = [...data]; // copy array
    
    if (type === "low") {
      sortedData.sort((a, b) =>
        getNumericPrice(a.price) - getNumericPrice(b.price)
      );
    }
    
    if (type === "high") {
      sortedData.sort((a, b) =>
        getNumericPrice(b.price) - getNumericPrice(a.price)
      );
    }
    
    if (type === "az") {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    if (type === "za") {
      sortedData.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    display(sortedData);
    sortPanel.classList.remove("active");
  });
});