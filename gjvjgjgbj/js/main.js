// Initialize the page
function init() {
  renderProducts(products);
  renderRecentSearches();
  setupEventListeners();
  updateCartCount();
}

// Set up event listeners
function setupEventListeners() {
  // Filter modal
  document.getElementById('open-filter').addEventListener('click', openFilterModal);
  document.getElementById('close-filter').addEventListener('click', closeFilterModal);
  document.getElementById('reset-filters').addEventListener('click', resetFilters);
  document.getElementById('apply-filters').addEventListener('click', applyFilters);
  
  // Category filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const category = this.dataset.category;
      if (category === 'all') {
        currentFilters.category = [];
      } else {
        currentFilters.category = [category];
      }
      
      filterAndSortProducts();
    });
  });
  
  // Sort options
  document.getElementById('sort-btn').addEventListener('click', toggleSortOptions);
  document.querySelectorAll('.sort-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active'));
      this.classList.add('active');
      currentSort = this.dataset.sort;
      filterAndSortProducts();
      document.getElementById('sort-options').classList.remove('show');
    });
  });
  
  // Search functionality
  document.getElementById('open-search').addEventListener('click', openSearchModal);
  document.getElementById('close-search').addEventListener('click', closeSearchModal);
  document.getElementById('search-input').addEventListener('input', handleSearchInput);
  document.getElementById('clear-recent').addEventListener('click', clearRecentSearches);
  
  // Quick view modal
  document.getElementById('close-quick-view').addEventListener('click', closeQuickViewModal);
  document.getElementById('add-to-cart').addEventListener('click', addToCartFromQuickView);
  
  // Cart icon
  document.getElementById('cart-icon').addEventListener('click', function() {
    alert('Cart page would be implemented here');
  });
  
  // Bottom navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('filter-modal')) {
      closeFilterModal();
    }
    if (event.target === document.getElementById('quick-view-modal')) {
      closeQuickViewModal();
    }
    if (!event.target.closest('#sort-options') && event.target !== document.getElementById('sort-btn')) {
      document.getElementById('sort-options').classList.remove('show');
    }
  });
}

// Open filter modal
function openFilterModal() {
  document.getElementById('filter-modal').style.display = 'block';
}

// Close filter modal
function closeFilterModal() {
  document.getElementById('filter-modal').style.display = 'none';
}

// Reset filters
function resetFilters() {
  // Uncheck all checkboxes
  document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  // Check first radio button in each radio group
  document.querySelectorAll('.filter-section input[type="radio"]').forEach((radio, index) => {
    radio.checked = index === 0;
  });
  
  // Reset current filters
  currentFilters = {
    category: [],
    price: "all",
    brand: [],
    rating: []
  };
}

// Apply filters
function applyFilters() {
  // Get selected categories
  currentFilters.category = Array.from(
    document.querySelectorAll('input[data-filter="category"]:checked')
  ).map(el => el.value);
  
  // Get selected price range
  currentFilters.price = document.querySelector('input[data-filter="price"]:checked').value;
  
  // Get selected brands
  currentFilters.brand = Array.from(
    document.querySelectorAll('input[data-filter="brand"]:checked')
  ).map(el => el.value);
  
  // Get selected ratings
  currentFilters.rating = Array.from(
    document.querySelectorAll('input[data-filter="rating"]:checked')
  ).map(el => el.value);
  
  filterAndSortProducts();
  closeFilterModal();
}

// Toggle sort options
function toggleSortOptions() {
  document.getElementById('sort-options').classList.toggle('show');
}

// Open search modal
function openSearchModal() {
  document.getElementById('search-modal').style.display = 'block';
  document.getElementById('search-input').focus();
  document.getElementById('search-results').style.display = 'none';
  document.getElementById('no-results').style.display = 'none';
  document.getElementById('recent-searches').style.display = 'block';
}

// Close search modal
function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-input').value = '';
}

// Handle search input
function handleSearchInput(event) {
  const searchTerm = event.target.value.trim().toLowerCase();
  
  if (searchTerm.length === 0) {
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('no-results').style.display = 'none';
    document.getElementById('recent-searches').style.display = 'block';
    return;
  }
  
  // Show loading spinner
  document.getElementById('search-loading').style.display = 'block';
  document.getElementById('search-results').style.display = 'none';
  document.getElementById('no-results').style.display = 'none';
  document.getElementById('recent-searches').style.display = 'none';
  
  // Simulate API delay
  setTimeout(() => {
    performSearch(searchTerm);
    document.getElementById('search-loading').style.display = 'none';
  }, 500);
}

// Close quick view
function closeQuickViewModal() {
  document.getElementById('quick-view-modal').style.display = 'none';
}

// Initialize the page
init();