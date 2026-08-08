console.log("Prácticas cargadas");


// =====================================================
// OBTENER CATEGORÍA A PARTIR DE LA MISIÓN
// =====================================================

function obtenerCategoriaPorMision(idmision) {

    const categorias = {

        1: [3, 4, 5],       // Abecedario
        2: [6, 7, 8],       // Saludos
        3: [11, 12, 13],    // Tiempo
        4: [15, 16, 17],    // Sociedad
        5: [19, 20, 21],    // Plantas
        6: [23, 24],        // Alimentos
        7: [26, 27, 28],    // Animales
        8: [30, 31, 32],    // Colores
        9: [34, 35],        // Números
        10: [37, 38]        // Cuerpo humano

    };


    idmision = parseInt(idmision);


    for (const categoria in categorias) {

        if (categorias[categoria].includes(idmision)) {

            return parseInt(categoria);

        }

    }


    return null;

}



// =====================================================
// CARGAR PREGUNTAS DE PRÁCTICA
// =====================================================

async function cargarPractica(idmision) {

    try {

        console.log(
            "Misión recibida:",
            idmision
        );


        const categoria =
            obtenerCategoriaPorMision(idmision);


        console.log(
            "Categoría encontrada:",
            categoria
        );


        if (!categoria) {

            console.error(
                "No se encontró categoría para la misión:",
                idmision
            );

            return [];

        }


        // =================================================
        // CONSULTAR API
        // =================================================

        const url =
            `../php/api_practica.php?categoria=${categoria}`;


        console.log(
            "Consultando API:",
            url
        );


        const respuesta =
            await fetch(url);


        if (!respuesta.ok) {

            throw new Error(
                "Error HTTP: " + respuesta.status
            );

        }


        const datos =
            await respuesta.json();


        console.log(
            "Respuesta API prácticas:",
            datos
        );


        if (datos.status !== "success") {

            console.error(
                "Error de API:",
                datos.message
            );

            return [];

        }


        // =================================================
        // DEVOLVER PREGUNTAS
        // =================================================

        return datos.preguntas || [];


    } catch (error) {

        console.error(
            "Error cargando prácticas:",
            error
        );

        return [];

    }

}