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
        // VALIDAR SI YA SE APROBÓ EL EXAMEN
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


        const idMedalla =
            relacionMisionMedalla[idMision] || idMision;


        const medallasGanadas =
            JSON.parse(
                localStorage.getItem(
                    "misMedallasObtenidas"
                )
            ) || [];


        if (medallasGanadas.includes(idMedalla)) {

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


        const respuesta =
            await fetch(
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


        const datos =
            await respuesta.json();


        console.log(
            "Respuesta registro examen:",
            datos
        );


        if (
            datos.status !== "success"
        ) {

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

async function finalizarExamen() {

    // =================================================
    // OBTENER ID MISIÓN
    // =================================================

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const idMision =
        parseInt(
            parametros.get("idmision")
        ) || 1;


    // =================================================
    // GUARDAR PUNTAJE EN BASE DE DATOS
    // =================================================

    if (puntaje > 0) {

        fetch(
            "../php/puntaje.php",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    idexamen:
                        idMision,

                    puntos:
                        puntaje

                })

            }
        )

        .then(
            res => res.json()
        )

        .then(
            data =>
                console.log(
                    "Respuesta BD puntaje:",
                    data
                )
        )

        .catch(
            err =>
                console.error(
                    "Error al guardar puntaje en BD:",
                    err
                )
        );

    }


    // =================================================
    // ACTUALIZAR PROGRESO VISUAL
    // =================================================

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

            <i
                class="bi bi-check-circle-fill text-success"
                style="font-size:70px;">
            </i>

            <h3 class="mt-3">

                Examen terminado

            </h3>

        </div>

    `;


    // =================================================
    // OCULTAR BOTÓN SIGUIENTE
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
    // AVISAR QUE EL EXAMEN TERMINÓ
    // =================================================

    document.dispatchEvent(
        new Event("examenTerminado")
    );


    // =================================================
    // REGISTRAR EXAMEN
    // =================================================

    await registrarExamenRealizado();


    // =================================================
    // MOSTRAR BOTÓN "TERMINAR EXAMEN"
    // =================================================

    const btnTerminar =
        document.getElementById(
            "btnTerminarExamen"
        );


    if (btnTerminar) {

        btnTerminar.style.display =
            "inline-block";


        // =================================================
        // ⭐ CUANDO SE PRESIONE TERMINAR EXAMEN
        // =================================================

        btnTerminar.onclick =
            async function () {

                console.log(
                    "📝 Botón Terminar examen presionado"
                );


                // Desactivar temporalmente
                // para evitar doble clic

                btnTerminar.disabled =
                    true;


                // =================================================
                // ⭐ REGISTRAR RACHA
                // =================================================

                const rachaRegistrada =
                    await registrarRacha();


                // =================================================
                // PROCESAR MEDALLA
                // =================================================

                if (
                    typeof procesarMedallaLocal ===
                    "function"
                ) {

                    procesarMedallaLocal(
                        idMision,
                        puntaje
                    );

                }


                // =================================================
                // SI NO HAY FUNCIÓN DE MEDALLA,
                // REGRESAR A PROGRESO
                // =================================================

                else {

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