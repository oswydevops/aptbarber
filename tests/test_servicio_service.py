import os
import pytest

from app.core.factory import create_app
from app.domain.models import db
from app.services.servicio_service import ServicioService


@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


def test_crear_y_listar_servicio(app):
    servicio_service = ServicioService()

    # Crear servicio
    nuevo = servicio_service.crear_servicio(
        'Test Corte', '10.000', 'Descripción', 'corte')
    assert nuevo.id is not None
    assert nuevo.nombre == 'Test Corte'

    # Listar servicios
    servicios = servicio_service.listar_servicios()
    assert any(s.nombre == 'Test Corte' for s in servicios)
