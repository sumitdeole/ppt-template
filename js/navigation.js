let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let isFullscreen = false;

function showSlide(n) {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    
    // Update current slide index
    currentSlide = (n + totalSlides) % totalSlides;
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    
    // Update navigation info
    document.getElementById('slideInfo').textContent = `${currentSlide + 1} / ${totalSlides}`;
    
    // Update button states
    document.getElementById('prevBtn').disabled = currentSlide === 0;
    document.getElementById('nextBtn').disabled = currentSlide === totalSlides - 1;
}

function changeSlide(direction) {
    const newSlide = currentSlide + direction;
    if (newSlide >= 0 && newSlide < totalSlides) {
        showSlide(newSlide);
        smoothScrollToTop();
    }
}

function smoothScrollToTop() {
    window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
    });
}

// Fullscreen functionality
function toggleFullscreen() {
    const elem = document.documentElement;
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (!isFullscreen) {
        // Enter fullscreen
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
        fullscreenBtn.innerHTML = '🗗 Exit Fullscreen';
        isFullscreen = true;
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        fullscreenBtn.innerHTML = '📺 Fullscreen';
        isFullscreen = false;
    }
}

// Listen for fullscreen changes (when user presses ESC)
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!document.fullscreenElement && !document.mozFullScreenElement && 
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        fullscreenBtn.innerHTML = '📺 Fullscreen';
        isFullscreen = false;
    }
}

// Auto-fit slides to viewport
function fitSlideToViewport() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        const viewportHeight = window.innerHeight;
        const slideContent = slide.scrollHeight;
        
        if (slideContent > viewportHeight) {
            // If content is taller than viewport, scale it down
            const scale = (viewportHeight - 100) / slideContent;
            slide.style.transform = `scale(${Math.min(scale, 1)})`;
            slide.style.transformOrigin = 'top center';
        } else {
            slide.style.transform = 'none';
        }
    });
}

// Presentation mode (removes margins and maximizes space)
function togglePresentationMode() {
    const container = document.querySelector('.presentation-container');
    const body = document.body;
    
    container.classList.toggle('presentation-mode');
    body.classList.toggle('presentation-active');
    
    const presentBtn = document.getElementById('presentBtn');
    if (container.classList.contains('presentation-mode')) {
        presentBtn.innerHTML = '🔙 Exit Present';
    } else {
        presentBtn.innerHTML = '🎯 Present Mode';
    }
    
    // Refit slides after mode change
    setTimeout(fitSlideToViewport, 100);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowLeft':
            changeSlide(-1);
            break;
        case 'ArrowRight':
            changeSlide(1);
            break;
        case 'Home':
            showSlide(0);
            break;
        case 'End':
            showSlide(totalSlides - 1);
            break;
        case 'F11':
            e.preventDefault();
            toggleFullscreen();
            break;
        case 'f':
        case 'F':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleFullscreen();
            }
            break;
        case 'p':
        case 'P':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                togglePresentationMode();
            }
            break;
        case 'Escape':
            // Exit presentation mode with ESC
            const container = document.querySelector('.presentation-container');
            if (container.classList.contains('presentation-mode')) {
                togglePresentationMode();
            }
            break;
    }
});

// Initialize presentation
document.addEventListener('DOMContentLoaded', function() {
    showSlide(0);
    fitSlideToViewport();
});

// Refit slides when window is resized
window.addEventListener('resize', fitSlideToViewport);

// Optional: Auto-play functionality
function startAutoPlay(interval = 10000) {
    return setInterval(() => {
        if (currentSlide < totalSlides - 1) {
            changeSlide(1);
        }
    }, interval);
}

// Uncomment to enable auto-play
// const autoPlay = startAutoPlay(8000); // Change slide every 8 seconds