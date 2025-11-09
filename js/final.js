/**
 * final.js - Lógica de la pantalla de resultado final
 */

// Elementos del DOM
const resultIcon = document.getElementById('result-icon');
const resultTitle = document.getElementById('result-title');
const resultImg = document.getElementById('result-img');
const resultMessage = document.getElementById('result-message');
const resultStatsText = document.getElementById('result-stats-text');
const restartBtn = document.getElementById('restart-btn');

/**
 * Inicializa la pantalla final
 */
async function init() {
    // Obtener resultado del juego
    const resultData = JSON.parse(sessionStorage.getItem('gameResult'));
    
    if (!resultData) {
        alert('No hay datos del juego');
        window.location.href = 'index.html';
        return;
    }
    
    try {
        // Cargar valoraciones
        const valoraciones = await cargarJSON('config/valoraciones.json');
        
        // Mostrar resultado
        mostrarResultado(resultData, valoraciones);
        
        // Event listener
        restartBtn.addEventListener('click', volverAlInicio);
        
    } catch (error) {
        console.error('Error al cargar valoraciones:', error);
        alert('Error al cargar los resultados');
        window.location.href = 'index.html';
    }
}

/**
 * Carga un archivo JSON
 */
async function cargarJSON(ruta) {
    const response = await fetch(ruta);
    if (!response.ok) {
        throw new Error(`Error al cargar ${ruta}`);
    }
    return await response.json();
}

/**
 * Muestra el resultado del juego
 */
function mostrarResultado(resultData, valoraciones) {
    if (resultData.victoria) {
        mostrarVictoria(resultData, valoraciones);
    } else {
        mostrarDerrota(resultData, valoraciones);
    }
}

/**
 * Muestra pantalla de victoria
 */
function mostrarVictoria(resultData, valoraciones) {
    // Icono
    resultIcon.textContent = '🎉';
    
    // Título
    resultTitle.textContent = '¡Felicidades!';
    resultTitle.style.color = '#27ae60';
    
    // Imagen
    resultImg.src = 'img/victory.png';
    resultImg.onerror = () => {
        resultImg.style.display = 'none';
    };
    resultImg.alt = 'Victoria';
    
    // Mensaje aleatorio
    const mensajes = valoraciones.final_correcto;
    const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
    resultMessage.textContent = mensajeAleatorio;
    
    // Estadísticas
    resultStatsText.innerHTML = `
        Has completado todas las preguntas correctamente<br>
        <strong>Vidas restantes:</strong> ${resultData.vidas} ❤️<br>
        <strong>Preguntas respondidas:</strong> ${resultData.preguntas}
    `;
}

/**
 * Muestra pantalla de derrota
 */
function mostrarDerrota(resultData, valoraciones) {
    // Icono
    resultIcon.textContent = '😢';
    
    // Título
    resultTitle.textContent = 'Oh no...';
    resultTitle.style.color = '#e74c3c';
    
    // Imagen
    resultImg.src = 'img/defeat.png';
    resultImg.onerror = () => {
        resultImg.style.display = 'none';
    };
    resultImg.alt = 'Derrota';
    
    // Mensaje aleatorio
    const mensajes = valoraciones.final_incorrecto;
    const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
    resultMessage.textContent = mensajeAleatorio;
    
    // Estadísticas
    resultStatsText.innerHTML = `
        Te has quedado sin vidas<br>
        <strong>Preguntas respondidas:</strong> ${resultData.preguntas}<br>
        ¡No te rindas! Inténtalo de nuevo 💪
    `;
}

/**
 * Vuelve a la página inicial
 */
function volverAlInicio() {
    // Limpiar sessionStorage
    sessionStorage.removeItem('ejercicioActual');
    sessionStorage.removeItem('gameResult');
    
    // Redirigir
    window.location.href = 'index.html';
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);