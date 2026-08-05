const UILecciones = {


    mostrarPregunta(pregunta, indice, total, puntajeActual) {


        document.getElementById("tituloCategoria").textContent =
            "Evaluación de la misión";


        document.getElementById("tituloMision").textContent =
            "Veamos qué tanto has aprendido";



        const porcentaje = ((indice + 1) / total) * 100;


        document.getElementById("progreso").style.width =
            porcentaje + "%";



        document.getElementById("contadorPregunta").textContent =
            `Pregunta ${indice + 1} de ${total}`;



        document.getElementById("contenedorPregunta").innerHTML = `

            <h3>${pregunta.texto_esp}</h3>

        `;



        let htmlOpciones = "";

if(!pregunta.opciones || pregunta.opciones.length===0){

    document.getElementById("contenedorOpciones").innerHTML =
    "<p>Esta pregunta no tiene opciones.</p>";

    return;

}

        pregunta.opciones.forEach(opcion => {


            htmlOpciones += `

                <label class="opcion">

                    <input

                        type="radio"

                        name="respuesta"

                        value="${opcion.idopcion}"

                        data-correcto="${opcion.correcto}"

                    >

                    ${opcion.texto_esp}

                </label>

            `;


        });



        document.getElementById("contenedorOpciones").innerHTML =
            htmlOpciones;



      //  document.getElementById("puntaje").textContent =
        //    `Puntaje: ${puntajeActual}`;


    },



    async mostrarResultado(puntaje, total, idmision, idexamen) {


        document.getElementById("contenedorPregunta").innerHTML = `

            <h2>¡Práctica completada!</h2>

        `;



        document.getElementById("contenedorOpciones").innerHTML = `

            <div class="resultado-final">

                <h3>

                    Obtuviste ${puntaje} de ${total} puntos

                </h3>


              

            </div>

        `;



        document.getElementById("btnSiguiente").style.display = "none";



        await guardarResultado(

            puntaje,

            idmision,

            idexamen

        );


    }


};




// Guardar puntaje en base de datos

async function guardarResultado(puntos, idmision, idexamen){


    try{


        const sesion = await fetch("../php/sesion_usuario.php");


        const usuario = await sesion.json();



        if(usuario.status !== "success"){


            console.error("No existe sesión activa");

            return;


        }



        const datos = {


            idusuario: usuario.usuario.idusuario,

            idleccion: idmision,

            idexamen: idexamen,

            puntos: puntos


        };



        const respuesta = await fetch(

            "../php/get_lecciones.php?accion=guardar_resultado",

            {


                method:"POST",


                headers:{


                    "Content-Type":"application/json"


                },


                body:JSON.stringify(datos)


            }

        );



        const resultado = await respuesta.json();


        console.log(

            "Resultado guardado:",

            resultado

        );



    }catch(error){


        console.error(

            "Error guardando resultado:",

            error

        );


    }


}