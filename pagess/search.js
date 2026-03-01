// ==========================
// GLOBAL DATA
// ==========================

let data = [];

const searchspace = document.querySelector("#searchspace");
const searchBtn = document.querySelector("#searchBtn");
const sortToggle = document.querySelector("#sortToggle");
const sortPanel = document.querySelector("#sortPanel");


// ==========================
// LOAD PRODUCTS
// ==========================

async function products() {
  const response = await fetch("../database/products.json");
  data = await response.json();
  
  const query = getQueryParam("q");
  const sort = getQueryParam("sort");
  
  if (query) {
    searchspace.value = query;
    let result = applySearch(query);
    if (sort) result = applySort(result, sort);
    display(result);
  } else {
    display(data);
  }
}

products();


// ==========================
// DISPLAY FUNCTION
// ==========================

function display(result) {
  const box = document.querySelector("#slist");
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
            ${item.tags.map(tag => `<p>${tag}</p>`).join("")}
          </span>
          <h5>${item.price}</h5>
        </span>
      </a>
    `;
  });
}


// ==========================
// SEARCH LOGIC
// ==========================

function applySearch(input) {
  let words = input.toLowerCase().trim().split(" ");
  
  return data.filter((item) => {
    let searchableText = `
      ${item.name}
      ${item.tags.join(" ")}
      ${item.price}
    `.toLowerCase();
    
    return words.every(word => searchableText.includes(word));
  });
}


// ==========================
// BUTTON SEARCH (WITH RELOAD)
// ==========================

searchBtn.addEventListener("click", function() {
  const input = searchspace.value.trim();
  if (!input.length) return;
  
  window.location.href = `?q=${encodeURIComponent(input)}`;
});


// ENTER KEY SEARCH

searchspace.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});


// ==========================
// URL PARAM READER
// ==========================

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}


// ==========================
// SORT LOGIC
// ==========================

function getNumericPrice(price) {
  return Number(price.replace(/[^0-9.]/g, ""));
}

function applySort(items, type) {
  let sorted = [...items];
  
  if (type === "low") {
    sorted.sort((a, b) =>
      getNumericPrice(a.price) - getNumericPrice(b.price)
    );
  }
  
  if (type === "high") {
    sorted.sort((a, b) =>
      getNumericPrice(b.price) - getNumericPrice(a.price)
    );
  }
  
  if (type === "az") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  if (type === "za") {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  }
  
  return sorted;
}


// ==========================
// SORT PANEL TOGGLE
// ==========================

if (sortToggle) {
  sortToggle.addEventListener("click", function() {
    sortPanel.classList.toggle("active");
  });
}


// ==========================
// SORT OPTION CLICK
// ==========================

document.querySelectorAll("#sortPanel p").forEach(option => {
  option.addEventListener("click", function() {
    
    const sortType = this.dataset.sort;
    const query = getQueryParam("q");
    
    let newURL = "?";
    
    if (query) {
      newURL += `q=${encodeURIComponent(query)}&`;
    }
    
    newURL += `sort=${sortType}`;
    
    window.location.href = newURL;
  });
});