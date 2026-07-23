// =====================================
// INIT
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    obtenerCategorias();

});

//Abrir imagen en modal

function openImage(src){

document.getElementById("modalImage").src=src;

let modal=new bootstrap.Modal(
document.getElementById("imageModal")
);

modal.show();

}


// =====================================
// NAVEGACIÓN
function presenToggleNav(){

    document
        .getElementById("presenMenuNav")
        .classList.toggle("show");

}

function scrollToSection(id){

    document
        .getElementById(id)
        .scrollIntoView({

            behavior:"smooth"

        });

    document
        .getElementById("presenMenuNav")
        .classList.remove("show");

}


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
        await fetch("../json/paises.json")
        .then(r => r.json());

        paises =
        paises.map(
            pais => pais.shortName
        );

        estadosMexico =
        await fetch("../json/estados_mexico.json")
        .then(r => r.json());

        palabrasProhibidas =
        await fetch("../json/palabras_prohibidas.json")
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

    window.location.href = "/pages_ext/index.html";

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
    `../Recursos/nahui/frames_nahui/ezgif-frame-${numero}.png`;

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

// ===================================================
// LÓGICA DE CONTROL PARA EL CHAT DE IA (AMIGO NAHUI)
// ===================================================

/**
 * Muestra u oculta la ventana del chatbox
 */
function toggleChatbox() {
    const chatbox = document.getElementById('chatbox-container');
    if (chatbox) {
        chatbox.classList.toggle('d-none');
        chatbox.classList.toggle('d-flex');
        
        // Auto-scroll al fondo al abrir
        if (chatbox.classList.contains('d-flex')) {
            const chatBody = document.getElementById('chatbox-body');
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }
}

/**
 * Maneja el envío de mensajes e integra la simulación de respuesta de la IA
 */
function enviarMensajeIA(event) {
    event.preventDefault(); // Evita que la página se recargue

    const input = document.getElementById('chatbox-input');
    const chatBody = document.getElementById('chatbox-body');
    const mensajeTexto = input.value.trim();

    if (!mensajeTexto) return;

    // 1. Agregar el mensaje del Usuario al chat
    const usuarioDiv = document.createElement('div');
    usuarioDiv.className = 'bg-success text-white p-2 rounded-3 align-self-end text-break';
    usuarioDiv.style.maxWidth = '85%';
    usuarioDiv.style.fontSize = '0.9rem';
    usuarioDiv.textContent = mensajeTexto;
    chatBody.appendChild(usuarioDiv);

    // Limpiar el input inmediatamente
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // 2. Crear y agregar indicador de "Escribiendo..." para Nahui
    const escribiendoDiv = document.createElement('div');
    escribiendoDiv.className = 'bg-secondary text-white p-2 rounded-3 align-self-start fst-italic';
    escribiendoDiv.style.maxWidth = '85%';
    escribiendoDiv.style.fontSize = '0.9rem';
    escribiendoDiv.id = 'nahui-escribiendo';
    escribiendoDiv.textContent = 'Amigo Nahui está escribiendo...';
    chatBody.appendChild(escribiendoDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // 3. Simulación de respuesta de la IA (Reemplaza este setTimeout por tu fetch/API real en el futuro)
    setTimeout(() => {
        // Eliminar indicador de escribiendo
        const indicador = document.getElementById('nahui-escribiendo');
        if (indicador) indicador.remove();

        // Generar respuesta simulada orientada al Náhuatl
        let respuestaNahui = "¡Quema! (¡Sí!) Comprendo lo que dices. Estoy aquí para ayudarte a practicar y resolver tus dudas sobre la lengua náhuatl. ¿Te gustaría repasar vocabulario o alguna lección?";

        // Respuestas rápidas basadas en palabras clave sencillas
        const textoMin = mensajeTexto.toLowerCase();
        if (textoMin.includes('hola') || textoMin.includes('piyali')) {
            respuestaNahui = "¡Piyali! (¡Hola!) Qué alegría tenerte de vuelta por aquí. ¿Qué palabra o frase te gustaría aprender hoy?";
        } else if (textoMin.includes('gracias') || textoMin.includes('tlazocamati')) {
            respuestaNahui = "¡Tlazocamati huel miac! (¡Muchas gracias a ti!) Sigue esforzándote mucho con tus misiones.";
        } else if (textoMin.includes('adios') || textoMin.includes('nochi')) {
            respuestaNahui = "¡Timouitazqueh! (¡Nos vemos luego!). Cuídate mucho y recuerda seguir practicando.";
        }

        // Agregar la respuesta de Nahui a la interfaz
        const nahuiDiv = document.createElement('div');
        nahuiDiv.className = 'bg-secondary text-white p-2 rounded-3 align-self-start';
        nahuiDiv.style.maxWidth = '85%';
        nahuiDiv.style.fontSize = '0.9rem';
        nahuiDiv.textContent = respuestaNahui;
        
        chatBody.appendChild(nahuiDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1500); // 1.5 segundos de retraso para simular pensamiento
}








// =====================================
// ENRUTADOR VISTAS: MOSTRAR PAGINAS
// =====================================

function showPage(page) {
    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.add("hidden");
    });

    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.remove("hidden");
    }

    if (page === 'modules') {
        obtenerCategorias();
    }

    const navbarCollapse = document.getElementById("menuNavbar");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
    }
}


