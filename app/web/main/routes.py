"""
Blueprint de rutas principales (público)
"""
from flask import Blueprint, render_template
from app.services.service_locator import get_servicio_service

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    """Página de inicio"""
    return render_template('index.html')


@main_bp.route('/servicios')
def servicios():
    """Página de servicios"""
    servicio_service = get_servicio_service()
    servicios = servicio_service.listar_servicios()
    return render_template('servicios.html', servicios=servicios)


@main_bp.route('/contacto')
def contacto():
    """Página de contacto"""
    return render_template('contacto.html')
