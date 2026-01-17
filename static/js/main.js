// Scroll suave header
window.addEventListener('scroll', () => {
    document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 50);
});

// Duplicar carrusel para loop infinito
const track = document.querySelector('.gallery-track');
if (track) {
    track.innerHTML += track.innerHTML;
}

// Animaciones al hacer scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Menú hamburguesa móvil
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

// Prevenir scroll cuando el menú está abierto
function toggleBodyScroll(isOpen) {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
}

hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    toggleBodyScroll(isActive);
});

// Cerrar al hacer clic en un enlace
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        toggleBodyScroll(false);
    });
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    if (hamburger.classList.contains('active') &&
        !e.target.closest('.hamburger') &&
        !e.target.closest('.mobile-nav')) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        toggleBodyScroll(false);
    }
});

// Duplicar para loop infinito
const galleryTrack = document.getElementById('galleryTrack');
if (galleryTrack) {
    galleryTrack.innerHTML += galleryTrack.innerHTML;
}

// Desplazamiento suave con flechas
let currentScroll = 0;
const scrollAmount = 380;

document.getElementById('nextBtn')?.addEventListener('click', () => {
    currentScroll += scrollAmount;
    galleryTrack.style.transform = `translateX(-${currentScroll}px)`;
});

document.getElementById('prevBtn')?.addEventListener('click', () => {
    currentScroll -= scrollAmount;
    if (currentScroll < 0) currentScroll = 0;
    galleryTrack.style.transform = `translateX(-${currentScroll}px)`;
});