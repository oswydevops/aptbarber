/**
 * APT BARBER - Guía para Desarrolladores
 * Cómo trabajar con la nueva arquitectura modular
 */

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                          AGREGAR UN NUEVO MÓDULO                         ║
╠══════════════════════════════════════════════════════════════════════════════╣

1. Crear el archivo del módulo en static/js/
   ```javascript
   // static/js/nuevo-modulo.js
   class NuevoModulo {
       constructor() {
           this.init();
       }

       init() {
           // Inicialización del módulo
           console.log('NuevoModulo inicializado');
       }

       // API pública
       hacerAlgo() {
           // Lógica del módulo
       }

       destroy() {
           // Cleanup
       }
   }

   // Exponer globalmente
   window.NuevoModulo = NuevoModulo;
   ```

2. Registrar el módulo en app.js
   ```javascript
   // En app.js, método getAvailableModules()
   getAvailableModules() {
       const modules = new Map();

       // ... módulos existentes ...

       // Agregar nuevo módulo
       if (typeof NuevoModulo !== 'undefined') {
           modules.set('nuevo-modulo', NuevoModulo);
       }

       return modules;
   }
   ```

3. Definir cuándo cargar el módulo
   ```javascript
   // En app.js, método shouldLoadModule()
   shouldLoadModule(moduleName) {
       switch (moduleName) {
           // ... casos existentes ...
           case 'nuevo-modulo':
               return document.querySelector('.elemento-especifico') !== null;
           default:
               return true;
       }
   }
   ```

4. Agregar estilos si es necesario
   ```javascript
   // En StyleManager.getCoreStyles() o crear método específico
   static getNuevoModuloStyles() {
       return `
       .nuevo-modulo {
           /* estilos específicos */
       }
       `;
   }
   ```

5. Incluir el script en el template cuando sea necesario
   ```html
   <!-- En base.html o template específico -->
   {% if 'nueva-pagina' in request.endpoint %}
   <script src="{{ url_for('static', filename='js/nuevo-modulo.js') }}"></script>
   {% endif %}
   ```

╚══════════════════════════════════════════════════════════════════════════════╝
*/

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                      USAR UTILIDADES CENTRALIZADAS                       ║
╠══════════════════════════════════════════════════════════════════════════════╣

✅ Utilidades DOM:
   Utils.$('.selector')                    // querySelector
   Utils.$$('.selector')                   // querySelectorAll
   Utils.createElement('div', {className: 'test'}) // Crear elemento

✅ Utilidades CSS:
   Utils.addClass(el, 'clase')
   Utils.removeClass(el, 'clase')
   Utils.toggleClass(el, 'clase')
   Utils.hasClass(el, 'clase')

✅ Utilidades de eventos:
   Utils.on(element, 'click', '.selector', handler)  // Event delegation
   Utils.delegate('click', '.selector', handler)     // Global delegation

✅ Utilidades de animación:
   Utils.fadeIn(element, 300)
   Utils.fadeOut(element, 300)
   Utils.slideIn(element, 'up', 300)
   Utils.animate(element, {opacity: '1', transform: 'scale(1)'}, 300)

✅ Utilidades AJAX:
   Utils.fetch('/api/endpoint', {method: 'POST', body: JSON.stringify(data)})

✅ Utilidades de validación:
   Utils.isValidEmail(email)
   Utils.isValidPhone(phone)
   Utils.isValidPrice(price)

✅ Utilidades responsive:
   Utils.isMobile()
   Utils.isTablet()
   Utils.isDesktop()
   Utils.getViewportSize()

✅ Utilidades de accesibilidad:
   Utils.announceToScreenReader('Mensaje')
   Utils.trapFocus(container)

╚══════════════════════════════════════════════════════════════════════════════╝
*/

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                      PATRONES RECOMENDADOS                               ║
╠══════════════════════════════════════════════════════════════════════════════╣

✅ Usar Utils en lugar de código vanilla:
   ❌ document.querySelectorAll('.items').forEach(...)
   ✅ Utils.$$('.items').forEach(...)

