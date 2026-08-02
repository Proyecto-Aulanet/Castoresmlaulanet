console.log("PERFIL JS CARGADO");


const API_PERFIL = "../php/perfil.php";
let idUsuarioActual = null;
let iconoSeleccionado = null;
// ===============================
// CARGAR PERFIL
// ===============================

document.addEventListener("DOMContentLoaded", function(){

    cargarPerfil();


    const botonEditar = document.getElementById("btnEditar");


    botonEditar.addEventListener("click", activarEdicion);



    const botonGuardar = document.getElementById("btnGuardar");


    botonGuardar.addEventListener("click", guardarPerfil);

    const botonEliminar = document.getElementById("btnEliminar");


    botonEliminar.addEventListener(
        "click",
        eliminarCuenta
    );


    const botonIcono = document.getElementById("btnCambiarIcono");


botonIcono.addEventListener("click", abrirModalIconos);

        


});

async function cargarPerfil(){


    try{


        const respuesta = await fetch(API_PERFIL);


        const resultado = await respuesta.json();



        console.log(resultado);



        if(resultado.status === "success"){


            const usuario = resultado.usuario;



            idUsuarioActual = usuario.idusuario;



            document.getElementById("lblUsuario").textContent =
            usuario.username;


                const imagen = document.getElementById("imgPerfil");
                const icono = document.getElementById("iconoDefaultPerfil");


                if(usuario.ruta_imagen){


                    imagen.src = usuario.ruta_imagen;


                    imagen.classList.remove("d-none");


                    icono.classList.add("d-none");


                }else{


                    imagen.classList.add("d-none");


                    icono.classList.remove("d-none");


                }



            document.getElementById("txtNombre").value =
            usuario.nombre;



            document.getElementById("txtApellido").value =
            usuario.apellidop + " " + usuario.apellidom;



            document.getElementById("txtUsuario").value =
            usuario.username;



            document.getElementById("txtCorreo").value =
            usuario.email;


        }


    }catch(error){


        console.error(
            "Error cargando perfil:",
            error
        );


    }


}

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


                document.getElementById(id).disabled=false;


            });



            document
            .getElementById("panelGuardar")
            .classList
            .remove("d-none");


        }


    });


}

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



    console.log("Datos enviados:", datos);



    let respuesta = await fetch("../php/registro_process.php",{


        method:"POST",


        headers:{


            "Content-Type":"application/json"


        },


        body:JSON.stringify(datos)


    });



    let resultado = await respuesta.json();


    console.log("Respuesta PHP:", resultado);



    if(resultado.status==="success"){


        Swal.fire({

            title:"Actualizado",

            text:"Datos modificados correctamente",

            icon:"success"

        });


        cargarPerfil();


    }else{


        Swal.fire({

            title:"Error",

            text:resultado.message,

            icon:"error"

        });


    }


}


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


            let datos={


                accion:"eliminar",


                idusuario:idUsuarioActual


            };



            console.log("Datos eliminar:",datos);



            let respuesta = await fetch("../php/registro_process.php",{


                method:"POST",


                headers:{


                    "Content-Type":"application/json"


                },


                body:JSON.stringify(datos)


            });



            let resultadoPHP =
            await respuesta.json();



            console.log(resultadoPHP);



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






function abrirModalIconos(){


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



    const contenedor =
    document.getElementById("contenedorIconos");



    contenedor.innerHTML="";



    iconos.forEach(ruta=>{


        let img=document.createElement("img");


        img.src=ruta;


        img.width=80;

        img.height=80;


        img.style.cursor="pointer";



        img.onclick=function(){


            iconoSeleccionado=ruta;


            document.querySelectorAll("#contenedorIconos img")
            .forEach(i=>{

                i.style.border="none";

            });



            img.style.border="3px solid green";


        };



        contenedor.appendChild(img);


    });



    let modal =
    new bootstrap.Modal(
        document.getElementById("modalIconos")
    );


    modal.show();


}


document
.getElementById("btnGuardarIcono")
.addEventListener(
    "click",
    guardarIcono
);



async function guardarIcono(){


    if(!iconoSeleccionado){


        Swal.fire(
            "Selecciona un icono",
            "",
            "warning"
        );

        return;

    }



    const datos = {

        accion:"foto",

        idusuario:idUsuarioActual,

        ruta_imagen:iconoSeleccionado

    };



    console.log("Datos enviados foto:", datos);



    try{


        const respuesta = await fetch("../php/registro_process.php",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(datos)

        });



        const texto = await respuesta.text();

        console.log("Respuesta PHP RAW:", texto);

        const resultado = JSON.parse(texto);



        console.log("Respuesta PHP foto:", resultado);



        if(resultado.status === "success"){


            document.getElementById("imgPerfil").src =
            iconoSeleccionado;



            Swal.fire({

                title:"Icono guardado",

                text:"Tu icono se guardó correctamente",

                icon:"success"

            });



            cargarPerfil();



            // cerrar modal
            const modal = bootstrap.Modal.getInstance(
                document.getElementById("modalIconos")
            );

            if(modal){

                modal.hide();

            }


        }else{


            Swal.fire({

                title:"Error",

                text:resultado.message,

                icon:"error"

            });


        }



    }catch(error){


        console.error("Error guardando icono:",error);


        Swal.fire({

            title:"Error",

            text:"No se pudo guardar el icono",

            icon:"error"

        });


    }


}