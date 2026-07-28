document.addEventListener('DOMContentLoaded', () => {
    let horaInicioExamen = null;

    // 1. OBTENER LISTA DE LECCIONES (MISIONES)
    async function obtenerLecciones() {
        try {
            const res = await fetch('php/get_lecciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accion: 'listar' })
            });

            const data = await res.json();
            if (data.status === 'success') {
                console.log("Lecciones disponibles:", data.data);
            }
        } catch (error) {
            console.error("Error al obtener lecciones:", error);
        }
    }

    // 2. OBTENER PREGUNTAS USANDO EL ID DE LA LECCIÓN (idleccion)
    async function obtenerPreguntasPorLeccion(idLeccion) {
        try {
            horaInicioExamen = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const res = await fetch('php/get_lecciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accion: 'preguntas',
                    idleccion: idLeccion
                })
            });

            const data = await res.json();
            if (data.status === 'success') {
                console.log(`Preguntas de la leccion ${idLeccion}:`, data.data);
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Error al obtener preguntas:", error);
        }
    }

    // 3. FINALIZAR EXAMEN, GUARDAR AVANCE Y ENTREGAR MEDALLA
    async function finalizarExamen(idUsuario, idLeccion, idExamen, puntajeObtenido, idMedalla = null) {
        try {
            const res = await fetch('php/get_lecciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accion: 'guardar_resultado',
                    idusuario: idUsuario,
                    idleccion: idLeccion,
                    idexamen: idExamen,
                    puntos: puntajeObtenido,
                    idmedalla: idMedalla,
                    hora_inicio: horaInicioExamen
                })
            });

            const data = await res.json();
            if (data.status === 'success') {
                if (data.medalla_otorgada) {
                    alert("Felicidades. Has ganado una nueva medalla.");
                } else {
                    alert(data.message);
                }
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Error al finalizar examen:", error);
        }
    }

    // Cargar lecciones al entrar
    obtenerLecciones();
});