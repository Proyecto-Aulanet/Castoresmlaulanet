async function actualizarTarjetaCompartir(){

    const respuesta = await fetch("../php/compartir_progreso.php");

    const datos = await respuesta.json();

    if(datos.status!="success"){

        return;

    }

    const u = datos.usuario;

    document.getElementById("shareNombre").textContent = u.nombre;

    document.getElementById("shareNivel").textContent = u.nivel;

    document.getElementById("shareXP").textContent = u.xp;

    document.getElementById("shareMedallas").textContent =
        u.medallas + "/" + u.totalMedallas;

    document.getElementById("shareExamenes").textContent =
        u.examenes + "/" + u.totalExamenes;

    if(u.foto){

        document.getElementById("shareFoto").src = u.foto;

    }

}

async function descargarTarjeta(){

    await actualizarTarjetaCompartir();

    const tarjeta = document.getElementById("tarjetaExportar");

    tarjeta.style.display = "flex";

    const canvas = await html2canvas(tarjeta, {

        scale: 2,

        useCORS: true,

        width: 1080,
        height: 1350
    });

    tarjeta.style.display = "none";

    const enlace = document.createElement("a");

    enlace.download = "MiProgresoAULNET.png";

    enlace.href = canvas.toDataURL("image/png");

    enlace.click();
}

async function compartirWhatsApp(){

    try {

        await actualizarTarjetaCompartir();

        const tarjeta = document.getElementById("tarjetaExportar");

        // Mostrar tarjeta
        tarjeta.style.display = "flex";

        const canvas = await html2canvas(tarjeta, {

            scale: 2,

            useCORS: true,

            backgroundColor: "#F7FAF8",

            width: 1080,

            height: 1350,

            scrollX: 0,

            scrollY: 0

        });

        // Ocultar tarjeta
        tarjeta.style.display = "none";

        canvas.toBlob(async function(blob){

            if(!blob){

                alert("No se pudo generar la imagen.");

                return;

            }

            const archivo = new File(

                [blob],

                "MiProgresoAULNET.png",

                {
                    type: "image/png"
                }

            );

            if(
                navigator.share &&
                navigator.canShare &&
                navigator.canShare({
                    files: [archivo]
                })
            ){

                await navigator.share({

                    files: [archivo],

                    title: "Mi progreso AUL@NET",

                    text:
                    "Estoy aprendiendo náhuatl con Castores Multilingües AUL@NET 🌱"

                });

            }else{

                alert(
                    "Tu navegador no permite compartir imágenes."
                );

            }

        }, "image/png");

    }catch(error){

        console.error(
            "Error al compartir:",
            error
        );

        document.getElementById(
            "tarjetaExportar"
        ).style.display = "none";

        alert(
            "No se pudo compartir la tarjeta."
        );

    }

}

async function compartirFacebook(){

    await actualizarTarjetaCompartir();

    const tarjeta = document.getElementById("tarjetaExportar");

    tarjeta.style.display = "flex";

    const canvas = await html2canvas(tarjeta, {

        scale: 2,

        useCORS: true,

        backgroundColor: "#F7FAF8",

        width: 1080,

        height: 1350,

        scrollX: 0,

        scrollY: 0

    });

    tarjeta.style.display = "none";

    // Descargar imagen
    const enlace = document.createElement("a");

    enlace.download = "MiProgresoAULNET.png";

    enlace.href = canvas.toDataURL("image/png");

    enlace.click();


    // Texto
    const texto =
        "Estoy aprendiendo náhuatl con Castores Multilingües AUL@NET 🌱\n\n" +
        "#Náhuatl #UTP #AULNET #CastoresMultilingües";


    // Abrir ventana de compartir de Facebook
    const urlFacebook =
        "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(window.location.href) +
        "&quote=" +
        encodeURIComponent(texto);


    window.open(
        urlFacebook,
        "facebookCompartir",
        "width=700,height=600"
    );

}

async function compartirX(){

    try {

        // Actualizar información de la tarjeta
        await actualizarTarjetaCompartir();

        const tarjeta =
            document.getElementById("tarjetaExportar");

        tarjeta.style.display = "flex";

        // Generar tarjeta
        const canvas = await html2canvas(tarjeta, {

            scale: 2,

            useCORS: true,

            backgroundColor: "#F7FAF8",

            width: 1080,

            height: 1350,

            scrollX: 0,

            scrollY: 0

        });

        tarjeta.style.display = "none";


        // Descargar imagen
        const enlace = document.createElement("a");

        enlace.download = "MiProgresoAULNET.png";

        enlace.href =
            canvas.toDataURL("image/png");

        enlace.click();


        // TEXTO DE LA PUBLICACIÓN
        const texto =
            "Estoy aprendiendo náhuatl con Castores Multilingües AUL@NET 🌱\n\n" +
            "Nechmachtia in náhuatl ipan Castores Multilingües AUL@NET 🌱\n\n" +
            "#Náhuatl #UTP #AULNET #CastoresMultilingües";


        // Abrir X con el texto preparado
        const urlX =
            "https://twitter.com/intent/post?text=" +
            encodeURIComponent(texto);


        window.open(

            urlX,

            "compartirX",

            "width=700,height=600"

        );

    } catch(error) {

        console.error(
            "Error al compartir en X:",
            error
        );

        document.getElementById(
            "tarjetaExportar"
        ).style.display = "none";

        alert(
            "No se pudo preparar la publicación."
        );

    }

}