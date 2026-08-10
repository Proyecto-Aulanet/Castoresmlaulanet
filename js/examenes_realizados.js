console.log("✅ examenes_realizados.js cargado");

document.addEventListener("DOMContentLoaded", function () {

    cargarExamenesRealizados();

});


// =====================================================
// CARGAR EXÁMENES REALIZADOS
// =====================================================

async function cargarExamenesRealizados() {

    try {

        console.log("📚 Consultando exámenes realizados...");

        const respuesta = await fetch(
            "../php/obtener_examenes_realizados.php",
            {
                method: "GET",
                credentials: "same-origin"
            }
        );


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );

        }


        const datos = await respuesta.json();

        console.log(
            "📊 Exámenes realizados:",
            datos
        );


        if (datos.status !== "success") {

            console.error(
                "❌ Error:",
                datos.message
            );

            return;
        }


        marcarExamenesRealizados(
            datos.examenes || []
        );


    } catch (error) {

        console.error(
            "❌ Error cargando exámenes realizados:",
            error
        );

    }

}


// =====================================================
// MARCAR TARJETAS
// =====================================================

function marcarExamenesRealizados(examenes) {

    console.log(
        "🔎 Procesando",
        examenes.length,
        "exámenes."
    );


    /*
     * Relación:
     *
     * idmision → número de medalla/tarjeta
     *
     */

    const relacionMisionMedalla = {

        9: 1,   // Abecedario
        10: 2,  // Saludos
        14: 3,  // Tiempo
        18: 4,  // Sociedad
        22: 5,  // Plantas
        25: 6,  // Alimentos
        29: 7,  // Animales
        33: 8,  // Colores
        36: 9,  // Números
        39: 10  // Cuerpo

    };


    // =================================================
    // RECORRER EXÁMENES
    // =================================================

    examenes.forEach(function (examen) {

        const idMision =
            parseInt(examen.idmision);


        const puntaje =
            parseInt(examen.puntos) || 0;


        const numeroTarjeta =
            relacionMisionMedalla[idMision];


        console.log(
            "📝 Misión:",
            idMision,
            "→ Tarjeta:",
            numeroTarjeta,
            "→ Puntaje:",
            puntaje
        );


        if (!numeroTarjeta) {

            console.warn(
                "⚠️ No existe tarjeta para misión:",
                idMision
            );

            return;
        }


        // =================================================
        // BUSCAR TARJETA
        // =================================================

        const tarjeta =
            document.querySelector(
                `[data-medalla="${numeroTarjeta}"]`
            );


        if (!tarjeta) {

            console.warn(
                "⚠️ No se encontró tarjeta:",
                numeroTarjeta
            );

            return;
        }


        // =================================================
        // CAMBIAR ESTADO
        // =================================================

        const estado =
            tarjeta.querySelector(
                ".estado-examen"
            );


        if (estado) {

            estado.classList.remove(
                "bg-secondary"
            );

            estado.classList.add(
                "bg-success"
            );


            estado.innerHTML = `
                <i class="bi bi-check-circle-fill me-1"></i>
                Realizado
            `;

        }


        // =================================================
        // MOSTRAR PUNTAJE
        // =================================================

        const cardBody =
            tarjeta.querySelector(
                ".card-body"
            );


        if (!cardBody) {
            return;
        }


        // Evitar duplicarlo
        let elementoPuntaje =
            cardBody.querySelector(
                ".puntaje-examen"
            );


        if (!elementoPuntaje) {

            elementoPuntaje =
                document.createElement("div");

            elementoPuntaje.className =
                "puntaje-examen mt-2";

            cardBody.appendChild(
                elementoPuntaje
            );

        }


        elementoPuntaje.innerHTML = `

            <span class="badge bg-warning text-dark fs-6">

                <i class="bi bi-stars me-1"></i>

                ${puntaje} puntos

            </span>

        `;


        // =================================================
        // MARCAR TARJETA VISUALMENTE
        // =================================================

        tarjeta.classList.add(
            "examen-realizado"
        );

    });

}