/**
 * Form Validation Module - Sistema centralizado de validaciones
 * Arquitectura modular siguiendo Clean Code principles
 *
 * Este módulo proporciona validaciones reutilizables para formularios
 * con reglas configurables y feedback visual consistente.
 */

class FormValidator {
    constructor(form, customRules = {}) {
        this.form = form;
        this.errors = {};
        this.customRules = customRules;
        this.init();
    }

    init() {
        this.setupValidationRules();
        this.bindEvents();
    }

    setupValidationRules() {
        // Reglas de validación por tipo de campo
        this.rules = {
            nombre: {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                messages: {
                    required: 'El nombre es obligatorio',
                    minLength: 'El nombre debe tener al menos 2 caracteres',
                    maxLength: 'El nombre no puede exceder 100 caracteres',
                    pattern: 'El nombre solo puede contener letras y espacios'
                }
            },
            precio: {
                required: true,
                custom: (value) => Utils.isValidPrice(value),
                messages: {
                    required: 'El precio es obligatorio',
                    custom: 'Formato de precio inválido (ej: 25.000)'
                }
            },
            descripcion: {
                maxLength: 500,
                messages: {
                    maxLength: 'La descripción no puede exceder 500 caracteres'
                }
            },
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                messages: {
                    pattern: 'Email inválido'
                }
            },
            telefono: {
                pattern: /^[\+]?[0-9\s\-\(\)]{8,}$/,
                messages: {
                    pattern: 'Número de teléfono inválido'
                }
            },
            ...this.customRules
        };
    }

    bindEvents() {
        // Validación en tiempo real
        Utils.on(this.form, 'input', 'input, textarea, select', (e) => {
            this.validateField(e.target);
        });

        // Validación completa al enviar
        Utils.on(this.form, 'submit', '', (e) => {
            if (!this.validateAll()) {
                e.preventDefault();
                this.showFirstError();
            }
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.rules[fieldName];

        if (!rules) return true; // No hay reglas para este campo

        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = rules.messages.required;
        }
        // Custom validation
        else if (rules.custom && typeof rules.custom === 'function' && value) {
            if (!rules.custom(value)) {
                isValid = false;
                errorMessage = rules.messages.custom;
            }
        }
        // Length validations
        else if (value) {
            if (rules.minLength && value.length < rules.minLength) {
                isValid = false;
                errorMessage = rules.messages.minLength;
            } else if (rules.maxLength && value.length > rules.maxLength) {
                isValid = false;
                errorMessage = rules.messages.maxLength;
            } else if (rules.pattern && !rules.pattern.test(value)) {
                isValid = false;
                errorMessage = rules.messages.pattern;
            }
        }

        // Update field state
        this.updateFieldState(field, isValid, errorMessage);

        return isValid;
    }

    validateAll() {
        let isFormValid = true;
        this.errors = {};

        const fields = Utils.$$('input, textarea, select', this.form);
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
                this.errors[field.name] = this.getFieldError(field);
            }
        });

        return isFormValid;
    }

    updateFieldState(field, isValid, errorMessage) {
        // Limpiar estados previos
        Utils.removeClass(field, 'field-valid');
        Utils.removeClass(field, 'field-invalid');

        if (field.value.trim()) {
            Utils.addClass(field, isValid ? 'field-valid' : 'field-invalid');
        }

        // Actualizar mensaje de error
        this.updateErrorMessage(field, errorMessage);
    }

    updateErrorMessage(field, message) {
        const errorElement = Utils.$(`.field-error[data-for="${field.name}"]`, field.parentNode);

        if (message) {
            if (!errorElement) {
                const newError = Utils.createElement('div', {
                    className: 'field-error',
                    'data-for': field.name
                }, message);
                field.parentNode.appendChild(newError);
            } else {
                errorElement.textContent = message;
            }
        } else if (errorElement) {
            errorElement.remove();
        }
    }

    getFieldError(field) {
        const errorElement = Utils.$(`.field-error[data-for="${field.name}"]`, field.parentNode);
        return errorElement?.textContent || '';
    }

    showFirstError() {
        const firstErrorField = Utils.$('.field-invalid', this.form);
        if (firstErrorField) {
            firstErrorField.focus();
            Utils.scrollToElement(firstErrorField, { behavior: 'smooth', block: 'center' });
        }
    }

    // ===== API PÚBLICA =====
    validate() {
        return this.validateAll();
    }

    getErrors() {
        return { ...this.errors };
    }

    clearValidation() {
        Utils.$$('.field-valid, .field-invalid, .field-error', this.form).forEach(el => {
            Utils.removeClass(el, 'field-valid');
            Utils.removeClass(el, 'field-invalid');
            if (Utils.hasClass(el, 'field-error')) {
                el.remove();
            }
        });
    }

    addCustomRule(fieldName, rule) {
        this.rules[fieldName] = { ...this.rules[fieldName], ...rule };
    }

    removeRule(fieldName) {
        delete this.rules[fieldName];
    }
}

// ===== FACTORY PARA CREAR VALIDADORES =====
class ValidationFactory {
    static createValidator(form, rules = {}) {
        return new FormValidator(form, rules);
    }

    static validateForm(form, rules = {}) {
        const validator = new FormValidator(form, rules);
        return validator.validate();
    }
}

// ===== INICIALIZACIÓN GLOBAL =====
document.addEventListener('DOMContentLoaded', () => {
    // Auto-inicializar validadores para formularios con clase .validate-form
    Utils.$$('.validate-form').forEach(form => {
        new FormValidator(form);
    });
});

// ===== EXPOSICIÓN GLOBAL =====
window.FormValidator = FormValidator;
window.ValidationFactory = ValidationFactory;