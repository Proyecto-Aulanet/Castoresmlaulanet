console.log("MotorLecciones cargado");


const MotorLecciones = {


    idMision:null,

    preguntas:[],
    preguntasActuales:[],

    indicePregunta:0,
    puntaje:0,


    async iniciar(){


        console.log("Iniciando práctica");


        const url = new URLSearchParams(window.location.search);


        this.idMision=parseInt(
            url.get("idmision")
        );
        


        if(
            isNaN(this.idMision) ||
            !configMisiones[this.idMision]
        ){

            console.error(
                "Misión inválida"
            );

            document.getElementById(
                "contenedorPregunta"
            ).innerHTML=
            "<h2>Misión no encontrada</h2>";

            return;

        }


        console.log(
            "Misión:",
            configMisiones[this.idMision].nombre
        );


        console.log(
            "ID misión:",
            this.idMision
        );


        /*
          AQUÍ SE CONSULTA LA BD
          POR EL ID DE MISIÓN
        */

        this.preguntas =
        await obtenerPreguntasPorLeccion(
            this.idMision
        );



        console.log(
            "Preguntas:",
            this.preguntas
        );
        console.log("Misión actual:", this.idMision);



        if(
            !this.preguntas ||
            this.preguntas.length===0
        ){

            document.getElementById(
                "contenedorPregunta"
            ).innerHTML=
            "<h2>No existen preguntas</h2>";

            return;

        }



        this.preguntas.sort(
            ()=>Math.random()-0.5
        );



        this.preguntasActuales =
        this.preguntas.slice(0,5);



        this.indicePregunta=0;
        this.puntaje=0;



        UILecciones.mostrarPregunta(

            this.preguntasActuales[0],

            0,

            this.preguntasActuales.length,

            this.puntaje

        );


    },



    siguiente(){


        const respuesta=
        document.querySelector(
        'input[name="respuesta"]:checked'
        );


        if(!respuesta){

            alert(
            "Selecciona una respuesta"
            );

            return;

        }



        if(
        respuesta.dataset.correcto=="1"
        ){

            this.puntaje+=10;

        }



        this.indicePregunta++;



        if(
        this.indicePregunta <
        this.preguntasActuales.length
        ){


            UILecciones.mostrarPregunta(

                this.preguntasActuales[
                    this.indicePregunta
                ],

                this.indicePregunta,

                this.preguntasActuales.length,

                this.puntaje

            );


        }else{


            UILecciones.mostrarResultado(

                this.puntaje,

                this.preguntasActuales.length*10,

                this.idMision,

                null

            );


        }


    }


};



document.addEventListener(
"DOMContentLoaded",
()=>{


    MotorLecciones.iniciar();



    const boton=
    document.getElementById(
    "btnSiguiente"
    );



    if(boton){


        boton.addEventListener(
        "click",
        ()=>{

            MotorLecciones.siguiente();

        });


    }


});