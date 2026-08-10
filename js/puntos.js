
// =====================================================
// PUNTOS.JS
// =====================================================

console.log("🚀 puntos.js CARGADO CORRECTAMENTE");


// =====================================================
// ESPERAR A QUE CARGUE EL HTML
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("📄 DOM cargado");

    cargarPuntaje();

});


// =====================================================
// CARGAR PUNTAJE
// =====================================================

async function cargarPuntaje() {

    console.log("⭐ Iniciando carga del puntaje...");


    const urlApi = "/Castoresmlaulanet/php/obtener_puntaje_total.php";

    console.log(
        "🌐 Consultando:",
        urlApi
    );


    try {

        const response =
            await fetch(
                urlApi,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        console.log(
            "📡 Respuesta HTTP:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "📦 Datos recibidos:",
            data
        );


        if (
            data.status === "success"
        ) {

            const puntaje =
                Number(
                    data.puntaje_total
                ) || 0;


            console.log(
                "🏆 PUNTAJE TOTAL:",
                puntaje
            );


            actualizarPuntajeDOM(
                puntaje
            );


        } else {

            console.error(
                "❌ PHP respondió error:",
                data.message
            );

        }


    } catch (error) {

        console.error(
            "❌ ERROR CARGANDO PUNTAJE:",
            error
        );

    }

}


// =====================================================
// ACTUALIZAR ELEMENTOS
// =====================================================

function actualizarPuntajeDOM(puntaje) {

    console.log(
        "🎯 Actualizando puntaje en pantalla:",
        puntaje
    );


    // =================================================
    // PERFIL
    // =================================================

    const xpUsuario =
        document.getElementById(
            "xpUsuario"
        );


    if (xpUsuario) {

        xpUsuario.textContent =
            puntaje;

        console.log(
            "✅ #xpUsuario actualizado"
        );

    } else {

        console.warn(
            "⚠️ No existe #xpUsuario en esta página"
        );

    }


    // =================================================
    // HEADER
    // =================================================

    const xpDisplay =
        document.getElementById(
            "xp-display"
        );


    if (xpDisplay) {

        xpDisplay.textContent =
            puntaje;

        console.log(
            "✅ #xp-display actualizado"
        );

    } else {

        console.warn(
            "⚠️ No existe #xp-display en esta página"
        );

    }

}

