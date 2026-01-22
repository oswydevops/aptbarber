"""
Script para ejecutar la aplicación en desarrollo
Uso: python run.py
"""
import os
from app.core.factory import create_app

if __name__ == '__main__':
    # Crear la aplicación con la configuración del entorno (por defecto: development)
    app = create_app(os.environ.get('FLASK_ENV', 'development'))

    # Ejecutar en modo desarrollo
    app.run(
        debug=True,
        host=os.environ.get('FLASK_HOST', '127.0.0.1'),
        port=int(os.environ.get('FLASK_PORT', 5000))
    )