// =====================================
// OBTENER CATEGORIAS
// =====================================

async function obtenerCategorias() {
    try {
        const response = await fetch("../php/obtener_categorias.php");
        const categories = await response.json();

        renderCategorias(categories);

        const idiomaGuardado = localStorage.getItem("idiomaSeleccionado");
        if (idiomaGuardado) presenCambiarModo(idiomaGuardado);

    } catch (error) {
        console.error("Error obteniendo categorías:", error);
    }
}


// =====================================
// RENDER CATEGORIAS
// =====================================

function renderCategorias(categorias) {
    const container = document.getElementById("modules-grid");
    if (!container) return;

    container.innerHTML = "";

    categorias.forEach(categoria => {
        const rtaImagen = categoria.imagen.includes('../') ? categoria.imagen : `../Recursos/logos_lecciones/${categoria.imagen}`;
        
        container.innerHTML += `
            <div class="col-12 col-md-6 col-lg-3">
                <div onclick="obtenerMisiones(${categoria.idcategoria})"
                     class="lesson-card card border-0 shadow-lg h-100 overflow-hidden cursor-pointer">
                    <div class="bg-success text-white text-center p-4">
                        <img src="${rtaImagen}"
                             class="rounded-circle mb-3"
                             style="width:100px; height:100px; object-fit:cover;">
                        <h3 class="fw-bold fs-4">${categoria.nombre_esp}</h3>
                        <p class="small mt-2 mb-0">${categoria.descripcion_esp}</p>
                    </div>
                </div>
            </div>
        `;
    });
}


// =====================================
// Lecciones
// =====================================

// =====================================
// OBTENER MISIONES
// =====================================

async function obtenerMisiones(idcategoria) {
    try {
        const response = await fetch(`../php/obtener_misiones.php?idcategoria=${idcategoria}`);
        const misiones = await response.json();

        renderMisiones(misiones);
        showPage("missions");

    } catch (error) {
        console.error("Error obteniendo misiones:", error);
    }
}


// =====================================
// RENDER MISIONES (CORREGIDO)
// =====================================

function renderMisiones(misiones) {
    const container = document.getElementById("missions-container");
    if (!container) return;

    container.innerHTML = "";

    misiones.forEach(mision => {
        // Escapamos strings para evitar rupturas en el HTML estructurado
        const nombreEspEscapado = mision.nombre_esp.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const nombreNahEscapado = mision.nombre_nah.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const descEspEscapada = mision.descripcion_esp.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const descNahEscapada = mision.descripcion_nah ? mision.descripcion_nah.replace(/'/g, "\\'").replace(/"/g, '&quot;') : '';
        
        // CORRECCIÓN: Escapamos y empaquetamos de forma segura la nueva columna de la BD
        const contextoEspEscapado = mision.contexto_esp ? mision.contexto_esp.replace(/'/g, "\\'").replace(/"/g, '&quot;') : '';

        const rtaMisionImg = mision.imagen.includes('../') ? mision.imagen : `../Recursos/${mision.imagen}`;

        container.innerHTML += `
            <div class="card border-0 shadow-lg rounded-4 p-4 mb-4 cursor-pointer mission-clickable-card"
                 data-idmision="${mision.idmision}"
                 data-nombre-esp="${nombreEspEscapado}"
                 data-nombre-nah="${nombreNahEscapado}"
                 data-desc-esp="${descEspEscapada}"
                 data-desc-nah="${descNahEscapada}"
                 data-contexto-esp="${contextoEspEscapado}"> <div class="row align-items-center g-4">
                    <div class="col-12 col-md-3 text-center">
                        <img src="${rtaMisionImg}"
                             class="img-fluid rounded-4"
                             style="width:140px; height:140px; object-fit:cover;">
                    </div>
                    <div class="col-12 col-md-9">
                        <h2 class="fw-bold text-success">${mision.nombre_esp}</h2> 
                        <h3 class="fw-bold text-warning">${mision.nombre_nah}</h3> 
                        <p class="text-secondary mt-3">${mision.descripcion_esp}</p>
                    </div>
                </div>
            </div>
        `;
    });
}


