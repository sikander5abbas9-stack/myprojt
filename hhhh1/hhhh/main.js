
function openSecondPage() {
    parent.postMessage('switch-to-second', '*');
}


function showbottomandtopbar(activeIcon) {
  const navItems = [
    { name: 'home', label: 'Home', url: '../' },
    { name: 'cata', label: 'Categories', url: '../category/' },
    { name: 'cart', label: 'Cart', url: '../card/' },
    { name: 'profile', label: 'Account', url: '../profile/' }
  ];
  
  const cartCount = localStorage.getItem('cartCount') || 0;
  
  let html = '';
  
  navItems.forEach(item => {
    const isActive = item.name === activeIcon;
    const imgSrc = isActive ? `../icons/${item.name} 1.svg` : `../icons/${item.name}.svg`;
    const activeClass = isActive ? 'nav-item active' : 'nav-item';
    
    html += `
            <a href="${item.url}" target="_top" class="${activeClass}">
                <img src="${imgSrc}" class="icon" alt="${item.label}">
                <span class="nav-label">${item.label}</span>
                ${item.name === 'cart' && cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
            </a>
        `;
  });
  
  document.getElementById('bottom-bar').innerHTML = html;
  
  main(); // optional main() call
}

function main() {
  const style = document.createElement('style');
  
  
  style.innerHTML = `
    /* ========== ENHANCED BOTTOM BAR ========== */
#bottom-bar {
    background-color: #088178;
    padding: 8px 0 5px;
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 65px;
 border-radius: 20px 20px 0px 0;
    width: 100%;
    z-index: 100;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    
    
}

#bottom-bar .nav-item {
    position: relative;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 25%;
    padding: 5px 0;
}

#bottom-bar .icon {
    width: 28px;
    height: 28px;
    margin-bottom: 4px;
    transition: all 0.3s ease;
}

#bottom-bar .nav-label {
    font-size: 25px;
    color: #fff;
    font-weight: 500;
    transition: all 0.3s ease;
    text-transform: capitalize;
}

#bottom-bar .nav-item.active .nav-label {
    
}

#bottom-bar .nav-item.active .icon {
    transform: translateY(-7px);
}
#bottom-bar .cart-badge {
    position: absolute;
    top: -3px;
    
    right: 22%;
    background-color: red;
    color: white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    border: 2px solid white;
}

/* Active state indicator */
#bottom-bar .nav-item.active::before {
    content: '';
    position: absolute;
    top: -5px;
    width: 35px;
    height: 35px;
    background-color: #fff;
    border-radius: 5px;
}

/* Mobile optimizations */
@media (max-width: 360px) {
    #bottom-bar {
        height: 70px;
        padding: 14px 0 0 0;
    }
    
    $bottom-bar .icon {
        width: 25px;
        height: 25px;
    }
    
    #bottom-bar .nav-label {
        font-size: 12px;
    }
}





  `;
  
  
  
  document.head.appendChild(style);
  
}

  // This should be in shop.html
window.addEventListener('message', function(event) {
  if (event.data.isSticky) {
    // If sticky (received 'yes')
    document.querySelectorAll('.swiper-slide').forEach(slide => {
      slide.style.overflowY = 'auto';
    });
  } else {
    // If not sticky (received 'no')
    document.querySelectorAll('.swiper-slide').forEach(slide => {
      slide.style.overflowY = 'hidden';
    });
  }
});
