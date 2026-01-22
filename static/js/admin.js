/**
 * Admin Panel Module - Funcionalidades del panel de administración
 * Arquitectura modular siguiendo Clean Code principles
 *
 * Este módulo maneja todas las funcionalidades específicas del panel admin:
 * - Gestión de servicios e imágenes
 * - Validaciones y feedback
 * - Interacciones de usuario
 */

class AdminPanel {
    constructor() {
        this.initialized = false;
        this.eventListeners = new Map();
        this.init();
    }

    init() {
        if (this.initialized) return;

        this.bindEvents();
        this.initializeComponents();
        this.setupNotifications();

        this.initialized = true;
    }

    bindEvents() {
        // Confirmaciones de eliminación
        Utils.delegate('click', '[data-action="delete"]', this.handleDeleteClick.bind(this));

        // Validaciones de formularios
        Utils.on(document, 'submit', '.admin-form', this.handleFormSubmit.bind(this));

        // Feedback visual en inputs
        Utils.on(document, 'input', '.input-field', this.handleInputValidation.bind(this));
    }

    initializeComponents() {
        // Inicializar tooltips
        this.initTooltips();

        // Configurar drag & drop para imágenes
        this.initDragDrop();
    }

    // ===== GESTIÓN DE ELIMINACIONES =====
    async handleDeleteClick(e) {
        const deleteBtn = e.target.closest('[data-action="delete"]');
        if (!deleteBtn) return;

        e.preventDefault();

        const itemType = deleteBtn.dataset.type || 'elemento';
        const itemName = deleteBtn.dataset.name || 'este elemento';

        if (this.confirmDelete(itemType, itemName)) {
            await this.performDelete(deleteBtn.href || deleteBtn.getAttribute('data-url'));
        }
    }

    confirmDelete(type, name) {
        return confirm(`¿Estás seguro de que quieres eliminar ${type} "${name}"?\n\nEsta acción no se puede deshacer.`);
    }

    async performDelete(url) {
        try {
            this.showLoading();

            const response = await Utils.fetch(url, {
                method: 'GET'
            });

            if (response.ok || response.status === 302) { // Redirect es OK para GET deletes
                this.showNotification('Elemento eliminado correctamente', 'success');
                setTimeout(() => location.reload(), 1000);
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting:', error);
            this.showNotification('Error al eliminar el elemento', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // ===== VALIDACIONES DE FORMULARIOS =====
    handleFormSubmit(e) {
        const form = e.target;

        if (!this.validateForm(form)) {
            e.preventDefault();
            this.showNotification('Por favor, corrige los errores en el formulario', 'error');
            this.focusFirstError(form);
        } else {
            this.showLoading();
        }
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Este campo es obligatorio');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Validación específica para precio
        const precioField = form.querySelector('[name="precio"]');
        if (precioField && precioField.value) {
            if (!Utils.isValidPrice(precioField.value)) {
                this.showFieldError(precioField, 'Formato de precio inválido (ej: 25.000)');
                isValid = false;
            }
        }

        return isValid;
    }

    handleInputValidation(e) {
        const field = e.target;
        if (field.hasAttribute('required') && field.value.trim()) {
            this.clearFieldError(field);
        }
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

        Utils.addClass(field, 'field-invalid');

        const errorDiv = Utils.createElement('div', { className: 'field-error' }, message);
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        Utils.removeClass(field, 'field-invalid');

        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    focusFirstError(form) {
        const firstErrorField = form.querySelector('.field-invalid');
        if (firstErrorField) {
            firstErrorField.focus();
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // ===== DRAG & DROP PARA IMÁGENES =====
    initDragDrop() {
        const dropZone = Utils.$('.gallery-upload-zone') || Utils.$('.file-input')?.parentElement;
        if (!dropZone) return;

        Utils.addClass(dropZone, 'drop-zone');

        const events = ['dragenter', 'dragover', 'dragleave', 'drop'];

        events.forEach(eventName => {
            dropZone.addEventListener(eventName, this.preventDefaults.bind(this), false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => this.highlight(dropZone), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => this.unhighlight(dropZone), false);
        });

        dropZone.addEventListener('drop', this.handleDrop.bind(this), false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(zone) {
        Utils.addClass(zone, 'drag-over');
    }

    unhighlight(zone) {
        Utils.removeClass(zone, 'drag-over');
    }

    handleDrop(e) {
        const files = e.dataTransfer.files;
        const fileInput = Utils.$('input[type="file"]');

        if (fileInput && files.length > 0) {
            fileInput.files = files;

            // Trigger change event
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);

            this.showNotification(`${files.length} archivo(s) agregado(s)`, 'info');
        }
    }

    // ===== NOTIFICACIONES =====
    setupNotifications() {
        // El container ya está creado por StyleManager
    }

    showNotification(message, type = 'info') {
        const container = Utils.$('.notification-container');
        if (!container) return;

        const notification = Utils.createElement('div', {
            className: `notification notification-${type}`
        });

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-text">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        container.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                Utils.addClass(notification, 'notification-exit');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    // ===== TOOLTIPS =====
    initTooltips() {
        Utils.$$('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip.bind(this));
            element.addEventListener('mouseleave', this.hideTooltip.bind(this));
        });
    }

    showTooltip(e) {
        const element = e.target;
        const tooltipText = element.dataset.tooltip;

        if (!tooltipText) return;

        const tooltip = Utils.createElement('div', {
            className: 'tooltip'
        }, tooltipText);

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    }

    hideTooltip() {
        const tooltip = Utils.$('.tooltip');
        if (tooltip) tooltip.remove();
    }

    // ===== UTILIDADES =====
    showLoading() {
        if (Utils.$('.loading-overlay')) return;

        const overlay = Utils.createElement('div', { className: 'loading-overlay' });
        overlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <div class="loading-text">Procesando...</div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    hideLoading() {
        const overlay = Utils.$('.loading-overlay');
        if (overlay) overlay.remove();
    }

    // ===== MÉTODO PÚBLICO PARA POST-DOM INITIALIZATION =====
    onDOMReady() {
        // Animaciones de carga específicas del admin
        this.animateOnLoad();
    }

    // ===== ANIMACIONES DE CARGA =====
    animateOnLoad() {
        const cards = Utils.$$('.service-card, .admin-card');
        cards.forEach((card, index) => {
            Utils.animate(card, { opacity: '1', transform: 'translateY(0)' }, 500, 'ease')
                .then(() => {
                    Utils.addClass(card, 'animate-in');
                });
        });
    }

    // ===== CLEANUP =====
    destroy() {
        this.eventListeners.clear();
        console.log('AdminPanel cleaned up');
    }
}

// ===== EXPOSICIÓN GLOBAL =====
window.AdminPanel = AdminPanel;