// Cart data
let cart = [];

// Update cart count
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-count').style.display = count > 0 ? 'flex' : 'none';
}

// Add to cart from quick view
function addToCartFromQuickView() {
  const productId = parseInt(document.getElementById('add-to-cart').dataset.productId);
  const product = products.find(p => p.id === productId);
  
  if (product) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    updateCartCount();
    alert(`${product.title} added to cart`);
    closeQuickViewModal();
  }
}

// Toggle wishlist
function toggleWishlist(event) {
  const icon = event.currentTarget;
  icon.classList.toggle('far');
  icon.classList.toggle('fas');
  icon.classList.toggle('active');
  
  // Here you would typically update the wishlist in your backend
}