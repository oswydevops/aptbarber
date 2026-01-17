# 🎨 Biblioteca de Componentes CSS - APT BARBER

## Componentes Reutilizables

Esta guía muestra cómo usar y extender los componentes CSS existentes.

---

## 1️⃣ Botones

### Botón WhatsApp (Principal)

```html
<a href="https://wa.me/..." class="btn-whatsapp">
    Reservar Cita
</a>
```

```css
.btn-whatsapp {
    display: inline-block;
    background: var(--color-accent);
    color: black !important;
    padding: clamp(1rem, 2vw, 1.4rem) clamp(2rem, 4vw, 3.5rem);
    border-radius: 60px;
    font-weight: var(--font-weight-extrabold);
    text-decoration: none;
    box-shadow: 0 15px 40px rgba(212, 175, 55, 0.4);
    transition: var(--transition-base);
    position: relative;
    overflow: hidden;
}

.btn-whatsapp:hover {
    transform: translateY(-6px);
    box-shadow: 0 25px 50px rgba(212, 175, 55, 0.6);
    background: var(--color-accent-light);
}
```

### Crear Variante: Botón Secundario

```css
.btn-secondary {
    background: transparent;
    border: 2px solid var(--color-accent);
    color: var(--color-accent) !important;
    padding: clamp(0.8rem, 1.5vw, 1.2rem) clamp(1.5rem, 3vw, 3rem);
    border-radius: 8px;
    font-weight: var(--font-weight-semibold);
    transition: var(--transition-base);
}

.btn-secondary:hover {
    background: var(--color-accent);
    color: black !important;
}
```

**Uso:**
```html
<button class="btn-secondary">Más información</button>
<a href="#" class="btn-secondary">Ir a servicios</a>
```

---

## 2️⃣ Cards

### Card Base (Servicios)

```html
<div class="card">
    <h3>Corte Clásico</h3>
    <p class="card__description">Corte tradicional con precisión</p>
    <div class="card__price">$25.00</div>
</div>
```

```css
.card {
    background: linear-gradient(135deg, #1a1a1a, #111);
    padding: var(--spacing-2xl) var(--spacing-xl);
    border-radius: var(--radius-xl);
    text-align: center;
    border: 1px solid var(--color-border);
    transition: var(--transition-cubic);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--color-accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.6s;
}

.card:hover {
    transform: translateY(-20px);
    border-color: var(--color-accent);
    box-shadow: var(--shadow-lg);
    background: linear-gradient(135deg, #222, #1a1a1a);
}

.card:hover::before {
    transform: scaleX(1);
}
```

### Variante: Card Testimonial

```css
.card.testimonial {
    background: var(--color-bg-darker);
    padding: var(--spacing-xl);
    text-align: left;
    border: 1px solid var(--color-border-light);
}

.card.testimonial .card__rating {
    color: var(--color-accent);
    font-size: 1.2rem;
    margin-bottom: var(--spacing-md);
}

.card.testimonial .card__text {
    font-size: 0.95rem;
    opacity: 0.9;
    margin-bottom: var(--spacing-lg);
    font-style: italic;
}

.card.testimonial .card__author {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
}
```

**Uso:**
```html
<div class="card testimonial">
    <div class="card__rating">⭐⭐⭐⭐⭐</div>
    <p class="card__text">"Excelente servicio y profesionalismo"</p>
    <p class="card__author">- Juan Pérez</p>
</div>
```

---

## 3️⃣ Grid Responsive

### Grid Auto-fit (Servicios)

```html
<div class="servicios-grid">
    <div class="card"><!-- ... --></div>
    <div class="card"><!-- ... --></div>
    <div class="card"><!-- ... --></div>
</div>
```

```css
.servicios-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--spacing-xl);
    padding: 0 var(--spacing-md);
    align-items: stretch;
}

/* Breakpoint específicos */
@media (min-width: 768px) {
    .servicios-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .servicios-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

### Grid Flexible Personalizada

```css
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
    auto-flow: dense;
}

/* Hacer algunos items más grandes */
.gallery-item:nth-child(1),
.gallery-item:nth-child(4) {
    grid-column: span 1;
    grid-row: span 2;
}

