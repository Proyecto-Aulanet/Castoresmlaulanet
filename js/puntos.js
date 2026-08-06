document.addEventListener('DOMContentLoaded', () => {
    cargarPuntaje();
});

async function cargarPuntaje() {

    const urlApi = '../php/obtener_puntaje.php'; 

    try {
        const response = await fetch(urlApi, { 
            credentials: 'same-origin' 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success') {
            actualizarPuntajeDOM(data.puntos_totales);
        } else {
            console.error('Error desde la API:', data.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

function actualizarPuntajeDOM(totales) {
    // 1. Tarjeta lateral de Perfil ("pts Total:")
    const xpUsuario = document.getElementById('xpUsuario');
    if (xpUsuario) {
        xpUsuario.textContent = totales;
    }

    // 2. Header superior ("Puntaje")
    const xpDisplay = document.getElementById('xp-display');
    if (xpDisplay) {
        xpDisplay.textContent = totales;
    }
}