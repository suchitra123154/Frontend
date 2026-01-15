// All product data
const products = {
  men:[{name:"Men 1",img:"https://m.media-amazon.com/images/I/71Amu7-gYmL._AC_UL480_FMwebp_QL65_.jpg",price:1200},
  {name:"Men 2",img:"https://m.media-amazon.com/images/I/61BIuLnLh9L._AC_UL480_FMwebp_QL65_.jpg",price:1500},
  {name: "Men Product 3", img: "https://m.media-amazon.com/images/I/51CRDDG6s4L._AC_UL480_FMwebp_QL65_.jpg", price: 1100},
  {name: "Men Product 4", img: "https://m.media-amazon.com/images/I/61ua-JNV87L._AC_UL480_FMwebp_QL65_.jpg", price: 1800},
  {name: "Men Product 5", img: "https://m.media-amazon.com/images/I/51XnB96ujVL._AC_SX644_CB1169409_QL70_.jpg", price: 1300},
  {name: "Men Product 6", img: "https://m.media-amazon.com/images/I/71OBVZ-69WL._AC_UL480_FMwebp_QL65_.jpg", price: 1600},
  {name: "Men Product 7", img: "https://m.media-amazon.com/images/I/71CLAteDp4L._AC_UL480_FMwebp_QL65_.jpg", price: 1400},
  {name: "Men Product 8", img: "https://m.media-amazon.com/images/I/71IXThTV2QL._AC_UL480_FMwebp_QL65_.jpg", price: 1700},
  {name: "Men Product 9", img: "https://m.media-amazon.com/images/I/61veqzxiKyL._AC_UL480_FMwebp_QL65_.jpg", price: 1250},
  {name: "Men Product 10", img: "https://m.media-amazon.com/images/I/61AuDia-2aL._AC_UL480_FMwebp_QL65_.jpg", price: 1550}],
  // ... [rest of the products object]
};

const liked = [];

// Variables to store current product being ordered
let currentOrderProduct = null;

// Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = total;
}

// Update orders count (placed orders)
function updateOrdersCount() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const total = orders.length;
  const el = document.getElementById('orders-count');
  if (el) el.textContent = total;
}

// Navigate to Cart Page
function goToCart() {
  document.getElementById('cart-page').style.display = 'block';
  renderCart();
}

// Navigate back to Home Page
function goHome() {
  document.getElementById('cart-page').style.display = 'none';
}

// Render Cart
function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const tbody = document.querySelector('#cart-table tbody');
  tbody.innerHTML = '';
  let grandTotal = 0;

  cart.forEach((item, index) => {
    const total = item.price * item.quantity;
    grandTotal += total;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${item.img}" alt="${item.name}"></td>
      <td>${item.name}</td>
      <td>₹${item.price}</td>
      <td>
        <button class="qty-btn decrease" data-index="${index}">−</button>
        ${item.quantity}
        <button class="qty-btn increase" data-index="${index}">+</button>
      </td>
      <td>₹${total}</td>
      <td><button class="remove-btn" data-index="${index}">Remove</button></td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById('grand-total').textContent = `Grand Total: ₹${grandTotal}`;

  // Add button functionalities
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.index;
      cart.splice(idx, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      renderCart();
    });
  });

  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.index;
      cart[idx].quantity += 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      renderCart();
    });
  });

  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.index;
      if(cart[idx].quantity > 1) cart[idx].quantity -= 1;
      else cart.splice(idx, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      renderCart();
    });
  });
}

