"""
Blueprint de rutas del administrador
"""
from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from app.services.auth_service import AuthService
from app.services.service_locator import get_servicio_service, get_galeria_service

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


# ==================== AUTENTICACIÓN ====================

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Página de login del administrador"""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = AuthService.validar_credenciales(username, password)
        
        if user:
            login_user(user)
            return redirect(url_for('admin.dashboard'))
        
        flash('Usuario o contraseña incorrectos', 'error')
    
    return render_template('admin/login.html')


@admin_bp.route('/logout')
@login_required
def logout():
    """Cierra la sesión del administrador"""
    logout_user()
    return redirect(url_for('main.index'))


# ==================== DASHBOARD ====================

@admin_bp.route('/', methods=['GET'])
@login_required
def dashboard():
    """Panel de administración"""
    servicio_service = get_servicio_service()
    galeria_service = get_galeria_service()
    
    servicios = servicio_service.listar_servicios()
    
    return render_template(
        'admin/dashboard.html',
        servicios=servicios,
        gallery_images=galeria_service.obtener_galeria()
    )


# ==================== GESTIÓN DE SERVICIOS ====================

@admin_bp.route('/servicios/crear', methods=['POST'])
@login_required
def crear_servicio():
    """Crea un nuevo servicio"""
    try:
        nombre = request.form.get('nombre')
        precio = request.form.get('precio')
        descripcion = request.form.get('descripcion', '')
        categoria = request.form.get('categoria', 'corte')
        
        servicio_service = get_servicio_service()
        servicio_service.crear_servicio(nombre, precio, descripcion, categoria)
        
        flash('Servicio agregado con éxito!', 'success')
    except ValueError as e:
        flash(f'Error: {str(e)}', 'error')
    except Exception as e:
        flash(f'Error inesperado: {str(e)}', 'error')
    
    return redirect(url_for('admin.dashboard'))


@admin_bp.route('/servicios/<int:servicio_id>/editar', methods=['GET', 'POST'])
@login_required
def editar_servicio(servicio_id):
    """Edita un servicio existente"""
    servicio_service = get_servicio_service()
    
    try:
        servicio = servicio_service.obtener_servicio(servicio_id)
    except ValueError:
        flash('Servicio no encontrado', 'error')
        return redirect(url_for('admin.dashboard'))
    
    if request.method == 'POST':
        try:
            datos = {
                'nombre': request.form.get('nombre'),
                'precio': request.form.get('precio'),
                'descripcion': request.form.get('descripcion', ''),
                'categoria': request.form.get('categoria', 'corte')
            }
            
            servicio_service.actualizar_servicio(servicio_id, **datos)
            flash('Servicio actualizado', 'success')
            return redirect(url_for('admin.dashboard'))
        except Exception as e:
            flash(f'Error: {str(e)}', 'error')
    
    return render_template('admin/edit.html', servicio=servicio)


@admin_bp.route('/servicios/<int:servicio_id>/eliminar', methods=['GET'])
@login_required
def eliminar_servicio(servicio_id):
    """Elimina un servicio"""
    try:
        servicio_service = get_servicio_service()
        servicio_service.eliminar_servicio(servicio_id)
        flash('Servicio eliminado', 'success')
    except ValueError as e:
        flash(f'Error: {str(e)}', 'error')
    except Exception as e:
        flash(f'Error inesperado: {str(e)}', 'error')
    
    return redirect(url_for('admin.dashboard'))


# ==================== GESTIÓN DE GALERÍA ====================

@admin_bp.route('/galeria/subir', methods=['POST'])
@login_required
def subir_galeria():
    """Sube imágenes a la galería"""
    if 'images' not in request.files:
        flash('No se seleccionó ningún archivo', 'error')
        return redirect(url_for('admin.dashboard'))
    
    files = request.files.getlist('images')
    galeria_service = get_galeria_service()
    
    uploaded = 0
    for file in files:
        if file and file.filename:
            filename = galeria_service.subir_imagen(file)
            if filename:
                uploaded += 1
    
    if uploaded > 0:
        flash(f'{uploaded} imagen(es) subida(s) y optimizada(s)', 'success')
    else:
        flash('No se pudo subir ninguna imagen o límite alcanzado', 'error')
    
    return redirect(url_for('admin.dashboard'))


@admin_bp.route('/galeria/<filename>/eliminar', methods=['GET'])
@login_required
def eliminar_galeria(filename):
    """Elimina una imagen de la galería"""
    galeria_service = get_galeria_service()
    
    if galeria_service.eliminar_imagen(filename):
        flash('Imagen eliminada', 'success')
    else:
        flash('Imagen no encontrada', 'error')
    
    return redirect(url_for('admin.dashboard'))
