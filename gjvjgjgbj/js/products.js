// Sample product data
const products = [
    {
        id: 1,
        title: "Xiaomi Redmi Note 10 Pro 6GB 128GB - Onyx Gray",
        price: 39999,
        originalPrice: 45999,
        discount: 13,
        rating: 4.5,
        reviews: 125,
        category: "mobile",
        brand: "xiaomi",
        image: "https://static-01.daraz.pk/p/7a1f5d1a6a6a8a8a8a8a8a8a8a8a8a8.jpg",
        description: "6.67\" AMOLED Display, 108MP Quad Camera, 5020mAh Battery, Snapdragon 732G"
    },
    {
        id: 2,
        title: "Samsung Galaxy A52 8GB 256GB - Awesome Black",
        price: 59999,
        originalPrice: 64999,
        discount: 8,
        rating: 4.0,
        reviews: 89,
        category: "mobile",
        brand: "samsung",
        image: "https://static-01.daraz.pk/p/7a1f5d1a6a6a8a8a8a8a8a8a8a8a8.jpg",
        description: "6.5\" Super AMOLED Display, 64MP Quad Camera, 4500mAh Battery, IP67 Water Resistance"
    },
    {
        id: 3,
        title: "Infinix Hot 10 Play 4GB 64GB - Morandi Green",
        price: 19999,
        originalPrice: 24999,
        discount: 20,
        rating: 3.0,
        reviews: 45,
        category: "mobile",
        brand: "infinix",
        image: "https://static-01.daraz.pk/p/7a1f5d1a6a6a8a8a8a8a8a8a8a8a8.jpg",
        description: "6.82\" HD+ Display, 13MP Dual Camera, 6000mAh Battery, Helio G35 Processor"
    },
    {
        id: 4,
        title: "Oppo A74 6GB 128GB - Prism Black",
        price: 34999,
        originalPrice: 39999,
        discount: 13,
        rating: 4.5,
        reviews: 76,
        category: "mobile",
        brand: "oppo",
        image: "https://static-01.daraz.pk/p/7a1f5d1a6a6a8a8a8a8a8a8a8a8a8.jpg",
        description: "6.43\" AMOLED Display, 48MP Triple Camera, 5000mAh Battery, Snapdragon 662"
    },
    {
        id: 5,
        title: "Vivo Y20 4GB 64GB - Purist Blue",
        price: 29999,
        originalPrice: 34999,
        discount: 14,
        rating: 3.0,
        reviews: 32,
        category: "mobile",
        brand: "vivo",
        image: "https://static-01.daraz.pk/p/7a1f5d1a6a6a8a8a8a8a8a8a8a8a8.jpg",
        description: "6.51\" HD+ Display, 13MP Triple Camera, 5000mAh Battery, Helio P35 Processor"
    },
    {
        id: 6,
        title: "Realme 8 Pro 8GB 128GB - Infinite Blue",
        price: 49999,
        originalPrice: 54999,
        discount: 9,
        rating: 5.0,
        reviews: 112,
        category: "mobile",
        brand: "realme",
        image: "https://static-01.daraz.pk/p/7a1f5d1a6a6a8a8a8a8a8a8a8a8a8.jpg",
        description: "6.4\" Super AMOLED Display, 108MP Quad Camera, 4500mAh Battery, Snapdragon 720G"
    },
    {
        id: 7,
        title: "Samsung Galaxy Tab A7 Lite 3GB 32GB - Gray",
        price: 34999,
        originalPrice: 39999,
        discount: 13,
        rating: 4.0,
        reviews: 42,
        category: "tablets",
        brand: "samsung",
        image: "https://static-01.daraz.pk/p/7a1f5d1a6a6a8a8a8a8a8a8a8a8a8.jpg",
        description: "8.7\" Display, 5100mAh Battery, Dolby Atmos Sound, LTE Support"
    },
    {
        id: 8,
        title: "Xiaomi Mi Band 6 - Black",
        price: 5999,
        originalPrice: 6999,
        discount: 14,
        rating: 4.5,
        reviews: 215,
        category: "accessories",
        brand: "xiaomi",
        image: "https://static-01.daraz.pk/p/7a1f5d1a6a6a8a8a8a8a8a8a8a8a8.jpg",
        description: "1.56\" AMOLED Display, SpO2 Monitoring, 30 Sports Modes, 14-Day Battery Life"
    },
    {
        id: 9,
        title: "HP Pavilion 15-EG0023DX Laptop",
        price: 129999,
        originalPrice: 139999,
        discount: 7,
        rating: 4.5,
        reviews: 78,
        category: "laptop",
        brand: "hp",
        image: "https://static-01.daraz.pk/p/7a1f5d1a6a6a8a8a8a8a8a8a8a8a8.jpg",
        description: "11th Gen Intel Core i7, 16GB RAM, 512GB SSD, 15.6\" FHD Display"
    },
    {
        id: 10,
        title: "Dell Inspiron 3505 Laptop",
        price: 79999,
        originalPrice: 89999,
        discount: 11,
        rating: 4.0,
        reviews: 56,
        category: "laptop",
        brand: "dell",
        image: "https://static-01.daraz.pk/p/7a1f5d1a6a6a8a8a8a8a8a8a8a8a8.jpg",
        description: "AMD Ryzen 5, 8GB RAM, 256GB SSD, 15.6\" HD Display"
    }
];

