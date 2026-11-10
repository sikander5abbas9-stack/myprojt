// Store references to original elements
let originalMainContent = null;
let searchOverlay = null;
let isSearchActive = false;

// Add CSS dynamically
const searchCSS = `
.search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 10000;
    padding: 15px;
    overflow-y: auto;
}
.search-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    position: sticky;
    top: 0;
    background: white;
    padding: 10px 0;
    z-index: 100;
}
.search-input {
    flex: 1;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.search-input:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}
.back-button {
    background: none;
    border: none;
    font-size: 24px;
    margin-right: 10px;
    cursor: pointer;
    padding: 8px;
}
.search-button {
    margin-left: 10px;
    padding: 12px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
}
.search-results {
    padding: 10px 0;
}
.hidden-content {
    display: none !important;
}
@media (max-width: 768px) {
    .search-header {
        padding-top: env(safe-area-inset-top);
    }
    .search-input {
        font-size: 16px !important;
        padding: 14px 15px;
    }
}
`;

// Inject CSS
const styleTag = document.createElement('style');
styleTag.textContent = searchCSS;
document.head.appendChild(styleTag);

// Focus with mobile support
function focusSearchInput() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    // Multiple focus methods for maximum compatibility
    searchInput.focus();
    searchInput.setAttribute('autofocus', 'true');
    
    // Timeout helps on some mobile devices
    setTimeout(() => {
        searchInput.focus();
        
        // Scroll to input if needed (for mobile)
        if ('scrollIntoView' in searchInput) {
            searchInput.scrollIntoView({block: 'center', behavior: 'smooth'});
        }
    }, 100);
}

// Show search page
function showSearchPage() {
    if (isSearchActive) {
        focusSearchInput();
        return;
    }

    // Find main content (excluding scripts)
    originalMainContent = document.querySelector('main, .main-content, .content, #content') || 
                         Array.from(document.body.children).find(el => el.tagName !== 'SCRIPT');
    
    if (originalMainContent) {
        originalMainContent.classList.add('hidden-content');
    }

    // Create search overlay
    searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-header">
            <button class="back-button">←</button>
            <input type="text" class="search-input" placeholder="Search...">
            <button class="search-button">Search</button>
        </div>
        <div class="search-results"></div>
    `;

    // Add to body (preserving scripts)
    document.body.insertBefore(searchOverlay, document.body.firstChild);
    
    // Set up events
    searchOverlay.querySelector('.back-button').addEventListener('click', hideSearchPage);
    searchOverlay.querySelector('.search-button').addEventListener('click', performSearch);
    searchOverlay.querySelector('.search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    isSearchActive = true;
    focusSearchInput();
    
    // History management
    window.addEventListener('popstate', handleBackButton);
    history.pushState({isSearchActive: true}, '');
}

// Hide search page
function hideSearchPage() {
    if (!isSearchActive) return;

    if (searchOverlay && searchOverlay.parentNode) {
        searchOverlay.parentNode.removeChild(searchOverlay);
    }
    
    if (originalMainContent) {
        originalMainContent.classList.remove('hidden-content');
    }

    isSearchActive = false;
    originalMainContent = null;
    searchOverlay = null;
    
    window.removeEventListener('popstate', handleBackButton);
}

// Handle back button
function handleBackButton(event) {
    if (isSearchActive && (!event.state || event.state.isSearchActive)) {
        hideSearchPage();
        history.pushState(null, '');
        if (event.cancelable) event.preventDefault();
    }
}

// Sample search function
function performSearch() {
    const input = document.querySelector('.search-input');
    const resultsDiv = document.querySelector('.search-results');
    if (!input || !resultsDiv) return;
    
    const query = input.value.trim();
    resultsDiv.innerHTML = query ? 
        `<p>Search results for: <strong>${query}</strong></p>` : 
        '<p>Please enter a search term</p>';
}

// Initialize search triggers
function initSearch() {
    document.querySelectorAll('.search-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showSearchPage();
        });
    });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}