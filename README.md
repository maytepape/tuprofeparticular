# 🎓 Mi Profe Particular

Aplicación web educativa de preguntas y respuestas (quiz) desarrollada con HTML5, CSS3 y JavaScript Vanilla.

## 📁 Estructura del Proyecto

```
MiProfeParticular/
│
├── index.html                 # Página principal (selección de ejercicio)
├── game.html                  # Página del juego (quiz)
├── final.html                 # Página de resultado final
│
├── css/
│   └── styles.css            # Estilos globales de la aplicación
│
├── js/
│   ├── index.js              # Lógica de la página principal
│   ├── game.js               # Lógica del juego
│   └── final.js              # Lógica de la pantalla final
│
├── config/
│   ├── valoraciones.json     # Mensajes de feedback
│   └── ejercicios/
│       ├── matematicas-basicas.json
│       ├── geografia-europa.json
│       └── ciencias-naturales.json
│
├── img/
│   ├── success.png           # Imagen para respuestas correctas
│   ├── error.png             # Imagen para respuestas incorrectas
│   ├── victory.png           # Imagen para victoria final
│   └── defeat.png            # Imagen para derrota final
│
└── README.md                 # Este archivo
```

## 🎮 Flujo del Juego

### 1. Página Principal (index.html)

**Funcionalidad:**
- Muestra el título de la aplicación: "Mi Profe Particular"
- Desplegable que lista dinámicamente los ejercicios disponibles
- Botón "Comenzar" que se habilita al seleccionar un ejercicio

**Flujo:**
1. El usuario selecciona un ejercicio del desplegable
2. Se habilita el botón "Comenzar"
3. Al hacer clic, se guarda la selección en `sessionStorage`
4. Redirección a `game.html`

### 2. Pantalla del Juego (game.html)

**Funcionalidad:**
- Muestra las preguntas una a una
- Gestiona las vidas del jugador (inicialmente 3)
- Valida respuestas y proporciona feedback
- Controla el flujo entre preguntas

**Tipos de Pregunta:**

1. **Número (`tipo: "numero"`)**
   - Campo de entrada numérica
   - El usuario escribe su respuesta
   - Ejemplo: "¿Cuánto es 5 + 3?"

2. **Opciones (`tipo: "opciones"`)**
   - Radio buttons (solo una respuesta correcta)
   - El usuario selecciona una opción
   - Ejemplo: "¿Cuál es la capital de Francia?"

3. **Múltiples opciones (`tipo: "multiopciones"`)**
   - Checkboxes (múltiples respuestas correctas)
   - El usuario selecciona todas las correctas
   - Ejemplo: "Selecciona los números pares"

**Gestión de Preguntas:**

- Si `numeroPreguntas` ≤ Total de preguntas: Se muestran todas en orden
- Si `numeroPreguntas` > Total de preguntas: Se seleccionan aleatoriamente hasta completar

**Sistema de Vidas:**

- Inicio: 3 vidas (❤️ ❤️ ❤️)
- Cada error: -1 vida
- Si vidas = 0: Pantalla de derrota

**Comportamiento de Respuestas:**

**Respuesta Correcta:**
- Opción marcada en verde con ✅
- Resto de opciones deshabilitadas en gris
- Mensaje aleatorio de acierto + imagen
- Aparece botón "Siguiente pregunta"

**Respuesta Incorrecta:**
- Opción elegida marcada en rojo con ❌
- Las correctas se muestran en verde con ✅
- Resto de opciones deshabilitadas
- Se resta una vida
- Mensaje aleatorio de fallo + imagen
- Aparece botón "Volver a intentarlo"

### 3. Pantalla Final (final.html)

**Victoria:**
- Si completa todas las preguntas con vidas disponibles
- Muestra: 🎉 + mensaje aleatorio de `final_correcto`
- Estadísticas: vidas restantes y preguntas completadas
- Imagen de victoria

**Derrota:**
- Si se queda sin vidas
- Muestra: 😢 + mensaje aleatorio de `final_incorrecto`
- Mensaje motivacional para reintentar
- Imagen de derrota

