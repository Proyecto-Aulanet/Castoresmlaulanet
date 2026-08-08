console.log("Seguridad del examen iniciada");

let examenCancelado = false;

function cancelarExamen(motivo){

    if(examenCancelado) return;

    examenCancelado = true;

    const parametros = new URLSearchParams(window.location.search);
    const idExamen = parametros.get("idmision");

    localStorage.setItem(
        "examen_cancelado_" + idExamen,
        "1"
    );

    Swal.fire({

        icon:"error",

        title:"Examen cancelado",

        text: motivo,

        allowOutsideClick:false,

        allowEscapeKey:false

    }).then(()=>{

        window.location.href="../pages_int/lecciones.html";

    });

}



// Cambió de pestaña
document.addEventListener("visibilitychange",()=>{

    if(document.hidden){

        cancelarExamen(
            "Cambiaste de pestaña."
        );

    }

});



// Perdió el foco
window.addEventListener("blur",()=>{

    cancelarExamen(
        "Abandonaste la ventana del examen."
    );

});