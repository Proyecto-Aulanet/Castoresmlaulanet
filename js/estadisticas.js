document.addEventListener('DOMContentLoaded', () => {
    cargarEstadisticas();
});

const coloresDestacados = {
    // Países
    "MÉXICO": "#28a745",          
    "MEXICO": "#28a745",
    "COLOMBIA": "#ffc107",        
    "ESPAÑA": "#dc3545",          
    "ARGENTINA": "#007bff",       
    "ESTADOS UNIDOS": "#6f42c1",  
    "PERÚ": "#fd7e14",           
    "CHILE": "#20c997",           
    "PUEBLA": "#20c997",
    "CIUDAD DE MEXICO": "#dc3545",
    "ESTADO DE MÉXICO": "#6f42c1",
    "VERACRUZ": "#17a2b8",
    "JALISCO": "#ffc107",
    "NUEVO LEÓN": "#007bff",

    "SIN ESPECIFICAR": "#6c757d"  // Gris
};

function obtenerColor(nombre) {
    if (!nombre) return "#6c757d";

    const nombreUpper = nombre.trim().toUpperCase();

    if (coloresDestacados[nombreUpper]) {
        return coloresDestacados[nombreUpper];
    }

    let hash = 0;
    for (let i = 0; i < nombreUpper.length; i++) {
        hash = nombreUpper.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 48%)`;
}

async function cargarEstadisticas() {
    try {
        const respuesta = await fetch('../php/estadisticas.php');
        const resultado = await respuesta.json();

        if (resultado.status === 'success') {
            if (document.getElementById('totalUsuarios')) {
                document.getElementById('totalUsuarios').textContent = resultado.contadores.totalUsuarios;
            }
            if (document.getElementById('totalPaises')) {
                document.getElementById('totalPaises').textContent = resultado.contadores.totalPaises;
            }
            if (document.getElementById('totalMisiones')) {
                document.getElementById('totalMisiones').textContent = resultado.contadores.totalMisiones;
            }

            renderizarGraficaGlobal(resultado.graficas.global);

            renderizarGraficaMexico(resultado.graficas.mexico);
        }
    } catch (error) {
        console.error("Error al cargar las estadísticas:", error);
    }
}

function renderizarGraficaGlobal(datos) {
    const ctx = document.getElementById('globalChart');
    if (!ctx) return;

    if (window.chartGlobal instanceof Chart) {
        window.chartGlobal.destroy();
    }

    const labels = datos.map(item => item.pais || 'Sin especificar');
    const valores = datos.map(item => item.cantidad);
    const colores = labels.map(pais => obtenerColor(pais));

    window.chartGlobal = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: colores,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

function renderizarGraficaMexico(datos) {
    const ctx = document.getElementById('mexicoChart');
    if (!ctx) return;

    if (window.chartMexico instanceof Chart) {
        window.chartMexico.destroy();
    }

    const labels = datos.map(item => item.estado || 'Sin especificar');
    const valores = datos.map(item => item.cantidad);
    const colores = labels.map(estado => obtenerColor(estado));

    window.chartMexico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, 
            datasets: [{
                label: 'Usuarios',
                data: valores,
                backgroundColor: colores,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}