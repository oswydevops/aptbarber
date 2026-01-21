"""
Script para ejecutar la aplicación
"""
import os
from app.core.factory import create_app

# Crear la aplicación
app = create_app(os.environ.get('FLASK_ENV', 'development'))

if __name__ == '__main__':
    # Configuración para desarrollo
    app.run(debug=True, host='0.0.0.0', port=5000)
