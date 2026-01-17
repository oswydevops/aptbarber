# 🔧 Guía de Mantenimiento CSS - APT BARBER

## Tabla de Contenidos
1. [Variables CSS](#variables-css)
2. [Breakpoints](#breakpoints)
3. [Nomenclatura BEM](#nomenclatura-bem)
4. [Agregar Nuevos Estilos](#agregar-nuevos-estilos)
5. [Troubleshooting](#troubleshooting)

---

## Variables CSS

### 📦 Localización
Todas las variables están en el `:root` al inicio del archivo `style.css` (líneas 28-104)

### 🎨 Variables por Categoría

**COLORES:**
```css
--color-bg-dark         /* #0f0f0f - Fondo principal */
--color-bg-darker       /* #0a0a0a - Fondo más oscuro */
--color-text-primary    /* #f5f5f5 - Texto principal */
--color-text-secondary  /* #e8e8e8 - Texto secundario */
--color-accent          /* #d4af37 - Color dorado */
--color-accent-light    /* #e6c14a - Dorado más claro */
--color-border          /* #222 - Bordes */
--color-border-light    /* rgba(...0.3) - Bordes claros */
```

**ESPACIADO (Escala):**
```css
--spacing-xs   (0.25rem = 4px)
--spacing-sm   (0.5rem = 8px)
--spacing-md   (1rem = 16px)
--spacing-lg   (1.5rem = 24px)
--spacing-xl   (2rem = 32px)
--spacing-2xl  (3rem = 48px)
--spacing-3xl  (4rem = 64px)
--spacing-4xl  (5rem = 80px)
--spacing-5xl  (6rem = 96px)
--spacing-6xl  (7rem = 112px)
--spacing-7xl  (8rem = 128px)
--spacing-8xl  (10rem = 160px)
```

**TIPOGRAFÍA:**
```css
--font-primary          /* 'Inter' - Texto */
--font-display          /* 'Satoshi' - Títulos */
--font-weight-regular   (400)
--font-weight-medium    (500)
--font-weight-semibold  (600)
--font-weight-bold      (700)
--font-weight-extrabold (900)
```

**TRANSICIONES:**
```css
--transition-fast   (0.3s ease)
--transition-base   (0.4s ease)
--transition-slow   (0.5s ease)
--transition-cubic  (0.5s cubic-bezier(...))
```

**SOMBRAS:**
```css
--shadow-sm   (pequeña)
--shadow-md   (mediana)
--shadow-lg   (grande - para cards)
--shadow-xl   (muy grande - lightbox)
--shadow-accent (resplandor dorado)
```

### ✨ Cómo Usar Variables

```css
/* CORRECTO ✓ */
.mi-componente {
    background: var(--color-bg-dark);
    padding: var(--spacing-lg);
    color: var(--color-text-primary);
    transition: var(--transition-base);
    box-shadow: var(--shadow-md);
    border-radius: var(--radius-lg);
}

/* INCORRECTO ✗ */
.mi-componente {
    background: #0f0f0f;           /* No usar hardcoded */
    padding: 24px;                 /* No usar px directo */
    color: #f5f5f5;                /* No usar hardcoded */
    transition: 0.4s ease;         /* No repetir transiciones */
}
```

---

## Breakpoints

### 📱 Puntos de Quiebre (Ordenados)

| Mobile-first | Rango | Uso |
|--------------|-------|-----|
| 320px | Small phones | iPhone SE |
| 375px | Medium phones | iPhone 12/13 |
| 414px | Large phones | iPhone 14+ |
| 600px | Tablets pequeños | - |
| 768px | Tablets estándar | iPad |
| 992px | Laptops compactas | - |
| 1024px | Desktops | Monitor 27" |
| 1366px | Desktops grandes | Monitor 24" |
| 1920px | Full HD | Monitor 27"+ |
| 2560px | 4K | - |

### 🎯 Usar en Media Queries

```css
/* Estructura recomendada */
.componente {
    /* Estilos base para móvil */
    font-size: 1rem;
    padding: var(--spacing-md);
}

/* Tablet */
@media (min-width: 768px) {
    .componente {
        font-size: 1.2rem;
        padding: var(--spacing-lg);
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .componente {
        font-size: 1.5rem;
        padding: var(--spacing-xl);
    }
}
```

---

## Nomenclatura BEM

### 📖 Estructura BEM

```
Block__Element--Modifier
```

### 📚 Ejemplos en el Proyecto

**Header:**
```css
.header { }
.header-inner { }
.logo { }
.logo__icon { }
.nav-desktop { }
.nav-desktop__link { }
.hamburger { }
.hamburger__line { }
.hamburger.active { } /* Modifier */
.mobile-nav { }
.mobile-nav__link { }
.mobile-nav.active { } /* Modifier */
```

**Hero:**
```css
.hero { }
.hero-content { }
.hero-title { }
.hero-subtitle { }
.btn-whatsapp { }
.btn-whatsapp:hover { } /* Pseudo-estado */
.text-info { }
```

**Cards:**
```css
.card { }
.card h3 { } /* Elemento anidado */
.card__description { }
.card__price { }
.card:hover { } /* Estado */
.card::before { } /* Pseudo-elemento */
```

### ✅ Reglas de BEM

1. **Block:** Componente independiente
   - `.card`, `.header`, `.footer`

2. **Element:** Parte de un block
   - `.card__description`, `.logo__icon`

3. **Modifier:** Variante de block o element
   - `.button--primary`, `.card.active`

4. **Notación:**
   - Block-to-element: `__` (dos guiones bajos)
   - Element-to-modifier: `--` (dos guiones)
   - Bloque multi-palabra: `-` (un guion)

### ❌ Evitar

```css
/* MALO - Muy específico */
.header .nav-desktop a { }

/* BUENO - BEM */
.nav-desktop__link { }

/* MALO - Anidación profunda */
.header > .container > .nav-desktop > a { }

/* BUENO - Clase independiente */
.nav-desktop__link { }
```

---

## Agregar Nuevos Estilos

### 📝 Paso a Paso

#### 1. **Crear un nuevo componente**

```css
/* Ubicación: Después de componentes similares */

/* ========== NUEVO COMPONENTE ========== */
.testimonial {
    background: var(--color-bg-darker);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    transition: var(--transition-base);
}

.testimonial__author {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
}

.testimonial__text {
    color: var(--color-text-secondary);
    margin: var(--spacing-md) 0;
    font-size: clamp(0.95rem, 1.2vw, 1.05rem);
}

.testimonial__rating {
    color: var(--color-accent);
    font-size: 1.2rem;
}

.testimonial:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-4px);
}
```

#### 2. **Usar en HTML**

```html
<div class="testimonial">
    <div class="testimonial__rating">⭐⭐⭐⭐⭐</div>
    <p class="testimonial__text">"Excelente barbería"</p>
    <p class="testimonial__author">- Juan Pérez</p>
</div>
```

#### 3. **Agregar responsive**

```css
/* Al final del archivo, en sección RESPONSIVE */

@media (min-width: 768px) {
    .testimonial {
        padding: var(--spacing-xl);
    }

    .testimonial__text {
        font-size: 1.1rem;
    }
}

@media (min-width: 1024px) {
    .testimonial {
        padding: var(--spacing-2xl);
    }
}
```

### 🎨 Template Completo de Componente

```css
/* ========== NUEVO COMPONENTE ========== */

/* Block principal */
.banner {
    background: var(--color-bg-dark);
    padding: var(--spacing-3xl) var(--spacing-lg);
    border-radius: var(--radius-lg);
    position: relative;
    overflow: hidden;
    transition: var(--transition-base);
}

/* Elementos */
.banner__title {
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-lg);
}

.banner__text {
    font-size: var(--spacing-md);
    color: var(--color-text-secondary);
    opacity: 0.9;
}

.banner__button {
    display: inline-block;
    background: var(--color-accent);
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: 50px;
    color: black;
    text-decoration: none;
    margin-top: var(--spacing-lg);
    transition: var(--transition-base);
    font-weight: var(--font-weight-semibold);
}

.banner__button:hover {
    background: var(--color-accent-light);
    transform: translateY(-4px);
    box-shadow: var(--shadow-accent);
}

/* Modifiers */
.banner.dark {
    background: var(--color-bg-darker);
}

.banner.featured {
    border: 2px solid var(--color-accent);
}

/* Media queries */
@media (min-width: 768px) {
    .banner {
        padding: var(--spacing-5xl) var(--spacing-2xl);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-3xl);
    }

    .banner__title {
        font-size: 2.5rem;
    }
}

@media (min-width: 1024px) {
    .banner {
        padding: var(--spacing-6xl) var(--spacing-3xl);
    }
}
```

---

## Troubleshooting

### 🔴 Problema: Estilos no se aplican

**Solución:**
1. Verificar que uses `var(--nombre-variable)` correcto
2. Revisar que la clase BEM está escrita igual en CSS y HTML
3. Comprobar que no hay media query conflictiva
4. Ver que no hay `!important` que sobrescriba

```css
/* ✓ CORRECTO */
.componente {
    color: var(--color-text-primary);
}

/* ✗ INCORRECTO */
.componente {
    color: #f5f5f5;  /* Debería ser variable */
}
```

### 🔴 Problema: Responsive no funciona en móvil

**Solución:**
1. Usar `min-width` (mobile-first), no `max-width`
2. Verificar que breakpoint está correcto (768px, 1024px, etc.)
3. Limpiar cache del navegador

```css
/* ✓ CORRECTO - Mobile-first */
.componente {
    font-size: 1rem; /* móvil */
}

@media (min-width: 768px) {
    .componente {
        font-size: 1.2rem; /* tablet+ */
    }
}

/* ✗ INCORRECTO - Desktop-first */
@media (max-width: 768px) {
    .componente {
        font-size: 1rem;
    }
}
```

### 🔴 Problema: Transiciones no funcionan

**Solución:**
1. Usar `var(--transition-base)` o similar
2. Revisar que no hay `transition: none`
3. Comprobar que propiedad CSS es animable

```css
/* ✓ CORRECTO */
.boton {
    background: var(--color-accent);
    transition: var(--transition-base);
}

.boton:hover {
    background: var(--color-accent-light);
}

/* ✗ INCORRECTO */
.boton {
    background: var(--color-accent);
    /* Sin transition */
}

.boton:hover {
    background: var(--color-accent-light);
}
```

### 🔴 Problema: Colores no cambian globalmente

**Solución:**
1. Editar `:root` al inicio del archivo
2. Cambiar la variable CSS, no valores hardcoded

```css
/* ✓ CORRECTO - Cambiar una sola vez */
:root {
    --color-accent: #gold-nuevo;
}

/* ✗ INCORRECTO - Cambiar en 50 lugares */
.boton { background: #gold-viejo; }
.card { border: #gold-viejo; }
.text { color: #gold-viejo; }
```

---

## 📚 Referencia Rápida

```css
/* COLORES */
color: var(--color-text-primary);
background: var(--color-bg-dark);
border: 1px solid var(--color-border);

/* ESPACIADO */
padding: var(--spacing-lg);
margin: var(--spacing-md) 0;
gap: var(--spacing-xl);

/* TRANSICIONES */
transition: var(--transition-base);
transition: var(--transition-fast);

/* SOMBRAS */
box-shadow: var(--shadow-md);
box-shadow: var(--shadow-lg);

/* TIPOGRAFÍA FLUIDA */
font-size: clamp(1rem, 2vw, 1.5rem);

/* RESPONSIVE */
@media (min-width: 768px) { }
@media (min-width: 1024px) { }
@media (min-width: 1920px) { }
```

---

**📌 Última actualización:** 17 Enero, 2026
**✅ CSS listo para producción**
