const API_RACHA_URL = '/Castoresmlaulanet/php/racha.php';

/**
 * @param {number} idusuario 
 */
async function obtenerRacha(idusuario) {
    try {
        const usuarioActivo = idusuario || localStorage.getItem('idusuario') || 1;
        const response = await fetch(`${API_RACHA_URL}?idusuario=${usuarioActivo}`);
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
 * @param {number} idusuario 
 * @param {number} idmision 
 */
async function completarMision(idusuario, idmision) {
    const usuarioActivo = idusuario || localStorage.getItem('idusuario') || 1;
    const misionActiva = idmision || 1;

    try {
        const response = await fetch(API_RACHA_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idusuario: usuarioActivo,
                idmision: misionActiva
            })
        });

        const data = await response.json();

        if (data.exito) {
            const contadorRacha = document.getElementById('streak-display');
            if (contadorRacha) {
                contadorRacha.textContent = data.racha_actual;
            }

            alert(`¡Misión completada! Tu racha actual es: ${data.racha_actual} día(s)`);

            window.location.href = '/Castoresmlaulanet/pages_int/mapa_abecedario.html';
        } else {
            alert('Error al guardar el progreso: ' + data.mensaje);
        }
    } catch (error) {
        console.error('Error al registrar la misión completada:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const idusuarioactivo = localStorage.getItem('idusuario') || 1; 
    
    if (idusuarioactivo) {
        obtenerRacha(idusuarioactivo);
    }
});