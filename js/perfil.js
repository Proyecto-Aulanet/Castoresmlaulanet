console.log("PERFIL JS CARGADO");


const API_PERFIL = "../php/perfil.php";

let idUsuarioActual = null;

let iconoSeleccionado = null;


// ===============================
// CARGAR EVENTOS
// ===============================

document.addEventListener("DOMContentLoaded", function(){


    // Solo carga perfil si existe el elemento del perfil

    if(document.getElementById("lblUsuario")){

        cargarPerfil();

    }



    const botonEditar =
    document.getElementById("btnEditar");

    if(botonEditar){

        botonEditar.addEventListener(
            "click",
            activarEdicion
        );

    }



    const botonGuardar =
    document.getElementById("btnGuardar");


    if(botonGuardar){

        botonGuardar.addEventListener(
            "click",
            guardarPerfil
        );

    }



    const botonEliminar =
    document.getElementById("btnEliminar");


    if(botonEliminar){

        botonEliminar.addEventListener(
            "click",
            eliminarCuenta
        );

    }



    const botonIcono =
    document.getElementById("btnCambiarIcono");


    if(botonIcono){

        botonIcono.addEventListener(
            "click",
            abrirModalIconos
        );

    }



        const botonGuardarIcono =
        document.getElementById("btnGuardarIcono");


        if(botonGuardarIcono){

            botonGuardarIcono.addEventListener(
                "click",
                guardarIcono
            );

        }


});



// ===============================
// CARGAR PERFIL
// ===============================

async function cargarPerfil(){


    try{


        const respuesta =
        await fetch(API_PERFIL);


        const resultado =
        await respuesta.json();



        console.log(resultado);



        if(resultado.status==="success"){


            const usuario =
            resultado.usuario;



            idUsuarioActual =
            usuario.idusuario;



            const lblUsuario =
            document.getElementById("lblUsuario");


            if(lblUsuario){

                lblUsuario.textContent =
                usuario.username;

            }




            const imagen =
            document.getElementById("imgPerfil");


            const icono =
            document.getElementById("iconoDefaultPerfil");



            if(imagen && icono){


                if(usuario.ruta_imagen){


                    imagen.src =
                    usuario.ruta_imagen;


                    imagen.classList.remove("d-none");


                    icono.classList.add("d-none");


                }else{


                    imagen.classList.add("d-none");


                    icono.classList.remove("d-none");


                }

            }





            const txtNombre =
            document.getElementById("txtNombre");


            if(txtNombre){

                txtNombre.value =
                usuario.nombre;

            }



            const txtApellido =
            document.getElementById("txtApellido");


            if(txtApellido){

                txtApellido.value =
                usuario.apellidop+" "+
                usuario.apellidom;

            }



            const txtUsuario =
            document.getElementById("txtUsuario");


            if(txtUsuario){

                txtUsuario.value =
                usuario.username;

            }



            const txtCorreo =
            document.getElementById("txtCorreo");


            if(txtCorreo){

                txtCorreo.value =
                usuario.email;

            }



        }



    }catch(error){


        console.error(
            "Error cargando perfil:",
            error
        );


    }


}




// ===============================
// EDITAR PERFIL
// ===============================

function activarEdicion(){


    Swal.fire({

        title:"Editar información",

        text:"¿Deseas modificar tus datos?",

        icon:"question",

        showCancelButton:true,

        confirmButtonText:"Sí, editar"


    }).then((resultado)=>{


        if(resultado.isConfirmed){


            let campos=[

                "txtNombre",
                "txtApellido",
                "txtUsuario",
                "txtCorreo"

            ];



            campos.forEach(id=>{


                const campo =
                document.getElementById(id);



                if(campo){

                    campo.disabled=false;

                }


            });



            const panel =
            document.getElementById("panelGuardar");


            if(panel){

                panel.classList.remove("d-none");

            }


        }


    });


}





// ===============================
// GUARDAR PERFIL
// ===============================

