"""
Punto de entrada WSGI para producción
Uso: gunicorn wsgi:app
"""
import os
from app.core.factory import create_app

# Crear la aplicación para producción por defecto
app = create_app(os.environ.get('FLASK_ENV', 'production'))

# Este archivo está pensado para servidores WSGI (gunicorn, uWSGI).
# Para desarrollo, use `python run.py`.
