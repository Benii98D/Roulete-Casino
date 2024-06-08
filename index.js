const form = document.getElementById('betting-form');
const creditoInput = document.getElementById('credito');
const apuestaInput = document.getElementById('apuesta');
const vecesInput = document.getElementById('veces');
const colorInputs = document.querySelectorAll('input[name="color"]');
const submitButton = document.querySelector('.submit-button');

const errorCredito = document.getElementById('error-credito');
const errorApuesta = document.getElementById('error-apuesta');
const errorVeces = document.getElementById('error-veces');
const errorColor = document.getElementById('error-color');

function validateForm() {
    let isValid = true;

    // Validar crédito
    if (creditoInput.value <= 0) {
        errorCredito.textContent = 'El crédito debe ser mayor que 0.';
        isValid = false;
    } else {
        errorCredito.textContent = '';
    }

    // Validar apuesta
    if (apuestaInput.value <= 0) {
        errorApuesta.textContent = 'La apuesta debe ser mayor que 0.';
        isValid = false;
    } else {
        errorApuesta.textContent = '';
    }

    // Validar cantidad de veces
    if (vecesInput.value <= 0) {
        errorVeces.textContent = 'La cantidad de veces debe ser mayor que 0.';
        isValid = false;
    } else {
        errorVeces.textContent = '';
    }

    // Validar relación entre crédito y apuesta
    const totalApuesta = apuestaInput.value * vecesInput.value;
    if (totalApuesta > creditoInput.value) {
        errorApuesta.textContent = 'El crédito no es suficiente para la cantidad de apuestas indicadas.';
        isValid = false;
    } else if (apuestaInput.value > 0) {
        errorApuesta.textContent = '';
    }

    // Validar color
    if (![...colorInputs].some(input => input.checked)) {
        errorColor.textContent = 'Debe seleccionar un color.';
        isValid = false;
    } else {
        errorColor.textContent = '';
    }

    submitButton.disabled = !isValid;
    submitButton.classList.toggle('enabled', isValid);
}

function redirectToResults() {
    const credito = parseFloat(creditoInput.value);
    const apuesta = parseFloat(apuestaInput.value);
    const veces = parseInt(vecesInput.value);
    const color = document.querySelector('input[name="color"]:checked').value;

    const queryString = `credito=${credito}&apuesta=${apuesta}&veces=${veces}&color=${color}`;
    window.location.href = `results.html?${queryString}`;
}

colorInputs.forEach(input => {
    input.addEventListener('change', (event) => {
        document.querySelectorAll('.color-button').forEach(button => {
            button.classList.remove('selected');
        });
        document.querySelector(`label[for="${event.target.id}"]`).classList.add('selected');
        validateForm();
    });
});

// Marcar la opción por defecto como seleccionada
document.querySelector(`label[for="color-rojo"]`).classList.add('selected');

form.addEventListener('input', validateForm);

form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (!submitButton.disabled) {
        redirectToResults();
    }
});

// Restablecer formulario al volver a la página
window.addEventListener('pageshow', function(event) {
    if (event.persisted || window.performance && window.performance.navigation.type === 2) {
        form.reset();

        // Quita mensajes de error
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.textContent = '');

        // Deshabilita el botón de submit
        submitButton.disabled = true;
        submitButton.classList.remove('enabled');

        // Restablece la selección de color
        document.querySelector('.color-button.rojo').classList.add('selected');
        document.querySelector('.color-button.negro').classList.remove('selected');
    }
});