async function guardarPerfil(){


    let apellido =
    document.getElementById("txtApellido")
    .value.split(" ");



    let datos={


        accion:"modificar",

        idusuario:idUsuarioActual,


        nombre:
        document.getElementById("txtNombre").value,


        apellidop:
        apellido[0],


        apellidom:
        apellido[1] || "",


        username:
        document.getElementById("txtUsuario").value,


        email:
        document.getElementById("txtCorreo").value


    };



    const respuesta =
    await fetch("../php/registro_process.php",
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



    console.log(resultado);



    if(resultado.status==="success"){


        Swal.fire(
            "Actualizado",
            "Datos modificados correctamente",
            "success"
        );


        cargarPerfil();


    }


}





// ===============================
// ELIMINAR CUENTA
// ===============================

async function eliminarCuenta(){

    Swal.fire({
        title:"¿Eliminar cuenta?",
        text:"Esta acción no se puede deshacer",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText:"Sí, eliminar",
        cancelButtonText:"Cancelar",
        confirmButtonColor:"#dc3545"
    }).then(async(resultado)=>{

        if(resultado.isConfirmed){

            let datos = {
                accion:"eliminar",
                idusuario:idUsuarioActual
            };

            let respuesta = await fetch("../php/registro_process.php",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(datos)
            });

            let resultadoPHP = await respuesta.json();

            console.log("Respuesta eliminar:", resultadoPHP);

            if(resultadoPHP.status==="success"){

                Swal.fire({
                    title:"Cuenta eliminada",
                    text:"Tu cuenta fue eliminada correctamente",
                    icon:"success"
                }).then(()=>{
                    window.location.href="../pages_ext/index.html";
                });

            }else{

                Swal.fire({
                    title:"Error",
                    text:resultadoPHP.message,
                    icon:"error"
                });

            }

        }

    });

}




// ===============================
// ICONOS
// ===============================

function abrirModalIconos(){


    const contenedor =
    document.getElementById("contenedorIconos");


    if(!contenedor){

        return;

    }



const iconos = [

    "../Recursos/mascotas/ajolote.png",
    "../Recursos/mascotas/castor.png",
    "../Recursos/mascotas/zorro.png",
    "../Recursos/mascotas/armadillo.png",
    "../Recursos/mascotas/colibri.png",
    "../Recursos/mascotas/venado.png",
    "../Recursos/mascotas/guacamalla.png",
    "../Recursos/mascotas/lobo.png",
    "../Recursos/mascotas/tigre.png",
    "../Recursos/mascotas/todos_azul.png",
    "../Recursos/mascotas/todos_rosa.png",
    "../Recursos/mascotas/xolo.png"

];



    contenedor.innerHTML="";



    iconos.forEach(ruta=>{


        let img =
        document.createElement("img");


        img.src=ruta;


        img.width=80;

        img.height=80;



        img.onclick=function(){

            iconoSeleccionado = ruta;


            // quitar selección anterior
            document.querySelectorAll("#contenedorIconos img")
            .forEach(i=>{

                i.style.border="none";
                i.style.borderRadius="0";

            });


            // marcar seleccionado
            img.style.border="3px solid #198754";
            img.style.borderRadius="10px";


            console.log(
                "Icono seleccionado:",
                iconoSeleccionado
            );

        };



        contenedor.appendChild(img);


    });

    let modal = new bootstrap.Modal(
    document.getElementById("modalIconos")
);

modal.show();

}






async function guardarIcono(){
        console.log("ENTRÓ A GUARDAR ICONO");
    if(!iconoSeleccionado){
        return;
    }

    const datos = {

        accion:"foto",
        idusuario:idUsuarioActual,
        ruta_imagen:iconoSeleccionado

    };

    console.log("Enviando:", datos);

    const respuesta = await fetch("../php/registro_process.php",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(datos)

    });

    const resultado = await respuesta.json();

    console.log(resultado);

    if(resultado.status === "success"){

        Swal.fire({
            icon:"success",
            title:"Icono actualizado"
        });

        cargarPerfil();

    }else{

        Swal.fire({
            icon:"error",
            title:"Error",
            text:resultado.message
        });

    }

}

document.addEventListener("click", function(e){

    if(e.target.closest("#btnGuardarIcono")){

        console.log("CLICK REAL GUARDAR ICONO");

        guardarIcono();

    }

});

document.getElementById('btnEditar').addEventListener('click', () => {
    document.getElementById('txtNombre').removeAttribute('disabled');
    document.getElementById('txtApellido').removeAttribute('disabled');
    document.getElementById('txtUsuario').removeAttribute('disabled');
    document.getElementById('txtCorreo').removeAttribute('disabled');
    
    // Habilitar contraseña y botón de visualización
    document.getElementById('txtPassword').removeAttribute('disabled');
    document.getElementById('btnTogglePassword').removeAttribute('disabled');
    
    document.getElementById('panelGuardar').classList.remove('d-none');
});