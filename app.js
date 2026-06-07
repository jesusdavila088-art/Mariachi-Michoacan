const mobileMenu = document.getElementById('mobile-menu');
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('nav ul li a');

function setMenuOpen(isOpen) {
    if (!header || !mobileMenu) return;

    header.classList.toggle('nav-open', isOpen);
    mobileMenu.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');

    const icon = mobileMenu.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-times', isOpen);
    }
}

if (mobileMenu && header) {
    mobileMenu.addEventListener('click', () => {
        setMenuOpen(!header.classList.contains('nav-open'));
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => setMenuOpen(false));
    });
}

function pauseCarouselMedia(carousel) {
    carousel.querySelectorAll('video').forEach((video) => {
        video.pause();
    });

    carousel.querySelectorAll('iframe').forEach((iframe) => {
        const src = iframe.getAttribute('src');
        if (src && !src.includes('VIDEO_ID')) {
            iframe.setAttribute('src', src);
        }
    });
}

function initCarousel(carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer || slides.length === 0) return;

    let currentIndex = 0;
    let autoplayId = null;
    const AUTOPLAY_MS = 5000;
    const isVideoCarousel = carousel.classList.contains('galeria-carousel--video');

    dotsContainer.innerHTML = '';

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (index === 0 ? ' is-active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Ir al elemento ${index + 1}`);
        dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
        pauseCarouselMedia(carousel);

        currentIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, i) => {
            slide.classList.toggle('is-active', i === currentIndex);
        });

        dots.forEach((dot, i) => {
            const active = i === currentIndex;
            dot.classList.toggle('is-active', active);
            dot.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
        if (isVideoCarousel) return;
        stopAutoplay();
        autoplayId = window.setInterval(nextSlide, AUTOPLAY_MS);
    }

    function stopAutoplay() {
        if (autoplayId !== null) {
            window.clearInterval(autoplayId);
            autoplayId = null;
        }
    }

    prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoplay();
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    carousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            prevSlide();
            startAutoplay();
        } else if (event.key === 'ArrowRight') {
            nextSlide();
            startAutoplay();
        }
    });

    let touchStartX = 0;

    carousel.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    carousel.addEventListener('touchend', (event) => {
        const delta = event.changedTouches[0].screenX - touchStartX;
        if (Math.abs(delta) > 50) {
            if (delta < 0) nextSlide();
            else prevSlide();
        }
        startAutoplay();
    }, { passive: true });

    startAutoplay();
}

function initGaleriaTabs() {
    const tabs = document.querySelectorAll('[data-galeria-tab]');
    const panels = document.querySelectorAll('.galeria-panel');

    if (tabs.length === 0 || panels.length === 0) return;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-galeria-tab');

            tabs.forEach((item) => {
                const active = item === tab;
                item.classList.toggle('is-active', active);
                item.setAttribute('aria-selected', active ? 'true' : 'false');
            });

            panels.forEach((panel) => {
                const active = panel.id === `galeria-${target}`;
                panel.classList.toggle('is-active', active);
                panel.hidden = !active;

                if (!active) {
                    panel.querySelectorAll('.galeria-carousel').forEach(pauseCarouselMedia);
                }
            });
        });
    });
}

document.querySelectorAll('.galeria-carousel').forEach(initCarousel);
initGaleriaTabs();

console.log("Sitio web del Mariachi Michoacán cargado exitosamente.");
