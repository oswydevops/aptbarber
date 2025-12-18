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

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

// Cerrar al hacer clic en un enlace
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
    });
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