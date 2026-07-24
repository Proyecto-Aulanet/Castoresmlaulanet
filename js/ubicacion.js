document.addEventListener("DOMContentLoaded", () => {
    const selectPais = document.getElementById("pais") || document.querySelector("select[name*='pais']");
    const selectEstado = document.getElementById("estado") || document.querySelector("select[name*='estado']");

    if (!selectPais || !selectEstado) return;

    // 1. Cargar la lista de países desde tu API PHP
    async function cargarPaises() {
        try {
            const respuesta = await fetch("/Castoresmlaulanet/php/get_ubicaciones.php?accion=paises");
            const resultado = await respuesta.json();

            selectPais.innerHTML = '<option value="">Selecciona un país</option>';
            
            if (resultado.status === "success" && Array.isArray(resultado.data)) {
                resultado.data.forEach(pais => {
                    const option = document.createElement("option");
                    option.value = pais.nombre; // Guardamos el nombre (ej. "México") para compararlo fácil abajo
                    option.textContent = pais.nombre; 
                    selectPais.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Error al cargar los países:", error);
        }
    }

    // 2. Cargar los estados directamente desde el archivo JSON local
    async function cargarEstados(paisSeleccionado) {
        selectEstado.innerHTML = '<option value="">Cargando estados...</option>';

        if (!paisSeleccionado) {
            selectEstado.innerHTML = '<option value="">Selecciona</option>';
            return;
        }

        // Verificamos si el país seleccionado es México
        if (paisSeleccionado.toLowerCase() === "méxico" || paisSeleccionado.toLowerCase() === "mexico") {
            try {
                // Ruta hacia tu archivo JSON de estados
                const respuesta = await fetch("../json/estados_mexico.json");
                const estados = await respuesta.json();

                selectEstado.innerHTML = '<option value="">Selecciona</option>';

                estados.forEach(estado => {
                    const option = document.createElement("option");
                    option.value = estado; // Si el JSON es una lista de strings o un objeto
                    option.textContent = estado;
                    selectEstado.appendChild(option);
                });
            } catch (error) {
                console.error("Error al cargar estados_mexico.json:", error);
                selectEstado.innerHTML = '<option value="">Error al cargar estados</option>';
            }
        } else {
            selectEstado.innerHTML = '<option value="">No hay estados disponibles</option>';
        }
    }

    // Evento al cambiar de país en el select
    selectPais.addEventListener("change", (e) => {
        cargarEstados(e.target.value);
    });

    // Cargar los países al iniciar la página
    cargarPaises();
});