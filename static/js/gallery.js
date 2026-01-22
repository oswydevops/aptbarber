/**
 * Gallery Module - Funcionalidades de galería con mejor UX
 * Arquitectura modular siguiendo Clean Code principles
 *
 * Este módulo maneja la galería de imágenes con lightbox y scroll infinito.
 * Optimizado para performance y accesibilidad.
 */

class Gallery {
    constructor() {
        this.currentImageIndex = 0;
        this.images = [];
        this.lightbox = null;
        this.observers = new Map();
        this.eventListeners = new Map();
        this.init();
    }

    init() {
        this.collectImages();
        this.bindEvents();
        this.setupLightbox();
        this.setupInfiniteScroll();
        this.setupLazyLoading();
    }

    collectImages() {
        const imageElements = Utils.$$('.gallery-item img');
        this.images = imageElements.map(img => ({
            src: img.src,
            alt: img.alt || 'Imagen de galería',
            element: img
        }));
    }

    bindEvents() {
        // Click en imágenes para abrir lightbox
        Utils.delegate('click', '.gallery-item img', this.openLightbox.bind(this));

        // Controles del lightbox
        const keydownHandler = this.handleKeydown.bind(this);
        const lightboxClickHandler = this.handleLightboxClick.bind(this);

        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('click', lightboxClickHandler);

        this.eventListeners.set('lightbox', { keydownHandler, lightboxClickHandler });
    }