✅ Usar event delegation para mejor performance:
   ❌ element.addEventListener('click', (e) => { if(e.target.matches('.btn')) ... })
   ✅ Utils.on(element, 'click', '.btn', handler)

✅ Usar las utilidades de animación:
   ❌ element.style.transition = 'opacity 0.3s'; element.style.opacity = '1';
   ✅ Utils.fadeIn(element, 300)

✅ Manejar errores consistentemente:
   try {
       // código
   } catch (error) {
       Utils.logError('ComponentName', error, {context: 'additional data'});
   }

✅ Cleanup en destroy():
   destroy() {
       // Limpiar event listeners
       this.eventListeners.clear();
       // Limpiar observers
       this.observers.forEach(obs => obs.disconnect());
       // Limpiar referencias
   }

╚══════════════════════════════════════════════════════════════════════════════╝
*/

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                          DEPLOYMENT CHECKLIST                            ║
╠══════════════════════════════════════════════════════════════════════════════╣

Antes de hacer deploy:

✅ Verificar que todos los módulos se carguen correctamente
   - Abrir DevTools > Console
   - Buscar mensajes de error de módulos
   - Verificar que no hay errores de carga

✅ Verificar que las utilidades funcionen
   - Utils.$() retorna elementos correctamente
   - Utils.fetch() funciona con la API
   - Animaciones funcionan correctamente

✅ Verificar performance
   - Abrir DevTools > Performance
   - Verificar que no hay memory leaks
   - Verificar que las animaciones son smooth

✅ Verificar accesibilidad
   - Usar WAVE o axe DevTools
   - Verificar focus management
   - Verificar screen reader support

✅ Verificar responsive
   - Probar en diferentes viewports
   - Verificar que los breakpoints funcionan
   - Verificar touch interactions

╚══════════════════════════════════════════════════════════════════════════════╝
*/

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                          DEBUGGING TIPS                                  ║
╠══════════════════════════════════════════════════════════════════════════════╣

🔍 Acceder al sistema desde consola:
   > AptBarberApp.getModule('main')        // Acceder a módulo específico
   > AptBarberApp.modules                   // Ver todos los módulos cargados
   > Utils.getViewportSize()               // Ver tamaño de viewport
   > Utils.isMobile()                      // Verificar si es mobile

🔍 Verificar carga de módulos:
   > console.log('Módulos cargados:', AptBarberApp.modules.size)
   > AptBarberApp.modules.forEach((mod, name) => console.log(name, mod))

🔍 Performance monitoring:
   > Utils.logError('Test', new Error('Test error'))  // Probar logging
   > console.time('animation'); Utils.fadeIn(element); console.timeEnd('animation')

🔍 Verificar estilos:
   > getComputedStyle(document.querySelector('.elemento'))
   > document.styleSheets  // Ver hojas de estilo cargadas

╚══════════════════════════════════════════════════════════════════════════════╝
*/

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                          CONVENCIONES DE CÓDIGO                         ║
╠══════════════════════════════════════════════════════════════════════════════╣

📝 Nombres de archivos:
   • Módulos: kebab-case (nuevo-modulo.js)
   • Clases: PascalCase (NuevoModulo)
   • Métodos: camelCase (hacerAlgo)
   • Variables: camelCase (miVariable)

📝 Estructura de módulos:
   class MiModulo {
       constructor() {
           this.init();
       }

       init() {
           // Configuración inicial
       }

       // API pública
       metodoPublico() {}

       // Métodos privados (convención con _)
       _metodoPrivado() {}

       destroy() {
           // Cleanup
       }
   }

📝 Manejo de errores:
   try {
       // código riesgoso
   } catch (error) {
       Utils.logError('MiModulo', error, {contexto: 'adicional'});
   }

📝 Comentarios:
   // ✅ Comentarios descriptivos para lógica compleja
   // ❌ Comentarios obvios (let x = 1; // asignar 1 a x)

╚══════════════════════════════════════════════════════════════════════════════╝
*/

// Sistema listo para desarrollo
console.log('📚 Guía para desarrolladores cargada');
console.log('💡 Usa Utils para utilidades centralizadas');
console.log('🔧 Usa AptBarberApp para acceder a módulos');