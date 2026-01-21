# 🔄 GUÍA DE MIGRACIÓN - Del Código Anterior

## Resumen de Cambios de Rutas

Si estabas usando el código anterior, aquí están todos los cambios de rutas:

### Rutas Públicas

| Antes | Ahora | Cambio |
|-------|-------|--------|
| `url_for('index')` | `url_for('main.index')` | ✅ Nuevo blueprint `main` |
| `url_for('servicios')` | `url_for('main.servicios')` | ✅ Nuevo blueprint `main` |
| `url_for('contacto')` | `url_for('main.contacto')` | ✅ Nuevo blueprint `main` |
| `/` | `/` | ✅ Igual |
| `/servicios` | `/servicios` | ✅ Igual |
| `/contacto` | `/contacto` | ✅ Igual |

### Rutas Admin

| Antes | Ahora | Cambio |
|-------|-------|--------|
| `url_for('admin_login')` | `url_for('admin.login')` | ✅ Nuevo blueprint `admin` |
| `url_for('admin_dashboard')` | `url_for('admin.dashboard')` | ✅ Nuevo blueprint `admin` |
| `url_for('admin_logout')` | `url_for('admin.logout')` | ✅ Nuevo blueprint `admin` |
| `url_for('add_service')` | `url_for('admin.crear_servicio')` | ✅ Nuevo nombre |
| `url_for('edit_service', id=x)` | `url_for('admin.editar_servicio', servicio_id=x)` | ✅ Nuevo nombre + parámetro |
| `url_for('delete_service', id=x)` | `url_for('admin.eliminar_servicio', servicio_id=x)` | ✅ Nuevo nombre + parámetro |
| `url_for('upload_gallery')` | `url_for('admin.subir_galeria')` | ✅ Nuevo nombre |
| `url_for('delete_gallery_image', filename=x)` | `url_for('admin.eliminar_galeria', filename=x)` | ✅ Nuevo nombre |

---

## Cambios en Templates

### `templates/base.html`

```html
<!-- ANTES -->
<a href="/">Inicio</a>
<a href="/servicios">Servicios</a>

<!-- DESPUÉS -->
<a href="{{ url_for('main.index') }}">Inicio</a>
<a href="{{ url_for('main.servicios') }}">Servicios</a>
{% if current_user.is_authenticated %}
    <a href="{{ url_for('admin.dashboard') }}">Admin</a>
{% endif %}
```

### `templates/admin/dashboard.html`

```html
<!-- ANTES -->
<form method="POST" action="{{ url_for('add_service') }}">
<a href="{{ url_for('edit_service', id=s.id) }}">
<a href="{{ url_for('delete_service', id=s.id) }}">
<form method="POST" action="{{ url_for('upload_gallery') }}">
<a href="{{ url_for('delete_gallery_image', filename=img) }}">

<!-- DESPUÉS -->
<form method="POST" action="{{ url_for('admin.crear_servicio') }}">
<a href="{{ url_for('admin.editar_servicio', servicio_id=s.id) }}">
<a href="{{ url_for('admin.eliminar_servicio', servicio_id=s.id) }}">
<form method="POST" action="{{ url_for('admin.subir_galeria') }}">
<a href="{{ url_for('admin.eliminar_galeria', filename=img) }}">
```

### `templates/admin/edit.html`

```html
<!-- ANTES -->
<form method="POST" action="{{ url_for('edit_service', id=servicio.id) }}">
<a href="{{ url_for('admin_dashboard') }}">

<!-- DESPUÉS -->
<form method="POST" action="{{ url_for('admin.editar_servicio', servicio_id=servicio.id) }}">
<a href="{{ url_for('admin.dashboard') }}">
```

### `templates/admin/login.html`

```html
<!-- ANTES -->
<form method="POST">

<!-- DESPUÉS -->
<form method="POST" action="{{ url_for('admin.login') }}">
```

---

## Cambios en Importaciones

### Servicios

```python
# ANTES
from models import User, Servicio
from config import Config

# DESPUÉS
from app.domain.models import User, Servicio, db
from app.core.config import get_config
from app.services.service_locator import get_servicio_service, get_galeria_service
from app.services.auth_service import AuthService
```

---

## Punto de Entrada

### Desarrollo

```bash
# ANTES
python app.py

# DESPUÉS
python run.py
# o
flask run
```

### Producción

```bash
# ANTES (sin especificar)
python app.py

# DESPUÉS (recomendado)
gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app
```

