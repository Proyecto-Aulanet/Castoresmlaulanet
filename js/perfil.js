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


    console.log(
        "Eliminar cuenta"
    );


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



    const iconos=[

        "../Recursos/mascotas/ajolote.png",

        "../Recursos/mascotas/castor.png",

        "../Recursos/mascotas/zorro.png",

        "../Recursos/mascotas/armadillo.png",

        "../Recursos/mascotas/colibri.png"

    ];



    contenedor.innerHTML="";



    iconos.forEach(ruta=>{


        let img =
        document.createElement("img");


        img.src=ruta;


        img.width=80;

        img.height=80;



        img.onclick=function(){


            iconoSeleccionado=ruta;


        };



        contenedor.appendChild(img);


    });



}






async function guardarIcono(){


    if(!iconoSeleccionado){

        return;

    }



    const datos={


        accion:"foto",

        idusuario:idUsuarioActual,

        ruta_imagen:
        iconoSeleccionado


    };



    await fetch(
        "../php/registro_process.php",
        {

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:
        JSON.stringify(datos)

        }
    );


    cargarPerfil();


}