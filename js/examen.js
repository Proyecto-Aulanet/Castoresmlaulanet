console.log("Motor examen cargado");


const informacionMedallas = {


    1:{
        nombre:"CALLY",
        descripcion:"Guardiana del Abecedario",
        imagen:"medalla_abecedario.png"
    },


    2:{
        nombre:"XOLO",
        descripcion:"Guardián de los Saludos",
        imagen:"medalla_saludos.png"
    },


    3:{
        nombre:"YAJ",
        descripcion:"Guardián del Tiempo",
        imagen:"medalla_tiempo.png"
    },


    4:{
        nombre:"VENI",
        descripcion:"Guardiana de la Sociedad",
        imagen:"medalla_sociedad.png"
    },


    5:{
        nombre:"AJOTL",
        descripcion:"Guardián de Plantas y Animales",
        imagen:"medalla_plantas.png"
    },


    6:{
        nombre:"AST",
        descripcion:"Guardián de Frutas y Verduras",
        imagen:"medalla_alimentos.png"
    },


    7:{
        nombre:"MAMCHA",
        descripcion:"Guardián de Comidas y Bebidas",
        imagen:"medalla_comidas.png"
    },


    8:{
        nombre:"GUAMAY",
        descripcion:"Guardián de los Colores",
        imagen:"medalla_colores.png"
    },


    9:{
        nombre:"DILO",
        descripcion:"Guardián de los Números",
        imagen:"medalla_numeros.png"
    },


    10:{
        nombre:"LONI",
        descripcion:"Guardián del Cuerpo",
        imagen:"medalla_cuerpo.png"
    }


};





