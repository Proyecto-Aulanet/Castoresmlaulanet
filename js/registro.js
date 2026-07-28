document.addEventListener('DOMContentLoaded', () => {
    cargarPaises();

    const selectPais = document.querySelector('#pais');
    if (selectPais) {
        selectPais.addEventListener('change', cambiarPais);
    }

    const form = document.querySelector('#registerForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = document.querySelector('#password').value;
        const confirmPassword = document.querySelector('#confirmPassword')?.value;

        if (confirmPassword && password !== confirmPassword) {
            alert("Las contraseñas no coinciden. Por favor verifica.");
            return;
        }

        const paisVal = document.querySelector('#pais').value;
        const estadoVal = document.querySelector('#estado').value;

        const datosUsuario = {
            nombre: document.querySelector('#nombre').value.trim(),
            apellidop: document.querySelector('#apellidop').value.trim(),
            apellidom: document.querySelector('#apellidom').value.trim(),
            fechaNac: document.querySelector('#fechaNac').value,
            username: document.querySelector('#username').value.trim(),
            idpais: paisVal && !isNaN(paisVal) ? parseInt(paisVal, 10) : null,
            idestado: estadoVal && !isNaN(estadoVal) ? parseInt(estadoVal, 10) : null,
            email: document.querySelector('#email').value.trim(),
            password: password
        };

        try {
            const respuesta = await fetch('../php/registro_process.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosUsuario)
            });

            const resultado = await respuesta.json();

            if (resultado.status === 'success') {
                alert(resultado.message);
                window.location.href = 'login.html';
            } else {
                alert("Atención: " + resultado.message);
            }

        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("Ocurrió un error al intentar registrar el usuario.");
        }
    });
});

async function cargarPaises() {
    const selectPais = document.querySelector('#pais');
    if (!selectPais) return;

    try {
        const res = await fetch('../php/get_ubicaciones.php?accion=paises');
        const resultado = await res.json();

        if (resultado.status === 'success' && Array.isArray(resultado.data)) {
            selectPais.innerHTML = '<option value="">Selecciona un país</option>';
            resultado.data.forEach(pais => {
                const opt = document.createElement('option');
                opt.value = pais.idpais; // ID numérico obligatorio
                opt.textContent = pais.nombre;
                selectPais.appendChild(opt);
            });
        }
    } catch (e) {
        console.error("Error cargando países:", e);
    }
}

async function cambiarPais() {
    const selectPais = document.querySelector('#pais');
    const selectEstado = document.querySelector('#estado');
    if (!selectPais || !selectEstado) return;

    const idpais = selectPais.value;
    selectEstado.innerHTML = '<option value="">Selecciona un estado</option>';

    if (!idpais) return;

    try {
        const res = await fetch(`../php/get_ubicaciones.php?accion=estados&idpais=${idpais}`);
        const resultado = await res.json();

        if (resultado.status === 'success' && Array.isArray(resultado.data)) {
            resultado.data.forEach(estado => {
                const opt = document.createElement('option');
                opt.value = estado.idestado; // ID numérico obligatorio
                opt.textContent = estado.nombre;
                selectEstado.appendChild(opt);
            });
        }
    } catch (e) {
        console.error("Error cargando estados:", e);
    }
}