// Quick diagnostic script for Apt Barber
console.log('🔍 Apt Barber Diagnostic Starting...');

// Check if essential elements exist
const checks = [
    { selector: '.header', name: 'Header' },
    { selector: '.hero', name: 'Hero section' },
    { selector: '.gallery-track', name: 'Gallery' },
    { selector: '.admin-dashboard', name: 'Admin dashboard' },
    { selector: '.footer', name: 'Footer' }
];

checks.forEach(check => {
    const element = document.querySelector(check.selector);
    if (element) {
        console.log(`✅ ${check.name} found`);
    } else {
        console.log(`❌ ${check.name} NOT found`);
    }
});

// Check if CSS is loaded
const testElement = document.createElement('div');
testElement.style.cssText = 'position: absolute; visibility: hidden;';
testElement.textContent = 'test';
document.body.appendChild(testElement);

const computedStyle = getComputedStyle(testElement);
if (computedStyle.fontFamily.includes('Inter') || computedStyle.fontFamily.includes('Satoshi')) {
    console.log('✅ Fonts loaded');
} else {
    console.log('❌ Fonts NOT loaded');
}

document.body.removeChild(testElement);

// Check JavaScript modules
const modules = [
    { name: 'Utils', obj: window.Utils },
    { name: 'CoreUtils', obj: window.CoreUtils },
    { name: 'StyleManager', obj: window.StyleManager },
    { name: 'MainApp', obj: window.mainApp },
    { name: 'Gallery', obj: window.gallery },
    { name: 'AdminPanel', obj: window.adminPanel },
    { name: 'Animations', obj: window.animations }
];

modules.forEach(module => {
    if (module.obj) {
        console.log(`✅ ${module.name} loaded`);
    } else {
        console.log(`❌ ${module.name} NOT loaded`);
    }
});

// Check if there are any JavaScript errors
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', e.message, e.filename, e.lineno);
});

// Check if CSS is applying
const header = document.querySelector('.header');
if (header) {
    const headerStyles = getComputedStyle(header);
    if (headerStyles.position === 'fixed') {
        console.log('✅ Header styles applied');
    } else {
        console.log('❌ Header styles NOT applied');
    }
}

console.log('🔍 Diagnostic complete. Check console for results.');