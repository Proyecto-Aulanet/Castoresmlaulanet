// =====================================
// INIT
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    obtenerCategorias();

});




// =====================================
// ABRIR / CERRAR MENÚ
// =====================================

function presenToggleMenu(){

    // Obtener menú
    const menu =
        document.getElementById(
            "presenMenuIdioma"
        );

    // Mostrar u ocultar menú
    menu.classList.toggle(
        "presen-show"
    );
}

// =====================================
// CAMBIAR IDIOMA
// =====================================

function presenCambiarModo(modo){

    // Guardar idioma seleccionado
    // en localStorage
    localStorage.setItem(
        "idiomaSeleccionado",
        modo
    );

    // Obtener todos los elementos
    // que tengan traducciones
    const elementos =
        document.querySelectorAll(
            "[data-es]"
        );

    // Recorrer elementos
    elementos.forEach(el => {

        // Obtener textos
        const es =
            el.getAttribute("data-es");

        const na =
            el.getAttribute("data-na");


        // =================================
        // ELEMENTOS SOLO SIMPLE
        // =================================

        if(el.classList.contains("solo-simple")){

            // SI EL MODO CONTIENE ESPAÑOL
            if(
                modo === "es" ||
                modo === "es-na"
            ){

                el.textContent = es;
            }

            // SI EL MODO CONTIENE NÁHUATL
            if(
                modo === "na" ||
                modo === "na-es"
            ){

                el.textContent = na;
            }

            return;
        }    

        // =================================
        // CASO ESPECIAL:
        // BOTONES DE TRAJES / AVATARES
        // =================================

        if(
            el.classList.contains(
                "avatar-btn"
            )
        ){

            const span =
                el.querySelector(
                    ".nombre-traje"
                );

            // SOLO ESPAÑOL
            if(modo === "es"){

                span.textContent = es;
            }

            // SOLO NÁHUATL
            if(modo === "na"){

                span.textContent = na;
            }

            // ESPAÑOL + NÁHUATL
            if(modo === "es-na"){

                span.innerHTML =

                    '<span class="idioma-principal">'
                    + es +
                    '</span>' +

                    '<span class="idioma-secundario">'
                    + ' / ' + na +
                    '</span>';
            }

            // NÁHUATL + ESPAÑOL
            if(modo === "na-es"){

                span.innerHTML =

                    '<span class="idioma-principal">'
                    + na +
                    '</span>' +

                    '<span class="idioma-secundario">'
                    + ' / ' + es +
                    '</span>';
            }

            // Saltar resto
            return;
        }

        // =================================
        // TEXTO NORMAL
        // =================================

        // SOLO ESPAÑOL
        if(modo === "es"){

            el.textContent = es;
        }

        // SOLO NÁHUATL
        if(modo === "na"){

            el.textContent = na;
        }

        // ESPAÑOL + NÁHUATL
        if(modo === "es-na"){

            el.innerHTML =

                '<span class="idioma-principal">'
                + es +
                '</span>' +

                '<span class="idioma-secundario">'
                + ' / ' + na +
                '</span>';
        }

        // NÁHUATL + ESPAÑOL
        if(modo === "na-es"){

            el.innerHTML =

                '<span class="idioma-principal">'
                + na +
                '</span>' +

                '<span class="idioma-secundario">'
                + ' / ' + es +
                '</span>';
        }

    });

    // Cerrar menú después
    // de seleccionar idioma
    document
        .getElementById(
            "presenMenuIdioma"
        )
        .classList.remove(
            "presen-show"
        );
}

// =====================================
// CARGAR IDIOMA GUARDADO
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        // Obtener idioma guardado
        const idiomaGuardado =

            localStorage.getItem(
                "idiomaSeleccionado"
            );

        // Si existe idioma guardado
        // aplicarlo automáticamente
        if(idiomaGuardado){

            presenCambiarModo(
                idiomaGuardado
            );
        }

    }
);

