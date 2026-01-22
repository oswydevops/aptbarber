/**
 * Main Application Module - Funcionalidades principales del sitio
 * Arquitectura modular siguiendo Clean Code principles
 *
 * Este módulo maneja las funcionalidades principales del sitio público.
 * Está optimizado para performance y UX.
 */

class MainApp {
    constructor() {
        this.initialized = false;
        this.observers = new Map();
        this.eventListeners = new Map();
        this.init();
    }

    init() {
        if (this.initialized) return;

        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupGallery();
        this.setupSmoothScrolling();
        this.setupFormEnhancements();
        this.setupAccessibility();

        this.initialized = true;
    }

    // ===== EFECTOS DE SCROLL =====
    setupScrollEffects() {
        const header = Utils.$('.header');
        if (!header) return;

        const handleScroll = Utils.throttle(() => {
            const scrolled = window.scrollY > 50;
            Utils.toggleClass(header, 'scrolled', scrolled);
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll, { passive: true });
        this.eventListeners.set('scroll', handleScroll);
    }

    // ===== MENÚ HAMBURGUESA MÓVIL =====
    setupMobileMenu() {
        const hamburger = Utils.$('#hamburger');
        const mobileNav = Utils.$('#mobileNav');

        if (!hamburger || !mobileNav) return;

        this.mobileMenu = {
            hamburger,
            mobileNav,
            isOpen: false
        };

        const toggleHandler = () => this.toggleMobileMenu();
        const closeHandler = (e) => {
            if (this.mobileMenu.isOpen &&
                !e.target.closest('.hamburger') &&
                !e.target.closest('.mobile-nav')) {
                this.closeMobileMenu();
            }
        };

        const keyHandler = (e) => {
            if (e.key === 'Escape' && this.mobileMenu.isOpen) {
                this.closeMobileMenu();
            }
        };

        hamburger.addEventListener('click', toggleHandler);
        document.addEventListener('click', closeHandler);
        document.addEventListener('keydown', keyHandler);

        // Cerrar al hacer clic en enlaces
        Utils.$$('.mobile-nav a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        this.eventListeners.set('mobile-menu', { toggleHandler, closeHandler, keyHandler });
    }

    toggleMobileMenu() {
        const { hamburger, mobileNav } = this.mobileMenu;
        this.mobileMenu.isOpen = !this.mobileMenu.isOpen;

        Utils.toggleClass(hamburger, 'active');
        Utils.toggleClass(mobileNav, 'active');
        this.toggleBodyScroll(this.mobileMenu.isOpen);

        Utils.announceToScreenReader(
            this.mobileMenu.isOpen ? 'Menú de navegación abierto' : 'Menú de navegación cerrado'
        );
    }

    closeMobileMenu() {
        if (this.mobileMenu?.isOpen) {
            this.toggleMobileMenu();
        }
    }

    toggleBodyScroll(disable) {
        document.body.style.overflow = disable ? 'hidden' : '';
        document.body.style.position = disable ? 'fixed' : '';
        document.body.style.width = disable ? '100%' : '';
    }

    // ===== GALERÍA CON SCROLL =====
    setupGallery() {
        const galleryTrack = Utils.$('#galleryTrack');
        if (!galleryTrack) return;

        // Duplicar contenido para scroll infinito
        this.duplicateGalleryContent(galleryTrack);

        // Configurar navegación
        this.setupGalleryNavigation(galleryTrack);
    }

    duplicateGalleryContent(track) {
        const originalContent = track.innerHTML;
        track.innerHTML = originalContent + originalContent;
    }

    setupGalleryNavigation(track) {
        let currentScroll = 0;
        const scrollAmount = Utils.isMobile() ? 280 : 380;

        const nextBtn = Utils.$('#nextBtn');
        const prevBtn = Utils.$('#prevBtn');

        const nextHandler = () => {
            currentScroll += scrollAmount;
            track.style.transform = `translateX(-${currentScroll}px)`;
        };

        const prevHandler = () => {
            currentScroll = Math.max(0, currentScroll - scrollAmount);
            track.style.transform = `translateX(-${currentScroll}px)`;
        };

        if (nextBtn) nextBtn.addEventListener('click', nextHandler);
        if (prevBtn) prevBtn.addEventListener('click', prevHandler);

        this.eventListeners.set('gallery-nav', { nextHandler, prevHandler });

        // Soporte para swipe en móviles
        this.setupGallerySwipe(track);
    }

    setupGallerySwipe(track) {
        let startX = 0;
        let isDragging = false;

        const touchStart = (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        };

        const touchEnd = (e) => {
            if (!isDragging) return;

            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                const event = new Event(diff > 0 ? 'swipeleft' : 'swiperight');
                track.dispatchEvent(event);
            }

            isDragging = false;
        };

        track.addEventListener('touchstart', touchStart, { passive: true });
        track.addEventListener('touchend', touchEnd, { passive: true });

        this.eventListeners.set('gallery-swipe', { touchStart, touchEnd });
    }

    // ===== SCROLL SUAVE =====
    setupSmoothScrolling() {
        Utils.$$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                const targetElement = Utils.$(href);

                if (targetElement) {
                    e.preventDefault();
                    Utils.scrollToElement(targetElement);
                }
            });
        });
    }

    // ===== MEJORAS DE FORMULARIOS =====
    setupFormEnhancements() {
        // Mejorar inputs
        Utils.$$('.input-field').forEach(input => {
            this.enhanceInput(input);
        });

        // Mejorar botones
        Utils.$$('.btn-primary, .btn-secondary').forEach(button => {
            this.enhanceButton(button);
        });
    }

    enhanceInput(input) {
        const inputHandler = () => {
            const isValid = input.checkValidity();
            Utils.toggleClass(input, 'input-valid', isValid && input.value);
            Utils.toggleClass(input, 'input-invalid', !isValid && input.value);
        };

        const focusHandler = () => Utils.addClass(input, 'input-focused');
        const blurHandler = () => Utils.removeClass(input, 'input-focused');

        input.addEventListener('input', inputHandler);
        input.addEventListener('focus', focusHandler);
        input.addEventListener('blur', blurHandler);

        this.eventListeners.set(`input-${input.name}`, { inputHandler, focusHandler, blurHandler });
    }

    enhanceButton(button) {
        const mouseDown = () => Utils.addClass(button, 'btn-pressed');
        const mouseUp = () => Utils.removeClass(button, 'btn-pressed');
        const mouseLeave = () => Utils.removeClass(button, 'btn-pressed');

        button.addEventListener('mousedown', mouseDown);
        button.addEventListener('mouseup', mouseUp);
        button.addEventListener('mouseleave', mouseLeave);

        this.eventListeners.set(`button-${button.className}`, { mouseDown, mouseUp, mouseLeave });

        // Loading state para submits
        if (button.type === 'submit') {
            const clickHandler = () => {
                if (button.form && button.form.checkValidity()) {
                    Utils.addClass(button, 'btn-loading');
                    button.disabled = true;
                    button.innerHTML = '<span class="spinner"></span> Procesando...';
                }
            };

            button.addEventListener('click', clickHandler);
            this.eventListeners.get(`button-${button.className}`).clickHandler = clickHandler;
        }
    }

    // ===== ACCESIBILIDAD =====
    setupAccessibility() {
        // Skip links
        this.setupSkipLinks();

        // Focus management
        this.setupFocusManagement();
    }

    setupSkipLinks() {
        const skipLink = Utils.createElement('a', {
            href: '#main-content',
            className: 'skip-link sr-only'
        }, 'Saltar al contenido principal');

        document.body.insertBefore(skipLink, document.body.firstChild);

        const focusHandler = () => Utils.removeClass(skipLink, 'sr-only');
        const blurHandler = () => Utils.addClass(skipLink, 'sr-only');

        skipLink.addEventListener('focus', focusHandler);
        skipLink.addEventListener('blur', blurHandler);

        this.eventListeners.set('skip-link', { focusHandler, blurHandler });
    }

    setupFocusManagement() {
        // Mejorar navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // ===== MÉTODO PÚBLICO PARA POST-DOM INITIALIZATION =====
    onDOMReady() {
        // Inicializaciones que requieren que el DOM esté completamente listo
        this.optimizePerformance();
    }

    // ===== OPTIMIZACIONES DE PERFORMANCE =====
    optimizePerformance() {
        // Lazy loading de imágenes
        this.setupLazyLoading();
    }

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

    // ===== CLEANUP =====
    destroy() {
        // Limpiar event listeners
        this.eventListeners.forEach((handlers, key) => {
            if (typeof handlers === 'object') {
                Object.values(handlers).forEach(handler => {
                    // Nota: En una implementación real, necesitaríamos referencias a los elementos
                    // para remover los listeners correctamente
                });
            }
        });

        // Limpiar observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });

        // Limpiar referencias
        this.eventListeners.clear();
        this.observers.clear();

        console.log('MainApp cleaned up');
    }
}

// ===== EXPOSICIÓN GLOBAL =====
window.MainApp = MainApp;