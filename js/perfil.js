const API_PERFIL = "../php/perfil.php";
const API_USUARIO = "../php/registro_process.php";


document.addEventListener("DOMContentLoaded", ()=>{

    cargarPerfil();


    document
    .getElementById("perfilprinBtnEditar")
    .addEventListener("click", activarEdicion);


});



// ===============================
// CARGAR PERFIL
// ===============================

async function cargarPerfil(){

    console.log("Cargando perfil...");

    try{

        const respuesta = await fetch("../php/perfil.php");

        console.log("Respuesta:", respuesta);


        const resultado = await respuesta.json();


        console.log("JSON recibido:", resultado);



        if(resultado.status === "success"){


            const usuario = resultado.usuario;


            console.log(usuario);



            document.getElementById("perfilNombreUsuario").textContent =
            usuario.username;


            document.getElementById("nombre").value =
            usuario.nombre;


            document.getElementById("apellido").value =
            usuario.apellidop + " " + usuario.apellidom;


            document.getElementById("username").value =
            usuario.username;


            document.getElementById("email").value =
            usuario.email;



        }else{


            console.log(resultado.message);


        }



    }catch(error){

        console.error("Error:",error);

    }

}




// ===============================
// EDITAR
// ===============================

function activarEdicion(){


    Swal.fire({

        title:"Editar información",

        text:"¿Deseas modificar tus datos?",

        icon:"question",

        showCancelButton:true,

        confirmButtonText:"Sí, editar",

        cancelButtonText:"Cancelar",

        confirmButtonColor:"#198754"


    }).then((respuesta)=>{


        if(respuesta.isConfirmed){


            let campos=[

                "perfilNombre",
                "perfilApellido",
                "perfilUsername",
                "perfilEmail"

            ];



            campos.forEach(id=>{


                document
                .getElementById(id)
                .disabled=false;


            });



            document
            .getElementById("perfilprinGuardar")
            .classList
            .remove("d-none");


        }


    });


}


document.addEventListener("DOMContentLoaded",()=>{


console.log("DOM listo");


const boton = document.getElementById("btnEditarPerfil");


console.log("Boton editar:", boton);



});
 console.log("PERFIL.JS CARGADO");