// =====================================
// MOSTRAR PAGINAS
// =====================================

function showPage(page){

    document
        .querySelectorAll(".page-section")
        .forEach(section => {

            section.classList.add("hidden");

        });

    document
        .getElementById(`page-${page}`)
        .classList.remove("hidden");
}

// =====================================
// OBTENER CATEGORIAS
// =====================================

async function obtenerCategorias(){

    try{

        const response = await fetch(
            "php/obtener_categorias.php"
        );

        const categorias = await response.json();

        renderCategorias(categorias);

    }catch(error){

        console.log(error);

    }
}

// =====================================
// RENDER CATEGORIAS
// =====================================

function renderCategorias(categorias){

    const container =
        document.getElementById("modules-grid");

    container.innerHTML = "";

    categorias.forEach(categoria => {

        container.innerHTML += `

            <div class="col-12 col-md-6 col-lg-3">

                <div
                    onclick="obtenerMisiones(${categoria.idcategoria})"
                    class="lesson-card card border-0 shadow-lg h-100 overflow-hidden cursor-pointer">

                    <div
                        class="bg-success text-white text-center p-4">

                        <img
                            src="${categoria.imagen}"
                            class="rounded-circle mb-3 object-fit-cover"
                            style="
                                width:100px;
                                height:100px;
                                object-fit:cover;
                            ">

                        <h3
                            class="fw-bold fs-4">

                            ${categoria.nombre_esp}

                        </h3>

                        <p class="small mt-2 mb-0">

                            ${categoria.descripcion_esp}

                        </p>

                    </div>

                </div>

            </div>

        `;
    });
}

// =====================================
// OBTENER MISIONES
// =====================================

async function obtenerMisiones(idcategoria){

    try{

        const response = await fetch(
            `php/obtener_misiones.php?idcategoria=${idcategoria}`
        );

        const misiones = await response.json();

        renderMisiones(misiones);

        showPage("missions");

    }catch(error){

        console.log(error);

    }
}

// =====================================
// RENDER MISIONES
// =====================================

function renderMisiones(misiones){

    const container =
        document.getElementById("missions-container");

    container.innerHTML = "";

    misiones.forEach(mision => {

        container.innerHTML += `

            <div
                class="card border-0 shadow-lg rounded-4 p-4 mb-4">

                <div
                    class="row align-items-center g-4">

                    <div class="col-12 col-md-3 text-center">

                        <img
                            src="${mision.imagen}"
                            class="img-fluid rounded-4"
                            style="
                                width:140px;
                                height:140px;
                                object-fit:cover;
                            ">

                    </div>

                    <div class="col-12 col-md-9">

                        <h2
                            class="fw-bold text-success">

                            ${mision.nombre_esp}

                        </h2>

                        <h3
                            class="fw-bold text-warning">

                            ${mision.nombre_nah}

                        </h3>

                        <p class="text-secondary mt-3">

                            ${mision.descripcion_esp}

                        </p>

                    </div>

                </div>

            </div>

        `;
    });
}

/*Scroll en header animacion*/

let ultimoScroll = 0;

window.addEventListener("scroll", () => {

    const header =
        document.querySelector(".header-main");

    const scrollActual =
        window.pageYOffset;

    if (scrollActual > 100) {

        if (scrollActual > ultimoScroll) {

            header.classList.add("header-hide");

        } else {

            header.classList.remove("header-hide");

        }
    }

    ultimoScroll = scrollActual;

});


let visible = true;

function toggleVisibilidad(){

    const icono =
        document.getElementById("iconoVisibilidad");

    visible = !visible;

    icono.classList.remove("eye-animate");

    void icono.offsetWidth;

    icono.classList.add("eye-animate");

    if(visible){

        icono.className =
            "bi bi-eye-fill eye-animate";

    }else{

        icono.className =
            "bi bi-eye-slash-fill eye-animate";
    }
}
