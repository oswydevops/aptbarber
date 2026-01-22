/**
 * Core Utilities - Utilidades básicas centralizadas
 * Arquitectura modular siguiendo Clean Code principles
 *
 * Este archivo proporciona funcionalidades core que otros módulos pueden usar.
 * Utiliza Utils como base y agrega funcionalidades específicas de la aplicación.
 */

class CoreUtils {
    static init() {
        this.setupGlobalErrorHandling();
        this.setupPerformanceMonitoring();
    }

    // ===== MANEJO DE ERRORES GLOBAL =====
    static setupGlobalErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            Utils.logError('JavaScript Error', e.error, {
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            Utils.logError('Unhandled Promise Rejection', e.reason);
        });
    }

    // ===== MONITORING DE PERFORMANCE =====
    static setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            // Monitorear Largest Contentful Paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP observer not supported');
            }

            // Monitorear First Input Delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('FID observer not supported');
            }
        }
    }

    // ===== DELEGACIÓN A UTILS =====
    // Todas las utilidades comunes ahora están centralizadas en Utils
    static $(selector, context) { return Utils.$(selector, context); }
    static $$(selector, context) { return Utils.$$(selector, context); }
    static createElement(tag, attrs, content) { return Utils.createElement(tag, attrs, content); }
    static addClass(el, className) { return Utils.addClass(el, className); }
    static removeClass(el, className) { return Utils.removeClass(el, className); }
    static toggleClass(el, className) { return Utils.toggleClass(el, className); }
    static hasClass(el, className) { return Utils.hasClass(el, className); }
    static on(el, event, selector, handler) { return Utils.on(el, event, selector, handler); }
    static delegate(event, selector, handler, context) { return Utils.delegate(event, selector, handler, context); }
    static animate(el, props, duration, easing) { return Utils.animate(el, props, duration, easing); }
    static fadeIn(el, duration) { return Utils.fadeIn(el, duration); }
    static fadeOut(el, duration) { return Utils.fadeOut(el, duration); }
    static slideIn(el, direction, duration) { return Utils.slideIn(el, direction, duration); }
    static scaleIn(el, duration) { return Utils.scaleIn(el, duration); }
    static fetch(url, options) { return Utils.fetch(url, options); }
    static isValidEmail(email) { return Utils.isValidEmail(email); }
    static isValidPhone(phone) { return Utils.isValidPhone(phone); }
    static sanitizeHTML(text) { return Utils.sanitizeHTML(text); }
    static setStorage(key, value, session) { return Utils.setStorage(key, value, session); }
    static getStorage(key, defaultValue, session) { return Utils.getStorage(key, defaultValue, session); }
    static removeStorage(key, session) { return Utils.removeStorage(key, session); }
    static logError(context, error, data) { return Utils.logError(context, error, data); }
    static getViewportSize() { return Utils.getViewportSize(); }
    static isMobile() { return Utils.isMobile(); }
    static isTablet() { return Utils.isTablet(); }
    static isDesktop() { return Utils.isDesktop(); }
    static announceToScreenReader(msg, priority) { return Utils.announceToScreenReader(msg, priority); }
    static trapFocus(container) { return Utils.trapFocus(container); }

    // ===== FUNCIONALIDADES ESPECÍFICAS DE LA APP =====
    static setupCSSTransitions() {
        // Configurar transiciones CSS suaves
        const style = document.createElement('style');
        style.textContent = `
            * {
                box-sizing: border-box;
            }

            body {
                margin: 0;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #333;
                background: #fff;
            }

            button, input, textarea, select {
                font-family: inherit;
            }

            /* Smooth scrolling */
            html {
                scroll-behavior: smooth;
            }

            /* Focus management */
            :focus {
                outline: 2px solid #d4af37;
                outline-offset: 2px;
            }

            /* Loading states */
            .loading {
                pointer-events: none;
                opacity: 0.6;
            }
        `;
        document.head.appendChild(style);
    }

    static setupTheme() {
        // Detectar tema del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = Utils.getStorage('theme');

        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);

        // Escuchar cambios
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!Utils.getStorage('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
            }
        });
    }

    static setTheme(theme) {
        Utils.setStorage('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }

    // ===== INICIALIZACIÓN CONDICIONAL =====
    static onDOMReady() {
        this.setupCSSTransitions();
        this.setupTheme();
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    CoreUtils.init();
});

// ===== EXPOSICIÓN GLOBAL =====
window.CoreUtils = CoreUtils;