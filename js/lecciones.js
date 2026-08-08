//document.addEventListener('DOMContentLoaded', () => {
    // Ruta base a tu PHP
    const API_URL = '/Castoresmlaulanet/php/get_lecciones.php';
    let horaInicioExamen = null;

    // 1. OBTENER LISTA DE LECCIONES (MISIONES) -> Método GET
    async function obtenerLecciones() {
        try {
            const res = await fetch(`${API_URL}?accion=listar`);
            const data = await res.json();

            if (data.status === 'success') {
                console.log("Lecciones disponibles:", data.data);
                // AQUÍ: Puedes llamar a una función para renderizar las lecciones en el HTML
            }
        } catch (error) {
            console.error("Error al obtener lecciones:", error);
        }
    }

    // 2. OBTENER PREGUNTAS DE UNA LECCIÓN -> Método GET
    async function obtenerPreguntasPorLeccion(idLeccion){

    const res = await fetch(
        `${API_URL}?accion=preguntas&idleccion=${idLeccion}`
    );

    const data = await res.json();

    if(data.status==="success"){

        return data.data;

    }

    return [];

}
    // 3. OBTENER PUNTAJE Y AVANCE SEMANAL -> Método GET
    async function obtenerPuntajeSemanal(idUsuario) {
        try {
            const res = await fetch(`${API_URL}?accion=puntaje_semanal&idusuario=${idUsuario}`);
            const data = await res.json();

            if (data.status === 'success') {
                console.log(`Puntaje semanal del usuario ${idUsuario}:`, data.data);

                // Si tienes elementos en HTML con esta ID, se actualizarán solos:
                const elPuntos = document.getElementById('total-puntos');
                if (elPuntos && data.data.length > 0) {
                    elPuntos.textContent = `${data.data[0].puntos || 0} pts`;
                }
            }
        } catch (error) {
            console.error("Error al obtener puntaje semanal:", error);
        }
    }

    // 4. FINALIZAR EXAMEN Y GUARDAR RESULTADO -> Método POST
    async function finalizarExamen(idUsuario, idLeccion, idExamen, puntajeObtenido, idMedalla = 1) {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accion: 'guardar_resultado',
                    idusuario: idUsuario,
                    idleccion: idLeccion,
                    idexamen: idExamen,
                    puntos: puntajeObtenido,
                    idmedalla: idMedalla,
                    hora_inicio: horaInicioExamen || new Date().toISOString().slice(0, 19).replace('T', ' ')
                })
            });

            const data = await res.json();

            if (data.status === 'success') {
                if (data.medalla_otorgada) {
                    alert("¡Felicidades! Has ganado una nueva medalla 🏅");
                } else {
                    alert(data.message || "¡Examen guardado con éxito!");
                }

                // Actualizar automáticamente los puntos semanales tras terminar el examen
                obtenerPuntajeSemanal(idUsuario);
            } else {
                alert("Error al guardar: " + data.message);
            }
        } catch (error) {
            console.error("Error al finalizar examen:", error);
        }
    }

    // ==========================================
    // EJECUCIÓN INICIAL
    // ==========================================
    const ID_USUARIO_LOGUEADO = 1; // Cambiar dinámicamente según la sesión

    obtenerLecciones();
    obtenerPuntajeSemanal(ID_USUARIO_LOGUEADO);
;