function renderProducts(category, containerId){
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  products[category].forEach((p,i)=>{
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>₹${p.price}</p>
      <button class="add-cart-btn" data-cat="${category}" data-index="${i}">Add to Cart</button>
      <button class="place-order-btn" data-cat="${category}" data-index="${i}">Place Order</button>
      <span class="like-btn" data-cat="${category}" data-index="${i}">&#10084;</span>
    `;
    container.appendChild(div);
  });
}

// Initialize liked status from localStorage
function initializeLikedStatus() {
  const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
  document.querySelectorAll('.like-btn').forEach(btn => {
    const cat = btn.dataset.cat;
    const idx = btn.dataset.index;
    const product = products[cat][idx];
    if(likedProducts.some(p => p.name === product.name)) {
      btn.classList.add('liked');
    }
  });
}

// Function to open order form for a specific product
function openOrderForm(product) {
  currentOrderProduct = product;
  
  // Show product details in the form
  const productInfo = document.getElementById('quick-order-product-info');
  productInfo.innerHTML = `
    <div style="display: flex; align-items: center; gap: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
      <img src="${product.img}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
      <div>
        <h3 style="margin: 0; font-size: 16px;">${product.name}</h3>
        <p style="margin: 5px 0; color: #28a745; font-weight: bold;">₹${product.price}</p>
      </div>
    </div>
  `;
  
  // Clear previous inputs
  document.getElementById('customer-name').value = '';
  document.getElementById('customer-phone').value = '';
  document.getElementById('customer-address').value = '';
  
  // Show the modal
  document.getElementById('quick-order-modal').style.display = 'flex';
}

// Function to close the order modal
function closeQuickOrderModal() {
  document.getElementById('quick-order-modal').style.display = 'none';
  currentOrderProduct = null;
}

// Function to confirm and place the order
function confirmQuickOrder() {
  // Get form values
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  
  // Validate inputs
  if (!name) {
    alert('Please enter your full name');
    return;
  }
  if (!phone || !/^\d{10}$/.test(phone)) {
    alert('Please enter a valid 10-digit phone number');
    return;
  }
  if (!address) {
    alert('Please enter your delivery address');
    return;
  }
  
  // Create the order
  const order = {
    id: 'ORD' + Date.now(),
    name,
    phone,
    address,
    items: [{ ...currentOrderProduct, quantity: 1 }],
    total: currentOrderProduct.price,
    date: new Date().toISOString()
  };
  
  // Save to orders in localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Close modal and show confirmation
  closeQuickOrderModal();
  alert(`Order placed successfully!\nOrder ID: ${order.id}\nWe will contact you at ${phone} for delivery.`);
  
  // Update orders count in header
  updateOrdersCount();
}

for(const cat in products){
  renderProducts(cat, cat+"-images");
}

// Initialize liked status after rendering products
initializeLikedStatus();

// Initialize counts
updateCartCount();
updateOrdersCount();

// Toggle section
document.querySelectorAll(".section-container h2").forEach(h=>{
  h.addEventListener("click", ()=>h.nextElementSibling.style.display = h.nextElementSibling.style.display==="flex"?"none":"flex");
});

// Event listeners for add to cart, like, and place order
document.addEventListener("click", e => {
  if(e.target.classList.contains("place-order-btn")) {
    const cat = e.target.dataset.cat;
    const idx = parseInt(e.target.dataset.index);
    const product = {...products[cat][idx]};
    openOrderForm(product);
  }
  
  if(e.target.classList.contains("like-btn")){
    e.target.classList.toggle("liked");
    const cat = e.target.dataset.cat;
    const idx = e.target.dataset.index;
    const product = products[cat][idx];
    
    // Get current liked products from localStorage
    let likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
    
    if(e.target.classList.contains("liked")) {
      // Add to liked products if not already present
      if(!likedProducts.some(p => p.name === product.name)) {
        likedProducts.push(product);
      }
    } else {
      // Remove from liked products
      likedProducts = likedProducts.filter(p => p.name !== product.name);
    }
    
    // Save to localStorage
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
  }
  
  if(e.target.classList.contains("add-cart-btn")) {
    const cat = e.target.dataset.cat;
    const idx = parseInt(e.target.dataset.index);
    const product = {...products[cat][idx], quantity: 1};
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(p => p.name === product.name);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
  }
});

// Search functionality
const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    const searchResultsSection = document.getElementById('search-results-section');
    const searchResultsContainer = searchResultsSection.querySelector('.products');
    const allSections = document.querySelectorAll('.section-container:not(#search-results-section)');
    
    if (searchTerm === '') {
        // Hide search results and show all sections
        searchResultsSection.style.display = 'none';
        allSections.forEach(section => {
            section.style.display = 'block';
            const category = section.id.replace('-section', '');
            renderProducts(category, `${category}-images`);
        });
        return;
    }

    // Hide all regular sections and show search results section
    allSections.forEach(section => section.style.display = 'none');
    searchResultsSection.style.display = 'block';
    searchResultsSection.querySelector('h2').textContent = `Search Results for "${searchTerm}"`;

    // Search through all categories
    let allResults = [];
    Object.keys(products).forEach(category => {
        const matches = products[category].filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
        matches.forEach(product => {
            allResults.push({
                ...product,
                category,
                index: products[category].indexOf(product)
            });
        });
    });

    // Display results
    if (allResults.length > 0) {
        searchResultsContainer.innerHTML = '';
        allResults.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>₹${product.price}</p>
                <button class="add-cart-btn" data-cat="${product.category}" data-index="${product.index}">Add to Cart</button>
                <button class="place-order-btn" data-cat="${product.category}" data-index="${product.index}">Place Order</button>
                <span class="like-btn" data-cat="${product.category}" data-index="${product.index}">&#10084;</span>
            `;
            searchResultsContainer.appendChild(div);
        });
    } else {
        searchResultsContainer.innerHTML = `
            <div style="width: 100%; text-align: center; padding: 20px; color: #666; font-size: 18px;">
                No products found matching "${searchTerm}"
            </div>
        `;
    }

    // Re-initialize liked status for search results
    initializeLikedStatus();
});