// =====================================
// CONTROLADOR: VER CONTEXTO DE LA MISIÓN (CORREGIDO)
// =====================================

function verContextoMision(idmision, nombreEsp, nombreNah, contextoEsp, descNah) {
    if (!idmision) return;

    const titleEs = document.getElementById("context-title-es");
    const titleNa = document.getElementById("context-title-na");
    const descEs = document.getElementById("context-desc-es");
    const descNa = document.getElementById("context-desc-na");

    if (titleEs) titleEs.textContent = nombreEsp;
    if (titleNa) titleNa.textContent = nombreNah;
    
    // SOLUCIÓN DEFINITIVA: Vaciamos por completo estas etiquetas para que la 
    // descripción exterior no se pinte adentro y evitemos la duplicidad de pantallas
    if (descEs) descEs.textContent = ""; 
    if (descNa) descNa.textContent = "";

    const vocabContainer = document.getElementById("context-vocabulario");
    if (vocabContainer) {
        vocabContainer.innerHTML = `
            <div class="text-center py-4 bg-light rounded-4 text-dark p-3">
                <i class="bi bi-info-circle-fill text-success fs-1"></i>
                <p class="fw-bold mt-3 fs-5">¡Prepárate para el desafío!</p>
                
                <p class="text-secondary px-3 mb-0">${contextoEsp}</p>
            </div>
        `;
    }

    const actionsContainer = document.getElementById("context-actions");
    if (actionsContainer) {
        const nombreSeguro = nombreEsp.replace(/'/g, "\\'");
        actionsContainer.innerHTML = `
            <button onclick="iniciarCuestionario(${idmision}, '${nombreSeguro}')" 
                    class="btn btn-warning text-dark fw-bold rounded-pill px-5 py-3 fs-5 shadow w-100 transition-all">
                Iniciar Evaluación <i class="bi bi-lightning-charge-fill ms-2"></i>
            </button>
        `;
    }

    showPage("context");
}


// =====================================
// CONTROLADOR INTERACTIVO DEL QUIZ
// =====================================

async function iniciarCuestionario(idmision, nombreMision) {
    try {
        const response = await fetch(`../php/obtener_preguntas.php?idmision=${idmision}`);
        preguntasMisionActual = await response.json();

        if (!preguntasMisionActual || preguntasMisionActual.length === 0) {
            alert("¡Hola! Muy pronto se cargarán las preguntas asignadas a esta misión en la base de datos.");
            return;
        }

        indicePreguntaActual = 0;
        respuestasCorrectasTotales = 0;
        
        const quizTitle = document.getElementById("quiz-mision-title");
        const qContainer = document.getElementById("quiz-question-container");
        const rContainer = document.getElementById("quiz-results-container");

        if (quizTitle) quizTitle.textContent = nombreMision;
        if (qContainer) qContainer.classList.remove("hidden");
        if (rContainer) rContainer.classList.add("hidden");

        mostrarPreguntaActual();
        showPage("quiz");

    } catch (error) {
        console.error("Error obteniendo reactivos del cuestionario:", error);
    }
}

function mostrarPreguntaActual() {
    const totalPreguntas = preguntasMisionActual.length;
    const pregunta = preguntasMisionActual[indicePreguntaActual];

    const progressText = document.getElementById("quiz-progress-text");
    const progressBar = document.getElementById("quiz-progress-bar");
    const questionText = document.getElementById("quiz-question-text");
    const opcionesContainer = document.getElementById("quiz-options-container");

    if (progressText) progressText.textContent = `Pregunta ${indicePreguntaActual + 1} de ${totalPreguntas}`;
    if (progressBar) {
        const porcentajeProgreso = (indicePreguntaActual / totalPreguntas) * 100;
        progressBar.style.width = `${porcentajeProgreso}%`;
    }
    if (questionText) questionText.textContent = pregunta.pregunta;
    if (!opcionesContainer) return;
    
    opcionesContainer.innerHTML = "";

    const opciones = [
        { texto: pregunta.opcion_correcta, esCorrecta: true },
        { texto: pregunta.opcion_b, esCorrecta: false },
        { texto: pregunta.opcion_c, esCorrecta: false }
    ];
    
    // Mezclar las respuestas aleatoriamente
    opciones.sort(() => Math.random() - 0.5);

    opciones.forEach(opcion => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-success text-start p-3 rounded-3 fs-5 fw-medium shadow-sm option-btn w-100 style-leccion-btn";
        btn.textContent = opcion.texto;
        btn.onclick = () => verificarRespuestaUsuario(opcion.esCorrecta, btn);
        opcionesContainer.appendChild(btn);
    });
}

