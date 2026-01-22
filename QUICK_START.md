# 🚀 QUICK START - Inicio Rápido

## 📋 Pre-requisitos

```bash
# Python 3.8+
python --version

# Dependencias desde requirements.txt
pip install -r requirements.txt
```

---

## 🎯 Inicio en 3 Pasos

### 1️⃣ Ejecutar la aplicación

```bash
# Desarrollo (con reload automático)
python run.py

# O desde terminal:
python -m flask run
```

**Output esperado:**
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### 2️⃣ Acceder a la aplicación

```
🏠 Home:        http://localhost:5000/
📋 Servicios:   http://localhost:5000/servicios
🔐 Admin Login: http://localhost:5000/admin/login
```

### 3️⃣ Credenciales Admin

```
👤 Usuario: admin
🔑 Password: barber123
```

---

## 📂 Estructura Rápida

```
app/
├── core/          ← Configuración y Factory
├── domain/        ← Modelos y Repositorios
├── services/      ← Lógica de negocio
└── web/           ← Rutas (Blueprints)

static/css/
├── base/          ← Variables y responsive
├── components/    ← Botones, header, cards, etc
├── layouts/       ← Hero section
└── pages/         ← Estilos específicos por página

templates/         ← HTML Jinja2
run.py            ← Punto de entrada (desarrollo)
wsgi.py           ← Punto de entrada (producción)
```

---

## 🔧 Comandos Útiles

### Desarrollo

```bash
# Iniciar con reload automático
python run.py

# Entrar a la shell de Flask
flask shell

# Ver rutas registradas
flask routes
```

### Producción

```bash
# Con Gunicorn (4 workers)
gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app

# En background
gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app &
```

### Testing

```bash
# Ejecutar tests (cuando estén listos)
pytest

# Con cobertura
pytest --cov=app
```

---

## 🛣️ Rutas Principales

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/` | GET | Página principal |
| `/servicios` | GET | Lista de servicios |
| `/admin/login` | GET/POST | Login admin |
| `/admin/` | GET | Dashboard admin |
| `/admin/servicios/crear` | POST | Crear servicio |
| `/admin/servicios/<id>/editar` | GET/POST | Editar servicio |
| `/admin/servicios/<id>/eliminar` | POST | Eliminar servicio |
| `/admin/galeria/<servicio_id>` | GET | Ver galería |
| `/admin/galeria/subir` | POST | Subir imagen |
| `/admin/logout` | GET | Cerrar sesión |

---

## 📊 Servicios Disponibles

### ServicioService
```python
from app.services.service_locator import get_servicio_service

servicio = get_servicio_service()

# Listar
servicios = servicio.listar_servicios()
servicios_corte = servicio.obtener_por_categoria('corte')

# CRUD
nuevo = servicio.crear_servicio(nombre, precio, descripcion, categoria)
actualizado = servicio.actualizar_servicio(id, nombre, precio, ...)
eliminado = servicio.eliminar_servicio(id, hard_delete=False)
```

### GaleriaService
```python
galeria = get_galeria_service()

# Obtener galería
imagenes = galeria.obtener_galeria(servicio_id)

# Subir imagen (auto-optimización)
nombre = galeria.subir_imagen(file, servicio_id)

# Eliminar imagen
galeria.eliminar_imagen(servicio_id, imagen_id)
```

### AuthService
```python
from app.services.service_locator import get_auth_service

auth = get_auth_service()

# Crear usuario
usuario = auth.crear_usuario(username, password, email)

# Validar credenciales
valido = auth.validar_credenciales(username, password)

# Verificar existencia
existe = auth.usuario_existe(username)
```

---

## ⚙️ Configuración

### Variables de Ambiente

```bash
# Ambiente
export FLASK_ENV=development  # o production
export FLASK_DEBUG=1

# Base de datos
export DATABASE_URL=sqlite:///barbershop.db

