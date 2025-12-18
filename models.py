from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# ← AÑADIDO: campo "categoria" con valor por defecto "corte"
class Servicio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.String(20), nullable=False)
    descripcion = db.Column(db.Text)
    
    # NUEVO CAMPO: para separar "corte" y "extra"
    categoria = db.Column(db.String(20), default="corte", nullable=False)
    
    def __repr__(self):
        return f'<Servicio {self.nombre} - {self.categoria}>'