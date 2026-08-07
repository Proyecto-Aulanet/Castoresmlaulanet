document.addEventListener(
    "DOMContentLoaded",
    cargarExamenesRealizados
);

async function cargarExamenesRealizados() {

    try {

        const respuesta =
            await fetch("../php/api_examenes_realizados.php");

        const datos =
            await respuesta.json();

        console.log("Exámenes:", datos);

        if (datos.status !== "success")
            return;

        datos.examenes.forEach(examen => {

            // Buscar la tarjeta usando la misión
            const tarjeta =
                document.getElementById(
                    "mision" + examen.idmision
                );

            if (!tarjeta)
                return;

            // Cambiar apariencia
            tarjeta.classList.add(
                "border-success",
                "border-3",
                "bg-light"
            );

            // Cambiar el estado
            const estado =
                tarjeta.querySelector(".estado-examen");

            if (estado) {

                estado.classList.remove(
                    "bg-secondary"
                );

                estado.classList.add(
                    "bg-success"
                );

                estado.innerHTML =
                    `<i class="bi bi-check-circle-fill"></i>
                     Realizado`;

            }

        });

    }

    catch (error) {

        console.error(error);

    }

}