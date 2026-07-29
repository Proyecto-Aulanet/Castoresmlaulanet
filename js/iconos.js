let mascotaSeleccionada = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarMascotasDesdeAPI();
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
        alert('Por favor, selecciona un icono antes de guardar.');
        return;
    }

    console.log('Icono listo para enviarse a la BD:', mascotaSeleccionada);

    fetch('../backend/guardar_foto_perfil.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foto: mascotaSeleccionada })
    })
    .then(res => res.json())
    .then(data => {
    });

    // Cerrar el modal con Bootstrap
    const modalElement = document.getElementById('perfilprinModalIconos');
    if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.hide();
    }
}