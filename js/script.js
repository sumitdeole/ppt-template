let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let isFullscreen = false;

function showSlide(n) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
    
    document.getElementById('slideInfo').textContent = `${currentSlide + 1} / ${totalSlides}`;
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleFullscreen() {
    const elem = document.documentElement;
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (!isFullscreen) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        fullscreenBtn.innerHTML = '🗗';
        fullscreenBtn.title = 'Exit Fullscreen (ESC)';
        isFullscreen = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        fullscreenBtn.innerHTML = '📺';
        fullscreenBtn.title = 'Fullscreen (F11)';
        isFullscreen = false;
    }
}

function togglePresentationMode() {
    const container = document.querySelector('.presentation-container');
    const body = document.body;
    const presentBtn = document.getElementById('presentBtn');
    
    container.classList.toggle('presentation-mode');
    body.classList.toggle('presentation-active');
    
    if (container.classList.contains('presentation-mode')) {
        presentBtn.innerHTML = '🔙';
        presentBtn.title = 'Exit Present Mode (ESC)';
    } else {
        presentBtn.innerHTML = '🎯';
        presentBtn.title = 'Present Mode (Ctrl+P)';
    }
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!document.fullscreenElement && !document.mozFullScreenElement && 
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        fullscreenBtn.innerHTML = '📺';
        fullscreenBtn.title = 'Fullscreen (F11)';
        isFullscreen = false;
    }
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
            const container = document.querySelector('.presentation-container');
            if (container.classList.contains('presentation-mode')) {
                togglePresentationMode();
            }
            break;
    }
});

// Initialize charts
function initializeCharts() {
    const ctx = document.getElementById('performanceChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue ($K)',
                    data: [45, 52, 48, 61, 58, 67, 72, 78, 85, 82, 79, 88],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3498db',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            color: '#7f8c8d'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            color: '#7f8c8d'
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#2980b9'
                    }
                }
            }
        });
    }
}

// Initialize presentation
document.addEventListener('DOMContentLoaded', function() {
    showSlide(0);
    // Wait a bit for DOM to be fully ready before initializing charts
    setTimeout(initializeCharts, 100);
});