document.addEventListener("DOMContentLoaded", async () => {
    
    // 1️⃣ Get ID from URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    
    if (!productId) {
        console.log("No product ID found in URL");
        return;
    }
    
    try {
        // 2️⃣ Fetch JSON
        const response = await fetch("../database/products.json");
        const products = await response.json();
        
        // 3️⃣ Find matching product
        const product = products.find(p => p.id == productId);
        
        if (!product) {
            console.log("Product not found");
            return;
        }
        
        // 4️⃣ Insert into HTML
        document.getElementById("productName").textContent = product.name;
        document.getElementById("productPrice").textContent = "₹" + product.price;
        document.getElementById("productDescription").textContent = product.description;
        document.getElementById("productImage").src = "../database/" + product.url;
        
    } catch (error) {
        console.error("Error loading product:", error);
    }
    
});