function verificarRespuestaUsuario(esCorrecta, botonPresionado) {
    const botones = document.querySelectorAll(".option-btn");
    botones.forEach(b => b.disabled = true);

    if (esCorrecta) {
        botonPresionado.classList.replace("btn-outline-success", "btn-success");
        respuestasCorrectasTotales++;
    } else {
        botonPresionado.classList.replace("btn-outline-success", "btn-danger");
        botones.forEach(b => {
            if (b.textContent === preguntasMisionActual[indicePreguntaActual].opcion_correcta) {
                b.classList.replace("btn-outline-success", "btn-success");
            }
        });
    }

    setTimeout(() => {
        indicePreguntaActual++;
        if (indicePreguntaActual < preguntasMisionActual.length) {
            mostrarPreguntaActual();
        } else {
            finalizarCuestionario();
        }
    }, 1400);
}

function finalizarCuestionario() {
    const progressBar = document.getElementById("quiz-progress-bar");
    const progressText = document.getElementById("quiz-progress-text");
    const qContainer = document.getElementById("quiz-question-container");
    const scoreTexto = document.getElementById("quiz-results-score");
    const rContainer = document.getElementById("quiz-results-container");

    if (progressBar) progressBar.style.width = "100%";
    if (progressText) progressText.textContent = "¡Terminado!";
    if (qContainer) qContainer.classList.add("hidden");
    
    if (scoreTexto) {
        scoreTexto.textContent = `Lograste contestar de forma correcta ${respuestasCorrectasTotales} de ${preguntasMisionActual.length} reactivos. ¡Buen trabajo practicando tu náhuatl!`;
    }
    
    if (rContainer) rContainer.classList.remove("hidden");
}

//==================
// Perfil
//==================

//==================
// IDIOMA
//==================

function perfilprinTexto(es, na){

const idioma =
localStorage.getItem("idiomaSeleccionado")
||
localStorage.getItem("idioma")
||
"es";

return idioma.toLowerCase() === "na"
? na
: es;

}

let abiertas = false;

function perfilprinMostrarMasMedallas() {

    const extras =
        document.querySelectorAll(
            ".perfilprin-medalla-extra"
        );

    abiertas = !abiertas;

    extras.forEach(e => {

        e.classList.toggle("d-none");

    });

    document.getElementById(
        "btnVerMas"
    ).innerHTML = abiertas

        ? "Ver menos"

        : "Ver más";

}



//==================
// EDITAR INFO
//==================

function perfilprinEditarInformacion(){

Swal.fire({

title:

perfilprinTexto(
"¿Editar contraseña?",
"¿Tikpatlas tlatzakuilli?"
),

text:

perfilprinTexto(
"Solo podrás modificar la contraseña",
"San huel tikpatlas motlatzakuilli"
),

icon:"question",

showCancelButton:true,

confirmButtonText:

perfilprinTexto(
"Editar",
"Xikpatla"
),

cancelButtonText:

perfilprinTexto(
"Cancelar",
"Xikmokuepa"
),

confirmButtonColor:"#2ebc68"

})

.then(r=>{

if(r.isConfirmed){

const input=

document.getElementById(
"perfilprinPassword"
);

input.disabled=false;

input.focus();

document
.getElementById(
"perfilprinGuardar"
)
.classList
.remove(
"d-none"
);

}

});

}



