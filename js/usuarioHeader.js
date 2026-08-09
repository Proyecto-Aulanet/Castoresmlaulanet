
document.addEventListener("DOMContentLoaded", function() {

    console.log("🔄 usuarioHeader.js cargado");

    // ================================
    // 1. OBTENER NOMBRE DEL USUARIO
    // ================================
    fetch("/Castoresmlaulanet/php/sesion_usuario.php")
        .then(response => response.json())
        .then(data => {

            if (data.status !== "success") return;

            const nombreHeader = document.getElementById("nombreUsuario");
            const nombreBienvenida = document.getElementById("nombreUsuarioBienvenida");

            if (nombreHeader) {
                nombreHeader.textContent = data.usuario.nombre;
            }

            if (nombreBienvenida) {
                nombreBienvenida.textContent = data.usuario.nombre;
            }


            if (data.usuario && data.usuario.idusuario) {
                localStorage.setItem("idusuario", data.usuario.idusuario);
            }
        })
        .catch(error => console.error("Error al obtener el nombre:", error));

    // ================================
    // 2. OBTENER FOTO DEL USUARIO
    // ================================
    fetch("/Castoresmlaulanet/php/foto_usuario.php")
        .then(response => response.json())
        .then(data => {

            if (data.status !== "success") return;

            const foto = document.getElementById("fotoUsuario");
            const icono = document.getElementById("iconoUsuario");

            if (foto && data.foto !== "") {

                foto.src = data.foto;
                foto.style.display = "block";
                if (icono) {
                    icono.style.display = "none";
                }
            }
        })
        .catch(error => console.error("Error al obtener la foto:", error));

    // ================================
    // 3. OBTENER RACHA DEL USUARIO
    // ================================
    function cargarRacha() {
        fetch("/Castoresmlaulanet/php/obtener_racha.php")
            .then(response => response.json())
            .then(data => {
                if (data.status !== "success") return;

                const streakDisplay = document.getElementById("streak-display");
                if (streakDisplay) {
                    streakDisplay.textContent = data.racha || 0;
                }
            })
            .catch(error => console.error("Error al obtener la racha:", error));
    }

    cargarRacha();

});