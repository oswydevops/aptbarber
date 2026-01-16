# Apt Barber - Sistema de Gestión para Barberías

Una aplicación web completa para la gestión de barberías, construida con Flask. Incluye panel público con galería de trabajos, lista de servicios y panel de administración para gestionar servicios e imágenes.

## 🚀 Características

### Panel Público
- **Página de Inicio**: Presentación de la barbería con información básica
- **Servicios**: Lista completa de servicios ofrecidos con precios y descripciones
- **Galería**: Muestra de trabajos realizados (hasta 10 imágenes optimizadas)
- **Contacto**: Información de contacto de la barbería

### Panel de Administración
- **Autenticación**: Login seguro con Flask-Login
- **Gestión de Servicios**: Agregar, editar y eliminar servicios
- **Categorización**: Servicios divididos en "corte" y "extra"
- **Galería de Trabajos**: Subida múltiple de imágenes con optimización automática
- **Interfaz Intuitiva**: Dashboard moderno con Bootstrap

### Tecnologías Utilizadas
- **Backend**: Flask 3.0.3
- **Base de Datos**: SQLite con SQLAlchemy
- **Autenticación**: Flask-Login
- **Imágenes**: Pillow para optimización automática
- **Frontend**: HTML5, CSS3, JavaScript
- **Estilos**: Bootstrap (integrado)
- **Despliegue**: Gunicorn + Docker + Render

## 📋 Requisitos Previos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- (Opcional) Docker para despliegue en contenedor

## 🛠️ Instalación

### Instalación Local

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd aptbarber
   ```

2. **Crea un entorno virtual:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. **Instala las dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Inicializa la base de datos:**
   ```bash
   python app.py
   ```
   La aplicación se ejecutará en modo debug y creará automáticamente la base de datos y datos iniciales.

### Despliegue con Docker

1. **Construye la imagen:**
   ```bash
   docker build -t aptbarber .
   ```

2. **Ejecuta el contenedor:**
   ```bash
   docker run -p 5000:5000 aptbarber
   ```

3. **Accede a la aplicación:**
   Abre tu navegador en `http://localhost:5000`

## 🚀 Uso

### Inicio de la Aplicación

```bash
python app.py
```

La aplicación estará disponible en `http://localhost:5000`

### Credenciales de Administrador por Defecto

- **Usuario**: `admin`
- **Contraseña**: `barber123`

⚠️ **Importante**: Cambia la contraseña por defecto inmediatamente después del primer login por razones de seguridad.

### Navegación

- **Páginas Públicas**: `/` (inicio), `/servicios`, `/contacto`
- **Panel Admin**: `/admin/login` → `/admin` (requiere autenticación)

## ⚙️ Configuración

La configuración se encuentra en `config.py`. Variables principales:

- `SECRET_KEY`: Clave secreta para sesiones (generada automáticamente)
- `SQLALCHEMY_DATABASE_URI`: URI de la base de datos (SQLite por defecto)
- `PERMANENT_SESSION_LIFETIME`: Duración de la sesión (5 horas)

### Variables de Entorno

Para producción, configura estas variables de entorno:

```bash
export FLASK_ENV=production
export SECRET_KEY=tu_clave_secreta_aqui
```

## 📁 Estructura del Proyecto

```
aptbarber/
├── app.py                 # Aplicación principal Flask
├── models.py             # Modelos de base de datos
├── config.py             # Configuración de la aplicación
├── requirements.txt      # Dependencias Python
├── Dockerfile            # Configuración Docker
├── render.yaml           # Configuración de despliegue en Render
├── templates/            # Plantillas HTML
│   ├── base.html
│   ├── index.html
│   ├── servicios.html
│   └── admin/
│       ├── login.html
│       ├── dashboard.html
│       └── edit.html
├── static/               # Archivos estáticos
│   ├── css/
│   ├── js/
│   └── images/
└── instance/             # Base de datos SQLite
    └── barberia.db
```

## 🔧 Funcionalidades Técnicas

### Optimización de Imágenes
- Redimensionamiento automático a máximo 1200px de ancho
- Compresión JPEG con calidad 80%
- Conversión automática de PNG a RGB si es necesario

### Gestión de Servicios
- Categorización automática (corte/extra)
- Precios en formato de texto para flexibilidad
- Descripciones opcionales

### Seguridad
- Autenticación con hash de contraseñas (Werkzeug)
- Protección CSRF integrada
- Validación de archivos subidos
- Límites en cantidad de imágenes (máx 10)

## 🚀 Despliegue

### Render (Recomendado)
1. Conecta tu repositorio de GitHub a Render
2. Usa la configuración en `render.yaml`
3. Configura las variables de entorno
4. Despliega automáticamente

### Docker
```bash
docker build -t aptbarber .
docker run -d -p 5000:5000 aptbarber
```

### Producción con Gunicorn
```bash
gunicorn --bind 0.0.0.0:5000 app:app
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o reportar bugs, por favor abre un issue en el repositorio.

---

**Desarrollado con ❤️ para barberías modernas**