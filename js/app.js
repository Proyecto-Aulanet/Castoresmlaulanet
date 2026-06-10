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



/* NOMBRES EN MAYÚSCULAS */
[
    "nombre",
    "apellidoPaterno",
    "apellidoMaterno"
].forEach(id => {

    const campo =
    document.getElementById(id);

    if(campo){

        campo.addEventListener("input", function(){

            this.value = this.value
            .replace(
                /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s-]/g,
                ""
            )
            .toUpperCase();

        });

    }

});


/* JSON REGISTRO */

let paises = [];
let estadosMexico = [];
let palabrasProhibidas = [];

async function cargarDatosRegistro(){

    try{

        paises =
        await fetch("/json/paises.json")
        .then(r => r.json());

        paises =
        paises.map(
            pais => pais.shortName
        );

        estadosMexico =
        await fetch("/json/estados_mexico.json")
        .then(r => r.json());

        palabrasProhibidas =
        await fetch("/json/palabras_prohibidas.json")
        .then(r => r.json());

        cargarPaises();

    }
    catch(error){

        console.error(
            "Error cargando JSON:",
            error
        );

    }

}


function cargarPaises(){

    const selectPais =
    document.getElementById("pais");

    if(!selectPais) return;

    paises.forEach(pais => {

        const option =
        document.createElement("option");

        option.value =
        pais;

        option.textContent =
        pais;

        selectPais.appendChild(option);

    });

}

function cambiarPais(){

    const pais =
    document.getElementById("pais").value;

    const estado =
    document.getElementById("estado");

    if(!estado) return;

    estado.innerHTML = "";

    if(pais === "México"){

        const opcion =
        document.createElement("option");

        opcion.textContent =
        "Selecciona un estado";

        opcion.value = "";

        estado.appendChild(opcion);

        estadosMexico.forEach(nombre => {

            const option =
            document.createElement("option");

            option.value =
            nombre;

            option.textContent =
            nombre;

            estado.appendChild(option);

        });

    }
    else{

        const option =
        document.createElement("option");

        option.value =
        "No aplica";

        option.textContent =
        "No aplica";

        estado.appendChild(option);

    }

}

function generarUsuario(){

    const nombreInput =
    document.getElementById("nombre");

    if(!nombreInput) return;

    const nombre =
    nombreInput.value
    .trim()
    .toLowerCase();

    if(nombre === ""){

        alert(
            "Ingresa primero tu nombre"
        );

        return;

    }

    const numero =
    Math.floor(
        100 + Math.random() * 900
    );

    const username =
    nombre.replace(/\s+/g,"")
    + numero;

    document
    .getElementById("username")
    .value =
    username;

}

function usernameValido(username){

    username =
    username.toLowerCase();

    return !palabrasProhibidas.some(
        palabra =>
        username.includes(
            palabra.toLowerCase()
        )
    );

}

function togglePassword(){

    const input =
    document.getElementById("password");

    const icon =
    document.getElementById("iconPassword");

    if(!input || !icon) return;

    if(input.type === "password"){

        input.type = "text";

        icon.classList.replace(
            "bi-eye-fill",
            "bi-eye-slash-fill"
        );

    }
    else{

        input.type = "password";

        icon.classList.replace(
            "bi-eye-slash-fill",
            "bi-eye-fill"
        );

    }

}


const registerForm =
document.getElementById("registerForm");

if(registerForm){

    registerForm.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const username =
            document
            .getElementById("username")
            .value;

            const password =
            document
            .getElementById("password")
            .value;

            const confirmPassword =
            document
            .getElementById("confirmPassword")
            .value;

            const regexPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;

            if(
                !regexPassword.test(password)
            ){

                alert(
                    "La contraseña debe tener mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos."
                );

                return;

            }

            if(
                !usernameValido(username)
            ){

                alert(
                    "Nombre de usuario no permitido."
                );

                return;

            }

            if(
                password !== confirmPassword
            ){

                alert(
                    "Las contraseñas no coinciden."
                );

                return;

            }

            alert(
                "Cuenta creada correctamente."
            );

        }
    );

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if(
            document.getElementById(
                "registerForm"
            )
        ){

            cargarDatosRegistro();

        }

    }
);


/*Cerrar sesión en inicio*/


function cerrarSesion(){

    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/pages_ext/home.html";

}


/* frames nahui*/
let frameActual = 1;

const totalFrames = 58;

let direccion = 1;

function animarNahui(){

    const numero =
    String(frameActual)
    .padStart(3,"0");

    document.getElementById("nahuiFrame")
    .src =
    `/Recursos/nahui/frames_nahui/ezgif-frame-${numero}.png`;

    frameActual += direccion;

    if(frameActual >= totalFrames){

        direccion = -1;

    }

    if(frameActual <= 1){

        direccion = 1;

    }

}

setInterval(animarNahui, 70);


const ctx =
document.getElementById('xpChart');

new Chart(ctx, {

    type:'bar',

    data:{

        labels:[
            'L',
            'M',
            'M',
            'J',
            'V',
            'S',
            'D'
        ],

        datasets:[{

            label:'XP',

            data:[
                50,
                120,
                80,
                200,
                170,
                240,
                180
            ]

        }]
    }
});



/* script de progreso*/

function abrirExamen(numero){

    document.getElementById(
        "tituloExamen"
    ).textContent =
    "Examen " + numero;

    const modal =
    new bootstrap.Modal(
        document.getElementById(
            "modalDetalleExamen"
        )
    );

    modal.show();

}

/*Tarjeta de progreso*/


function descargarTarjeta(){

    html2canvas(
        document.getElementById(
            "tarjetaCompartir"
        )
    ).then(canvas => {

        const link =
        document.createElement("a");

        link.download =
        "aulanet.png";

        link.href =
        canvas.toDataURL();

        link.click();

    });

}


/* Funciones de compartir */

function compartirWhatsApp() {

    const mensaje =
`Estoy aprendiendo náhuatl gracias a Castores Multilingües AUL@NET 🦫📚

🏆 XP: 5420
🎖️ Medallas: 6/10
📝 Exámenes: 8/10

#AULANET
#Nahuatl
#CastoresMultilingues`;

    window.open(
        `https://wa.me/?text=${encodeURIComponent(mensaje)}`,
        '_blank'
    );
}


function compartirFacebook(){

    const url =
    encodeURIComponent(
        "https://aulanet.mx"
    );

    window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        "_blank"
    );

}


function compartirX(){

    const mensaje =
    encodeURIComponent(
        "Estoy aprendiendo náhuatl gracias a Castores Multilingües AUL@NET 🦫📚 #Nahuatl #AULANET"
    );

    window.open(
        `https://twitter.com/intent/tweet?text=${mensaje}`,
        "_blank"
    );

}


function descargarTarjeta() {

    const tarjeta = document.getElementById("tarjetaExportar");

    html2canvas(tarjeta, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
    })
    .then(canvas => {

        const enlace = document.createElement("a");

        enlace.download = "progreso_aulanet.png";

        enlace.href = canvas.toDataURL("image/png");

        enlace.click();

    });

}




/*java para abrir las lecciones*/
document
.querySelectorAll('.nivel-svg')
.forEach(nivel => {

    nivel.addEventListener('click', () => {

        const id = nivel.dataset.id;

        console.log("Nivel:", id);

        // Aquí rediriges
        // window.location.href = "nivel" + id + ".html";

    });

});