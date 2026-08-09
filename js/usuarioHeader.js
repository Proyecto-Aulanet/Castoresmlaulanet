document.addEventListener("DOMContentLoaded", function () {

    console.log("🔄 usuarioHeader.js cargado");

    // ================================
    // OBTENER INFORMACIÓN DEL USUARIO
    // ================================

    fetch("/Castoresmlaulanet/php/sesion_usuario.php", {
        method: "GET",
        credentials: "include",
        cache: "no-store"
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("Error HTTP: " + response.status);
            }

            return response.json();
        })
        .then(data => {

            console.log("👤 Datos de sesión:", data);

            if (data.status !== "success" || !data.usuario) {

                console.warn("⚠️ No hay sesión activa");

                const nombreHeader =
                    document.getElementById("nombreUsuario");

                const nombreBienvenida =
                    document.getElementById("nombreUsuarioBienvenida");

                if (nombreHeader) {
                    nombreHeader.textContent = "Invitado";
                }

                if (nombreBienvenida) {
                    nombreBienvenida.textContent = "Invitado";
                }

                return;
            }

            const usuario = data.usuario;

            // ================================
            // NOMBRE DEL USUARIO
            // ================================

            const nombre =
                usuario.nombre?.trim() || "Usuario";

            const nombreHeader =
                document.getElementById("nombreUsuario");

            const nombreBienvenida =
                document.getElementById("nombreUsuarioBienvenida");

            if (nombreHeader) {
                nombreHeader.textContent = nombre;
            }

            if (nombreBienvenida) {
                nombreBienvenida.textContent = nombre;
            }

            // ================================
            // GUARDAR ID
            // ================================

            if (usuario.idusuario) {

                localStorage.setItem(
                    "idusuario",
                    usuario.idusuario
                );

            }

        })
        .catch(error => {

            console.error(
                "❌ Error al obtener el usuario:",
                error
            );

            const nombreBienvenida =
                document.getElementById("nombreUsuarioBienvenida");

            if (nombreBienvenida) {
                nombreBienvenida.textContent = "Usuario";
            }

        });


    // ================================
    // OBTENER FOTO DEL USUARIO
    // ================================

    fetch("/Castoresmlaulanet/php/foto_usuario.php", {
        method: "GET",
        credentials: "include",
        cache: "no-store"
    })
        .then(response => response.json())
        .then(data => {

            if (data.status !== "success") return;

            const foto =
                document.getElementById("fotoUsuario");

            const icono =
                document.getElementById("iconoUsuario");

            if (foto && data.foto) {

                let rutaFoto = data.foto;

                rutaFoto =
                    rutaFoto.replace(/^(\.\.\/)+/, "");

                if (!rutaFoto.startsWith("/Castoresmlaulanet/")) {

                    rutaFoto =
                        "/Castoresmlaulanet/" + rutaFoto;

                }

                console.log(
                    "📷 Ruta final:",
                    rutaFoto
                );

                foto.src = rutaFoto;

                foto.style.display = "block";

                if (icono) {
                    icono.style.display = "none";
                }

            }

        })
        .catch(error =>
            console.error(
                "❌ Error al obtener la foto:",
                error
            )
        );


    // ================================
    // OBTENER RACHA
    // ================================

    function cargarRacha() {

        fetch(
            "/Castoresmlaulanet/php/obtener_racha.php",
            {
                credentials: "include",
                cache: "no-store"
            }
        )
            .then(response => response.json())
            .then(data => {

                if (data.status !== "success") return;

                const streakDisplay =
                    document.getElementById("streak-display");

                if (streakDisplay) {

                    streakDisplay.textContent =
                        data.racha || 0;

                }

            })
            .catch(error =>
                console.error(
                    "❌ Error al obtener la racha:",
                    error
                )
            );
    }

    cargarRacha();

});