// Recent searches
let recentSearches = ["Mobile phones", "Laptops", "Headphones"];

// Current filters
let currentFilters = {
    category: [],
    price: "all",
    brand: [],
    rating: []
};

// Current sort
let currentSort = "newest";

// Render products
function renderProducts(productsToRender) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsContainer.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 20px;">No products found matching your filters</div>';
        document.getElementById('item-count').textContent = '0 items found';
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <i class="far fa-heart wishlist-icon" data-product-id="${product.id}"></i>
            <img src="${product.image}" alt="${product.title}" class="product-image" data-product-id="${product.id}">
            <div class="product-info">
                <div class="product-title" data-product-id="${product.id}">${product.title}</div>
                <div class="product-price">Rs. ${product.price.toLocaleString()} <span class="original-price">Rs. ${product.originalPrice.toLocaleString()}</span> <span class="discount">-${product.discount}%</span></div>
                <div class="rating">
                    ${renderStars(product.rating)} (${product.reviews})
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
    
    // Update item count
    document.getElementById('item-count').textContent = `${productsToRender.length} ${productsToRender.length === 1 ? 'item' : 'items'} found`;
    
    // Add event listeners to new elements
    document.querySelectorAll('.wishlist-icon').forEach(icon => {
        icon.addEventListener('click', toggleWishlist);
    });
    
    document.querySelectorAll('.product-image, .product-title').forEach(el => {
        el.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            openQuickView(productId);
        });
    });
}

// Render star rating
function renderStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Filter and sort products
function filterAndSortProducts() {
    let filteredProducts = [...products];
    
    // Apply category filter
    if (currentFilters.category.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            currentFilters.category.includes(product.category)
        );
    }
    
    // Apply price filter
    if (currentFilters.price !== 'all') {
        const [min, max] = currentFilters.price.split('-').map(Number);
        filteredProducts = filteredProducts.filter(product => {
            if (currentFilters.price === '60000-100000') {
                return product.price >= min;
            }
            return product.price >= min && product.price <= max;
        });
    }
    
    // Apply brand filter
    if (currentFilters.brand.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            currentFilters.brand.includes(product.brand)
        );
    }
    
    // Apply rating filter
    if (currentFilters.rating.length > 0) {
        const minRating = Math.min(...currentFilters.rating.map(Number));
        filteredProducts = filteredProducts.filter(product => 
            product.rating >= minRating
        );
    }
    
    // Apply sorting
    switch (currentSort) {
        case 'popular':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
        default:
            // Already sorted by newest (sample data is in order)
            break;
    }
    
    renderProducts(filteredProducts);
}

// Open quick view
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('quick-view-image').src = product.image;
    document.getElementById('quick-view-title').textContent = product.title;
    document.getElementById('quick-view-price').innerHTML = `Rs. ${product.price.toLocaleString()} <span class="original-price">Rs. ${product.originalPrice.toLocaleString()}</span> <span class="discount">-${product.discount}%</span>`;
    document.getElementById('quick-view-rating').innerHTML = `${renderStars(product.rating)} (${product.reviews})`;
    document.getElementById('quick-view-desc').textContent = product.description;
    document.getElementById('add-to-cart').dataset.productId = productId;
    
    document.getElementById('quick-view-modal').style.display = 'flex';
}

// Render recent searches
function renderRecentSearches() {
    const recentItemsContainer = document.querySelectorAll('.recent-search-item');
    recentItemsContainer.forEach((item, index) => {
        if (recentSearches[index]) {
            item.querySelector('span').textContent = recentSearches[index];
            item.style.display = 'flex';
            
            // Add click handler for recent search items
            item.addEventListener('click', function() {
                document.getElementById('search-input').value = recentSearches[index];
                handleSearchInput({ target: document.getElementById('search-input') });
            });
            
            // Add click handler for delete icon
            item.querySelector('i').addEventListener('click', function(e) {
                e.stopPropagation();
                recentSearches.splice(index, 1);
                renderRecentSearches();
            });
        } else {
            item.style.display = 'none';
        }
    });
}

// Clear recent searches
function clearRecentSearches() {
    recentSearches = [];
    renderRecentSearches();
}

// Perform search
function performSearch(searchTerm) {
    const results = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) || 
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    if (results.length > 0) {
        renderSearchResults(results);
        document.getElementById('search-results').style.display = 'block';
        document.getElementById('no-results').style.display = 'none';
    } else {
        document.getElementById('search-results').style.display = 'none';
        document.getElementById('no-results').style.display = 'block';
    }
    
    // Add to recent searches if not already there
    if (searchTerm.length > 0 && !recentSearches.includes(searchTerm)) {
        recentSearches.unshift(searchTerm);
        if (recentSearches.length > 5) {
            recentSearches.pop();
        }
        renderRecentSearches();
    }
}

// Render search results
function renderSearchResults(results) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    
    results.forEach(product => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="info">
                <div class="title">${product.title}</div>
                <div class="price">Rs. ${product.price.toLocaleString()}</div>
            </div>
        `;
        resultItem.addEventListener('click', function() {
            openQuickView(product.id);
            closeSearchModal();
        });
        searchResults.appendChild(resultItem);
    });
}