/**
 * game.js - Lógica principal del juego de preguntas
 */

// Estado del juego
const gameState = {
    vidas: 3,
    preguntaActual: 0,
    preguntas: [],
    preguntasOriginales: [],
    numeroPreguntas: 0,
    respuestaActual: null,
    valoraciones: null
};

// Elementos del DOM
const livesDisplay = document.getElementById('lives-display');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const answerContainer = document.getElementById('answer-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackImg = document.getElementById('feedback-img');
const feedbackText = document.getElementById('feedback-text');
const checkBtn = document.getElementById('check-btn');
const nextBtn = document.getElementById('next-btn');
const retryBtn = document.getElementById('retry-btn');

/**
 * Inicializa el juego
 */
async function init() {
    // Verificar que hay un ejercicio seleccionado
    const ejercicioSeleccionado = sessionStorage.getItem('ejercicioActual');
    
    if (!ejercicioSeleccionado) {
        alert('No se ha seleccionado ningún ejercicio');
        window.location.href = 'index.html';
        return;
    }
    
    try {
        // Cargar valoraciones
        gameState.valoraciones = await cargarJSON('./config/valoraciones.json');
        
        // Cargar ejercicio
        const ejercicioData = await cargarJSON(`./config/ejercicios/${ejercicioSeleccionado}`);
        gameState.preguntasOriginales = ejercicioData.preguntas;
        gameState.numeroPreguntas = ejercicioData.numeroPreguntas;
        
        // Preparar preguntas según la lógica especificada
        prepararPreguntas();
        
        // Mostrar primera pregunta
        mostrarPregunta();
        
        // Event listeners
        checkBtn.addEventListener('click', comprobarRespuesta);
        nextBtn.addEventListener('click', siguientePregunta);
        retryBtn.addEventListener('click', volverAIntentar);
        
    } catch (error) {
        console.error('Error al cargar el juego:', error);
        alert('Error al cargar el ejercicio. Volviendo al inicio.');
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
 * Prepara las preguntas según la lógica especificada
 */
function prepararPreguntas() {
    const totalPreguntas = gameState.preguntasOriginales.length;
    
    if (gameState.numeroPreguntas >= totalPreguntas) {
        // Mostrar todas las preguntas en orden
        gameState.preguntas = [...gameState.preguntasOriginales];
    } else {
        // Seleccionar preguntas aleatorias hasta completar el número
        gameState.preguntas = [];
        while (gameState.preguntas.length < gameState.numeroPreguntas) {
            const preguntaAleatoria = gameState.preguntasOriginales[
                Math.floor(Math.random() * totalPreguntas)
            ];
            gameState.preguntas.push({...preguntaAleatoria});
        }
    }
}

/**
 * Muestra la pregunta actual
 */
function mostrarPregunta() {
    const pregunta = gameState.preguntas[gameState.preguntaActual];
    
    // Actualizar contador
    questionCounter.textContent = `Pregunta ${gameState.preguntaActual + 1} de ${gameState.preguntas.length}`;
    
    // Mostrar texto de la pregunta
    questionText.textContent = pregunta.pregunta;
    
    // Limpiar contenedor de respuestas
    answerContainer.innerHTML = '';
    
    // Ocultar feedback
    feedbackContainer.style.display = 'none';
    
    // Mostrar botón comprobar, ocultar otros
    checkBtn.style.display = 'inline-block';
    nextBtn.style.display = 'none';
    retryBtn.style.display = 'none';
    
    // Generar respuestas según el tipo
    switch (pregunta.tipo) {
        case 'numero':
            generarInputNumero();
            break;
        case 'opciones':
            generarOpciones(false);
            break;
        case 'multiopciones':
            generarOpciones(true);
            break;
        case 'texto':
            generarInputTexto();
            break;
    }
    
    // Resetear respuesta actual
    gameState.respuestaActual = null;
}

/**
 * Genera un input para respuestas numéricas
 */
function generarInputNumero() {
    const container = document.createElement('div');
    container.className = 'number-input-container';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'number-input';
    input.placeholder = 'Escribe tu respuesta';
    input.id = 'numero-respuesta';
    
    container.appendChild(input);
    answerContainer.appendChild(container);
    
    // Focus automático
    input.focus();
}

/**
 * Genera un input para respuestas texto
 */
function generarInputTexto() {
    const container = document.createElement('div');
    container.className = 'text-input-container';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-input';
    input.placeholder = 'Escribe tu respuesta';
    input.id = 'text-respuesta';
    
    container.appendChild(input);
    answerContainer.appendChild(container);
    
    // Focus automático
    input.focus();
}

/**
 * Genera opciones de respuesta
 * @param {boolean} multiple - Si permite múltiples selecciones
 */
function generarOpciones(multiple) {
    const pregunta = gameState.preguntas[gameState.preguntaActual];
    const inputType = multiple ? 'checkbox' : 'radio';
    
    pregunta.opciones.forEach((opcion, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.dataset.valor = opcion;
        
        const input = document.createElement('input');
        input.type = inputType;
        input.name = 'respuesta';
        input.value = opcion;
        input.id = `opcion-${index}`;
        
        const label = document.createElement('label');
        label.htmlFor = `opcion-${index}`;
        label.className = 'option-text';
        label.textContent = opcion;
        
        const icon = document.createElement('span');
        icon.className = 'option-icon';
        
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionDiv.appendChild(icon);
        
        // Click en toda la opción para seleccionar
        optionDiv.addEventListener('click', (e) => {
            if (!optionDiv.classList.contains('disabled')) {
                if (multiple) {
                    input.checked = !input.checked;
                } else {
                    // Deseleccionar todas las demás
                    document.querySelectorAll('.option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                }
                
                if (input.checked) {
                    optionDiv.classList.add('selected');
                } else {
                    optionDiv.classList.remove('selected');
                }
            }
        });
        
        answerContainer.appendChild(optionDiv);
    });
}

/**
 * Comprueba la respuesta del usuario
 */
function comprobarRespuesta() {
    const pregunta = gameState.preguntas[gameState.preguntaActual];
    let esCorrecta = false;
    
    // Obtener respuesta según el tipo
    switch (pregunta.tipo) {
        case 'numero':
            const inputNumero = document.getElementById('numero-respuesta');
            const valorNumero = parseFloat(inputNumero.value);
            
            if (isNaN(valorNumero)) {
                alert('Por favor, ingresa un número válido');
                return;
            }
            
            esCorrecta = pregunta.respuestas_correctas.includes(valorNumero);
            
            // Marcar input
            if (esCorrecta) {
                inputNumero.classList.add('correct');
            } else {
                inputNumero.classList.add('incorrect');
            }
            inputNumero.disabled = true;
            break;
            
        case 'texto':
            const inputText = document.getElementById('text-respuesta');
            const valorText = inputText.value;
            alert(valorText)
            
            esCorrecta = pregunta.respuestas_correctas.includes(valorText);
            
            // Marcar input
            if (esCorrecta) {
                inputText.classList.add('correct');
            } else {
                inputText.classList.add('incorrect');
            }
            inputText.disabled = true;
            break;

        case 'opciones':
            const radioSeleccionado = document.querySelector('input[name="respuesta"]:checked');
            
            if (!radioSeleccionado) {
                alert('Por favor, selecciona una opción');
                return;
            }
            
            const valorRadio = radioSeleccionado.value;
            esCorrecta = pregunta.respuestas_correctas.includes(valorRadio);
            
            // Marcar opciones
            document.querySelectorAll('.option').forEach(option => {
                const valor = option.dataset.valor;
                option.classList.add('disabled');
                
                if (esCorrecta && pregunta.respuestas_correctas.includes(valor)) {
                    option.classList.add('correct');
                    option.querySelector('.option-icon').textContent = '✅';
                } else if (!esCorrecta && valor === valorRadio) {
                    option.classList.add('incorrect');
                    option.querySelector('.option-icon').textContent = '❌';
                }
            });
            break;
            
        case 'multiopciones':
            const checkboxesSeleccionados = Array.from(
                document.querySelectorAll('input[name="respuesta"]:checked')
            ).map(cb => cb.value);
            
            if (checkboxesSeleccionados.length === 0) {
                alert('Por favor, selecciona al menos una opción');
                return;
            }
            
            // Comparar arrays
            esCorrecta = checkboxesSeleccionados.length === pregunta.respuestas_correctas.length &&
                         checkboxesSeleccionados.every(v => pregunta.respuestas_correctas.includes(v));
            
            // Marcar opciones
            document.querySelectorAll('.option').forEach(option => {
                const valor = option.dataset.valor;
                option.classList.add('disabled');
                
                if (esCorrecta && pregunta.respuestas_correctas.includes(valor)) {
                    option.classList.add('correct');
                    option.querySelector('.option-icon').textContent = '✅';
                } else if (!esCorrecta && checkboxesSeleccionados.includes(valor)) {
                    option.classList.add('incorrect');
                    option.querySelector('.option-icon').textContent = '❌';
                }
            });
            break;
    }
    
    // Mostrar feedback
    mostrarFeedback(esCorrecta);
    
    // Ocultar botón comprobar
    checkBtn.style.display = 'none';
    
    // Mostrar botón apropiado
    if (esCorrecta) {
        nextBtn.style.display = 'inline-block';
    } else {
        restarVida();
        retryBtn.style.display = 'inline-block';
    }
}

/**
 * Muestra feedback al usuario
 */
function mostrarFeedback(esCorrecta) {
    feedbackContainer.style.display = 'block';
    
    if (esCorrecta) {
        const mensajes = gameState.valoraciones.aciertos;
        const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
        feedbackText.textContent = mensajeAleatorio;
        feedbackImg.src = 'img/success.png';
        feedbackImg.alt = 'Correcto';
    } else {
        const mensajes = gameState.valoraciones.fallos;
        const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
        feedbackText.textContent = mensajeAleatorio;
        feedbackImg.src = 'img/error.png';
        feedbackImg.alt = 'Incorrecto';
    }
}

/**
 * Resta una vida al jugador
 */
function restarVida() {
    gameState.vidas--;
    actualizarVidas();
    
    if (gameState.vidas === 0) {
        // Game Over
        setTimeout(() => {
            finalizarJuego(false);
        }, 1500);
    }
}

/**
 * Actualiza la visualización de vidas
 */
function actualizarVidas() {
    const corazones = '❤️ '.repeat(gameState.vidas);
    const corazonesVacios = '🖤 '.repeat(3 - gameState.vidas);
    livesDisplay.textContent = corazones + corazonesVacios;
}

/**
 * Avanza a la siguiente pregunta
 */
function siguientePregunta() {
    gameState.preguntaActual++;
    
    if (gameState.preguntaActual >= gameState.preguntas.length) {
        // Juego completado con éxito
        finalizarJuego(true);
    } else {
        mostrarPregunta();
    }
}

/**
 * Permite volver a intentar la pregunta actual
 */
function volverAIntentar() {
    mostrarPregunta();
}

/**
 * Finaliza el juego y redirige a la página de resultado
 */
function finalizarJuego(victoria) {
    sessionStorage.setItem('gameResult', JSON.stringify({
        victoria: victoria,
        vidas: gameState.vidas,
        preguntas: gameState.preguntas.length
    }));
    
    window.location.href = 'final.html';
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
