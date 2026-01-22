/**
 * APT BARBER - Simple Application Bootstrap
 * Inicialización directa y confiable de funcionalidades
 */

// ===== INICIALIZACIÓN DIRECTA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Apt Barber initializing...');

    // Inicializar sistema de estilos
    if (typeof StyleManager !== 'undefined') {
        StyleManager.init();
        console.log('✅ Styles initialized');
    }

    // Inicializar core utilities
    if (typeof CoreUtils !== 'undefined') {
        CoreUtils.init();
        console.log('✅ Core utilities initialized');
    }

    // Inicializar módulos específicos según la página
    initializePageModules();

    console.log('✅ Apt Barber ready!');
});

function initializePageModules() {
    // Main app (siempre)
    if (typeof MainApp !== 'undefined') {
        try {
            window.mainApp = new MainApp();
            console.log('✅ Main app initialized');
        } catch (error) {
            console.warn('Main app failed:', error);
        }
    }

    // Gallery (solo si hay elementos de galería)
    if (typeof Gallery !== 'undefined' &&
        document.querySelector('.gallery-item, .gallery-track')) {
        try {
            window.gallery = new Gallery();
            console.log('✅ Gallery initialized');
        } catch (error) {
            console.warn('Gallery failed:', error);
        }
    }

    // Admin panel (solo en páginas de admin)
    if (typeof AdminPanel !== 'undefined' &&
        document.querySelector('.admin-dashboard')) {
        try {
            window.adminPanel = new AdminPanel();
            console.log('✅ Admin panel initialized');
        } catch (error) {
            console.warn('Admin panel failed:', error);
        }
    }

    // Animations (siempre)
    if (typeof AnimationController !== 'undefined') {
        try {
            window.animations = new AnimationController();
            console.log('✅ Animations initialized');
        } catch (error) {
            console.warn('Animations failed:', error);
        }
    }
}

// ===== API GLOBAL SIMPLE =====
window.AptBarber = {
    getMainApp: () => window.mainApp,
    getGallery: () => window.gallery,
    getAdminPanel: () => window.adminPanel,
    getAnimations: () => window.animations
};

// ===== SISTEMA DE ESTILOS CENTRALIZADO =====
class StyleManager {
    static init() {
        this.injectGlobalStyles();
        this.setupDynamicStyles();
    }

    static injectGlobalStyles() {
        // Inyectar todos los estilos de módulos en un solo lugar
        const allStyles = [
            this.getCoreStyles(),
            this.getAnimationStyles(),
            this.getValidationStyles(),
            this.getGalleryStyles(),
            this.getAdminStyles(),
            this.getMainStyles()
        ].join('\n');

        // Inyectar una sola vez
        if (!document.querySelector('#aptbarber-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'aptbarber-styles';
            styleElement.textContent = allStyles;
            document.head.appendChild(styleElement);
        }
    }

    static getCoreStyles() {
        return `
        /* Core utility styles */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }

        .notification-container {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        }

        @media (max-width: 768px) {
            .notification-container {
                left: 10px;
                right: 10px;
                top: 80px;
            }
        }
        `;
    }

    static getAnimationStyles() {
        return `
        /* Animation system styles */
        .animate-active {
            animation-fill-mode: both;
        }

        .fade-in-up-active {
            animation: fadeInUp 0.6s ease-out;
        }

        .fade-in-left-active {
            animation: fadeInLeft 0.6s ease-out;
        }

        .fade-in-right-active {
            animation: fadeInRight 0.6s ease-out;
        }

        .scale-in-active {
            animation: scaleIn 0.6s ease-out;
        }

        .slide-in-up-active {
            animation: slideInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }

        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .btn-hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .card-hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }

        .img-hover {
            transform: scale(1.05);
        }

        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        `;
    }

    static getValidationStyles() {
        return `
        /* Form validation styles */
        .field-valid {
            border-color: #10b981 !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
        }

        .field-invalid {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }

        .field-error {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            margin-left: 0.5rem;
            animation: errorSlideIn 0.3s ease-out;
        }

        @keyframes errorSlideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .field-valid::after {
            content: '✓';
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #10b981;
            font-weight: bold;
        }

        .field-invalid::after {
            content: '✕';
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #ef4444;
            font-weight: bold;
        }
        `;
    }

    static getGalleryStyles() {
        return `
        /* Gallery lightbox styles */
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

        .lightbox-container {
            animation: lightboxZoomIn 0.3s ease-out;
        }

        .lightbox-container.closing {
            animation: lightboxZoomOut 0.3s ease-in;
        }

        @keyframes lightboxZoomIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }

        @keyframes lightboxZoomOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.8); }
        }

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
        }

        @media (max-width: 480px) {
            .lightbox-prev, .lightbox-next {
                display: none;
            }
        }
        `;
    }

    static getAdminStyles() {
        return `
        /* Admin panel styles */
        .loading-spinner {
            text-align: center;
            color: white;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid #d4af37;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .drag-over {
            border-color: #d4af37 !important;
            background: rgba(212, 175, 55, 0.1) !important;
        }

        .notification {
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .notification-error { background: #ef4444; }
        .notification-warning { background: #f59e0b; }
        .notification-info { background: #3b82f6; }

        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }

        @media (max-width: 768px) {
            .notification-container {
                left: 10px;
                right: 10px;
                top: 80px;
            }
        }
        `;
    }

    static getMainStyles() {
        return `
        /* Main app styles */
        .btn-loading {
            position: relative;
            color: transparent !important;
        }

        .btn-loading .spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .btn-pressed {
            transform: translateY(1px) !important;
        }

        .input-valid {
            border-color: #10b981 !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
        }

        .input-invalid {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }

        .input-focused {
            transform: scale(1.02);
        }

        .btn-primary, .btn-secondary {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .btn-primary:hover, .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .btn-primary:active, .btn-secondary:active {
            transform: translateY(0);
        }

        .fade-in, .slide-up, .scale-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .slide-up {
            transform: translateY(30px);
        }

        .slide-up.visible {
            transform: translateY(0);
        }

        .scale-in {
            transform: scale(0.9);
        }

        .scale-in.visible {
            transform: scale(1);
        }

        .mobile-nav {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }

        .mobile-nav.active {
            transform: translateX(0);
        }

        .hamburger.active .bar:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }

        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active .bar:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        `;
    }

    static setupDynamicStyles() {
        // Configurar estilos dinámicos si es necesario
        this.setupThemeSupport();
    }

    static setupThemeSupport() {
        // Detectar y aplicar tema basado en preferencias del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        // Escuchar cambios en preferencias
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
}

// ===== EXPOSICIÓN GLOBAL =====
window.StyleManager = StyleManager;