**Ambas pantallas:**
- Botón "Volver al inicio" para jugar de nuevo
- Footer con "Hecho por vuestra Tia con ❤️"

## 🗂️ Archivos de Configuración

### valoraciones.json

Contiene mensajes dinámicos para diferentes situaciones:

```json
{
  "aciertos": [...],           // Mensajes para respuestas correctas
  "fallos": [...],             // Mensajes para respuestas incorrectas
  "final_correcto": [...],     // Mensajes de victoria
  "final_incorrecto": [...]    // Mensajes de derrota
}
```

### Archivo de Ejercicio (*.json)

Estructura:

```json
{
  "numeroPreguntas": 5,        // Cantidad de preguntas del quiz
  "preguntas": [
    {
      "id": 1,
      "pregunta": "Texto de la pregunta",
      "tipo": "opciones",      // "numero", "opciones", "multiopciones"
      "opciones": [...],       // Solo para "opciones" y "multiopciones"
      "respuestas_correctas": [...]
    }
  ]
}
```

## 🎨 Características de Diseño

- **Diseño responsive**: Adaptable a móviles, tablets y escritorio
- **Colores**: Gradiente morado en fondo, tarjetas blancas
- **Feedback visual**: Verde para correcto, rojo para incorrecto
- **Animaciones suaves**: Transiciones en hover y cambios de estado
- **Tipografía clara**: Segoe UI, legible y moderna
- **Iconos**: Emojis para mayor expresividad

## 🚀 Cómo Usar

### Instalación

1. Descarga todos los archivos manteniendo la estructura de carpetas
2. Coloca las imágenes necesarias en la carpeta `/img/`:
   - `success.png` (respuestas correctas)
   - `error.png` (respuestas incorrectas)
   - `victory.png` (victoria final)
   - `defeat.png` (derrota final)

### Ejecución

1. Abre `index.html` en un navegador web
2. Selecciona un ejercicio del desplegable
3. Haz clic en "Comenzar"
4. ¡Juega y aprende!

### Añadir Nuevos Ejercicios

1. Crea un nuevo archivo JSON en `/config/ejercicios/`
2. Usa la estructura especificada arriba
3. Añade el nombre del archivo a la lista `ejerciciosDisponibles` en `js/index.js`:

```javascript
const ejerciciosDisponibles = [
    'matematicas-basicas.json',
    'geografia-europa.json',
    'ciencias-naturales.json',
    'tu-nuevo-ejercicio.json'  // ← Añadir aquí
];
```

## 🔧 Requisitos Técnicos

- **Navegador moderno** con soporte para:
  - ES6+ (fetch, async/await, arrow functions)
  - SessionStorage
  - Flexbox y CSS Grid
- **No requiere servidor**: Funciona con el protocolo `file://`
- **Sin dependencias externas**: 100% Vanilla JavaScript

## 📝 Notas Importantes

1. **SessionStorage**: Se usa para transferir datos entre páginas
2. **Selección aleatoria**: Si `numeroPreguntas` > total, se repiten preguntas
3. **Mensajes aleatorios**: Cada vez que se muestra feedback, es diferente
4. **Código comentado**: Todas las funciones tienen documentación
5. **Modular**: Fácil de extender y modificar

## 🎯 Ejemplos de Uso Educativo

- **Primaria**: Matemáticas básicas, vocabulario, ciencias simples
- **Secundaria**: Historia, geografía, física, química
- **Idiomas**: Vocabulario, gramática, comprensión
- **Preparación de exámenes**: Cualquier materia con preguntas de repaso
- **Formación profesional**: Tests de conocimientos específicos

## 💡 Posibles Mejoras Futuras

- Sistema de puntuación
- Temporizador por pregunta
- Ranking de mejores puntuaciones
- Sonidos para feedback
- Modo multijugador
- Backend para gestionar ejercicios sin modificar código
- Exportar resultados en PDF
- Modo oscuro

## 👩‍🏫 Créditos

**Desarrollado con ❤️ por vuestra Tita**

---

¿Preguntas o sugerencias? ¡Sigue aprendiendo y divirtiéndote! 🚀