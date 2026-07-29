// Ruta a tu API PHP (Ajusta la ruta según la carpeta donde esté tu HTML)
const API_RACHA_URL = '../php/racha.php';

/**
 * Obtiene la racha actual del usuario y actualiza el contador del HTML
 * @param {number} idusuario 
 */
async function obtenerRacha(idusuario) {
    try {
        const response = await fetch(`${API_RACHA_URL}?idusuario=${idusuario}`);
        const data = await response.json();

        if (data.exito) {
            const contadorRacha = document.getElementById('streak-display');
            if (contadorRacha) {
                contadorRacha.textContent = data.racha_actual;
            }
            return data.racha_actual;
        } else {
            console.warn('No se pudo obtener la racha:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al conectar con la API de racha:', error);
    }
}

/**
 * Registra cuando el usuario completa una misión/nivel y actualiza su racha
 * @param {number} idusuario 
 * @param {number} idmision 
 */
async function completarMision(idusuario, idmision) {
    try {
        const response = await fetch(API_RACHA_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idusuario: idusuario,
                idmision: idmision
            })
        });

        const data = await response.json();

        if (data.exito) {
            // Actualiza el número de racha en la barra
            const contadorRacha = document.getElementById('streak-display');
            if (contadorRacha) {
                contadorRacha.textContent = data.racha_actual;
            }

            // Notificación/alerta al usuario
            alert(`¡Misión completada! Tu racha actual es: ${data.racha_actual} día(s)`);

            // Redirigir al mapa general
            window.location.href = 'mapa_abecedario.html';
        } else {
            alert('Error al guardar el progreso: ' + data.mensaje);
        }
    } catch (error) {
        console.error('Error al registrar la misión completada:', error);
    }
}