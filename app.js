
let amigos = [];

// Función para agregar un amigo
function agregarAmigo() {
    const input = document.getElementById('amigo');
    const nombre = input.value.trim();

    if (!nombre) {
        mostrarError('Por favor, ingresa un nombre válido');
        return;
    }

    if (nombre.length < 2) {
        mostrarError('El nombre debe tener al menos 2 caracteres');
        return;
    }

    if (amigos.some(amigo => amigo.toLowerCase() === nombre.toLowerCase())) {
        mostrarError('Este amigo ya está en la lista');
        return;
    }

    if (amigos.length >= 50) {
        mostrarError('Máximo 50 amigos permitidos');
        return;
    }

    amigos.push(nombre);
    mostrarAmigos();
    actualizarContador();
    input.value = '';
    limpiarResultados();
}

// Función para mostrar la lista de amigos
function mostrarAmigos() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = '';

    amigos.forEach((amigo, index) => {
        const li = document.createElement('li');
        li.className = 'friend-item';
        li.innerHTML = `
                    <span>${amigo}</span>
                    <button class="remove-btn" onclick="removerAmigo(${index})" title="Eliminar">×</button>
                `;
        lista.appendChild(li);
    });

    // Habilitar/deshabilitar botón de sorteo
    const sortearBtn = document.getElementById('sortearBtn');
    sortearBtn.disabled = amigos.length < 2;
}

// Función para remover un amigo
function removerAmigo(index) {
    amigos.splice(index, 1);
    mostrarAmigos();
    actualizarContador();
    limpiarResultados();
}

// Función para actualizar el contador
function actualizarContador() {
    const contador = document.getElementById('contador');
    const count = amigos.length;
    contador.textContent = `${count} amigo${count !== 1 ? 's' : ''} agregado${count !== 1 ? 's' : ''}`;
}

// Algoritmo de Fisher-Yates para mezclar array
function mezclar(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Función mejorada para generar asignaciones válidas
function generarAsignaciones(participantes) {
    const maxIntentos = 1000;
    let intentos = 0;

    while (intentos < maxIntentos) {
        const asignados = mezclar(participantes);

        // Verificar que nadie se asigne a sí mismo
        let valido = true;
        for (let i = 0; i < participantes.length; i++) {
            if (participantes[i] === asignados[i]) {
                valido = false;
                break;
            }
        }

        if (valido) {
            return asignados;
        }

        intentos++;
    }

    // Si no encontramos solución, usar método alternativo
    return generarAsignacionesAlternativo(participantes);
}

// Método alternativo para casos difíciles
function generarAsignacionesAlternativo(participantes) {
    const asignados = [...participantes];
    const n = asignados.length;

    // Rotar una posición para evitar auto-asignaciones
    const temp = asignados[0];
    for (let i = 0; i < n - 1; i++) {
        asignados[i] = asignados[i + 1];
    }
    asignados[n - 1] = temp;

    return asignados;
}

// Función principal de sorteo
function sortearAmigo() {
    if (amigos.length < 2) {
        mostrarError('Necesitas al menos 2 amigos para hacer el sorteo');
        return;
    }

    // Mostrar loading
    const sortearBtn = document.getElementById('sortearBtn');
    const originalText = sortearBtn.innerHTML;
    sortearBtn.innerHTML = '🎲 Sorteando...';
    sortearBtn.disabled = true;

    setTimeout(() => {
        try {
            const asignados = generarAsignaciones(amigos);
            const resultado = amigos.map((amigo, i) =>
                `${amigo} es el amigo secreto de ${asignados[i]}`
            );
            mostrarResultado(resultado);
        } catch (error) {
            mostrarError('Error al realizar el sorteo. Intenta de nuevo.');
        } finally {
            sortearBtn.innerHTML = originalText;
            sortearBtn.disabled = false;
        }
    }, 1000);
}

// Función para mostrar resultados
function mostrarResultado(lista) {
    const ul = document.getElementById('resultado');
    ul.innerHTML = '';

    lista.forEach((texto, index) => {
        setTimeout(() => {
            const li = document.createElement('li');
            li.className = 'result-item';
            li.textContent = texto;
            ul.appendChild(li);
        }, index * 200);
    });
}

// Función para mostrar errores
function mostrarError(mensaje) {
    const ul = document.getElementById('resultado');
    ul.innerHTML = `<li class="error-message">${mensaje}</li>`;

    setTimeout(() => {
        limpiarResultados();
    }, 3000);
}

// Función para limpiar resultados
function limpiarResultados() {
    const ul = document.getElementById('resultado');
    ul.innerHTML = '';
}

// Event listener para Enter en el input
document.getElementById('amigo').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        agregarAmigo();
    }
});

// Enfocar el input al cargar la página
window.addEventListener('load', () => {
    document.getElementById('amigo').focus();
});