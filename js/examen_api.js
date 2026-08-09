console.log("Examen API cargado");

let preguntas = [];
let indiceActual = 0;
let puntaje = 0;


// =====================================================
// CARGAR EXAMEN
// =====================================================

async function cargarExamen() {

    try {

        // =================================================
        // OBTENER MISIÓN DESDE LA URL
        // =================================================

        const parametros =
            new URLSearchParams(window.location.search);

        const idMision =
            parseInt(parametros.get("idmision"));

        console.log(
            "Misión recibida:",
            idMision
        );


        if (!idMision || isNaN(idMision)) {

            throw new Error(
                "No se recibió una misión válida."
            );

        }


        // =================================================
        // CONSULTAR API
        // IMPORTANTE:
        // SE ENVÍA idmision, NO idexamen
        // =================================================

        const url =
            `../php/api_examen.php?idmision=${idMision}`;


        console.log(
            "Consultando API examen:",
            url
        );


        const respuesta =
            await fetch(url);


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );

        }


        const datos =
            await respuesta.json();


        console.log(
            "Respuesta API examen:",
            datos
        );


        // =================================================
        // COMPROBAR RESPUESTA
        // =================================================

        if (datos.status !== "success") {

            throw new Error(
                datos.message ||
                "No se pudieron cargar las preguntas."
            );

        }


        // =================================================
        // GUARDAR PREGUNTAS
        // =================================================

        preguntas =
            datos.preguntas || [];


        // Máximo 10 preguntas

        preguntas =
            preguntas.slice(0, 10);


        console.log(
            "Preguntas recibidas:",
            preguntas.length
        );


        if (preguntas.length < 10) {

            throw new Error(
                "El examen necesita 10 preguntas y la API solo devolvió " +
                preguntas.length + "."
            );

        }


        indiceActual = 0;

        puntaje = 0;


        // =================================================
        // MOSTRAR PRIMERA PREGUNTA
        // =================================================

        mostrarPregunta();


    }

    catch (error) {

        console.error(
            "Error cargando examen:",
            error
        );


        const contenedor =
            document.getElementById(
                "contenedorPregunta"
            );


        if (contenedor) {

            contenedor.innerHTML = `

                <h3 class="text-danger">

                    No se pudo cargar el examen.

                </h3>

                <p>

                    ${error.message}

                </p>

            `;

        }

    }

}



// =====================================================
// MOSTRAR PREGUNTA
// =====================================================

function mostrarPregunta() {

    const pregunta =
        preguntas[indiceActual];


    if (!pregunta) {

        return;

    }


    const numero =
        indiceActual + 1;


    // =================================================
    // PROGRESO
    // =================================================

    document.getElementById(
        "contadorPregunta"
    ).textContent =
        `Pregunta ${numero} de 10`;


    document.getElementById(
        "progreso"
    ).style.width =
        `${(numero / 10) * 100}%`;


    // =================================================
    // PREGUNTA
    // SOLO NÁHUATL
    // =================================================

    document.getElementById(
        "contenedorPregunta"
    ).innerHTML = `

        <h3 class="fw-bold">

            ${pregunta.texto_nah}

        </h3>

    `;


    // =================================================
    // OPCIONES
    // =================================================

    let opciones =
        [...(pregunta.opciones || [])];


    // Aleatorizar respuestas

    opciones.sort(
        () => Math.random() - 0.5
    );


    let html = "";


    opciones.forEach(
        (opcion, index) => {

            // =================================================
            // SOLO MOSTRAR ESPAÑOL
            // NO MOSTRAR texto_nah
            // =================================================

            html += `

                <label class="opcion-respuesta
                              p-3
                              border
                              rounded-3
                              bg-white
                              shadow-sm
                              d-flex
                              align-items-center">

                    <input
                        type="radio"
                        name="respuesta"
                        value="${opcion.idopcion}"
                        data-correcto="${opcion.correcto}"
                        class="form-check-input me-3">

                    <span>

                        <strong>

                            ${String.fromCharCode(65 + index)}.

                        </strong>

                        ${opcion.texto_esp}

                    </span>

                </label>

            `;

        }
    );


    document.getElementById(
        "contenedorOpciones"
    ).innerHTML = html;


    // =================================================
    // BOTÓN SIGUIENTE
    // =================================================

    const btn =
        document.getElementById(
            "btnSiguiente"
        );


    btn.disabled = true;


    // =================================================
    // ACTIVAR BOTÓN
    // =================================================

    document
        .querySelectorAll(
            'input[name="respuesta"]'
        )
        .forEach(
            input => {

                input.addEventListener(
                    "change",
                    function () {

                        btn.disabled = false;

                    }
                );

            }
        );

}



// =====================================================
// SIGUIENTE PREGUNTA
// =====================================================

function siguientePregunta() {

    const seleccion =
        document.querySelector(
            'input[name="respuesta"]:checked'
        );


    if (!seleccion) {

        return;

    }


    // =================================================
    // COMPROBAR RESPUESTA
    // =================================================

    if (
        seleccion.dataset.correcto === "1"
    ) {

        puntaje += 10;

    }


    console.log(
        "Puntaje:",
        puntaje
    );


    // =================================================
    // SIGUIENTE
    // =================================================

    indiceActual++;


    if (
        indiceActual < preguntas.length
    ) {

        mostrarPregunta();

    }

    else {

        finalizarExamen();

    }

}
async function registrarExamenRealizado() {

    try {

        const parametros =
            new URLSearchParams(window.location.search);


        const idmision =
            parseInt(parametros.get("idmision"));


        if (!idmision) {

            console.error(
                "No se encontró idmision en la URL."
            );

            return false;
        }


        console.log(
            "Registrando misión:",
            idmision
        );


        const respuesta = await fetch(
            "../php/api_guardar_examen.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    idmision: idmision
                })
            }
        );


        const datos = await respuesta.json();


        console.log(
            "Respuesta registro examen:",
            datos
        );


        if (datos.status !== "success") {

            console.error(
                "Error:",
                datos.message
            );

            return false;
        }


        return true;


    } catch (error) {

        console.error(
            "Error registrando examen:",
            error
        );

        return false;
    }
}


// =====================================================
// FINALIZAR EXAMEN
// =====================================================

async function finalizarExamen() {

    document.getElementById(
        "progreso"
    ).style.width = "100%";


    document.getElementById(
        "contadorPregunta"
    ).textContent =
        "Examen completado";


    document.getElementById(
        "contenedorPregunta"
    ).innerHTML = `

        <h2 class="text-success">

            🎉 ¡Felicidades!

        </h2>

        <p class="fs-5">

            Has terminado este examen.

        </p>

    `;


    document.getElementById(
        "contenedorOpciones"
    ).innerHTML = `

        <div class="text-center">

            <i class="bi bi-check-circle-fill text-success"
               style="font-size:70px;">
            </i>

            <h3 class="mt-3">

                Examen terminado

            </h3>

        </div>

    `;


    document.getElementById(
        "btnSiguiente"
    ).style.display = "none";

document.dispatchEvent(new Event("examenTerminado"));
    // ============================================
    // REGISTRAR EXAMEN
    // ============================================

    await registrarExamenRealizado();

}
// =====================================================
// INICIAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        cargarExamen();


        const btn =
            document.getElementById(
                "btnSiguiente"
            );


        if (btn) {

            btn.addEventListener(
                "click",
                siguientePregunta
            );

        }

    }
);