const MotorExamen = {


    idExamen:null,


    preguntasActuales:[],


    indicePregunta:0,


    puntaje:0,


    intentos:0,


    maxIntentos:2,


    cancelado:false,


    activo:false,





    async iniciar(){


        const url =
        new URLSearchParams(window.location.search);



        this.idExamen =
        parseInt(url.get("idmision"));



        console.log(
            "Misión examen:",
            this.idExamen
        );



        const config =
        configExamenes[this.idExamen];



        if(!config){


            Swal.fire(
                "Error",
                "Examen no encontrado",
                "error"
            );


            return;

        }





        // Verificar si ya consiguió la medalla

        const yaTieneMedalla =
        await this.verificarMedalla();



        if(yaTieneMedalla){

            return;

        }






        let preguntas =
        await obtenerPreguntasPorLeccion(
            this.idExamen
        );



        console.log(
            "Preguntas cargadas:",
            preguntas
        );





        preguntas.sort(
            ()=>Math.random()-0.5
        );





        this.preguntasActuales =
        preguntas.slice(0,10);




        this.indicePregunta=0;


        this.puntaje=0;


        this.activo=true;




        UILecciones.mostrarPregunta(


            this.preguntasActuales[0],


            0,


            10,


            0


        );


    },








    async siguiente(){



        if(this.cancelado){

            return;

        }






        const respuesta =
        document.querySelector(
        'input[name="respuesta"]:checked'
        );




        if(!respuesta){


            Swal.fire(
                "Atención",
                "Selecciona una respuesta",
                "warning"
            );


            return;


        }





        if(respuesta.dataset.correcto=="1"){


            this.puntaje +=10;


        }






        this.indicePregunta++;






        if(this.indicePregunta < 10){



            UILecciones.mostrarPregunta(


                this.preguntasActuales[
                this.indicePregunta
                ],


                this.indicePregunta,


                10,


                this.puntaje


            );



        }else{



            await this.finalizar();



        }



    },







    async finalizar(){


        this.activo=false;




        if(this.puntaje >=50){



            console.log(
            "Examen aprobado:",
            this.puntaje
            );



            await this.guardarResultado();



            this.mostrarMedalla();





            const btnSiguiente =
            document.getElementById(
            "btnSiguiente"
            );



            if(btnSiguiente){

                btnSiguiente.style.display="none";

            }






            const btnContinuar =
            document.getElementById(
            "btnContinuar"
            );



            if(btnContinuar){

                btnContinuar.style.display="block";

            }

            const btnTerminarExamen =
            document.getElementById(
            "btnTerminarExamen"
            );

            if(btnTerminarExamen){

            btnTerminarExamen.style.display="inline-block";

            }






        }else{



            this.intentos++;





            if(this.intentos < this.maxIntentos){



                let repetir =
                confirm(

                "Obtuviste "
                +this.puntaje+
                " puntos.\n\n¿Quieres volver a intentarlo?"

                );





                if(repetir){


                    await this.iniciar();


                }



            }else{



                Swal.fire(

                    "Examen terminado",

                    "Has agotado tus intentos.",

                    "error"

                );


            }



        }



    },
async guardarResultado(){


const sesion =
await fetch("../php/sesion_usuario.php");


const usuario =
await sesion.json();



const datos={


idusuario:
usuario.usuario.idusuario,


idexamen:
configExamenes[this.idExamen].idexamen,


idleccion:
this.idExamen,


puntos:
this.puntaje,


idmedalla:
configExamenes[this.idExamen].idmedalla


};



console.log(
"Guardando resultado:",
datos
);



const respuesta =
await fetch(
"../php/get_lecciones.php?accion=guardar_resultado",
{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:
JSON.stringify(datos)


});



const resultado =
await respuesta.json();



console.log(
"Resultado guardado:",
resultado
);



if(resultado.status==="success"){


Swal.fire({

title:"🎉 ¡Felicidades!",

html:`

Has conseguido tu medalla 🏅

<br>

Puntaje obtenido:
<b>${this.puntaje}/100</b>

`,

icon:"success"


});


}



},






// ======================================================
// VERIFICAR SI EL USUARIO YA TIENE LA MEDALLA
// ======================================================

async verificarMedalla(){


try{


const sesion =
await fetch("../php/sesion_usuario.php");


const usuario =
await sesion.json();



if(usuario.status!=="success")
return false;



const idusuario =
usuario.usuario.idusuario;



const idmedalla =
configExamenes[this.idExamen].idmedalla;



const respuesta =
await fetch(
`../php/get_lecciones.php?accion=verificar_medalla&idusuario=${idusuario}&idmedalla=${idmedalla}`
);



const resultado =
await respuesta.json();



console.log(
"Verificación medalla:",
resultado
);



if(resultado.obtenida){


Swal.fire({

title:"🏅 Ya tienes esta medalla",

text:
"Este examen ya fue completado.",

icon:"info",

confirmButtonText:"Ir al mapa"


}).then(()=>{


window.location.href =
configExamenes[this.idExamen].siguiente;


});



return true;


}



return false;



}catch(error){


console.error(
"Error verificando medalla",
error
);


return false;


}






},







// ======================================================
// GUARDAR RESULTADO DEL EXAMEN
// GUARDA: PUNTAJE + MEDALLA + PROGRESO
// ======================================================


async guardarResultado(){



    try{



        const sesion =
        await fetch("../php/sesion_usuario.php");



        const usuario =
        await sesion.json();





        const datos = {


            idusuario:
            usuario.usuario.idusuario,



            // En tu proyecto el examen pertenece a la misión

            idexamen:
            this.idExamen,



            idleccion:
            this.idExamen,



            puntos:
            this.puntaje,



            idmedalla:
            configExamenes[this.idExamen].idmedalla



        };





        console.log(
            "Datos enviados resultado:",
            datos
        );








        const respuesta =
        await fetch(

        "../php/get_lecciones.php?accion=guardar_resultado",

        {


            method:"POST",


            headers:{


                "Content-Type":"application/json"


            },


            body:
            JSON.stringify(datos)



        });







        const resultado =
        await respuesta.json();






        console.log(
            "Resultado BD:",
            resultado
        );





        if(resultado.status==="success"){


            console.log(
            "Puntaje y medalla guardados correctamente"
            );


        }else{


            console.error(
            resultado.message
            );


        }







    }catch(error){



        console.error(
        "Error guardando resultado:",
        error
        );


    }



},







// ======================================================
// MOSTRAR MEDALLA GANADA
// ======================================================


mostrarMedalla(){



    const idmedalla =
    configExamenes[this.idExamen].idmedalla;




    const medalla =
    informacionMedallas[idmedalla];





    if(!medalla){


        console.error(
        "No existe información de medalla"
        );


        return;


    }






    Swal.fire({



        title:"🎉 ¡Has conseguido una medalla!",



        html:`


        <img 
        src="../Recursos/medallas/${medalla.imagen}"
        width="160"
        class="mb-3">



        <h2>
        ${medalla.nombre}
        </h2>




        <p>
        ${medalla.descripcion}
        </p>




        <hr>


        <b>
        Puntaje obtenido:
        ${this.puntaje}/100
        </b>


        `,



        confirmButtonText:"Continuar"



    });



},







// ======================================================
// CANCELAR SI CAMBIA DE PESTAÑA O VENTANA
// ======================================================


cancelarExamen(){



    if(!this.activo){


        return;


    }





    this.cancelado=true;



    this.activo=false;






    Swal.fire({


        title:"Examen cancelado",


        text:"Detectamos cambio de pestaña o ventana. No puedes continuar.",


        icon:"error"


    }).then(()=>{





        window.location.href =
        configExamenes[this.idExamen].siguiente;





    });





}
};
document.addEventListener(
"DOMContentLoaded",
()=>{


    document.addEventListener(
    "visibilitychange",
    ()=>{


        if(document.hidden){


            MotorExamen.cancelarExamen();


        }


    });





    MotorExamen.iniciar();






    const boton =
    document.getElementById("btnSiguiente");



    if(boton){


        boton.addEventListener(
        "click",
        ()=>{


            MotorExamen.siguiente();


        });


    }







    const btnContinuar =
    document.getElementById("btnContinuar");



    if(btnContinuar){



        btnContinuar.addEventListener(
        "click",
        ()=>{


            MotorExamen.mostrarMedalla();



        });



    }

    const btnTerminarExamen =
    document.getElementById("btnTerminarExamen");

if (btnTerminarExamen) {

    btnTerminarExamen.addEventListener(
        "click",
        async () => {

            try {

                const respuesta = await fetch(
                    "../php/registrar_racha.php",
                    {
                        method: "POST"
                    }
                );

                const datos = await respuesta.json();

                console.log(datos);

                if (datos.status === "success") {

                    window.history.back();

                } else {

                    alert(datos.message);

                }

            } catch (error) {

                console.error(
                    "Error al registrar la racha:",
                    error
                );

                alert(
                    "Ocurrió un error al registrar la actividad."
                );

            }

        }
    );

}




});