/*
===========================================
NAHUI CHATBOT
Castores Multilingües Aul@Net
===========================================
*/

const nahuichatbotContainer = document.getElementById("nahuichatbot-container");
const nahuichatbotAbrir = document.getElementById("nahuichatbot-abrir");
const nahuichatbotCerrar = document.getElementById("nahuichatbot-cerrar");

const nahuichatbotBody = document.getElementById("nahuichatbot-body");
const nahuichatbotInput = document.getElementById("nahuichatbot-input");
const nahuichatbotEnviar = document.getElementById("nahuichatbot-enviar");

/*=========================================
ABRIR CHAT
=========================================*/

nahuichatbotAbrir.addEventListener("click", () => {

    nahuichatbotContainer.style.display = "flex";

});

/*=========================================
CERRAR CHAT
=========================================*/

nahuichatbotCerrar.addEventListener("click", () => {

    nahuichatbotContainer.style.display = "none";

});

/*=========================================
AGREGAR MENSAJE
=========================================*/

function agregarMensaje(texto, tipo = "bot") {

    const mensaje = document.createElement("div");

    mensaje.classList.add("nahuichatbot-message");

    if (tipo === "bot") {

        mensaje.classList.add("nahuichatbot-message-bot");

    } else {

        mensaje.classList.add("nahuichatbot-message-user");

    }

    mensaje.innerHTML = texto;

    nahuichatbotBody.appendChild(mensaje);

    nahuichatbotBody.scrollTop = nahuichatbotBody.scrollHeight;

}

/*=========================================
ESCRIBIENDO
=========================================*/

function mostrarEscribiendo() {

    const typing = document.createElement("div");

    typing.id = "nahuichatbot-typing";

    typing.className =
        "nahuichatbot-message nahuichatbot-message-bot nahuichatbot-typing";

    typing.innerHTML = "Nahui está escribiendo...";

    nahuichatbotBody.appendChild(typing);

    nahuichatbotBody.scrollTop = nahuichatbotBody.scrollHeight;

}

function quitarEscribiendo() {

    const typing = document.getElementById("nahuichatbot-typing");

    if (typing) {

        typing.remove();

    }

}

/*=========================================
NORMALIZAR TEXTO
=========================================*/

function normalizar(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}

/*=========================================
BUSCAR RESPUESTA
=========================================*/

function buscarRespuesta(pregunta) {

    pregunta = normalizar(pregunta);

    for (const tema of conocimiento) {

        for (const palabra of tema.palabras) {

            if (pregunta.includes(normalizar(palabra))) {

                const respuestas = tema.respuestas;

                return respuestas[
                    Math.floor(Math.random() * respuestas.length)
                ];

            }

        }

    }

    return `Lo siento, no encontré información sobre esa consulta.

Puedes preguntarme acerca de:

• Aul@Net

• Registro

• Inicio de sesión

• Lecciones

• Evaluaciones

• Progreso

• Cultura

• Cuentos

• Equipo de desarrollo

• Contacto`;

}

/*=========================================
ENVIAR MENSAJE
=========================================*/

function enviarMensaje() {

    const pregunta = nahuichatbotInput.value.trim();

    if (pregunta === "") return;

    agregarMensaje(pregunta, "usuario");

    nahuichatbotInput.value = "";

    mostrarEscribiendo();

    setTimeout(() => {

        quitarEscribiendo();

        agregarMensaje(

            buscarRespuesta(pregunta),

            "bot"

        );

    }, 700);

}

/*=========================================
BOTÓN ENVIAR
=========================================*/

nahuichatbotEnviar.addEventListener("click", enviarMensaje);

/*=========================================
ENTER
=========================================*/

nahuichatbotInput.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        enviarMensaje();

    }

});

/*=========================================
MENSAJE DE BIENVENIDA
=========================================*/

window.addEventListener("load", () => {

    agregarMensaje(`

<h4 style="margin-bottom:10px;">👋 ¡Hola!</h4>

Soy <strong>Nahui</strong>, el asistente virtual de
<strong>Castores Multilingües Aul@Net</strong>.

Estoy aquí para ayudarte con información sobre:

<ul>

<li>📚 Lecciones</li>

<li>📝 Evaluaciones</li>

<li>🌎 Cultura</li>

<li>📖 Cuentos</li>

<li>📈 Progreso</li>

<li>🏅 Medallas</li>

<li>👥 Equipo de desarrollo</li>

<li>📞 Contacto</li>

</ul>

Escribe tu pregunta y con gusto intentaré ayudarte.

`);

});