---

## Estructura de Directorios

### ANTES
```
barbershop/
├── app.py
├── models.py
├── config.py
├── static/
│   └── css/
│       └── style.css       (1500+ líneas)
└── templates/
```

### DESPUÉS
```
barbershop/
├── app/
│   ├── core/
│   │   ├── config.py
│   │   └── factory.py
│   ├── domain/
│   │   ├── models.py
│   │   └── repositories.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── servicio_service.py
│   │   └── service_locator.py
│   └── web/
│       ├── main/routes.py
│       └── admin/routes.py
├── static/
│   └── css/
│       ├── style.css       (punto de entrada)
│       ├── base/           (variables, responsive)
│       ├── components/     (botones, header, cards, etc)
│       ├── layouts/        (hero)
│       └── pages/          (servicios, admin)
├── templates/
├── run.py
└── wsgi.py
```

---

## Cambios en CSS

### Punto de Entrada

```css
/* ANTES */
/* Todo en un solo archivo style.css */

/* DESPUÉS */
/* style.css importa módulos */
@import url('base/01-variables.css');
@import url('base/02-responsive.css');
@import url('components/01-buttons.css');
@import url('components/02-header.css');
@import url('components/03-cards.css');
@import url('components/04-gallery.css');
@import url('components/05-footer.css');
@import url('components/06-forms.css');
@import url('layouts/01-hero.css');
@import url('pages/01-servicios.css');
@import url('pages/02-admin.css');
```

### Variables CSS

```css
/* ANTES */
:root {
    --bg: #0f0f0f;
    --text: #f5f5f5;
    --accent: #d4af37;
}

/* DESPUÉS */
:root {
    /* === COLORES === */
    --bg: #0f0f0f;
    --bg-dark: #0a0a0a;
    --bg-card: #141414;
    --text: #f5f5f5;
    --text-secondary: #d0d0d0;
    --text-muted: #999;
    --accent: #d4af37;
    --accent-hover: #e6c14a;
    --gray: #222;
    --border: #333;
    
    /* === ESPACIADO === */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    --spacing-3xl: 4rem;
    
    /* === BORDES === */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 20px;
    --radius-xl: 24px;
    --radius-full: 50px;
    
    /* === SOMBRAS === */
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.2);
    --shadow-lg: 0 25px 60px rgba(0, 0, 0, 0.3);
    --shadow-accent: 0 15px 40px rgba(212, 175, 55, 0.4);
}
```

---

## Archivos Antiguos que se Pueden Eliminar

Después de verificar que todo funciona:

```bash
# Archivos raíz antiguos
rm app.py           # Reemplazado por app/core/factory.py + app/web/*/routes.py
rm models.py        # Movido a app/domain/models.py
rm config.py        # Movido a app/core/config.py

# CSS antiguo
rm static/css/style.css  # Reemplazado por estructura modular
```

---

## Base de Datos

La base de datos **barberia.db** permanece igual. Los modelos son compatibles:

```python
# El campo 'categoria' ya existe en el modelo anterior
class Servicio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.String(20), nullable=False)
    descripcion = db.Column(db.Text)
    categoria = db.Column(db.String(20), default="corte", nullable=False)
```

Si quieres migrar a una BD nueva (recomendado para limpiar):

```python
# En el Factory, se crea automáticamente con datos iniciales
db.create_all()
_crear_datos_iniciales()
```

---

## Verificación Post-Migración

Checklist para verificar que todo funciona:

- [ ] Ejecutar `python run.py` sin errores
- [ ] Página de inicio carga correctamente
- [ ] Página de servicios muestra servicios
- [ ] Login con admin:barber123 funciona
- [ ] Dashboard carga sin errores
- [ ] Agregar servicio funciona
- [ ] Editar servicio funciona
- [ ] Eliminar servicio funciona
- [ ] Subir imagen a galería funciona
- [ ] Eliminar imagen de galería funciona
- [ ] CSS se carga correctamente (no hay errores en consola)
- [ ] Responsive funciona en móvil
- [ ] Lightbox de galería funciona

---

## Soporte

Si encuentras problemas:

1. Verifica que todas las URLs en templates usen `url_for()`
2. Verifica que importas desde `app.*` no desde raíz
3. Revisa los logs en la consola
4. Consulta [ARCHITECTURE.md](ARCHITECTURE.md) para más detalles

---

**¡Listo! Tu aplicación está completamente refactorizada y lista para producción.** ✨
