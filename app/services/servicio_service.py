"""
Servicios de Negocio - Use Cases
"""
import os
import logging
from werkzeug.utils import secure_filename
from PIL import Image
from app.domain.repositories import ServicioRepository

logger = logging.getLogger(__name__)


class ServicioService:
    """
    Servicio de negocio para gestionar servicios
    Implementa la lógica de aplicación
    """

    def __init__(self):
        self.repository = ServicioRepository()

    def listar_servicios(self):
        """Obtiene todos los servicios"""
        try:
            return self.repository.get_all()
        except Exception as e:
            logger.exception('Error listando servicios')
            raise

    def listar_por_categoria(self, categoria):
        """Obtiene servicios por categoría"""
        if categoria not in ['corte', 'extra']:
            raise ValueError(f"Categoría inválida: {categoria}")
        try:
            return self.repository.get_by_categoria(categoria)
        except Exception as e:
            logger.exception('Error listando por categoria %s', categoria)
            raise

    def obtener_servicio(self, servicio_id):
        """Obtiene un servicio específico"""
        try:
            servicio = self.repository.get_by_id(servicio_id)
            if not servicio:
                raise ValueError(f"Servicio no encontrado: {servicio_id}")
            return servicio
        except ValueError:
            raise
        except Exception as e:
            logger.exception('Error obteniendo servicio %s', servicio_id)
            raise

    def crear_servicio(self, nombre, precio, descripcion='', categoria='corte'):
        """Crea un nuevo servicio"""
        if not nombre or not precio:
            raise ValueError("Nombre y precio son requeridos")
        try:
            return self.repository.create(nombre, precio, descripcion, categoria)
        except Exception as e:
            logger.exception('Error creando servicio %s', nombre)
            raise

    def actualizar_servicio(self, servicio_id, **kwargs):
        """Actualiza un servicio"""
        try:
            servicio = self.repository.update(servicio_id, **kwargs)
            if not servicio:
                raise ValueError(f"Servicio no encontrado: {servicio_id}")
            return servicio
        except ValueError:
            raise
        except Exception as e:
            logger.exception('Error actualizando servicio %s', servicio_id)
            raise

    def eliminar_servicio(self, servicio_id):
        """Elimina un servicio (soft delete)"""
        try:
            servicio = self.repository.delete(servicio_id)
            if not servicio:
                raise ValueError(f"Servicio no encontrado: {servicio_id}")
            return servicio
        except ValueError:
            raise
        except Exception as e:
            logger.exception('Error eliminando servicio %s', servicio_id)
            raise


class GaleriaService:
    """
    Servicio de negocio para gestionar la galería de imágenes
    """

    UPLOAD_FOLDER = 'static/images/gallery'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
    MAX_IMAGES = 10
    MAX_WIDTH = 1200
    IMAGE_QUALITY = 80

    def __init__(self):
        os.makedirs(self.UPLOAD_FOLDER, exist_ok=True)

    def validar_archivo(self, filename):
        """Valida que el archivo sea una imagen permitida"""
        if not filename or '.' not in filename:
            return False
        ext = filename.rsplit('.', 1)[1].lower()
        return ext in self.ALLOWED_EXTENSIONS

    def obtener_contador_imagenes(self):
        """Obtiene el número de imágenes actualmente en la galería"""
        try:
            files = os.listdir(self.UPLOAD_FOLDER)
            return len([f for f in files if f.lower().endswith(tuple(self.ALLOWED_EXTENSIONS))])
        except Exception:
            return 0

    def puede_subir_imagenes(self, cantidad=1):
        """Verifica si se pueden subir más imágenes"""
        actual = self.obtener_contador_imagenes()
        return (actual + cantidad) <= self.MAX_IMAGES

    def optimizar_imagen(self, filepath):
        """
        Redimensiona y comprime la imagen
        Máximo 1200px de ancho, calidad 80%
        """
        try:
            with Image.open(filepath) as img:
                # Redimensionar si es necesario
                if img.width > self.MAX_WIDTH:
                    ratio = self.MAX_WIDTH / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((self.MAX_WIDTH, new_height),
                                     Image.Resampling.LANCZOS)

                # Convertir a RGB si es necesario
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")

                # Guardar optimizada
                if filepath.lower().endswith('.png'):
                    img.save(filepath, 'PNG', optimize=True)
                else:
                    img.save(filepath, 'JPEG',
                             quality=self.IMAGE_QUALITY, optimize=True)

            return True
        except Exception as e:
            print(f"Error optimizando imagen: {e}")
            return False

    def subir_imagen(self, file):
        """
        Sube y optimiza una imagen
        Retorna el nombre del archivo o None si falla
        """
        if not file or not self.validar_archivo(file.filename):
            return None

        if not self.puede_subir_imagenes():
            return None

        # Generar nombre seguro y evitar duplicados
        filename = secure_filename(file.filename)
        base, ext = os.path.splitext(filename)
        counter = 1
        new_filename = filename

        while os.path.exists(os.path.join(self.UPLOAD_FOLDER, new_filename)):
            new_filename = f"{base}_{counter}{ext}"
            counter += 1

        filepath = os.path.join(self.UPLOAD_FOLDER, new_filename)
        file.save(filepath)

        # Optimizar imagen
        if self.optimizar_imagen(filepath):
            return new_filename
        else:
            # Si falla la optimización, eliminar el archivo
            if os.path.exists(filepath):
                os.remove(filepath)
            return None

    def obtener_galeria(self):
        """Obtiene lista de imágenes de la galería, ordenadas por fecha"""
        try:
            files = os.listdir(self.UPLOAD_FOLDER)
            images = [f for f in files if f.lower().endswith(
                tuple(self.ALLOWED_EXTENSIONS))]

            # Ordenar por fecha (más nueva primero)
            images.sort(
                key=lambda x: os.path.getmtime(
                    os.path.join(self.UPLOAD_FOLDER, x)),
                reverse=True
            )

            return images[:self.MAX_IMAGES]
        except Exception as e:
            print(f"Error en galería: {e}")
            return []

    def eliminar_imagen(self, filename):
        """Elimina una imagen de la galería"""
        if '..' in filename or not filename:
            return False

        filepath = os.path.join(self.UPLOAD_FOLDER, filename)

        if os.path.exists(filepath) and os.path.isfile(filepath):
            try:
                os.remove(filepath)
                return True
            except Exception as e:
                print(f"Error eliminando imagen: {e}")
                return False

        return False
