import os
import io
import pytest

from app.services.servicio_service import GaleriaService


def test_subir_y_listar_galeria(tmp_path):
    service = GaleriaService()

    # usar carpeta temporal
    service.UPLOAD_FOLDER = str(tmp_path)
    os.makedirs(service.UPLOAD_FOLDER, exist_ok=True)

    # crear una imagen válida en memoria usando Pillow
    from PIL import Image
    img = Image.new('RGB', (20, 20), color='red')
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    img_content = buf.getvalue()

    # Simular objeto file con save method
    class DummyFile(io.BytesIO):
        def __init__(self, b, name):
            super().__init__(b)
            self.filename = name

        def save(self, path):
            with open(path, 'wb') as f:
                f.write(self.getvalue())

    dummy = DummyFile(img_content, 'test.jpg')

    name = service.subir_imagen(dummy)
    assert name is not None

    images = service.obtener_galeria()
    assert name in images
