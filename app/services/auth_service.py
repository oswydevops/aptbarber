"""
Servicio de Autenticación
"""
from werkzeug.security import generate_password_hash, check_password_hash
from app.domain.models import User, db


class AuthService:
    """
    Servicio de autenticación y gestión de usuarios
    """
    
    @staticmethod
    def crear_usuario(username, password):
        """Crea un nuevo usuario con contraseña hasheada"""
        if not username or not password:
            raise ValueError("Usuario y contraseña requeridos")
        
        if User.query.filter_by(username=username).first():
            raise ValueError(f"Usuario '{username}' ya existe")
        
        usuario = User(
            username=username,
            password=generate_password_hash(password)
        )
        db.session.add(usuario)
        db.session.commit()
        return usuario
    
    @staticmethod
    def validar_credenciales(username, password):
        """Valida las credenciales de un usuario"""
        usuario = User.query.filter_by(username=username).first()
        
        if not usuario:
            return None
        
        if check_password_hash(usuario.password, password):
            return usuario
        
        return None
    
    @staticmethod
    def usuario_existe(username):
        """Verifica si un usuario existe"""
        return User.query.filter_by(username=username).first() is not None
