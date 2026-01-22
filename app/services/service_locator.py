"""
Inicializador de servicios
"""
from app.services.servicio_service import ServicioService, GaleriaService
from app.services.auth_service import AuthService


class ServiceLocator:
    """
    Service Locator para inyección de dependencias
    """
    _servicios = {}

    @classmethod
    def registrar(cls, nombre, servicio):
        """Registra un servicio"""
        cls._servicios[nombre] = servicio

    @classmethod
    def obtener(cls, nombre):
        """Obtiene un servicio registrado"""
        if nombre not in cls._servicios:
            cls._servicios[nombre] = cls._crear_servicio(nombre)
        return cls._servicios[nombre]

    @classmethod
    def _crear_servicio(cls, nombre):
        """Factory para crear servicios"""
        if nombre == 'servicio':
            return ServicioService()
        elif nombre == 'galeria':
            return GaleriaService()
        elif nombre == 'auth':
            return AuthService()
        else:
            raise ValueError(f"Servicio desconocido: {nombre}")


# Atajos convenientes
def get_servicio_service():
    return ServiceLocator.obtener('servicio')


def get_galeria_service():
    return ServiceLocator.obtener('galeria')


def get_auth_service():
    return ServiceLocator.obtener('auth')
