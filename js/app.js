// =====================================
// INIT
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    obtenerCategorias();

});

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