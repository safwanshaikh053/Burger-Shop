const API_BASE = 'http://localhost:5000';

// Load burgers dynamically
function loadBurgers() {
  fetch(`${API_BASE}/burgers`)
    .then(res => res.json())
    .then(burgers => {
      const container = document.getElementById('burger-container');
      container.innerHTML = '';
      burgers.forEach((burger, index) => {
        const card = document.createElement('div');
        card.className = 'burger-card';
        card.innerHTML = `
          <img src="${burger.image}" alt="${burger.name}">
          <h3>${burger.name}</h3>
          <p>₹${burger.price}</p>
          <button onclick="addToCart(${index})">Add to Cart</button>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => console.error(" Error loading burgers:", err));
}

// Add to cart
function addToCart(index) {
  fetch(`${API_BASE}/burgers`)
    .then(res => res.json())
    .then(burgers => {
      const burger = burgers[index];
      fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(burger)
      }).then(() => showCart())
        .catch(err => console.error(" Error adding to cart:", err));
    });
}

// Show cart & total
function showCart() {
  fetch(`${API_BASE}/cart`)
    .then(res => res.json())
    .then(cart => {
      const cartDiv = document.getElementById('cart');
      const countSpan = document.getElementById('cart-count');
      const totalSpan = document.getElementById('cart-total');
      cartDiv.innerHTML = '';
      countSpan.textContent = cart.length;

      if (cart.length === 0) {
        cartDiv.innerHTML = '<p>Your cart is empty 🛒</p>';
        totalSpan.textContent = 0;
        return;
      }

      let total = 0;
      cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <span>${item.name} - ₹${item.price}</span>
          <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartDiv.appendChild(div);
      });
      totalSpan.textContent = total;
    })
    .catch(err => console.error(" Error showing cart:", err));
}

// Remove item from cart
function removeFromCart(index) {
  fetch(`${API_BASE}/cart/${index}`, { method: 'DELETE' })
    .then(() => showCart())
    .catch(err => console.error(" Error removing item:", err));
}

// Toggle cart panel
function toggleCartPanel() {
  document.getElementById('cart-panel').classList.toggle('active');
}

// Mock checkout
function confirmOrder() {
  alert(" Order confirmed! Redirecting to payment page....");
  fetch(`${API_BASE}/cart`)
    .then(res => res.json())
    .then(cart => {
      // Reset cart locally and backend
      cart.forEach((_, index) => removeFromCart(0));
      toggleCartPanel();
    });
}

// Load on page load
window.onload = () => {
  loadBurgers();
  showCart();
};