//==================
// GUARDAR
//==================

function perfilprinGuardarInformacion(){

const pass=

document
.getElementById(
"perfilprinPassword"
)
.value;

if(pass.length<6){

Swal.fire({

icon:"warning",

title:

perfilprinTexto(
"Contraseña inválida",
"Tlatzakuilli amo kuali"
),

text:

perfilprinTexto(
"Mínimo 6 caracteres",
"Xikpia chikuasen caracteres"

)

});

return;

}

Swal.fire({

title:

perfilprinTexto(
"¿Guardar cambios?",
"¿Tikpiyawas tlamantli?"
),

icon:"question",

showCancelButton:true,

confirmButtonText:

perfilprinTexto(
"Guardar",
"Xikpiyawa"
),

cancelButtonText:

perfilprinTexto(
"Cancelar",
"Xikmokuepa"
),

confirmButtonColor:"#2ebc68"

})

.then(r=>{

if(r.isConfirmed){

document
.getElementById(
"perfilprinPassword"
)
.disabled=true;

document
.getElementById(
"perfilprinGuardar"
)
.classList
.add(
"d-none"
);

Swal.fire({

icon:"success",

title:

perfilprinTexto(
"Información actualizada",
"Tlanextilistli yancuic"

)

});

}

});

}



//==================
// ELIMINAR
//==================

function perfilprinEliminarCuenta(){

Swal.fire({

title:

perfilprinTexto(
"¿Eliminar cuenta?",
"¿Tikpoloas cuenta?"
),

text:

perfilprinTexto(
"Esta acción no se puede deshacer",
"Ayo huel mokuepas"
),

icon:"warning",

showCancelButton:true,

confirmButtonColor:"#d33",

confirmButtonText:

perfilprinTexto(
"Eliminar",
"Xikpoloa"
),

cancelButtonText:

perfilprinTexto(
"Cancelar",
"Xikmokuepa"
)

})

.then(r=>{

if(r.isConfirmed){

Swal.fire({

icon:"success",

title:

perfilprinTexto(
"Cuenta eliminada",
"Cuenta opoliw"

)

});

}

});

}



//==================
// MODAL ICONOS
//==================

let perfilprinIcono = null;



function perfilprinAbrirSelectorIcono() {

    const modal = new bootstrap.Modal(

        document.getElementById(
            "perfilprinModalIconos"
        )

    );

    modal.show();

}

//==================
// MODAL MEDALLAS
//==================

function perfilprinAbrirModalMedallas(){

new bootstrap.Modal(

document.getElementById(
"perfilprinModalMedallas"

)

).show();

}



//==================
// SELECCIÓN
//==================

document
.querySelectorAll(
".perfilprin-icon-grid img"
)

.forEach(img => {

    img.addEventListener(

        "click",

        () => {

            document
            .querySelectorAll(
                ".perfilprin-icon-grid img"
            )
            .forEach(i => {

                i.style.border =

                "4px solid transparent";

            });

            img.style.border =

            "4px solid #2ebc68";

            perfilprinIcono = img.src;

        }

    );

});



//==================
// GUARDAR ICONO
//==================

function perfilprinGuardarIcono(){

if(!perfilprinIcono){

Swal.fire({

icon:"warning",

title:

perfilprinTexto(
"Selecciona un icono",
"Xikpejpena se tlaixiptla"
)

});

return;

}

document
.getElementById(
"perfilprinAvatar"
)
.src=

perfilprinIcono;

bootstrap
.Modal
.getInstance(

document.getElementById(
"perfilprinModalIconos"

)

).hide();

Swal.fire({

icon:"success",

title:

perfilprinTexto(
"Icono actualizado",
"Tlaixiptla yancuic"
)

});

}

function interactuarImagen(img) {
    const contenedor = img.parentElement;

    // Si no está expandida, la expandimos
    if (!contenedor.classList.contains('expandida')) {
        contenedor.classList.add('expandida');
    }
}

// Esta función es activada por el clic en la 'X'
function cerrarImagen(btn) {
    const contenedor = btn.parentElement;
    
    // Si está expandida, la cerramos
    if (contenedor.classList.contains('expandida')) {
        contenedor.classList.remove('expandida');
    } else {
        // Opcional: Si hacen clic en el icono de lupa, también expande
        interactuarImagen(contenedor.querySelector('img'));
    }
}