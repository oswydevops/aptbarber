# 🏗️ ARQUITECTURA REFACTORIZADA - APT BARBER

## Overview
Esta aplicación ha sido refactorizada siguiendo **Clean Architecture** y **Best Practices** profesionales. El código es ahora modular, escalable, testeable y mantenible.

---

## 📁 Estructura de Directorios

```
barbershop/
├── app/                          # Código principal de la aplicación
│   ├── __init__.py
│   ├── core/
│   │   ├── config.py            # Configuración centralizada
│   │   └── factory.py           # Application Factory Pattern
│   ├── domain/
│   │   ├── models.py            # Modelos de negocio (User, Servicio)
│   │   └── repositories.py      # Data Access Layer (Repositorios)
│   ├── services/
│   │   ├── auth_service.py      # Lógica de autenticación
│   │   ├── servicio_service.py  # Lógica de servicios y galería
│   │   └── service_locator.py   # Inyección de dependencias
│   └── web/
│       ├── main/
│       │   └── routes.py        # Rutas públicas (index, servicios)
│       └── admin/
│           └── routes.py        # Rutas administrador (admin)
├── static/
│   ├── css/
│   │   ├── style.css            # Punto de entrada principal
│   │   ├── base/
│   │   │   ├── 01-variables.css    # Variables y reset
│   │   │   └── 02-responsive.css   # Media queries
│   │   ├── components/
│   │   │   ├── 01-buttons.css      # Botones
│   │   │   ├── 02-header.css       # Header y navegación
│   │   │   ├── 03-cards.css        # Tarjetas
│   │   │   ├── 04-gallery.css      # Galería y lightbox
│   │   │   ├── 05-footer.css       # Footer
│   │   │   └── 06-forms.css        # Formularios
│   │   ├── layouts/
│   │   │   └── 01-hero.css         # Sección hero
│   │   └── pages/
│   │       ├── 01-servicios.css    # Página de servicios
│   │       └── 02-admin.css        # Panel admin
│   ├── images/
│   ├── js/
│   │   ├── admin.js
│   │   └── main.js
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── servicios.html
│   └── admin/
│       ├── dashboard.html
│       ├── edit.html
│       └── login.html
├── run.py                        # Punto de entrada (dev)
├── wsgi.py                       # Punto de entrada (producción)
├── requirements.txt
├── README.md
└── ARCHITECTURE.md              # Este archivo
```

---

## 🏗️ Patrones de Arquitectura

### 1. **Clean Architecture**
Separación clara de responsabilidades en capas:

- **Domain Layer**: Modelos de negocio (`models.py`)
- **Repository Layer**: Acceso a datos (`repositories.py`)
- **Service Layer**: Lógica de aplicación (`servicio_service.py`, `auth_service.py`)
- **Web Layer**: Controladores/Rutas (`main/routes.py`, `admin/routes.py`)

### 2. **Application Factory Pattern**
```python
# app/core/factory.py
def create_app(config_name=None):
    app = Flask(__name__)
    app.config.from_object(get_config(config_name))
    
    db.init_app(app)
    login_manager.init_app(app)
    # ... más inicializaciones
    
    return app
```

**Ventajas:**
- Flexibilidad para crear múltiples instancias de la app
- Facilita testing
- Facilita deployments en diferentes ambientes

### 3. **Blueprint Pattern**
Organización modular de rutas:

```python
# app/web/main/routes.py
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index(): ...

@main_bp.route('/servicios')
def servicios(): ...
```

```python
# app/web/admin/routes.py
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/login')
def login(): ...

@admin_bp.route('/')
@login_required
def dashboard(): ...
```

### 4. **Service Locator Pattern**
Inyección de dependencias centralizada:

```python
# app/services/service_locator.py
class ServiceLocator:
    _servicios = {}
    
    @classmethod
    def obtener(cls, nombre):
        if nombre not in cls._servicios:
            cls._servicios[nombre] = cls._crear_servicio(nombre)
        return cls._servicios[nombre]
```

### 5. **Repository Pattern**
Abstracción del acceso a datos:

```python
# app/domain/repositories.py
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

**Ventajas:**
- Desacoplamiento de la lógica de persistencia
- Facilita cambiar de BD sin afectar los servicios
- Facilita testing (mock repositories)

---

## 🎨 Arquitectura CSS (SMACSS + BEM)

### **SMACSS (Scalable and Modular Architecture for CSS)**
Estructura en 5 capas:

1. **Base** (`base/`)
   - Variables CSS (`--bg`, `--accent`, `--font-primary`, etc.)
   - Reset y estilos globales
   - Media queries centralizadas

2. **Components** (`components/`)
   - `01-buttons.css` - Todos los botones (`.btn-whatsapp`, `.btn-primary`, etc.)
   - `02-header.css` - Header, logo, navegación
   - `03-cards.css` - Tarjetas de servicios
   - `04-gallery.css` - Galería, lightbox, flechas
   - `05-footer.css` - Footer, contacto, métodos de pago
   - `06-forms.css` - Inputs, textarea, selects

3. **Layouts** (`layouts/`)
   - `01-hero.css` - Sección hero, títulos principales

4. **Pages** (`pages/`)
   - `01-servicios.css` - Estilos específicos página servicios
   - `02-admin.css` - Estilos del panel administrador

5. **Responsive** (`base/02-responsive.css`)
   - Breakpoints organizados
   - Mobile-first approach

### **Ventajas de esta estructura:**

✅ **Modularidad**: Cada componente es independiente
✅ **Reutilización**: Las variables se heredan globalmente
✅ **Mantenibilidad**: Cambios localizados sin efectos secundarios
✅ **Performance**: Se puede descargar CSS por demanda
✅ **Escalabilidad**: Fácil agregar nuevas páginas o componentes
✅ **Consistencia**: Naming convention clara (BEM)

---

## 🚀 Cómo Usar

### **Desarrollo Local**

```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar
python run.py
# o
flask run
```

### **Producción (con Gunicorn)**

```bash
gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app
```

---

## 📝 Servicios Disponibles

### **ServicioService**
```python
from app.services.service_locator import get_servicio_service

