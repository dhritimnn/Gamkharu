document.addEventListener("DOMContentLoaded", async () => {
    
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    
    if (!productId) return;
    
    const cartBtn = document.querySelector(".btn-cart");
    const wishlistBtn = document.querySelector(".btn-wishlist");
    const buyBtn = document.querySelector(".btn-buy");
    
    try {
        const response = await fetch("../database/products.json");
        const products = await response.json();
        const product = products.find(p => p.id == productId);
        
        if (!product) return;
        
        // Insert product data
        document.getElementById("productName").textContent = product.name;
        document.getElementById("productPrice").textContent = "₹" + product.price;
        document.getElementById("productDescription").textContent = product.description;
        document.getElementById("productImage").src = "../database/" + product.url;
        
        // ---------- LOCAL STORAGE ----------
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        
        // Check if already in cart
        if (cart.some(item => item.id == product.id)) {
            cartBtn.innerHTML = `<i class="bi bi-cart-check"></i> Remove from Cart`;
        }
        
        // Check if already in wishlist
        if (wishlist.some(item => item.id == product.id)) {
            wishlistBtn.innerHTML = `<i class="bi bi-heart-fill"></i> Wishlisted`;
        }
        
        // ---------- ADD TO CART ----------
        cartBtn.addEventListener("click", () => {
            
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            
            const exists = cart.some(item => item.id == product.id);
            
            if (exists) {
                // Remove
                cart = cart.filter(item => item.id != product.id);
                cartBtn.innerHTML = `<i class="bi bi-cart"></i> Add to Cart`;
            } else {
                // Add
                cart.push(product);
                cartBtn.innerHTML = `<i class="bi bi-cart-check"></i> Remove from Cart`;
            }
            
            localStorage.setItem("cart", JSON.stringify(cart));
        });
        
        // ---------- WISHLIST ----------
        wishlistBtn.addEventListener("click", () => {
            
            let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            
            const exists = wishlist.some(item => item.id == product.id);
            
            if (exists) {
                wishlist = wishlist.filter(item => item.id != product.id);
                wishlistBtn.innerHTML = `<i class="bi bi-heart"></i> Wishlist`;
            } else {
                wishlist.push(product);
                wishlistBtn.innerHTML = `<i class="bi bi-heart-fill"></i> Wishlisted`;
            }
            
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
        });
        
        // ---------- BUY NOW ----------
        buyBtn.addEventListener("click", () => {
            
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            
            if (!cart.some(item => item.id == product.id)) {
                cart.push(product);
                localStorage.setItem("cart", JSON.stringify(cart));
            }
            
            alert("Product added to cart. Proceeding to checkout...");
            // window.location.href = "/checkout";  // Optional
        });
        
    } catch (error) {
        console.error("Error loading product:", error);
    }
});


