async function cargarRacha() {

    try {

        console.log(
            "🔥 Cargando racha..."
        );


        const respuesta =
            await fetch(
                "/castoresmlaulanet/php/obtener_racha.php"
            );


        const datos =
            await respuesta.json();


        console.log(
            "🔥 Racha recibida:",
            datos
        );


        if (
            datos.status === "success"
        ) {

            const elementoRacha =
                document.getElementById(
                    "streak-display"
                );


            if (elementoRacha) {

                elementoRacha.textContent =
                    datos.racha;

            } else {

                console.error(
                    "❌ No existe #streak-display"
                );

            }

        }

    } catch (error) {

        console.error(
            "❌ Error al cargar la racha:",
            error
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    cargarRacha
);