servicio_service = get_servicio_service()

# Listar todos
todos = servicio_service.listar_servicios()

# Por categoría
cortes = servicio_service.listar_por_categoria('corte')

# Crear
servicio_service.crear_servicio(
    nombre="Corte Premium",
    precio="50.000",
    descripcion="...",
    categoria="corte"
)

# Actualizar
servicio_service.actualizar_servicio(1, nombre="Nuevo Nombre")

# Eliminar
servicio_service.eliminar_servicio(1)
```

### **GaleriaService**
```python
from app.services.service_locator import get_galeria_service

galeria_service = get_galeria_service()

# Obtener galería
imagenes = galeria_service.obtener_galeria()

# Subir imagen
filename = galeria_service.subir_imagen(file_object)

# Eliminar imagen
galeria_service.eliminar_imagen('nombre.jpg')

# Verificar capacidad
puede_subir = galeria_service.puede_subir_imagenes(cantidad=3)
```

### **AuthService**
```python
from app.services.auth_service import AuthService

# Crear usuario
usuario = AuthService.crear_usuario('username', 'password')

# Validar credenciales
usuario = AuthService.validar_credenciales('username', 'password')

# Verificar existencia
existe = AuthService.usuario_existe('username')
```

---

## 🧪 Configuración por Ambiente

La configuración se gestiona por variables de entorno:

```python
# app/core/config.py
class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///barberia.db')
    DEBUG = False

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_SECURE = True
```

Uso:
```bash
export FLASK_ENV=production
python wsgi.py
```

---

## 📊 Flujo de una Solicitud

```
[Cliente]
    ↓
[base.html - Header/Nav]
    ↓
[/] → main_bp.index() → domain/models → template/index.html
    ↓
[/servicios] → main_bp.servicios() 
    → get_servicio_service()
    → ServicioRepository.get_all()
    → template/servicios.html
    ↓
[/admin] → admin_bp.dashboard() [login_required]
    → get_servicio_service()
    → get_galeria_service()
    → template/admin/dashboard.html
    ↓
[POST /admin/servicios/crear]
    → admin_bp.crear_servicio()
    → get_servicio_service().crear_servicio()
    → ServicioRepository.create()
    → redirect (admin.dashboard)
```

---

## 🔒 Seguridad

- **Contraseñas hasheadas** con `werkzeug.security`
- **CSRF protection** con Flask-Login
- **Session management** con duración limitada
- **SQL injection prevention** con SQLAlchemy ORM
- **Path traversal prevention** en galería (`secure_filename`)

---

## 🎯 Próximas Mejoras

1. **Testing**
   - Unit tests para services
   - Integration tests para blueprints

2. **Caching**
   - Redis para galería
   - Browser caching para imágenes

3. **API REST**
   - JSON endpoints para servicios
   - JWT authentication

4. **Database**
   - Migraciones con Alembic
   - Índices en campos de búsqueda

5. **Performance**
   - CDN para imágenes
   - Minificación CSS/JS
   - Lazy loading en galería

---

## 📚 Convenciones de Código

### **Nombres de funciones**
```python
# Rutas (snake_case)
@main_bp.route('/servicios')
def servicios():
    pass

# Métodos de servicio (verbos claros)
def crear_servicio():
def actualizar_servicio():
def eliminar_servicio():
def listar_servicios():
```

### **Nombres de archivos**
- Módulos: `snake_case.py`
- Rutas: `routes.py`
- Servicios: `{dominio}_service.py`
- Repositorios: `repositories.py`

### **CSS**
- Componentes: `PascalCase` para la clase base
- Variantes: `.btn-primary`, `.btn-secondary`
- Estados: `.active`, `.hover`, `.disabled`

---

## 🤝 Contributing

1. Crear rama desde `main`: `git checkout -b feature/nombre`
2. Hacer cambios siguiendo convenciones
3. Asegurar que mantiene Clean Architecture
4. Push y abrir Pull Request

---

## 📧 Soporte

Para dudas o mejoras, consulta el README.md principal.

---

**Versión:** 1.0.0 - Clean Architecture Refactor
**Fecha:** 2025
**Autor:** Senior Software Engineer
