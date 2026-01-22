/**
 * Centralized Utilities - Utilidades centralizadas sin duplicaciones
 * Arquitectura modular siguiendo Clean Code principles
 */

class Utils {
    // ===== UTILIDADES DOM (CENTRALIZADAS) =====
    static $(selector, context = document) {
        return context.querySelector(selector);
    }

    static $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    }

    static createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.assign(element.dataset, value);
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else {
                element.setAttribute(key, value);
            }
        });

        if (content) {
            element.innerHTML = content;
        }

        return element;
    }

    // ===== UTILIDADES DE CLASES CSS =====
    static addClass(element, className) {
        if (element && typeof element.classList !== 'undefined') {
            element.classList.add(className);
        }
    }

    static removeClass(element, className) {
        if (element && typeof element.classList !== 'undefined') {
            element.classList.remove(className);
        }
    }

    static toggleClass(element, className) {
        if (element && typeof element.classList !== 'undefined') {
            return element.classList.toggle(className);
        }
        return false;
    }

    static hasClass(element, className) {
        if (element && typeof element.classList !== 'undefined') {
            return element.classList.contains(className);
        }
        return false;
    }

    // ===== UTILIDADES DE EVENTOS =====
    static on(element, event, selector, handler) {
        if (!element) return;

        element.addEventListener(event, (e) => {
            const target = e.target.closest(selector);
            if (target) {
                handler.call(target, e);
            }
        });
    }

    static delegate(event, selector, handler, context = document) {
        if (!context) return;

        context.addEventListener(event, (e) => {
            if (e.target.matches(selector) || e.target.closest(selector)) {
                handler.call(e.target, e);
            }
        });
    }

    static once(element, event, handler) {
        if (!element) return;

        const onceHandler = (e) => {
            handler.call(element, e);
            element.removeEventListener(event, onceHandler);
        };

        element.addEventListener(event, onceHandler);
    }

    // ===== UTILIDADES DE ANIMACIÓN =====
    static animate(element, properties, duration = 300, easing = 'ease') {
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            const startValues = {};
            const endValues = {};

            // Guardar valores iniciales
            Object.keys(properties).forEach(prop => {
                startValues[prop] = element.style[prop] || getComputedStyle(element)[prop];
            });

            // Aplicar propiedades finales
            Object.assign(endValues, properties);

            element.style.transition = `all ${duration}ms ${easing}`;

            Object.entries(endValues).forEach(([property, value]) => {
                element.style[property] = value;
            });

            setTimeout(() => {
                element.style.transition = '';
                resolve();
            }, duration);
        });
    }

    static fadeIn(element, duration = 300) {
        if (!element) return Promise.resolve();

        element.style.opacity = '0';
        element.style.display = 'block';

        return this.animate(element, { opacity: '1' }, duration);
    }

    static fadeOut(element, duration = 300) {
        if (!element) return Promise.resolve();

        return this.animate(element, { opacity: '0' }, duration)
            .then(() => {
                element.style.display = 'none';
            });
    }

    static slideIn(element, direction = 'up', duration = 300) {
        if (!element) return Promise.resolve();

        const transforms = {
            up: 'translateY(0)',
            down: 'translateY(0)',
            left: 'translateX(0)',
            right: 'translateX(0)'
        };

        const initialTransforms = {
            up: 'translateY(20px)',
            down: 'translateY(-20px)',
            left: 'translateX(20px)',
            right: 'translateX(-20px)'
        };

        element.style.transform = initialTransforms[direction];
        element.style.opacity = '0';

        return this.animate(element,
            { transform: transforms[direction], opacity: '1' },
            duration
        );
    }

    static scaleIn(element, duration = 300) {
        if (!element) return Promise.resolve();

        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0';

        return this.animate(element,
            { transform: 'scale(1)', opacity: '1' },
            duration
        );
    }

    // ===== UTILIDADES AJAX =====
    static async fetch(url, options = {}) {
        const defaultOptions = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 segundos timeout
        };

        const mergedOptions = { ...defaultOptions, ...options };

        // Crear AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), mergedOptions.timeout);

        try {
            const response = await fetch(url, {
                ...mergedOptions,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return await response.text();
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }

            console.error('Fetch error:', error);
            throw error;
        }
    }

    // ===== UTILIDADES DE VALIDACIÓN =====
    static isValidEmail(email) {
        if (!email || typeof email !== 'string') return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    static isValidPhone(phone) {
        if (!phone || typeof phone !== 'string') return false;
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        return phoneRegex.test(phone.trim());
    }

    static sanitizeHTML(text) {
        if (!text || typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static isValidPrice(price) {
        if (!price) return false;
        const priceRegex = /^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$/;
        return priceRegex.test(price.toString());
    }

    // ===== UTILIDADES DE STORAGE =====
    static setStorage(key, value, useSession = false) {
        const storage = useSession ? sessionStorage : localStorage;
        try {
            storage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Storage not available:', e);
            return false;
        }
        return true;
    }

    static getStorage(key, defaultValue = null, useSession = false) {
        const storage = useSession ? sessionStorage : localStorage;
        try {
            const item = storage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Storage error:', e);
            return defaultValue;
        }
    }

    static removeStorage(key, useSession = false) {
        const storage = useSession ? sessionStorage : localStorage;
        try {
            storage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('Storage error:', e);
            return false;
        }
    }

    // ===== UTILIDADES RESPONSIVE =====
    static getViewportSize() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight
        };
    }

    static isMobile() {
        return this.getViewportSize().width < 768;
    }

    static isTablet() {
        const width = this.getViewportSize().width;
        return width >= 768 && width < 1024;
    }

    static isDesktop() {
        return this.getViewportSize().width >= 1024;
    }

    static isLargeDesktop() {
        return this.getViewportSize().width >= 1440;
    }

    // ===== UTILIDADES DE PERFORMANCE =====
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };

            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) func.apply(this, args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== UTILIDADES DE ACCESIBILIDAD =====
    static announceToScreenReader(message, priority = 'polite') {
        if (!message) return;

        const announcement = this.createElement('div', {
            'aria-live': priority,
            'aria-atomic': 'true',
            className: 'sr-only'
        }, message);

        document.body.appendChild(announcement);

        setTimeout(() => {
            if (announcement.parentElement) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    static trapFocus(container) {
        if (!container) return () => {};

        const focusableElements = container.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }

            if (e.key === 'Escape') {
                // Cerrar modal/lightbox si existe
                const closeBtn = container.querySelector('[data-close], .lightbox-close, .modal-close');
                if (closeBtn) {
                    closeBtn.click();
                }
            }
        };

        container.addEventListener('keydown', handleTabKey);

        // Focus en primer elemento focusable
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }

        // Retornar función de cleanup
        return () => {
            container.removeEventListener('keydown', handleTabKey);
        };
    }

    // ===== UTILIDADES DE LOGGING =====
    static logError(context, error, data = {}) {
        const logData = {
            timestamp: new Date().toISOString(),
            context,
            error: error.message || error,
            stack: error.stack,
            userAgent: navigator.userAgent,
            url: window.location.href,
            viewport: this.getViewportSize(),
            ...data
        };

        console.error('Error logged:', logData);

        // En producción, enviar a servicio externo
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            this.sendToLoggingService(logData);
        }
    }

    static sendToLoggingService(logData) {
        // Implementar envío a servicio externo
        // Por ejemplo: Sentry, LogRocket, etc.
        console.log('Would send to logging service:', logData);
    }

    // ===== UTILIDADES DE NAVEGACIÓN =====
    static scrollToElement(element, options = {}) {
        if (!element) return;

        const defaultOptions = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        };

        element.scrollIntoView({ ...defaultOptions, ...options });
    }

    static scrollToTop(options = {}) {
        const defaultOptions = {
            top: 0,
            left: 0,
            behavior: 'smooth'
        };

        window.scrollTo({ ...defaultOptions, ...options });
    }

    // ===== UTILIDADES DE TIEMPO =====
    static formatTime(date) {
        if (!date) return '';
        return new Intl.DateTimeFormat('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }

    static formatDate(date) {
        if (!date) return '';
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    static timeAgo(date) {
        if (!date) return '';

        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);

        const intervals = [
            { label: 'año', seconds: 31536000 },
            { label: 'mes', seconds: 2592000 },
            { label: 'día', seconds: 86400 },
            { label: 'hora', seconds: 3600 },
            { label: 'minuto', seconds: 60 },
            { label: 'segundo', seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return `hace ${count} ${interval.label}${count > 1 ? 's' : ''}`;
            }
        }

        return 'ahora mismo';
    }
}

// ===== EXPOSICIÓN GLOBAL =====
window.Utils = Utils;