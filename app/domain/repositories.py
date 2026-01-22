"""
Repositorio de Servicios - Capa de acceso a datos
"""
from app.domain.models import Servicio, db


class ServicioRepository:
    """
    Repositorio para operaciones CRUD de Servicios
    """
    
    @staticmethod
    def get_all():
        """Obtiene todos los servicios activos"""
        return Servicio.query.filter_by(is_active=True).all()
    
    @staticmethod
    def get_by_id(servicio_id):
        """Obtiene un servicio por ID"""
        return Servicio.query.get(servicio_id)
    
    @staticmethod
    def get_by_categoria(categoria):
        """Obtiene servicios por categoría"""
        return Servicio.query.filter_by(categoria=categoria, is_active=True).all()
    
    @staticmethod
    def create(nombre, precio, descripcion='', categoria='corte'):
        """Crea un nuevo servicio"""
        servicio = Servicio(
            nombre=nombre,
            precio=precio,
            descripcion=descripcion,
            categoria=categoria
        )
        db.session.add(servicio)
        db.session.commit()
        return servicio
    
    @staticmethod
    def update(servicio_id, **kwargs):
        """Actualiza un servicio existente"""
        servicio = Servicio.query.get(servicio_id)
        if not servicio:
            return None
        
        for key, value in kwargs.items():
            if hasattr(servicio, key) and key != 'id':
                setattr(servicio, key, value)
        
        db.session.commit()
        return servicio
    
    @staticmethod
    def delete(servicio_id):
        """Soft delete - marca como inactivo"""
        servicio = Servicio.query.get(servicio_id)
        if servicio:
            servicio.is_active = False
            db.session.commit()
        return servicio
    
    @staticmethod
    def hard_delete(servicio_id):
        """Eliminación permanente"""
        servicio = Servicio.query.get(servicio_id)
        if servicio:
            db.session.delete(servicio)
            db.session.commit()
        return servicio
