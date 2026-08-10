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

        const idmision =
            parseInt(parametros.get("idmision"));

        console.log(
            "Misión recibida:",
            idmision
        );


        if (!idmision || isNaN(idmision)) {

            throw new Error(
                "No se recibió una misión válida."
            );

        }


        // =================================================
        // VALIDAR SI YA SE APROBÓ EL EXAMEN (DESDE BD EN PHP)
        // =================================================

        const relacionMisionMedalla = {
            9: 1,
            10: 2,
            14: 3,
            18: 4,
            22: 5,
            25: 6,
            29: 7,
            33: 8,
            36: 9,
            39: 10
        };

        const idmedalla = relacionMisionMedalla[idmision] || idmision;

        // Consultar medallas de la cuenta activa desde PHP
        let medallasGanadas = [];
        try {
            const resMedallas = await fetch("../php/obtener_medallas.php");
            const dataMedallas = await resMedallas.json();
            if (dataMedallas.status === "success") {
                medallasGanadas = dataMedallas.medallas;
            }
        } catch (e) {
            console.error("No se pudieron verificar las medallas ganadas", e);
        }

        if (medallasGanadas.includes(idmedalla)) {

            if (typeof Swal !== "undefined") {

                Swal.fire({

                    icon: "info",

                    title: "Examen ya completado",

                    text:
                        "Ya aprobaste este examen y tienes tu medalla obtenida.",

                    confirmButtonText:
                        "Regresar a Lecciones",

                    confirmButtonColor:
                        "#28a745"

                }).then(() => {

                    window.location.href =
                        "lecciones.html";

                });

            } else {

                alert(
                    "Ya aprobaste este examen y tienes tu medalla obtenida."
                );

                window.location.href =
                    "lecciones.html";
            }

            return;
        }

        // =================================================
        // CONSULTAR API
        // IMPORTANTE: SE ENVÍA idmision
        // =================================================

        const url =
            `../php/api_examen.php?idmision=${idmision}`;


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
                preguntas.length +
                "."
            );

        }


        indiceActual = 0;
        puntaje = 0;

        // =================================================
        // MOSTRAR PRIMERA PREGUNTA
        // =================================================

        mostrarPregunta();

    } catch (error) {

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

// =====================================================
// REGISTRAR EXAMEN REALIZADO
// =====================================================

async function registrarExamenRealizado() {

    try {

        const parametros =
            new URLSearchParams(
                window.location.search
            );


        const idmision =
            parseInt(
                parametros.get("idmision")
            );


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
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    idmision:
                        idmision

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
// ⭐ REGISTRAR RACHA
// =====================================================

async function registrarRacha() {

    try {

        console.log(
            "🔥 Registrando racha..."
        );


        const respuesta =
            await fetch(
                "../php/registrar_racha.php",
                {
                    method: "POST"
                }
            );


        const datos =
            await respuesta.json();


        console.log(
            "🔥 Respuesta registrar racha:",
            datos
        );


        if (
            datos.status === "success"
        ) {

            console.log(
                "✅ Racha actual:",
                datos.racha
            );


            // =================================================
            // ACTUALIZAR EL NÚMERO DE ARRIBA
            // =================================================

            const elementoRacha =
                document.getElementById(
                    "streak-display"
                );


            if (elementoRacha) {

                elementoRacha.textContent =
                    datos.racha;

                console.log(
                    "🔥 Racha actualizada en pantalla:",
                    datos.racha
                );

            } else {

                console.warn(
                    "⚠️ No se encontró #streak-display"
                );

            }


            return true;

        }


        console.error(
            "❌ No se pudo registrar la racha:",
            datos.message
        );


        return false;


    } catch (error) {

        console.error(
            "❌ Error registrando racha:",
            error
        );


        return false;

    }

}






// =====================================================
// FINALIZAR EXAMEN
// =====================================================

let examenFinalizado = false;

async function finalizarExamen() {

    // Evitar que se ejecute dos veces
    if (examenFinalizado) {

        console.warn(
            "⚠️ El examen ya fue finalizado."
        );

        return;
    }

    examenFinalizado = true;

    console.log(
        "🏁 FINALIZANDO EXAMEN..."
    );

    console.log(
        "📊 PUNTAJE FINAL:",
        puntaje
    );


    // =================================================
    // OBTENER ID MISIÓN
    // =================================================

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const idmision =
        parseInt(
            parametros.get("idmision")
        );


    console.log(
        "🆔 ID MISIÓN:",
        idmision
    );


    if (
        !idmision ||
        isNaN(idmision)
    ) {

        console.error(
            "❌ No se encontró idmision en la URL."
        );

        examenFinalizado = false;

        return;
    }


    // =================================================
    // GUARDAR PUNTAJE
    // =================================================

    try {

        console.log(
            "💾 Guardando puntaje:",
            {
                idmision: idmision,
                puntos: puntaje
            }
        );


        const respuesta =
            await fetch(
                "../php/puntaje.php",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        idmision:
                            idmision,

                        puntos:
                            puntaje

                    })

                }
            );


        const datos =
            await respuesta.json();


        console.log(
            "📊 RESPUESTA PUNTAJE:",
            datos
        );


        if (
            datos.status !== "success"
        ) {

            console.error(
                "❌ ERROR GUARDANDO PUNTAJE:",
                datos.message
            );

        } else {

            console.log(
                "✅ PUNTAJE GUARDADO:",
                datos.puntos_guardados
            );

        }


    } catch (error) {

        console.error(
            "❌ Error al guardar puntaje:",
            error
        );

    }


    // =================================================
    // ACTUALIZAR PANTALLA
    // =================================================

    const progreso =
        document.getElementById(
            "progreso"
        );


    if (progreso) {

        progreso.style.width =
            "100%";

    }


    const contadorPregunta =
        document.getElementById(
            "contadorPregunta"
        );


    if (contadorPregunta) {

        contadorPregunta.textContent =
            "Examen completado";

    }


    const contenedorPregunta =
        document.getElementById(
            "contenedorPregunta"
        );


    if (contenedorPregunta) {

        contenedorPregunta.innerHTML = `

            <h2 class="text-success">

                🎉 ¡Examen terminado!

            </h2>

            <p class="fs-5">

                Has terminado este examen.

            </p>

            <p class="fs-4 fw-bold">

                Puntaje: ${puntaje}

            </p>

        `;

    }


    const contenedorOpciones =
        document.getElementById(
            "contenedorOpciones"
        );


    if (contenedorOpciones) {

        contenedorOpciones.innerHTML = `

            <div class="text-center">

                <i
                    class="bi bi-check-circle-fill text-success"
                    style="font-size:70px;">
                </i>

                <h3 class="mt-3">

                    Examen terminado

                </h3>

            </div>

        `;

    }


    // =================================================
    // OCULTAR SIGUIENTE
    // =================================================

    const btnSiguiente =
        document.getElementById(
            "btnSiguiente"
        );


    if (btnSiguiente) {

        btnSiguiente.style.display =
            "none";

    }


    // =================================================
    // MOSTRAR BOTÓN TERMINAR
    // =================================================

    const btnTerminar =
        document.getElementById(
            "btnTerminarExamen"
        );


    if (btnTerminar) {

        btnTerminar.style.display =
            "inline-block";


        btnTerminar.onclick =
            async function () {

                btnTerminar.disabled =
                    true;


                // =====================================
                // REGISTRAR RACHA
                // =====================================

                if (
                    typeof registrarRacha ===
                    "function"
                ) {

                    await registrarRacha();

                }


                // =====================================
                // PROCESAR MEDALLA
                // =====================================

                if (
                    typeof procesarMedallaLocal ===
                    "function"
                ) {

                    await procesarMedallaLocal(
                        idmision,
                        puntaje
                    );

                } else {

                    window.location.href =
                        "progreso.html";

                }

            };

    }

}


 



// =====================================================
// INICIAR EXAMEN
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

document.addEventListener("DOMContentLoaded", function () {

    const modalAlerta = document.getElementById("modalAlertaExamen");

    if (modalAlerta) {

        modalAlerta.addEventListener("hidden.bs.modal", function () {

            // Quitar el foco del botón antes de dejar el modal oculto
            if (document.activeElement) {
                document.activeElement.blur();
            }

        });

    }

});