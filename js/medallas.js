console.log("Medallas JS cargado (Sesión en BD)");

const informacionMedallas = {
    1: { nombre: "CALLY", descripcion: "Guardiana del Abecedario", imagen: "medalla_abecedario.png" },
    2: { nombre: "XOLO", descripcion: "Guardián de los Saludos", imagen: "medalla_saludos.png" },
    3: { nombre: "YAJ", descripcion: "Guardián del Tiempo", imagen: "medalla_tiempo.png" },
    4: { nombre: "VENI", descripcion: "Guardiana de la Sociedad", imagen: "medalla_sociedad.png" },
    5: { nombre: "AJOTL", descripcion: "Guardián de las Plantas", imagen: "medalla_plantas.png" },
    6: { nombre: "AST", descripcion: "Guardián de Frutas y Verduras", imagen: "medalla_alimentos.png" },
    7: { nombre: "MAMCHA", descripcion: "Guardián de los Animales", imagen: "medalla_animales.png" },
    8: { nombre: "GUAMAY", descripcion: "Guardián de los Colores", imagen: "medalla_colores.png" },
    9: { nombre: "DILO", descripcion: "Guardián de los Números", imagen: "medalla_numeros.png" },
    10: { nombre: "LONI", descripcion: "Guardián del Cuerpo", imagen: "medalla_cuerpo.png" }
};

async function obtenerMedallasUsuario() {
    try {
        const res = await fetch("../php/obtener_medallas.php");
        if (!res.ok) return [];
        const datos = await res.json();
        return datos.status === "success" ? datos.medallas : [];
    } catch (err) {
        console.error("Error al obtener medallas del usuario:", err);
        return [];
    }
}

/**
 * Renderiza la vista previa lateral y el modal dinámicamente con datos de la BD
 */
async function cargarMedallasObtenidas() {
    const contenedorPrevia = document.getElementById("gridMedallasPerfilVistaPrevia") || document.getElementById("gridMedallasVistaPrevia");
    const contenedorModal = document.getElementById("gridMedallasPerfilModal") || document.getElementById("gridMedallasModal");

    // Se consulta desde la BD
    const medallasGanadas = await obtenerMedallasUsuario();

    if (contenedorPrevia) {
        contenedorPrevia.innerHTML = "";

        if (medallasGanadas.length === 0) {
            contenedorPrevia.innerHTML = `
                <p class="text-white-50 fs-6 mb-0 py-2">
                    Aún no has obtenido medallas. ¡Completa los exámenes para desbloquearlas!
                </p>
            `;
        } else {
            medallasGanadas.forEach(idmedalla => {
                const info = informacionMedallas[idmedalla];

                if (info) {
                    contenedorPrevia.innerHTML += `
                        <div class="text-center p-2 rounded-3 bg-white bg-opacity-10" style="min-width: 85px;">
                            <img src="../Recursos/medallas/${info.imagen}" 
                                 alt="${info.nombre}" 
                                 style="width: 50px; height: 50px; object-fit: contain; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.2));">
                            <span class="d-block text-white mt-1 fw-bold" style="font-size: 0.75rem;">
                                ${info.nombre}
                            </span>
                        </div>
                    `;
                }
            });
        }
    }

    if (contenedorModal) {
        contenedorModal.innerHTML = "";

        Object.keys(informacionMedallas).forEach(idmedalla => {
            const info = informacionMedallas[idmedalla];
            const idnumero = parseInt(idmedalla);
            const esobtenida = medallasGanadas.includes(idnumero);

            const filtroimagen = esobtenida 
                ? 'filter: drop-shadow(0px 3px 5px rgba(0,0,0,0.15)); opacity: 1;' 
                : 'filter: grayscale(100%) opacity(0.25);';

            const clasetarjeta = esobtenida
                ? 'bg-white border-2 border-success shadow-sm'
                : 'bg-light border-1 border-light text-muted opacity-75';

            contenedorModal.innerHTML += `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card h-100 p-2 text-center rounded-3 ${clasetarjeta}">
                        <div class="d-flex align-items-center justify-content-center my-2" style="height: 60px;">
                            <img src="../Recursos/medallas/${info.imagen}" 
                                 alt="${info.nombre}" 
                                 class="img-fluid" 
                                 style="max-height: 55px; object-fit: contain; ${filtroimagen}">
                        </div>
                        <div class="card-body p-1">
                            <h6 class="fw-bold mb-1 ${esobtenida ? 'text-dark' : 'text-secondary'}" style="font-size: 0.85rem;">
                                ${info.nombre}
                            </h6>
                            <small style="font-size: 0.7rem; line-height: 1.1; color: ${esobtenida ? '#555' : '#aaa'}; display: block;">
                                ${info.descripcion}
                            </small>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

/**
 * Procesa y registra la medalla en la Base de Datos tras finalizar el examen
 */
async function procesarMedallaLocal(idmision, puntajeobtenido) {
    const relacionmisionmedalla = {
        9: 1, 10: 2, 14: 3, 18: 4, 22: 5, 25: 6, 29: 7, 33: 8, 36: 9, 39: 10
    };
    const idmedalla = relacionmisionmedalla[idmision] || idmision;
    const medalla = informacionMedallas[idmedalla];

    if (puntajeobtenido > 50) {
        try {
            await fetch("../php/guardar_medalla.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idmedalla: idmedalla })
            });
        } catch (error) {
            console.error("Error guardando medalla:", error);
        }

        if (typeof Swal !== "undefined") {
            Swal.fire({
                title: "🎉 ¡MEDALLA DESBLOQUEADA! 🎉",
                html: `
                    <div style="text-align: center;">
                        <img src="../Recursos/medallas/${medalla ? medalla.imagen : ''}" 
                             alt="${medalla ? medalla.nombre : ''}" 
                             style="width: 120px; height: 120px; object-fit: contain; margin: 15px 0;">
                        <h3 style="color: #2e7d32; margin: 5px 0;">${medalla ? medalla.nombre : '¡Felicidades!'}</h3>
                        <p style="color: #555; font-size: 0.95rem;">${medalla ? medalla.descripcion : ''}</p>
                        <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
                        <p style="font-size: 1rem; color: #333;"><b>Puntaje:</b> ${puntajeobtenido}%</p>
                    </div>
                `,
                confirmButtonText: "Continuar",
                confirmButtonColor: "#28a745"
            }).then(() => {
                window.location.href = "progreso.html";
            });
        } else {
            alert(`🎉 ¡Felicidades! Ganaste la medalla: ${medalla ? medalla.nombre : ''}`);
            window.location.href = "progreso.html";
        }
    } else {
        if (typeof Swal !== "undefined") {
            Swal.fire({
                icon: "warning",
                title: "Examen finalizado",
                text: `Obtuviste un ${puntajeobtenido}%. Necesitas más del 50% para conseguir la medalla.`,
                confirmButtonText: "Entendido",
                confirmButtonColor: "#dc3545"
            });
        } else {
            alert(`Obtuviste un ${puntajeobtenido}%. Requieres más del 50% para ganar esta medalla.`);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarMedallasObtenidas();
});

function abrirModalMedallas() {
    const modal = document.getElementById("modalMedallasPerfilCustom");
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; 
    }
}

function cerrarModalMedallas() {
    const modal = document.getElementById("modalMedallasPerfilCustom");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

window.addEventListener("click", function (event) {
    const modal = document.getElementById("modalMedallasPerfilCustom");
    if (event.target === modal) {
        cerrarModalMedallas();
    }
});