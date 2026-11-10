/**
 * Creates a gallery with precise touch handling and pinch-to-zoom
 * @param {string} divId - ID of the container div
 * @param {...string} mediaUrls - Array of image/video URLs
 */
function createGallery(divId, ...mediaUrls) {
    const galleryDiv = document.getElementById(divId);
    if (!galleryDiv) return;

    // Setup gallery structure
    galleryDiv.className = 'gallery-container';
    galleryDiv.innerHTML = `
        <div class="gallery-slider"></div>
        <div class="gallery-counter">1/${mediaUrls.length}</div>
    `;

    const slider = galleryDiv.querySelector('.gallery-slider');
    const counter = galleryDiv.querySelector('.gallery-counter');
    let currentIndex = 0;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;
    let isHorizontal = false;
    let sliderPosition = 0;
    const SWIPE_THRESHOLD = 50;
    const DIRECTION_THRESHOLD = 10;
    
    // Zoom variables
    let initialDistance = 0;
    let currentScale = 1;
    let isZooming = false;
    let zoomTransformOrigin = '50% 50%';
    let activeSlide = null;

    // Create slides with skeleton loading
    mediaUrls.forEach((url, index) => {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        
        // Non-interactive skeleton
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-box';
        slide.appendChild(skeleton);

        let mediaElement;
        if (url.match(/\.(mp4|webm)$/i)) {
            mediaElement = document.createElement('video');
            mediaElement.controls = true;
            mediaElement.muted = true;
        } else {
            mediaElement = document.createElement('img');
            mediaElement.alt = `Slide ${index + 1}`;
        }

        mediaElement.onload = mediaElement.onloadeddata = () => {
            slide.classList.add('loaded');
            skeleton.style.display = 'none';
        };
        
        mediaElement.src = url;
        slide.appendChild(mediaElement);
        slider.appendChild(slide);
    });

    // Update slide counter
    function updateCounter() {
        counter.textContent = `${currentIndex + 1}/${mediaUrls.length}`;
    }

    // Navigate to specific slide
    function goToSlide(index) {
        if (index < 0 || index >= mediaUrls.length) return;
        currentIndex = index;
        sliderPosition = -currentIndex * 100;
        slider.style.transform = `translateX(${sliderPosition}%)`;
        updateCounter();
        resetZoom();
    }

    // Reset zoom state
    function resetZoom() {
        currentScale = 1;
        const slides = document.querySelectorAll('.gallery-slide');
        slides.forEach(slide => {
            slide.style.transform = 'scale(1)';
            slide.style.transformOrigin = '50% 50%';
        });
        isZooming = false;
    }

    // Calculate distance between two touch points
    function getTouchDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Calculate midpoint between two touch points
    function getTouchMidpoint(touch1, touch2) {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    }

    // Touch event handlers
    function handleTouchStart(e) {
        if (e.touches.length === 2) {
            // Pinch zoom start
            isZooming = true;
            isDragging = false;
            initialDistance = getTouchDistance(e.touches[0], e.touches[1]);
            
            // Get the active slide (current slide in view)
            activeSlide = slider.children[currentIndex];
            
            // Calculate transform origin based on touch midpoint
            const midpoint = getTouchMidpoint(e.touches[0], e.touches[1]);
            const rect = activeSlide.getBoundingClientRect();
            zoomTransformOrigin = `${((midpoint.x - rect.left) / rect.width * 100)}% ${((midpoint.y - rect.top) / rect.height * 100)}%`;
            
            e.preventDefault();
            return;
        }

        // Single touch - swipe start
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        currentX = startX;
        isDragging = true;
        isHorizontal = false;
        slider.style.transition = 'none';
    }

    function handleTouchMove(e) {
        if (e.touches.length === 2 && isZooming) {
            // Pinch zoom in progress
            const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
            const scale = Math.max(1, Math.min(currentDistance / initialDistance * currentScale, 5));
            
            // Apply zoom to active slide
            activeSlide.style.transformOrigin = zoomTransformOrigin;
            activeSlide.style.transform = `scale(${scale})`;
            
            e.preventDefault();
            return;
        }

        if (!isDragging) return;
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const diffX = touchX - startX;
        const diffY = touchY - startY;
        
        // Determine direction if not already determined
        if (!isHorizontal && Math.abs(diffX) < DIRECTION_THRESHOLD && Math.abs(diffY) < DIRECTION_THRESHOLD) {
            return;
        }
        
        if (!isHorizontal) {
            isHorizontal = Math.abs(diffX) > Math.abs(diffY);
            
            if (!isHorizontal) {
                isDragging = false;
                return;
            }
            
            e.preventDefault();
        }
        
        const deltaX = touchX - currentX;
        currentX = touchX;
        
        const newPosition = sliderPosition + (deltaX / galleryDiv.offsetWidth * 100);
        const maxPosition = 0;
        const minPosition = -(mediaUrls.length - 1) * 100;
        
        if (newPosition > maxPosition) {
            sliderPosition = maxPosition + (newPosition - maxPosition) * 0.3;
        } else if (newPosition < minPosition) {
            sliderPosition = minPosition + (newPosition - minPosition) * 0.3;
        } else {
            sliderPosition = newPosition;
        }
        
        slider.style.transform = `translateX(${sliderPosition}%)`;
    }

    function handleTouchEnd(e) {
        if (isZooming) {
            // Update current scale if we were zooming
            if (activeSlide) {
                const transform = window.getComputedStyle(activeSlide).transform;
                const matrix = transform.match(/^matrix\((.+)\)$/);
                if (matrix && matrix[1]) {
                    const values = matrix[1].split(', ');
                    if (values.length === 6) {
                        currentScale = parseFloat(values[0]); // a value of the matrix represents scaleX
                    }
                }
            }
            isZooming = false;
            return;
        }

        if (!isDragging) return;
        
        isDragging = false;
        slider.style.transition = 'transform 0.3s ease-out';
        
        if (!isHorizontal) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;
        
        if (Math.abs(diffX) > SWIPE_THRESHOLD) {
            if (diffX < 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        } else {
            goToSlide(currentIndex);
        }
    }

    // Mouse event handlers (for desktop)
    function handleMouseDown(e) {
        startX = e.clientX;
        currentX = startX;
        isDragging = true;
        isHorizontal = false;
        slider.style.transition = 'none';
        galleryDiv.style.cursor = 'grabbing';
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const diffX = mouseX - startX;
        const diffY = mouseY - startY;
        
        if (!isHorizontal && Math.abs(diffX) < DIRECTION_THRESHOLD && Math.abs(diffY) < DIRECTION_THRESHOLD) {
            return;
        }
        
        if (!isHorizontal) {
            isHorizontal = Math.abs(diffX) > Math.abs(diffY);
            
            if (!isHorizontal) {
                isDragging = false;
                galleryDiv.style.cursor = '';
                return;
            }
        }
        
        const deltaX = mouseX - currentX;
        currentX = mouseX;
        
        const newPosition = sliderPosition + (deltaX / galleryDiv.offsetWidth * 100);
        const maxPosition = 0;
        const minPosition = -(mediaUrls.length - 1) * 100;
        
        if (newPosition > maxPosition) {
            sliderPosition = maxPosition + (newPosition - maxPosition) * 0.3;
        } else if (newPosition < minPosition) {
            sliderPosition = minPosition + (newPosition - minPosition) * 0.3;
        } else {
            sliderPosition = newPosition;
        }
        
        slider.style.transform = `translateX(${sliderPosition}%)`;
        e.preventDefault();
    }

    function handleMouseUp(e) {
        if (!isDragging) return;
        
        isDragging = false;
        slider.style.transition = 'transform 0.3s ease-out';
        galleryDiv.style.cursor = '';
        
        if (!isHorizontal) return;
        
        const endX = e.clientX;
        const diffX = endX - startX;
        
        if (Math.abs(diffX) > SWIPE_THRESHOLD) {
            if (diffX < 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        } else {
            goToSlide(currentIndex);
        }
    }

    // Double tap to zoom/unzoom
    function handleDoubleTap(e) {
        if (e.touches && e.touches.length > 1) return;
        
        const slide = slider.children[currentIndex];
        if (currentScale === 1) {
            // Zoom in
            const rect = slide.getBoundingClientRect();
            const originX = (e.clientX - rect.left) / rect.width * 100;
            const originY = (e.clientY - rect.top) / rect.height * 100;
            slide.style.transformOrigin = `${originX}% ${originY}%`;
            slide.style.transform = 'scale(2)';
            currentScale = 2;
        } else {
            // Zoom out
            slide.style.transform = 'scale(1)';
            currentScale = 1;
        }
    }

    // Add event listeners
    galleryDiv.addEventListener('touchstart', handleTouchStart, { passive: false });
    galleryDiv.addEventListener('touchmove', handleTouchMove, { passive: false });
    galleryDiv.addEventListener('touchend', handleTouchEnd);
    
    // Add double tap listener
    let lastTap = 0;
    galleryDiv.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            handleDoubleTap(e);
        }
        lastTap = currentTime;
    });
    
    galleryDiv.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Reset zoom when changing slides
    galleryDiv.addEventListener('transitionend', function() {
        if (!isDragging) {
            resetZoom();
        }
    });

    // Initialize
    goToSlide(0);
}