    // ===== LIGHTBOX FUNCTIONALITY =====
    setupLightbox() {
        if (Utils.$('.gallery-lightbox')) return;

        this.lightbox = Utils.createElement('div', {
            className: 'gallery-lightbox',
            'aria-hidden': 'true',
            role: 'dialog',
            'aria-label': 'Galería de imágenes'
        });

        this.lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-container">
                <button class="lightbox-close" aria-label="Cerrar galería">
                    <span aria-hidden="true">×</span>
                </button>
                <button class="lightbox-prev" aria-label="Imagen anterior">
                    <span aria-hidden="true">‹</span>
                </button>
                <button class="lightbox-next" aria-label="Imagen siguiente">
                    <span aria-hidden="true">›</span>
                </button>
                <div class="lightbox-content">
                    <img class="lightbox-image" src="" alt="" loading="lazy">
                    <div class="lightbox-caption"></div>
                </div>
                <div class="lightbox-counter">1 / 1</div>
            </div>
        `;

        document.body.appendChild(this.lightbox);
    }

    openLightbox(e) {
        e.preventDefault();

        const clickedImg = e.target.closest('.gallery-item img');
        this.currentImageIndex = this.images.findIndex(img => img.element === clickedImg);

        if (this.currentImageIndex === -1) return;

        this.showImage();
        this.lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus trap para accesibilidad
        this.focusTrapCleanup = Utils.trapFocus(this.lightbox);
        Utils.$('.lightbox-close', this.lightbox)?.focus();

        Utils.announceToScreenReader('Galería de imágenes abierta');
    }

    closeLightbox() {
        this.lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (this.focusTrapCleanup) {
            this.focusTrapCleanup();
        }

        Utils.announceToScreenReader('Galería de imágenes cerrada');
    }

    showImage() {
        const image = this.images[this.currentImageIndex];
        const lightboxImg = Utils.$('.lightbox-image', this.lightbox);
        const caption = Utils.$('.lightbox-caption', this.lightbox);
        const counter = Utils.$('.lightbox-counter', this.lightbox);

        if (lightboxImg) {
            lightboxImg.src = image.src;
            lightboxImg.alt = image.alt;
        }

        if (caption) caption.textContent = image.alt;
        if (counter) counter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;

        // Update navigation buttons
        const prevBtn = Utils.$('.lightbox-prev', this.lightbox);
        const nextBtn = Utils.$('.lightbox-next', this.lightbox);

        if (prevBtn) prevBtn.style.opacity = this.currentImageIndex > 0 ? '1' : '0.3';
        if (nextBtn) nextBtn.style.opacity = this.currentImageIndex < this.images.length - 1 ? '1' : '0.3';
    }

    navigate(direction) {
        const newIndex = this.currentImageIndex + direction;

        if (newIndex >= 0 && newIndex < this.images.length) {
            this.currentImageIndex = newIndex;
            this.showImage();
        }
    }

    handleKeydown(e) {
        if (this.lightbox.getAttribute('aria-hidden') === 'true') return;

        switch (e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.navigate(-1);
                break;
            case 'ArrowRight':
                this.navigate(1);
                break;
        }
    }

    handleLightboxClick(e) {
        const overlay = Utils.$('.lightbox-overlay', this.lightbox);

        if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
            this.closeLightbox();
        } else if (e.target.classList.contains('lightbox-prev')) {
            this.navigate(-1);
        } else if (e.target.classList.contains('lightbox-next')) {
            this.navigate(1);
        }
    }

    // ===== GALERÍA SCROLL INFINITO =====
    setupInfiniteScroll() {
        const galleryTrack = Utils.$('.gallery-track');
        if (!galleryTrack) return;

        // Duplicar contenido para loop infinito
        galleryTrack.innerHTML += galleryTrack.innerHTML;

        // Reset position cuando llegue al final
        const scrollHandler = Utils.throttle(() => {
            const scrollLeft = galleryTrack.scrollLeft;
            const scrollWidth = galleryTrack.scrollWidth;
            const clientWidth = galleryTrack.clientWidth;

            if (scrollLeft >= scrollWidth / 2) {
                galleryTrack.scrollLeft = scrollLeft - scrollWidth / 2;
            } else if (scrollLeft <= 0) {
                galleryTrack.scrollLeft = scrollWidth / 2;
            }
        }, 16); // ~60fps

        galleryTrack.addEventListener('scroll', scrollHandler, { passive: true });
        this.eventListeners.set('infinite-scroll', scrollHandler);
    }

    // ===== LAZY LOADING =====
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        Utils.$$('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        this.observers.set('lazy-loading', imageObserver);
    }

    // ===== MÉTODO PÚBLICO PARA ACTUALIZAR IMÁGENES =====
    updateImages() {
        this.collectImages();
    }

    // ===== CLEANUP =====
    destroy() {
        // Limpiar observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });

        // Limpiar event listeners (delegated, so they auto-clean)
        this.eventListeners.clear();

        // Cerrar lightbox si está abierto
        if (this.lightbox && this.lightbox.getAttribute('aria-hidden') === 'false') {
            this.closeLightbox();
        }

        console.log('Gallery cleaned up');
    }
}

// ===== EXPOSICIÓN GLOBAL =====
window.Gallery = Gallery;

        this.lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-container">
                <button class="lightbox-close" aria-label="Cerrar galería">
                    <span aria-hidden="true">×</span>
                </button>
                <button class="lightbox-prev" aria-label="Imagen anterior">
                    <span aria-hidden="true">‹</span>
                </button>
                <button class="lightbox-next" aria-label="Imagen siguiente">
                    <span aria-hidden="true">›</span>
                </button>
                <div class="lightbox-content">
                    <img class="lightbox-image" src="" alt="" loading="lazy">
                    <div class="lightbox-caption"></div>
                </div>
                <div class="lightbox-counter">1 / 1</div>
            </div>
        `;

        // Agregar estilos del lightbox
        this.addLightboxStyles();

        document.body.appendChild(this.lightbox);
    }

