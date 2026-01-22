"""
Factory de la aplicación Flask - Application Factory Pattern
"""
import os
from flask import Flask
from flask_login import LoginManager
from app.core.config import get_config
from app.domain.models import db, User


def create_app(config_name=None):
    """
    Factory para crear la aplicación Flask

    Configuración centralizada de la app:
    - Registra extensiones (SQLAlchemy, LoginManager)
    - Registra blueprints
    - Registra context processors

    Args:
        config_name: nombre del entorno ('development', 'production', 'testing')
    """
    basedir = os.path.abspath(os.path.dirname(
        os.path.dirname(os.path.dirname(__file__))))

    app = Flask(
        __name__,
        template_folder=os.path.join(basedir, 'templates'),
        static_folder=os.path.join(basedir, 'static')
    )

    # Cargar configuración
    config = get_config(config_name)
    app.config.from_object(config)

    # Inicializar extensiones y componentes
    _init_extensions(app)
    _register_blueprints(app)
    _register_context_processors(app)

    return app


def _init_extensions(app):
    """Inicializa extensiones como SQLAlchemy y LoginManager"""
    db.init_app(app)

    login_manager = LoginManager(app)
    login_manager.login_view = 'admin.login'
    login_manager.login_message = "Inicia sesión para acceder al panel"
    login_manager.login_message_category = 'info'

    @login_manager.user_loader
    def load_user(user_id):
        try:
            return User.query.get(int(user_id))
        except (ValueError, TypeError):
            return None


def _register_blueprints(app):
    """Registra blueprints del proyecto"""
    from app.web.main.routes import main_bp
    from app.web.admin.routes import admin_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(admin_bp)


def _register_context_processors(app):
    """Context processors globales para templates"""
    @app.context_processor
    def inject_gallery():
        from app.services.service_locator import get_galeria_service
        try:
            galeria_service = get_galeria_service()
            return {'gallery_images': galeria_service.obtener_galeria()}
        except Exception:
            return {'gallery_images': []}

    # Crear tablas
    with app.app_context():
        db.create_all()
        _crear_datos_iniciales()

    return app


def _crear_datos_iniciales():
    """Crea datos iniciales si no existen"""
    from app.services.auth_service import AuthService
    from app.domain.models import Servicio

    # Crear usuario admin si no existe
    if not User.query.filter_by(username='admin').first():
        try:
            AuthService.crear_usuario('admin', 'barber123')
            print("✓ Usuario admin creado")
        except ValueError:
            pass

        # Crear servicios de ejemplo
        servicios_ejemplo = [
            Servicio(nombre="Corte Clásico", precio="35.000",
                     descripcion="Corte tradicional con tijera y máquina", categoria="corte"),
            Servicio(nombre="Skin Fade + Degrade", precio="45.000",
                     descripcion="Degradado perfecto a piel", categoria="corte"),
            Servicio(nombre="Corte + Barba", precio="60.000",
                     descripcion="Pack más vendido", categoria="corte"),
            Servicio(nombre="Barba Completa", precio="30.000",
                     descripcion="Afeitado + perfilado + hot towel", categoria="corte"),
            Servicio(nombre="Peinados", precio="25.000",
                     descripcion="Estilizado con secador y producto", categoria="extra"),
            Servicio(nombre="Tinte", precio="80.000",
                     descripcion="Coloración completa + lavado", categoria="extra"),
            Servicio(nombre="Afeitado Clásico", precio="35.000",
                     descripcion="Con toalla caliente y navaja", categoria="extra"),
            Servicio(nombre="Perfilado de Cejas", precio="15.000",
                     descripcion="Definición perfecta", categoria="extra"),
        ]
        db.session.bulk_save_objects(servicios_ejemplo)
        db.session.commit()
        print("✓ Servicios de ejemplo creados")
