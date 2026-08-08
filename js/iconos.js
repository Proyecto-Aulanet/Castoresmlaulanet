let mascotaSeleccionada = null;

document.addEventListener("DOMContentLoaded", () => {

    cargarMascotasDesdeAPI();

    cargarFotoPerfil();

});

function cargarMascotasDesdeAPI() {
    fetch('../php/mascotas.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            return response.json();
        })
        .then(res => {
            if (res.success) {
                renderizarMascotas(res.data);
            } else {
                console.error('Error desde el servidor:', res.message);
            }
        })
        .catch(error => {
            console.error('Error al obtener los iconos de mascotas:', error);
        });
}

function renderizarMascotas(listaMascotas) {
    const contenedorGrid = document.getElementById('perfilprinIconGrid');

    if (!contenedorGrid) {
        console.error('No se encontró el contenedor #perfilprinIconGrid en el HTML');
        return;
    }

    contenedorGrid.innerHTML = '';

    if (listaMascotas.length === 0) {
        contenedorGrid.innerHTML = '<p class="text-muted text-center">No hay iconos disponibles</p>';
        return;
    }

    listaMascotas.forEach(item => {
        const img = document.createElement('img');
        img.src = item.url;
        img.alt = item.nombre;
        img.dataset.nombreArchivo = item.nombre;

        img.style.cursor = 'pointer';

        img.addEventListener('click', () => {
            contenedorGrid.querySelectorAll('img').forEach(i => {
                i.classList.remove('icono-activo');
                i.style.border = 'none';
            });

            img.classList.add('icono-activo');
            img.style.border = '3px solid #198754'; // Borde verde para destacar
            img.style.borderRadius = '8px';

            mascotaSeleccionada = item.nombre;
        });

        contenedorGrid.appendChild(img);
    });
}

function perfilprinGuardarIcono() {

    if (!mascotaSeleccionada) {

        alert("Selecciona un icono");

        return;

    }

    fetch("../php/mascotas.php", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            foto: mascotaSeleccionada

        })

    })

        .then(r => r.json())

        .then(data => {

            if (data.success) {

                document.getElementById("fotoPerfil").src = data.ruta;

                bootstrap.Modal.getInstance(
                    document.getElementById("perfilprinModalIconos")
                ).hide();

            } else {

                alert(data.message);

            }

        });

}

function cargarFotoPerfil() {

    fetch("../backend/obtener_foto_perfil.php")

        .then(r => r.json())

        .then(data => {

            if (data.success) {

                document.getElementById("fotoPerfil").src =

                    "../Recursos/mascotas/" + data.foto;

            }

        });

}