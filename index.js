//TABLERO PREDETERMINADO

function crearTablero(tamaño, porcentajeBombas) {
    const contenedor = document.getElementById('contenedor');
    contenedor.style.gridTemplateColumns = `repeat(${tamaño}, 1fr)`;
    contenedor.style.gridTemplateRows = `repeat(${tamaño}, 1fr)`;

    let contenido = "";
    for (let i = 0; i < tamaño; i++) {
        for (let j = 0; j < tamaño; j++) {
            contenido += `<div class='celda' data-row='${i}' data-col='${j}'></div>`; //Identificar la fila y la columna de la celda
        }
    }
    contenedor.innerHTML = contenido;

    // Ajusta el tamaño de las celdas según el tamaño del tablero
    const celdaSize = 500 / tamaño; // Ajusta 500 al tamaño deseado del contenedor
    document.querySelectorAll('.celda').forEach(celda => {
        celda.style.width = `${celdaSize}px`;
        celda.style.height = `${celdaSize}px`;
        celda.addEventListener('click', liberarCasilla);
        celda.addEventListener('contextmenu', desactivarBomba);
    });

    colocarBombas(tamaño, porcentajeBombas);
}

function colocarBombas(tamaño, porcentajeBombas) {
    const totalBombas = Math.floor(tamaño * tamaño * porcentajeBombas); // Ajusta el porcentaje de bombas según sea necesario
    const celdas = document.querySelectorAll('.celda');
    let bombasColocadas = 0;

    while (bombasColocadas < totalBombas) {
        const index = Math.floor(Math.random() * celdas.length); // Selecciona una celda aleatoria
        const celda = celdas[index]; // Selecciona la celda en el índice aleatorio
        if (!celda.classList.contains('bomba')) { // Si la celda no es una bomba, coloca una bomba
            celda.classList.add('bomba');
            bombasColocadas++;
        }
    }

    celdas.forEach(celda => {
        if (!celda.classList.contains('bomba')) {
            const row = parseInt(celda.getAttribute('data-row'));
            const col = parseInt(celda.getAttribute('data-col'));
            const bombasCercanas = contarBombasCercanas(row, col, tamaño);
            if (bombasCercanas > 0) {
                celda.dataset.bombasCercanas = bombasCercanas;
            }
        }
    });
}

function contarBombasCercanas(row, col, tamaño) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < tamaño && newCol >= 0 && newCol < tamaño) {
                const celda = document.querySelector(`.celda[data-row='${newRow}'][data-col='${newCol}']`);
                if (celda && celda.classList.contains('bomba')) {
                    count++;
                }
            }
        }
    }
    return count;
}

function liberarCasilla(event) {
    const celda = event.target;
    if (celda.classList.contains('bomba')) {
        alert('¡Boom! Has hecho clic en una bomba.');
    } else {
        celda.classList.add('liberada');
        const bombasCercanas = celda.dataset.bombasCercanas;
        if (bombasCercanas) {
            celda.textContent = bombasCercanas;
        } else {
            // Liberar casillas adyacentes si no hay bombas cercanas
            const row = parseInt(celda.getAttribute('data-row'));
            const col = parseInt(celda.getAttribute('data-col'));
            liberarCasillasAdyacentes(row, col, 0);
        }
    }
}

function liberarCasillasAdyacentes(row, col, liberadas) {
    if (liberadas >= 10) return; // Limita el número de casillas liberadas a 10
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            const celda = document.querySelector(`.celda[data-row='${newRow}'][data-col='${newCol}']`);
            if (celda && !celda.classList.contains('liberada') && !celda.classList.contains('bomba')) {
                celda.classList.add('liberada');
                const bombasCercanas = celda.dataset.bombasCercanas;
                if (bombasCercanas) {
                    celda.textContent = bombasCercanas;
                } else {
                    liberarCasillasAdyacentes(newRow, newCol, liberadas + 1);
                }
            }
        }
    }
}

function desactivarBomba(event) {
    event.preventDefault();
    const celda = event.target;
    if (!celda.classList.contains('liberada')) {
        celda.classList.toggle('desactivada');
        comprobarBombasDesactivadas();
    }
}

function comprobarBombasDesactivadas() {
    const bombas = document.querySelectorAll('.bomba');
    const desactivadas = document.querySelectorAll('.bomba.desactivada');
    if (bombas.length === desactivadas.length) {
        alert('¡Enhorabuena! Has desactivado todas las bombas.');
    }
}


//DIFICULTADES, TAMAÑO TABLERO, PORCENTAJE BOMBAS

//DIFICULTAD FACIL
function facil() {
    crearTablero(4, 0.2); // 10% de bombas
}

//DIFICULTAD MEDIA
function medio() {
    crearTablero(8, 0.20); // 15% de bombas
}

//DIFICULTAD DIFICIL
function dificil() {
    crearTablero(12, 0.25); // 20% de bombas
} 

//DIFICULTAD PERSONALIZADA
function personalizado() {
    let tamaño;
    do {
        tamaño = Number(prompt("Introduce el tamaño del tablero (4-15)"));
        if (tamaño < 4 || tamaño > 15 || isNaN(tamaño)) {
            alert("Por favor, introduce un número válido entre 4 y 15.");
        }
    } while (tamaño < 4 || tamaño > 15 || isNaN(tamaño));

    crearTablero(tamaño, 0.15); // Ajusta el porcentaje de bombas según sea necesario
}