# Secreto
export SECRET_KEY=tu-clave-secreta
```

### Archivos de Configuración

```python
# app/core/config.py
class DevelopmentConfig:
    DEBUG = True
    DATABASE_URI = 'sqlite:///barbershop.db'

class ProductionConfig:
    DEBUG = False
    DATABASE_URI = os.environ.get('DATABASE_URL')

class TestingConfig:
    TESTING = True
    DATABASE_URI = 'sqlite:///:memory:'
```

---

## 🐛 Troubleshooting

### Error: "ModuleNotFoundError: No module named 'app'"

```bash
# Solución: Instalar en modo desarrollo
pip install -e .
# O ejecutar desde el directorio raíz
cd d:\PROYECTOS\barbershop
python run.py
```

### Error: "No 'werkzeug' in requirements"

```bash
# Solución: Instalar dependencias
pip install -r requirements.txt
```

### Error: "Port 5000 already in use"

```bash
# Usar otro puerto
python run.py --port 8000

# O matar el proceso (PowerShell):
Stop-Process -Name python -Force
```

### CSS no carga en el navegador

```
✓ Verificar que style.css esté en static/css/style.css
✓ Verificar que los @import apunten correctamente
✓ Limpiar caché del navegador (Ctrl+Shift+Delete)
✓ Abrir Developer Tools (F12) y buscar errores en Console
```

---

## 📚 Documentación Completa

```
ARCHITECTURE.md        ← Explicación de la arquitectura
REFACTOR_SUMMARY.md    ← Cambios realizados
MIGRATION_GUIDE.md     ← Guía de migración de rutas
REFACTOR_VISUAL_SUMMARY.md ← Resumen visual
README_NEW.md          ← README del proyecto
```

---

## ✅ Verificación de Instalación

```bash
# Ejecutar este script para verificar todo está OK:
python -c "
import sys
print('Python:', sys.version)

import flask
print('Flask:', flask.__version__)

import sqlalchemy
print('SQLAlchemy:', sqlalchemy.__version__)

from app.core.factory import create_app
print('✅ App Factory OK')

app = create_app('development')
print('✅ App Creation OK')

with app.app_context():
    print('✅ App Context OK')

print('\n✨ Todos los sistemas GO!')
"
```

---

## 🎓 Pasos Siguiente

1. ✅ Ejecutar `python run.py`
2. ✅ Acceder a http://localhost:5000
3. ✅ Hacer login con admin/barber123
4. ✅ Crear un nuevo servicio
5. ✅ Subir una imagen
6. ✅ Verificar que todo funciona
7. ✅ Leer ARCHITECTURE.md para entender la estructura

---

## 💡 Tips Pro

```
# Recargar la BD (borra datos):
# 1. Elimina barbershop.db
# 2. Ejecuta python run.py nuevamente

# Debug en VSCode:
# 1. Crear .vscode/launch.json
# 2. Configurar Python debugger
# 3. F5 para iniciar debug

# Agregar nuevo Blueprint:
# 1. Crear app/web/nueva_ruta/routes.py
# 2. Importar en app/web/__init__.py
# 3. Registrar en factory.py

# Crear nuevo Servicio:
# 1. Crear app/services/nuevo_service.py
# 2. Agregar método en ServiceLocator
# 3. Usar desde routes con get_nuevo_service()
```

---

## 🆘 Soporte Rápido

**Problema**: App no inicia
**Solución**: `pip install -r requirements.txt && python run.py`

**Problema**: 404 en rutas
**Solución**: Verificar que los blueprints están registrados en factory.py

**Problema**: CSS se ve raro
**Solución**: Limpiar caché (Ctrl+Shift+Delete) y recargar (Ctrl+Shift+R)

**Problema**: Login no funciona
**Solución**: Verificar DB existe, ejecutar run.py para crear admin inicial

---

**¡Listo! Ahora puedes empezar a desarrollar 🚀**

Para preguntas, consulta `ARCHITECTURE.md` o `MIGRATION_GUIDE.md`
