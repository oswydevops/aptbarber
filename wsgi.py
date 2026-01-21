"""
Punto de entrada principal de la aplicación
Usa el Application Factory Pattern
"""
import os
import sys

# Agregar el directorio actual al PATH
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.factory import create_app

# Crear la aplicación
app = create_app(os.environ.get('FLASK_ENV', 'development'))

if __name__ == '__main__':
    """
    Ejecutar la aplicación en modo desarrollo
    Para producción, usar gunicorn o similar
    """
    app.run(debug=True, host='0.0.0.0', port=5000)
