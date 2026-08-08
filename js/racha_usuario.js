async function cargarRacha() {

    try {

        const respuesta = await fetch(
            "/castoresmlaulanet/php/obtener_racha.php"
        );

        const datos = await respuesta.json();

        console.log("Racha recibida:", datos);

        if (datos.status === "success") {

            const elementoRacha =
                document.getElementById("streak-display");

            console.log("Elemento encontrado:", elementoRacha);

            if (elementoRacha) {

                elementoRacha.textContent = datos.racha;

            }

        }

    } catch (error) {

        console.error(
            "Error al cargar la racha:",
            error
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    cargarRacha
);