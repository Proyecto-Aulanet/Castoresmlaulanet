// =====================================
// INIT
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    lucide.createIcons();

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

            <div
                onclick="obtenerMisiones(${categoria.idcategoria})"
                class="lesson-card bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer">

                <div
                    class="bg-gradient-to-r from-jade-500 to-nahua-500 p-6 text-center text-white">

                    <img
                        src="${categoria.imagen}"
                        class="w-24 h-24 object-cover rounded-full mx-auto mb-4">

                    <h3
                        class="font-display text-xl font-bold">

                        ${categoria.nombre_esp}

                    </h3>

                    <p class="text-sm mt-2">

                        ${categoria.descripcion_esp}

                    </p>

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
                class="bg-white rounded-2xl shadow-lg p-5 mb-4">

                <div class="flex gap-4 items-center">

                    <img
                        src="${mision.imagen}"
                        class="w-24 h-24 rounded-xl object-cover">

                    <div>

                        <h2
                            class="font-display text-2xl font-bold text-jade-700">

                            ${mision.nombre_esp}

                        </h2>

                        <h3
                            class="text-nahua-600 font-bold">

                            ${mision.nombre_nah}

                        </h3>

                        <p class="text-obsidian-500 mt-2">

                            ${mision.descripcion_esp}

                        </p>

                    </div>

                </div>

            </div>

        `;
    });
}