# app.py  ← VERSIÓN FINAL 2025 CON GALERÍA + SERVICIOS + ADMIN BRUTAL
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from models import db, User, Servicio
from config import Config
from PIL import Image
import os

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
login_manager = LoginManager(app)
login_manager.login_view = 'admin_login'
login_manager.login_message = "Inicia sesión para acceder al panel"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ==================== CONFIGURACIÓN DE GALERÍA ====================
UPLOAD_FOLDER = 'static/images/gallery'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
MAX_IMAGES = 10

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def optimize_image(filepath):
    """Redimensiona a máx 1200px de ancho y comprime"""
    try:
        with Image.open(filepath) as img:
            if img.width > 1200:
                ratio = 1200 / img.width
                new_height = int(img.height * ratio)
                img = img.resize((1200, new_height), Image.Resampling.LANCZOS)
            
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
                
            if filepath.lower().endswith('.png'):
                img.save(filepath, 'PNG', optimize=True)
            else:
                img.save(filepath, 'JPEG', quality=80, optimize=True)
    except Exception as e:
        print(f"Error optimizando imagen: {e}")

# ==================== INICIALIZACIÓN DE BASE DE DATOS ====================
def crear_datos_iniciales():
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            password=generate_password_hash('barber123')  # CAMBIA ESTA CONTRASEÑA YA!
        )
        db.session.add(admin)

        servicios_ejemplo = [
            Servicio(nombre="Corte Clásico", precio="35.000", descripcion="Corte tradicional con tijera y máquina", categoria="corte"),
            Servicio(nombre="Skin Fade + Degrade", precio="45.000", descripcion="Degradado perfecto a piel", categoria="corte"),
            Servicio(nombre="Corte + Barba", precio="60.000", descripcion="Pack más vendido", categoria="corte"),
            Servicio(nombre="Barba Completa", precio="30.000", descripcion="Afeitado + perfilado + hot towel", categoria="corte"),
            Servicio(nombre="Peinados", precio="25.000", descripcion="Estilizado con secador y producto", categoria="extra"),
            Servicio(nombre="Tinte", precio="80.000", descripcion="Coloración completa + lavado", categoria="extra"),
            Servicio(nombre="Afeitado Clásico", precio="35.000", descripcion="Con toalla caliente y navaja", categoria="extra"),
            Servicio(nombre="Perfilado de Cejas", precio="15.000", descripcion="Definición perfecta", categoria="extra"),
        ]
        db.session.bulk_save_objects(servicios_ejemplo)
        db.session.commit()
        print("¡Datos iniciales creados!")

# ==================== RUTAS PÚBLICAS ====================
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/servicios')
def servicios():
    servicios = Servicio.query.all()
    return render_template('servicios.html', servicios=servicios)

@app.route('/contacto')
def contacto():
    return render_template('contacto.html')

# ==================== ADMIN ====================
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and check_password_hash(user.password, request.form['password']):
            login_user(user)
            return redirect(url_for('admin_dashboard'))
        flash('Usuario o contraseña incorrectos', 'error')
    return render_template('admin/login.html')

@app.route('/admin')
@login_required
def admin_dashboard():
    servicios = Servicio.query.all()
    return render_template('admin/dashboard.html', servicios=servicios)

@app.route('/admin/logout')
@login_required
def admin_logout():
    logout_user()
    return redirect(url_for('index'))

# ==================== GESTIÓN DE SERVICIOS ====================
@app.route('/admin/add', methods=['POST'])
@login_required
def add_service():
    nuevo = Servicio(
        nombre=request.form['nombre'],
        precio=request.form['precio'],
        descripcion=request.form.get('descripcion', ''),
        categoria=request.form.get('categoria', 'corte')
    )
    db.session.add(nuevo)
    db.session.commit()
    flash('Servicio agregado con éxito!', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_service(id):
    servicio = Servicio.query.get_or_404(id)
    if request.method == 'POST':
        servicio.nombre = request.form['nombre']
        servicio.precio = request.form['precio']
        servicio.descripcion = request.form.get('descripcion', '')
        servicio.categoria = request.form.get('categoria', 'corte')
        db.session.commit()
        flash('Servicio actualizado', 'success')
        return redirect(url_for('admin_dashboard'))
    return render_template('admin/edit.html', servicio=servicio)

@app.route('/admin/delete/<int:id>')
@login_required
def delete_service(id):
    servicio = Servicio.query.get_or_404(id)
    db.session.delete(servicio)
    db.session.commit()
    flash('Servicio eliminado', 'success')
    return redirect(url_for('admin_dashboard'))

# ==================== GALERÍA DE TRABAJOS ====================
@app.route('/admin/upload-gallery', methods=['POST'])
@login_required
def upload_gallery():
    if 'images' not in request.files:
        flash('No se seleccionó ningún archivo', 'error')
        return redirect(url_for('admin_dashboard'))

    files = request.files.getlist('images')
    current_count = len([f for f in os.listdir(UPLOAD_FOLDER) if f.lower().endswith(('png', 'jpg', 'jpeg', 'webp'))])

    uploaded = 0
    for file in files:
        if file.filename == '':
            continue
        if file and allowed_file(file.filename) and (current_count + uploaded) < MAX_IMAGES:
            filename = secure_filename(file.filename)
            # Evitar duplicados
            base, ext = os.path.splitext(filename)
            counter = 1
            new_filename = filename
            while os.path.exists(os.path.join(UPLOAD_FOLDER, new_filename)):
                new_filename = f"{base}_{counter}{ext}"
                counter += 1

            filepath = os.path.join(UPLOAD_FOLDER, new_filename)
            file.save(filepath)
            optimize_image(filepath)
            uploaded += 1

    if uploaded > 0:
        flash(f'{uploaded} imagen(es) subida(s) y optimizada(s)', 'success')
    else:
        flash('No se pudo subir ninguna imagen o límite alcanzado', 'error')

    return redirect(url_for('admin_dashboard'))

@app.route('/admin/delete-gallery/<filename>')
@login_required
def delete_gallery_image(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(file_path) and '..' not in filename and filename != '':
        os.remove(file_path)
        flash('Imagen eliminada', 'success')
    else:
        flash('Imagen no encontrada', 'error')
    return redirect(url_for('admin_dashboard'))

# ==================== CONTEXTO PARA GALERÍA EN TEMPLATES ====================
@app.context_processor
def inject_gallery():
    folder = 'static/images/gallery'
    if not os.path.exists(folder):
        return {'gallery_images': []}
    
    try:
        files = os.listdir(folder)
        images = []
        for f in files:
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                full_path = os.path.join(folder, f)
                if os.path.isfile(full_path):  # solo archivos, no carpetas
                    images.append(f)
        
        # Ordena por fecha de modificación (más nueva primero)
        images.sort(key=lambda x: os.path.getmtime(os.path.join(folder, x)), reverse=True)
        
        # Toma solo las primeras 10 únicas
        return {'gallery_images': images[:10]}
    except Exception as e:
        print("Error en galería:", e)
        return {'gallery_images': []}

# ==================== ARRANCAR LA APP ====================
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        crear_datos_iniciales()
    app.run(debug=True)