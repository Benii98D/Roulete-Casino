document.addEventListener('DOMContentLoaded', () => {
    const { credito, apuesta, veces, color } = getQueryParams();
    const spinnerContainer = document.getElementById('spinner-container');
    const resultsContainer = document.getElementById('results-container');

    const results = simulateRoulette(credito, apuesta, veces, color);

    displayResults(results);

    // Mostrar los resultados y ocultar el spinner después de un breve retraso
    setTimeout(() => {
        console.log("Ocultando spinner y mostrando resultados");
        spinnerContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        window.dispatchEvent(new Event('resize')); // Forzar el redimensionado para asegurar que los gráficos se rendericen correctamente
    }, 500);
});

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        credito: parseFloat(params.get('credito')),
        apuesta: parseFloat(params.get('apuesta')),
        veces: parseInt(params.get('veces')),
        color: params.get('color')
    };
}

function simulateRoulette(credito, apuestaInicial, veces, apuestaColor) {
    const results = [];
    let apuesta = apuestaInicial;
    const colores = [
        'Verde', // 0
        'Rojo', 'Negro', 'Rojo', 'Negro', 'Rojo', 'Negro', 'Rojo', 'Negro', 'Rojo', // 1-9
        'Negro', 'Negro', 'Rojo', 'Negro', 'Rojo', 'Negro', 'Rojo', 'Negro', 'Rojo', // 10-18
        'Rojo', 'Negro', 'Rojo', 'Negro', 'Rojo', 'Negro', 'Rojo', 'Negro', 'Rojo', // 19-27
        'Negro', 'Negro', 'Rojo', 'Negro', 'Rojo', 'Negro', 'Rojo', 'Negro', 'Rojo', // 28-36
    ];

    for (let i = 1; i <= veces; i++) {
        const numero = Math.floor(Math.random() * 37); // Números de 0 a 36
        const color = colores[numero];
        const creditoAntes = credito;
        let resultado = '';

        if (color === apuestaColor) {
            credito += apuesta;
            resultado = 'GANADO';
            apuesta = apuestaInicial; // Volver a la apuesta inicial si ganamos
        } else {
            credito -= apuesta;
            resultado = 'PERDIDO';
            apuesta *= 2; // Doblar la apuesta si perdemos
        }

        results.push({
            tirada: i,
            numero,
            color,
            creditoAntes,
            apuesta: (resultado === 'GANADO' ? apuestaInicial : apuesta / 2), // Mostrar la apuesta real que se hizo
            resultado,
            creditoDespues: credito
        });

        if (credito <= 0) break; // Detener si no hay más crédito
    }
    return results;
}

function displayResults(results) {
    const resultTableBody = document.querySelector('#result-table tbody');
    resultTableBody.innerHTML = '';
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.tirada}</td>
            <td>${result.numero}</td>
            <td>${result.color}</td>
            <td>${result.creditoAntes.toFixed(2)}</td>
            <td>${result.apuesta.toFixed(2)}</td>
            <td>${result.resultado}</td>
            <td>${result.creditoDespues.toFixed(2)}</td>
        `;
        resultTableBody.appendChild(row);
    });

    console.log("Generando gráficos");
    generateCharts(results);
}

function generateCharts(results) {
    const winLossData = { GANADO: 0, PERDIDO: 0 };
    const colorFrequency = { Rojo: 0, Negro: 0, Verde: 0 };
    const numberFrequency = Array(37).fill(0);

    results.forEach(result => {
        winLossData[result.resultado]++;
        colorFrequency[result.color]++;
        numberFrequency[result.numero]++;
    });

    const winLossCanvas = document.getElementById('win-loss-chart');
    const numberFrequencyCanvas = document.getElementById('number-frequency-chart');
    const colorFrequencyCanvas = document.getElementById('color-frequency-chart');

    if (!winLossCanvas || !numberFrequencyCanvas || !colorFrequencyCanvas) {
        console.error('No se encontraron los elementos canvas para los gráficos');
        return;
    }

    console.log("Creando gráfico de Ganado vs. Perdido");
    new Chart(winLossCanvas, {
        type: 'pie',
        data: {
            labels: ['Ganado', 'Perdido'],
            datasets: [{
                data: [winLossData.GANADO, winLossData.PERDIDO],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Ganado vs. Perdido'
                }
            }
        }
    });

    console.log("Creando gráfico de Frecuencia de los Números");
    new Chart(numberFrequencyCanvas, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 37 }, (_, i) => i),
            datasets: [{
                label: 'Frecuencia del Número',
                data: numberFrequency,
                backgroundColor: '#007bff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Frecuencia de los Números'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Número'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frecuencia'
                    },
                    beginAtZero: true
                }
            }
        }
    });

    console.log("Creando gráfico de Frecuencia de los Colores");
    new Chart(colorFrequencyCanvas, {
        type: 'pie',
        data: {
            labels: ['Rojo', 'Negro', 'Verde'],
            datasets: [{
                data: [colorFrequency.Rojo, colorFrequency.Negro, colorFrequency.Verde],
                backgroundColor: ['#ff4b4b', '#343a40', '#28a745']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Frecuencia de los Colores'
                }
            }
        }
    });

    // Forzar la actualización del tamaño del canvas después de crear los gráficos
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 1000);
}