    addLightboxStyles() {
        const styles = `
        <style>
        .gallery-lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: none;
        }

        .gallery-lightbox[aria-hidden="false"] {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .lightbox-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(5px);
        }

        .lightbox-container {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            z-index: 2;
        }

        .lightbox-content {
            position: relative;
            background: #000;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }

        .lightbox-image {
            display: block;
            max-width: 100%;
            max-height: 80vh;
            width: auto;
            height: auto;
            margin: 0 auto;
        }

        .lightbox-caption {
            padding: 1rem;
            background: rgba(0,0,0,0.8);
            color: white;
            text-align: center;
            font-size: 0.9rem;
        }

        .lightbox-counter {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .lightbox-close, .lightbox-prev, .lightbox-next {
            position: absolute;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 3;
        }

        .lightbox-close:hover, .lightbox-prev:hover, .lightbox-next:hover {
            background: rgba(212, 175, 55, 0.9);
            transform: scale(1.1);
        }

        .lightbox-close {
            top: -25px;
            right: -25px;
            font-size: 2.5rem;
        }

        .lightbox-prev {
            left: -25px;
            top: 50%;
            transform: translateY(-50%);
        }

        .lightbox-next {
            right: -25px;
            top: 50%;
            transform: translateY(-50%);
        }

        .lightbox-close span, .lightbox-prev span, .lightbox-next span {
            line-height: 1;
            display: block;
            margin-top: -2px;
        }

        /* Animations */
        .lightbox-container {
            animation: lightboxZoomIn 0.3s ease-out;
        }

        .lightbox-container.closing {
            animation: lightboxZoomOut 0.3s ease-in;
        }

        @keyframes lightboxZoomIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes lightboxZoomOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.8);
            }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .lightbox-container {
                max-width: 95vw;
                max-height: 95vh;
            }

            .lightbox-close {
                top: -20px;
                right: -20px;
                width: 40px;
                height: 40px;
                font-size: 2rem;
            }

            .lightbox-prev, .lightbox-next {
                width: 40px;
                height: 40px;
                font-size: 1.5rem;
            }

            .lightbox-prev {
                left: -20px;
            }

            .lightbox-next {
                right: -20px;
            }

            .lightbox-counter {
                font-size: 0.75rem;
                padding: 0.25rem 0.75rem;
            }
        }

        @media (max-width: 480px) {
            .lightbox-prev, .lightbox-next {
                display: none; /* Esconder controles en móviles pequeños */
            }

            .lightbox-counter {
                display: none;
            }
        }
        </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    openLightbox(e) {
        e.preventDefault();

        const clickedImg = e.target;
        this.currentImageIndex = this.images.findIndex(img => img.element === clickedImg);

        if (this.currentImageIndex === -1) return;

        this.showImage();
        this.lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus trap para accesibilidad
        this.focusTrapCleanup = CoreUtils.trapFocus(this.lightbox);
        this.lightbox.querySelector('.lightbox-close').focus();
    }

    closeLightbox() {
        this.lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (this.focusTrapCleanup) {
            this.focusTrapCleanup();
        }
    }

    showImage() {
        const image = this.images[this.currentImageIndex];
        const lightboxImg = this.lightbox.querySelector('.lightbox-image');
        const caption = this.lightbox.querySelector('.lightbox-caption');
        const counter = this.lightbox.querySelector('.lightbox-counter');

        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        caption.textContent = image.alt;
        counter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;

        // Update navigation buttons
        const prevBtn = this.lightbox.querySelector('.lightbox-prev');
        const nextBtn = this.lightbox.querySelector('.lightbox-next');

        prevBtn.style.opacity = this.currentImageIndex > 0 ? '1' : '0.3';
        nextBtn.style.opacity = this.currentImageIndex < this.images.length - 1 ? '1' : '0.3';
    }

    navigate(direction) {
        const newIndex = this.currentImageIndex + direction;

        if (newIndex >= 0 && newIndex < this.images.length) {
            this.currentImageIndex = newIndex;
            this.showImage();
        }
    }

    handleKeydown(e) {
        if (this.lightbox.getAttribute('aria-hidden') === 'true') return;

        switch (e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.navigate(-1);
                break;
            case 'ArrowRight':
                this.navigate(1);
                break;
        }
    }

    handleLightboxClick(e) {
        if (e.target === this.lightbox.querySelector('.lightbox-overlay') ||
            e.target.classList.contains('lightbox-close')) {
            this.closeLightbox();
        } else if (e.target.classList.contains('lightbox-prev')) {
            this.navigate(-1);
        } else if (e.target.classList.contains('lightbox-next')) {
            this.navigate(1);
        }
    }

    // ===== GALERÍA SCROLL INFINITO =====
    setupInfiniteScroll() {
        const galleryTrack = document.querySelector('.gallery-track');
        if (!galleryTrack) return;

        // Duplicar contenido para scroll infinito
        const originalContent = galleryTrack.innerHTML;
        galleryTrack.innerHTML = originalContent + originalContent;

        // Reset position cuando llegue al final
        galleryTrack.addEventListener('scroll', () => {
            const scrollLeft = galleryTrack.scrollLeft;
            const scrollWidth = galleryTrack.scrollWidth;
            const clientWidth = galleryTrack.clientWidth;

            if (scrollLeft >= scrollWidth / 2) {
                galleryTrack.scrollLeft = scrollLeft - scrollWidth / 2;
            } else if (scrollLeft <= 0) {
                galleryTrack.scrollLeft = scrollWidth / 2;
            }
        });
    }

    // ===== GESTIÓN DE CARGA DE IMÁGENES =====
    lazyLoadImages() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar en páginas con galería
    if (document.querySelector('.gallery-item') || document.querySelector('.gallery-track')) {
        new Gallery();
    }
});