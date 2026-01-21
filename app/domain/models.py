"""
Domain Models - Entidades de negocio principales
"""
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()


class User(UserMixin, db.Model):
    """
    Modelo de Usuario para autenticación
    """
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    
    def __repr__(self):
        return f'<User {self.username}>'


class Servicio(db.Model):
    """
    Modelo de Servicio - Servicios de barbería
    Categorías: corte | extra
    """
    __tablename__ = 'servicio'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, index=True)
    precio = db.Column(db.String(20), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    categoria = db.Column(db.String(20), default="corte", nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    
    CATEGORIA_TIPOS = ['corte', 'extra']
    
    def __repr__(self):
        return f'<Servicio {self.nombre} - {self.categoria}>'
    
    def to_dict(self):
        """Convierte el modelo a diccionario"""
        return {
            'id': self.id,
            'nombre': self.nombre,
            'precio': self.precio,
            'descripcion': self.descripcion,
            'categoria': self.categoria
        }
