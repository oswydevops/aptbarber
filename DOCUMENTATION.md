# 📚 DOCUMENTACIÓN TÉCNICA - APT BARBER

> **Documentación completa consolidada para desarrolladores**

---

## 📋 TABLA DE CONTENIDOS

- [🚀 Inicio Rápido](#-inicio-rápido)
- [🏗️ Arquitectura](#️-arquitectura)
- [🎨 Sistema CSS](#-sistema-css)
- [🔧 Migración y Cambios](#-migración-y-cambios)
- [🧪 Testing](#-testing)
- [📱 Responsive Design](#-responsive-design)
- [🚀 Deployment](#-deployment)

---

## 🚀 INICIO RÁPIDO

### Pre-requisitos

```bash
# Python 3.8+
python --version

# Dependencias desde requirements.txt
pip install -r requirements.txt
```

### Inicio en 3 Pasos

#### 1️⃣ Ejecutar la aplicación

```bash
# Desarrollo (con reload automático)
python run.py

# Output esperado:
# * Running on http://127.0.0.1:5000
# * Press CTRL+C to quit
```

#### 2️⃣ Acceder a la aplicación

```
🏠 Home:        http://localhost:5000/
📋 Servicios:   http://localhost:5000/servicios
🔐 Admin Login: http://localhost:5000/admin/login
```

#### 3️⃣ Credenciales Admin

```
👤 Usuario: admin
🔑 Password: barber123
```

### Comandos Útiles

#### Desarrollo
```bash
# Iniciar con reload automático
python run.py

# Entrar a la shell de Flask
flask shell

# Ver rutas registradas
flask routes
```

#### Producción
```bash
# Con Gunicorn (4 workers)
gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app

# En background
gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app &
```

### Rutas Principales

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/` | GET | Página principal |
| `/servicios` | GET | Lista de servicios |
| `/admin/login` | GET/POST | Login admin |
| `/admin/` | GET | Dashboard admin |
| `/admin/servicios/crear` | POST | Crear servicio |
| `/admin/servicios/<id>/editar` | GET/POST | Editar servicio |
| `/admin/servicios/<id>/eliminar` | POST | Eliminar servicio |

### Troubleshooting

#### Error: "ModuleNotFoundError: No module named 'app'"
```bash
# Solución: Instalar en modo desarrollo
pip install -e .
# O ejecutar desde el directorio raíz
cd d:\PROYECTOS\barbershop
python run.py
```

#### Error: CSS no carga en el navegador
```
✓ Verificar que style.css esté en static/css/style.css
✓ Verificar que los @import apunten correctamente
✓ Limpiar caché del navegador (Ctrl+Shift+Delete)
✓ Abrir Developer Tools (F12) y buscar errores en Console
```

---

## 🏗️ ARQUITECTURA

### Clean Architecture Overview

```
APT BARBER/
├── app/                          # Código principal
│   ├── core/                     # Configuración y factory
│   ├── domain/                   # Modelos y repositorios
│   ├── services/                 # Lógica de negocio
│   └── web/                      # Rutas (blueprints)
├── static/                       # Archivos estáticos
│   ├── css/                      # Estilos modularizados
│   ├── js/                       # JavaScript modular
│   └── images/                   # Imágenes
└── templates/                    # Plantillas HTML
```

### Capas de Arquitectura

#### 1. Domain Layer (`app/domain/`)
- **Modelos**: Definición de entidades de negocio
- **Repositorios**: Abstracción del acceso a datos
- **Responsabilidad**: Reglas de negocio core

#### 2. Service Layer (`app/services/`)
- **Lógica de aplicación**: Casos de uso específicos
- **Inyección de dependencias**: Service Locator Pattern
- **Responsabilidad**: Coordinar operaciones entre capas

#### 3. Web Layer (`app/web/`)
- **Controladores**: Blueprints de Flask
- **Presentación**: Templates y respuestas
- **Responsabilidad**: Manejar requests/responses

#### 4. Core Layer (`app/core/`)
- **Configuración**: Settings por ambiente
- **Factory**: Application Factory Pattern
- **Responsabilidad**: Inicialización y configuración

### Patrones Implementados

#### Application Factory Pattern
```python
def create_app(config_name=None):
    app = Flask(__name__)
    app.config.from_object(get_config(config_name))

    # Inicializar componentes
    db.init_app(app)
    login_manager.init_app(app)

    # Registrar blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(admin_bp)

    return app
```

#### Repository Pattern
```python
class ServicioRepository:
    @staticmethod
    def get_all():
        return Servicio.query.filter_by(is_active=True).all()

    @staticmethod
    def create(nombre, precio, descripcion=''):
        servicio = Servicio(...)
        db.session.add(servicio)
        db.session.commit()
        return servicio
```

#### Service Layer Pattern
```python
class ServicioService:
    def __init__(self, repository=None):
        self.repository = repository or ServicioRepository()

    def listar_servicios(self):
        return self.repository.get_all()

    def crear_servicio(self, nombre, precio, descripcion='', categoria='corte'):
        # Validaciones y lógica de negocio
        return self.repository.create(nombre, precio, descripcion, categoria)
```

### Blueprints Organization

#### Main Blueprint (`app/web/main/`)
```python
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    servicios = get_servicio_service().listar_servicios()
    return render_template('index.html', servicios=servicios)

@main_bp.route('/servicios')
def servicios():
    servicios = get_servicio_service().listar_por_categoria('corte')
    extras = get_servicio_service().listar_por_categoria('extra')
    return render_template('servicios.html', servicios=servicios, extras=extras)
```

#### Admin Blueprint (`app/web/admin/`)
```python
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    # Lógica de autenticación

@admin_bp.route('/')
@login_required
def dashboard():
    servicios = get_servicio_service().listar_servicios()
    return render_template('admin/dashboard.html', servicios=servicios)
```

### Configuración por Ambiente

```python
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///barberia.db'
    DEBUG = False
    TESTING = False

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///barbershop.db'

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SESSION_COOKIE_SECURE = True
```

---

## 🎨 SISTEMA CSS

### Arquitectura SMACSS + BEM

La arquitectura CSS sigue **SMACSS** (Scalable and Modular Architecture for CSS) con convenciones **BEM** (Block Element Modifier).

### Estructura de Archivos

```
static/css/
├── style.css              # Punto de entrada
├── base/
│   ├── 01-variables.css      # Variables globales
│   ├── 02-responsive.css     # Media queries
│   └── 03-reset.css          # Reset y base styles
├── components/
│   ├── 01-buttons.css        # Botones (.btn-primary)
│   ├── 02-header.css         # Header y navegación
│   ├── 03-cards.css          # Tarjetas de servicios
│   ├── 04-gallery.css        # Galería y lightbox
│   ├── 05-footer.css         # Footer
│   └── 06-forms.css          # Formularios
├── layouts/
│   └── 01-hero.css           # Sección hero
└── pages/
    ├── 01-index.css          # Página principal
    ├── 02-servicios.css      # Página servicios
    └── 03-admin.css          # Panel admin
```

### Variables CSS Globales

```css
:root {
  /* Colores */
  --primary: #d4af37;
  --primary-dark: #b8941f;
  --accent: #ffb347;
  --dark: #000000;
  --dark-gray: #141414;
  --medium-gray: #333333;
  --light-gray: #dddddd;

  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;

  /* Tipografía */
  --font-primary: 'Inter', sans-serif;
  --font-heading: 'Satoshi', sans-serif;

  /* Bordes y sombras */
  --border-radius: 12px;
  --border-radius-lg: 18px;
  --shadow: 0 4px 12px rgba(0,0,0,0.3);
  --shadow-lg: 0 8px 25px rgba(0,0,0,0.4);
}
```

### Convenciones BEM

```css
/* Block */
.card { }

/* Element */
.card__title { }
.card__content { }

/* Modifier */
.card--featured { }
.card__title--large { }
```

### Sistema Responsive

#### Breakpoints Definidos

```css
/* Móvil pequeño */
@media (max-width: 375px) { }

/* Móvil */
@media (max-width: 768px) { }

/* Tablet */
@media (max-width: 1024px) { }

/* Desktop */
@media (max-width: 1200px) { }

/* Large desktop */
@media (min-width: 1440px) { }

/* Ultra-wide */
@media (min-width: 2560px) { }
```

#### Mobile-First Approach

```css
/* Base styles (mobile) */
.card {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .card {
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .card {
    padding: 3rem;
  }
}
```

### Componentes Reutilizables

#### Botones
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: var(--dark);
}

.btn-secondary {
  background: var(--dark-gray);
  color: var(--primary);
  border: 1px solid var(--medium-gray);
}
```

#### Tarjetas
```css
.card {
  background: var(--dark-gray);
  border: 1px solid var(--medium-gray);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}
```

#### Formularios
```css
.input-field {
  background: var(--dark);
  border: 1px solid var(--medium-gray);
  border-radius: var(--border-radius);
  padding: 1rem 1.5rem;
  color: var(--light-gray);
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}
```

---

## 🔧 MIGRACIÓN Y CAMBIOS

### Cambios de Rutas (Flask)

#### Antes (monolítico)
```python
@app.route('/')
def index():
    pass

@app.route('/admin/login')
def admin_login():
    pass
```

#### Después (Blueprints)
```python
# main/routes.py
@main_bp.route('/')
def index():
    pass

# admin/routes.py
@admin_bp.route('/login')
def login():
    pass
```

### Cambios en Templates

#### Antes
```html
<a href="{{ url_for('index') }}">Inicio</a>
<a href="{{ url_for('admin_dashboard') }}">Admin</a>
```

#### Después
```html
<a href="{{ url_for('main.index') }}">Inicio</a>
<a href="{{ url_for('admin.dashboard') }}">Admin</a>
```

### Cambios en Estructura de Archivos

#### Backend
```
Antes:
app.py (150 líneas) → 4 archivos separados
models.py → app/domain/models.py
routes.py → app/web/*/routes.py

Después:
app/ (estructura modular)
├── core/config.py
├── domain/models.py
├── services/*.py
└── web/*/routes.py
```

#### Frontend
```
Antes:
style.css (1500 líneas) → 13 archivos modulares

Después:
static/css/
├── base/ (variables, responsive, reset)
├── components/ (botones, header, cards, etc.)
├── layouts/ (hero, sections)
└── pages/ (páginas específicas)
```

### Mejoras de Rendimiento

#### CSS
- **Modularización**: Archivos más pequeños, mejor caching
- **Variables CSS**: Consistencia y facilidad de cambios
- **Mobile-first**: Mejor performance en móviles

#### JavaScript
- **Módulos especializados**: Solo carga lo necesario
- **Intersection Observer**: Animaciones eficientes
- **Event delegation**: Mejor performance

### Seguridad Mejorada

- **CSRF protection** integrado
- **Password hashing** con Werkzeug
- **SQL injection prevention** con SQLAlchemy ORM
- **Secure session management**
- **Input validation** tanto frontend como backend

---

## 🧪 TESTING

### Estructura de Tests

```
tests/
├── __init__.py
├── conftest.py           # Configuración de pytest
├── test_models.py        # Tests de modelos
├── test_services.py      # Tests de servicios
├── test_routes.py        # Tests de rutas
├── test_utils.py         # Tests de utilidades
└── test_integration.py   # Tests de integración
```

### Configuración de Testing

```python
# conftest.py
import pytest
from app.core.factory import create_app

@pytest.fixture
def app():
    app = create_app('testing')
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def db(app):
    from app.core.database import db
    db.create_all()
    yield db
    db.drop_all()
```

### Ejemplos de Tests

#### Test de Modelo
```python
def test_servicio_creation(db):
    servicio = Servicio(
        nombre="Corte Premium",
        precio="50.000",
        categoria="corte"
    )
    db.session.add(servicio)
    db.session.commit()

    assert servicio.id is not None
    assert servicio.nombre == "Corte Premium"
    assert servicio.is_active == True
```

#### Test de Servicio
```python
def test_servicio_service_create(db):
    service = ServicioService()

    servicio = service.crear_servicio(
        nombre="Corte Básico",
        precio="25.000",
        categoria="corte"
    )

    assert servicio.nombre == "Corte Básico"
    assert servicio.categoria == "corte"
```

#### Test de Ruta
```python
def test_index_route(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"APT BARBER" in response.data
```

### Ejecución de Tests

```bash
# Ejecutar todos los tests
pytest

# Con cobertura
pytest --cov=app --cov-report=html

# Tests específicos
pytest tests/test_services.py -v

# Tests con marcado
pytest -m "unit"  # Tests unitarios
pytest -m "integration"  # Tests de integración
```

### Cobertura Objetivo

- **Unit Tests**: 80% cobertura mínima
- **Integration Tests**: Principales flujos de usuario
- **E2E Tests**: Próximamente con Playwright

---

## 📱 RESPONSIVE DESIGN

### Breakpoints Optimizados

| Breakpoint | Rango | Dispositivos |
|------------|-------|--------------|
| **XS** | 0 - 320px | Móviles pequeños |
| **SM** | 321px - 375px | Móviles |
| **MD** | 376px - 414px | Móviles grandes |
| **LG** | 415px - 768px | Tablets pequeñas |
| **XL** | 769px - 1024px | Tablets grandes |
| **XXL** | 1025px - 1200px | Laptops |
| **XXXL** | 1201px - 1440px | Desktops |
| **4K** | 1441px - 1920px | Monitores grandes |
| **Ultra** | 1921px+ | Ultra-wide |

### Sistema de Grid Responsive

```css
/* Grid automático */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

/* Grid específico por breakpoint */
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr; /* Mobile */
}

@media (min-width: 640px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr); /* Tablet */
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr); /* Desktop */
  }
}
```

### Tipografía Responsive

```css
/* Escala de tipografía fluida */
:root {
  --font-size-xs: clamp(0.75rem, 2vw, 0.875rem);
  --font-size-sm: clamp(0.875rem, 2.5vw, 1rem);
  --font-size-base: clamp(1rem, 3vw, 1.125rem);
  --font-size-lg: clamp(1.125rem, 4vw, 1.25rem);
  --font-size-xl: clamp(1.25rem, 5vw, 1.5rem);
  --font-size-2xl: clamp(1.5rem, 6vw, 2rem);
}

.hero-title {
  font-size: var(--font-size-2xl);
}

@media (min-width: 768px) {
  .hero-title {
    font-size: clamp(2rem, 8vw, 4rem);
  }
}
```

### Imágenes Responsive

```css
/* Imágenes fluidas */
.responsive-img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Aspect ratios */
.aspect-square { aspect-ratio: 1 / 1; }
.aspect-video { aspect-ratio: 16 / 9; }
.aspect-portrait { aspect-ratio: 3 / 4; }

/* Lazy loading */
.lazy-img {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy-img.loaded {
  opacity: 1;
}
```

### Navegación Mobile

```css
/* Hamburger menu */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-desktop {
    display: none !important;
  }

  .mobile-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: var(--dark);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .mobile-nav.active {
    transform: translateX(0);
  }
}
```

### Touch Targets

```css
/* Touch-friendly buttons */
.btn-touch {
  min-width: 44px;
  min-height: 44px;
  padding: 0.75rem 1.5rem;
}

/* Espaciado adecuado entre elementos */
.touch-spacing > * + * {
  margin-top: 0.75rem;
}

@media (hover: none) and (pointer: coarse) {
  /* Solo en dispositivos táctiles */
  .btn-touch {
    min-height: 48px;
    padding: 1rem 2rem;
  }
}
```

---

## 🚀 DEPLOYMENT

### Configuración por Ambiente

#### Development
```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
python run.py
```

#### Production
```bash
export FLASK_ENV=production
export SECRET_KEY=tu-clave-secreta-super-segura
export DATABASE_URL=postgresql://user:pass@host:port/db
gunicorn -w 4 -b 0.0.0.0:$PORT wsgi:app
```

### Docker Deployment

#### Dockerfile
```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primero para aprovechar cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY . .

# Crear directorio para base de datos
RUN mkdir -p instance

# Exponer puerto
EXPOSE 5000

# Comando de ejecución
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "wsgi:app"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./instance:/app/instance
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=barbershop
      - POSTGRES_USER=barber
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Render Deployment

#### render.yaml
```yaml
services:
  - type: web
    name: apt-barber
    runtime: python312
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn -w 4 -b 0.0.0.0:$PORT wsgi:app

  - type: pserv
    name: apt-barber-db
    runtime: postgresql
    ipAllowList: ["0.0.0.0/0"]
```

### Variables de Entorno

#### Requeridas
```bash
# Flask
FLASK_ENV=production
SECRET_KEY=clave-super-segura-min-32-caracteres

# Base de datos
DATABASE_URL=postgresql://user:pass@host:port/database

# Email (opcional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
```

#### Opcionales
```bash
# Performance
GUNICORN_WORKERS=4
GUNICORN_TIMEOUT=30

# Logging
LOG_LEVEL=INFO
LOG_FILE=/app/logs/app.log

# CDN (futuro)
CDN_URL=https://cdn.example.com
```

### Checklist de Deployment

#### Pre-deployment
- [ ] Tests pasan: `pytest`
- [ ] Cobertura > 80%: `pytest --cov=app`
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Assets optimizados

#### Post-deployment
- [ ] Aplicación responde en producción
- [ ] Admin login funciona
- [ ] Base de datos poblada correctamente
- [ ] Emails funcionan (si aplicable)
- [ ] Performance monitoreada

### Monitoreo

#### Health Check
```python
@main_bp.route('/health')
def health():
    return {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    }
```

#### Logging
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)
```

---

## 📞 SOPORTE Y CONTRIBUCIÓN

### Reportar Issues

1. Verifica que el problema no esté ya reportado
2. Crea un issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Ambiente (OS, Python version, etc.)
   - Logs relevantes

### Contribuir Código

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Add nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

### Convenciones de Código

#### Python
- **PEP 8** compliance
- **Type hints** cuando sea posible
- **Docstrings** en funciones complejas
- **Nombres descriptivos**

#### JavaScript
- **ES6+** features
- **Async/await** sobre promises
- **Destructuring** y **spread operator**
- **Arrow functions** cuando apropiado

#### CSS
- **BEM** methodology
- **CSS Variables** para consistencia
- **Mobile-first** responsive
- **No !important** sin justificación

---

**📖 Para más información detallada, consulta los archivos específicos mencionados en cada sección.**</content>
<parameter name="filePath">DOCUMENTATION.md