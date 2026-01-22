/**
 * Animation Controller - Sistema centralizado de animaciones
 * Arquitectura modular siguiendo Clean Code principles
 *
 * Este módulo maneja todas las animaciones de la aplicación de manera
 * centralizada y eficiente, eliminando duplicaciones.
 */

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.eventListeners = new Map();
        this.animations = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupHoverEffects();
        this.setupPageLoadAnimations();
    }

    // ===== INTERSECTION OBSERVER CENTRALIZADO =====
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px 0px'
        };

        const intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScrollAnimation(entry.target);
                    intersectionObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar todos los elementos de animación
        const animatedElements = Utils.$$('.animate-on-scroll, .fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .slide-in-up');
        animatedElements.forEach(el => {
            intersectionObserver.observe(el);
        });

        this.observers.set('intersection', intersectionObserver);
    }

    triggerScrollAnimation(element) {
        const animationClass = this.getAnimationClass(element);
        if (animationClass) {
            Utils.addClass(element, animationClass);
        }
    }

    getAnimationClass(element) {
        const animationMap = {
            'fade-in-up': 'fade-in-up-active',
            'fade-in-left': 'fade-in-left-active',
            'fade-in-right': 'fade-in-right-active',
            'scale-in': 'scale-in-active',
            'slide-in-up': 'slide-in-up-active'
        };

        for (const [className, activeClass] of Object.entries(animationMap)) {
            if (Utils.hasClass(element, className)) {
                return activeClass;
            }
        }

        return Utils.hasClass(element, 'animate-on-scroll') ? 'animate-active' : null;
    }

    // ===== EFECTOS DE SCROLL =====
    setupScrollEffects() {
        const scrollHandler = Utils.throttle(() => {
            this.updateScrollEffects();
        }, 16); // ~60fps

        window.addEventListener('scroll', scrollHandler, { passive: true });
        this.eventListeners.set('scroll', scrollHandler);
    }

    updateScrollEffects() {
        // Efectos parallax
        Utils.$$('.parallax').forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const scrolled = window.pageYOffset;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Animaciones basadas en scroll (fallback para elementos no observados)
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;

        Utils.$$('.animate-on-scroll:not(.animate-active)').forEach(element => {
            const elementTop = element.offsetTop;
            const elementVisible = 150;

            if (scrolled + windowHeight > elementTop + elementVisible) {
                Utils.addClass(element, 'animate-active');
            }
        });
    }

    // ===== EFECTOS HOVER =====
    setupHoverEffects() {
        // Usar event delegation para mejor performance
        Utils.delegate('mouseenter', '.btn-primary, .btn-secondary, .card, .service-card, .gallery-item img',
            this.handleMouseEnter.bind(this));
        Utils.delegate('mouseleave', '.btn-primary, .btn-secondary, .card, .service-card, .gallery-item img',
            this.handleMouseLeave.bind(this));
    }

    handleMouseEnter(e) {
        const element = e.target;

        if (element.matches('.btn-primary, .btn-secondary')) {
            this.addButtonHoverEffect(element);
        } else if (element.matches('.card, .service-card')) {
            this.addCardHoverEffect(element);
        } else if (element.matches('.gallery-item img')) {
            this.addImageHoverEffect(element);
        }
    }

    handleMouseLeave(e) {
        const element = e.target;

        if (element.matches('.btn-primary, .btn-secondary')) {
            this.removeButtonHoverEffect(element);
        } else if (element.matches('.card, .service-card')) {
            this.removeCardHoverEffect(element);
        } else if (element.matches('.gallery-item img')) {
            this.removeImageHoverEffect(element);
        }
    }

    addButtonHoverEffect(button) {
        Utils.addClass(button, 'btn-hover');
        this.createRippleEffect(button);
    }

    removeButtonHoverEffect(button) {
        Utils.removeClass(button, 'btn-hover');
    }

    addCardHoverEffect(card) {
        Utils.addClass(card, 'card-hover');
    }

    removeCardHoverEffect(card) {
        Utils.removeClass(card, 'card-hover');
    }

    addImageHoverEffect(img) {
        Utils.addClass(img, 'img-hover');
    }

    removeImageHoverEffect(img) {
        Utils.removeClass(img, 'img-hover');
    }

    createRippleEffect(button) {
        const ripple = Utils.createElement('span', { className: 'ripple-effect' });

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        Object.assign(ripple.style, {
            width: size + 'px',
            height: size + 'px',
            left: x + 'px',
            top: y + 'px'
        });

        button.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentElement) {
                ripple.remove();
            }
        }, 600);
    }

    // ===== ANIMACIONES DE CARGA DE PÁGINA =====
    setupPageLoadAnimations() {
        // Solo ejecutar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.animateDOMContentLoaded();
            }, { once: true });
        } else {
            this.animateDOMContentLoaded();
        }

        // Animaciones después de que todas las imágenes carguen
        window.addEventListener('load', () => {
            this.animatePageLoad();
        }, { once: true });
    }

    animateDOMContentLoaded() {
        // Animar header
        const header = Utils.$('.header');
        if (header) {
            Utils.addClass(header, 'header-animate-in');
        }

        // Animar elementos iniciales
        Utils.$$('.animate-initial').forEach((el, index) => {
            setTimeout(() => {
                Utils.addClass(el, 'animate-active');
            }, index * 100);
        });
    }

    animatePageLoad() {
        // Animar hero section
        Utils.$$('.hero-title, .hero-subtitle, .hero-btn').forEach((el, index) => {
            setTimeout(() => {
                Utils.addClass(el, 'hero-animate-in');
            }, index * 200);
        });

        // Animar secciones
        Utils.$$('.section').forEach((section, index) => {
            setTimeout(() => {
                Utils.addClass(section, 'section-animate-in');
            }, 800 + index * 300);
        });
    }

    // ===== API PÚBLICA PARA ANIMACIONES MANUALES =====
    animateElement(element, animationType, options = {}) {
        const { duration = 300, delay = 0, callback } = options;

        setTimeout(() => {
            switch (animationType) {
                case 'fadeIn':
                    Utils.fadeIn(element, duration).then(callback);
                    break;
                case 'fadeOut':
                    Utils.fadeOut(element, duration).then(callback);
                    break;
                case 'slideInUp':
                    Utils.slideIn(element, 'up', duration).then(callback);
                    break;
                case 'slideInDown':
                    Utils.slideIn(element, 'down', duration).then(callback);
                    break;
                case 'scaleIn':
                    Utils.scaleIn(element, duration).then(callback);
                    break;
                default:
                    if (callback) callback();
            }
        }, delay);
    }

    // ===== MÉTODO PÚBLICO PARA ANIMAR NOTIFICACIONES =====
    animateNotification(notification) {
        Utils.addClass(notification, 'notification-enter');

        setTimeout(() => {
            Utils.addClass(notification, 'notification-exit');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // ===== MÉTODO PÚBLICO PARA POST-DOM INITIALIZATION =====
    onDOMReady() {
        // Inicializaciones que requieren DOM completamente listo
        this.setupParallax();
    }

    // ===== CONFIGURACIÓN DE PARALLAX =====
    setupParallax() {
        // Configurar elementos parallax si existen
        Utils.$$('[data-parallax]').forEach(element => {
            Utils.addClass(element, 'parallax');
            if (!element.dataset.speed) {
                element.dataset.speed = '0.5';
            }
        });
    }

    // ===== CLEANUP =====
    destroy() {
        // Limpiar observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });

        // Limpiar event listeners (delegated, so they auto-clean)
        this.eventListeners.clear();

        // Limpiar animaciones activas
        this.animations.clear();

        console.log('AnimationController cleaned up');
    }
}

// ===== EXPOSICIÓN GLOBAL =====
window.AnimationController = AnimationController;