/**
 * index.js - Lógica de la página principal
 * Carga dinámicamente los archivos JSON disponibles en config/ejercicios/
 */

// Elementos del DOM
const temaSelect = document.getElementById('tema-select');
const startBtn = document.getElementById('start-btn');

// Lista de archivos JSON disponibles (se puede hacer dinámico con un endpoint)
// Como estamos usando JavaScript vanilla en el navegador, definimos manualmente
// los archivos JSON disponibles
const ejerciciosDisponibles = [
    'psicotecnicos-aptitud-verbal.json',
    'matematicas-fracciones-equivalentes.json',
    'matematicas-ordenacion-fracciones.json',
    'matematicas-fracciones-generatrices.json',
    'matematicas-fracciones-decimales.json',
    'matematicas-operaciones-combinadas.json',
    'matematicas-operaciones-fracciones.json',
    'geografia-europea.json',
    'ciencias-naturales.json'
];

/**
 * Inicializa la página cargando los ejercicios disponibles
 */
function init() {
    cargarEjerciciosDisponibles();
    
    // Event listeners
    temaSelect.addEventListener('change', habilitarBotonInicio);
    startBtn.addEventListener('click', iniciarJuego);
}

/**
 * Carga los ejercicios disponibles en el desplegable
 */
function cargarEjerciciosDisponibles() {
    // Limpiar opciones existentes
    temaSelect.innerHTML = '<option value="">-- Selecciona un ejercicio --</option>';
    
    // Agregar cada ejercicio disponible
    ejerciciosDisponibles.forEach(archivo => {
        const option = document.createElement('option');
        option.value = archivo;
        // Eliminar extensión y convertir guiones en espacios para el nombre visible
        const nombreVisual = archivo
            .replace('.json', '')
            .split('-')
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
            .join(' ');
        option.textContent = nombreVisual;
        temaSelect.appendChild(option);
    });
}

/**
 * Habilita el botón de inicio cuando se selecciona un ejercicio
 */
function habilitarBotonInicio() {
    if (temaSelect.value) {
        startBtn.disabled = false;
    } else {
        startBtn.disabled = true;
    }
}

/**
 * Inicia el juego guardando el ejercicio seleccionado y redirigiendo
 */
function iniciarJuego() {
    const ejercicioSeleccionado = temaSelect.value;
    
    if (!ejercicioSeleccionado) {
        alert('Por favor, selecciona un ejercicio');
        return;
    }
    
    // Guardar en sessionStorage para acceder desde game.html
    sessionStorage.setItem('ejercicioActual', ejercicioSeleccionado);
    
    // Redirigir a la página del juego
    window.location.href = 'game.html';
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
