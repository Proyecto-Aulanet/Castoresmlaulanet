document.addEventListener("DOMContentLoaded", () => {

    // Obtener el nombre del usuario
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

        })
        .catch(error => console.error("Error al obtener el nombre:", error));

    // Obtener la foto del usuario
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

});