document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que recargue la página

            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            // Recopilar los datos usando los IDs de tu HTML
            const datosRegistro = {
                nombre: document.getElementById('nombre').value.trim(),
                apellidop: document.getElementById('apellidop').value.trim(),
                apellidom: document.getElementById('apellidom').value.trim(),
                username: document.getElementById('username').value.trim(),
                email: document.getElementById('email').value.trim(),
                password: password,
                fechaNac: document.getElementById('fechaNac').value || null,
                idpais: document.getElementById('pais') ? document.getElementById('pais').value : null,
                idestado: document.getElementById('estado') ? document.getElementById('estado').value : null
            };

            try {
                // Enviar a la API mediante fetch
                const respuesta = await fetch('../php/registro_process.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosRegistro)
                });

                const resultado = await respuesta.json();

                if (resultado.status === 'success') {
                    alert(resultado.message);
                    // Redirigir al login después de registrarse exitosamente
                    window.location.href = '../pages_ext/login.html';
                } else {
                    alert(resultado.message); // Muestra si el correo ya está registrado o falta algo
                }

            } catch (error) {
                console.error('Error en la petición de registro:', error);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }
});