@media (min-width: 768px) {
    .gallery-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
```

---

## 4️⃣ Tipografía Fluida

### Headings Responsive

```html
<h1 class="heading-1">Título Principal</h1>
<h2 class="heading-2">Subtítulo</h2>
<h3 class="heading-3">Sección</h3>
```

```css
.heading-1 {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    line-height: 1.1;
    margin-bottom: var(--spacing-xl);
    font-weight: var(--font-weight-extrabold);
    background: linear-gradient(90deg, #fff, var(--color-accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.heading-2 {
    font-size: clamp(1.8rem, 3.5vw, 3rem);
    line-height: 1.2;
    margin-bottom: var(--spacing-lg);
}

.heading-3 {
    font-size: clamp(1.3rem, 2.5vw, 2rem);
    line-height: 1.3;
    margin-bottom: var(--spacing-md);
}
```

### Body Text

```html
<p class="body-text">Contenido normal</p>
<p class="body-text body-text--small">Contenido pequeño</p>
<p class="body-text body-text--large">Contenido grande</p>
```

```css
.body-text {
    font-size: clamp(0.95rem, 1.2vw, 1.1rem);
    line-height: 1.6;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
}

.body-text--small {
    font-size: 0.85rem;
    opacity: 0.85;
}

.body-text--large {
    font-size: 1.25rem;
    font-weight: var(--font-weight-medium);
}
```

---

## 5️⃣ Hero Section

### Hero Estándar

```html
<section class="hero">
    <div class="container hero-content">
        <h1 class="hero-title">Tu Barbería Premium</h1>
        <p class="hero-subtitle">Estilo • Precisión • Actitud</p>
        <a href="#" class="btn-whatsapp hero-btn">Reservar Cita</a>
    </div>
</section>
```

```css
.hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
                url('/path/to/image.jpg') center/cover no-repeat;
    background-attachment: fixed;
    position: relative;
}

.hero-content {
    max-width: 1100px;
    padding: 0 var(--spacing-lg);
    z-index: 2;
    width: 100%;
}

.hero-title {
    font-size: clamp(2.5rem, 8vw, 5rem);
    line-height: 0.9;
    margin-bottom: var(--spacing-3xl);
    background: linear-gradient(90deg, #fff, var(--color-accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitle {
    font-size: clamp(1.2rem, 3vw, 2rem);
    margin-bottom: var(--spacing-3xl);
    opacity: 0.85;
    letter-spacing: 3px;
}
```

---

## 6️⃣ Efectos y Transiciones

### Hover Lift

```css
.hover-lift {
    transition: var(--transition-base);
}

.hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
}
```

### Hover Glow

```css
.hover-glow {
    transition: var(--transition-base);
}

.hover-glow:hover {
    box-shadow: var(--shadow-accent);
    filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.5));
}
```

### Hover Scale

```css
.hover-scale {
    transition: transform var(--transition-base);
}

.hover-scale:hover {
    transform: scale(1.05);
}
```

### Gradient Animated

```css
@keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.gradient-animated {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient-shift 15s ease infinite;
}
```

---

## 7️⃣ Formularios

### Input Base

```html
<input type="text" class="input-field" placeholder="Tu nombre">
<input type="email" class="input-field" placeholder="Tu email">
<textarea class="input-field" placeholder="Tu mensaje"></textarea>
```

```css
.input-field {
    width: 100%;
    padding: var(--spacing-md);
    background: var(--color-bg-darker);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-family: var(--font-primary);
    font-size: 1rem;
    transition: var(--transition-base);
}

.input-field:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
    background: var(--color-bg-dark);
}

.input-field::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.6;
}
```

---

## 8️⃣ Badges y Tags

### Badge Base

```html
<span class="badge">Nuevo</span>
<span class="badge badge--success">Disponible</span>
<span class="badge badge--accent">Popular</span>
```

```css
.badge {
    display: inline-block;
    background: var(--color-bg-darker);
    border: 1px solid var(--color-border);
    color: var(--color-text-primary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.5px;
}

.badge--success {
    background: rgba(76, 175, 80, 0.1);
    border-color: #4caf50;
    color: #4caf50;
}

.badge--accent {
    background: rgba(212, 175, 55, 0.1);
    border-color: var(--color-accent);
    color: var(--color-accent);
}
```

---

## 9️⃣ Listas

### Lista con Viñetas Doradas

```html
<ul class="list-custom">
    <li>Primer punto</li>
    <li>Segundo punto</li>
    <li>Tercer punto</li>
</ul>
```

```css
.list-custom {
    list-style: none;
    padding: 0;
}

.list-custom li {
    padding-left: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    position: relative;
    color: var(--color-text-primary);
}

.list-custom li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--color-accent);
    font-weight: var(--font-weight-bold);
    font-size: 1.2rem;
}
```

---

## 🔟 Utilidades Reutilizables

```css
/* VISIBILIDAD */
.hidden { display: none !important; }
.visible { display: block !important; }

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
}

/* ALINEACIÓN */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

/* OPACIDAD */
.opacity-50 { opacity: 0.5; }
.opacity-75 { opacity: 0.75; }

/* FLEXBOX */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-center { justify-content: center; align-items: center; }
.flex-between { justify-content: space-between; align-items: center; }

/* GRID */
.grid { display: grid; }
.grid-center { place-items: center; }

/* OVERFLOW */
.overflow-hidden { overflow: hidden; }
.overflow-scroll { overflow: auto; }

/* POSITIONING */
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }

/* TRANSICIONES */
.transition-fast { transition: var(--transition-fast); }
.transition-base { transition: var(--transition-base); }
.transition-slow { transition: var(--transition-slow); }
```

---

## 📚 Tabla Rápida de Componentes

| Componente | Clase | Uso |
|-----------|-------|-----|
| Botón Principal | `.btn-whatsapp` | CTA |
| Botón Secundario | `.btn-secondary` | Acciones |
| Card | `.card` | Servicios, testimonios |
| Grid | `.servicios-grid` | Layout responsivo |
| Hero | `.hero` | Secciones grandes |
| Input | `.input-field` | Formularios |
| Badge | `.badge` | Etiquetas |
| Lista | `.list-custom` | Listados |

---

**✨ Todos estos componentes ya están en el CSS profesional**
**Úsalos como base para tus nuevos elementos**
