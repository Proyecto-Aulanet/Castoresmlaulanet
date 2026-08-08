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

        console.log(datos);

        if (datos.status !== "success")
            return;

        datos.examenes.forEach(examen => {

            const tarjeta =
                document.querySelector(
                    `[data-id="${examen.idexamen}"]`
                );

            if (!tarjeta)
                return;

            tarjeta.classList.add("border-success");
            tarjeta.classList.add("bg-light");

            const estado =
                tarjeta.querySelector(".estado");

            if (estado) {

                estado.innerHTML =
                    `<span class="badge bg-success">
                        <i class="bi bi-check-circle-fill"></i>
                        Realizado
                    </span>`;

            }

        });

    }

    catch (error) {

        console.error(error);

    }

}