document.addEventListener('DOMContentLoaded', () => {
    cargarRanking();

    const btnVerMas = document.querySelector('.ranking-card .btn, [data-bs-target="#modalRanking"]');
    if (btnVerMas) {
        btnVerMas.addEventListener('click', cargarRankingModal);
    }
    
    const modalRanking = document.getElementById('modalRanking');
    if (modalRanking) {
        modalRanking.addEventListener('show.bs.modal', cargarRankingModal);
    }
});

const mapaBanderas = {
    "AFGANISTÁN": "🇦🇫", "ALBANIA": "🇦🇱", "ALEMANIA": "🇩🇪", "ANDORRA": "🇦🇩", "ANGOLA": "🇦🇴",
    "ANTIGUA Y BARBUDA": "🇦🇬", "ARABIA SAUDITA": "🇸🇦", "ARGELIA": "🇩🇿", "ARGENTINA": "🇦🇷", "AUSTRALIA": "🇦🇺",
    "AUSTRIA": "🇦🇹", "AZERBAIJAN": "🇦🇿", "BAHREIN": "🇧🇭", "BANGLADESH": "🇧🇩", "BELICE": "🇧🇿",
    "BOLIVIA": "🇧🇴", "BOSNIA Y HERZEGOVINA": "🇧🇦", "BRASIL": "🇧🇷", "BULGARIA": "🇧🇬", "BÉLGICA": "🇧🇪",
    "CABO VERDE": "🇨🇻", "CAMERÚN": "🇨🇲", "CANADÁ": "🇨🇦", "CHEQUIA": "🇨🇿", "CHILE": "🇨🇱",
    "CHINA": "🇨🇳", "CHIPRE": "🇨🇾", "COLOMBIA": "🇨🇴", "CONGO": "🇨🇬", "COREA DEL NORTE": "🇰🇵",
    "COREA DEL SUR": "🇰🇷", "COSTA RICA": "🇨🇷", "CROACIA": "🇭🇷", "CUBA": "🇨🇺", "DINAMARCA": "🇩🇰",
    "DOMINICA": "🇩🇲", "ECUADOR": "🇪🇨", "EGIPTO": "🇪🇬", "EL SALVADOR": "🇸🇻", "EMIRATOS ÁRABES UNIDOS": "🇦🇪",
    "ESLOVAQUIA": "🇸🇰", "ESLOVENIA": "🇸🇮", "ESPAÑA": "🇪🇸", "ESTADOS UNIDOS": "🇺🇸", "ESTONIA": "🇪🇪",
    "ETIOPÍA": "🇪🇹", "FEDERACIÓN DE RUSIA": "🇷🇺", "FILIPINAS": "🇵🇭", "FINLANDIA": "🇫🇮", "FRANCIA": "🇫🇷",
    "GEORGIA": "🇬🇪", "GHANA": "🇬🇭", "GRECIA": "🇬🇷", "GUATEMALA": "🇬🇹", "GUINEA": "🇬🇳",
    "HAITÍ": "🇭🇹", "HONDURAS": "🇭🇳", "HUNGRÍA": "🇭🇺", "INGLATERRA": "🏴󠁧󠁢", "INDIA": "🇮🇳",
    "INDONESIA": "🇮🇩", "IRAQ": "🇮🇶", "IRLANDA": "🇮🇪", "IRÁN": "🇮🇷", "ISRAEL": "🇮🇱",
    "ITALIA": "🇮🇹", "JAMAICA": "🇯🇲", "JAPÓN": "🇯🇵", "JORDANIA": "🇯🇴", "KENYA": "🇰🇪",
    "LETONIA": "🇱🇻", "LIBIA": "🇱🇾", "LITUANIA": "🇱🇹", "LUXEMBURGO": "🇱🇺", "LÍBANO": "🇱🇧",
    "MACEDONIA DEL NORTE": "🇲🇰", "MADAGASCAR": "🇲🇬", "MALASIA": "🇲🇾", "MARRUECOS": "🇲🇦", "MONGOLIA": "🇲🇳",
    "MOZAMBIQUE": "🇲🇿", "MÉXICO": "🇲🇽", "MEXICO": "🇲🇽", "MÓNACO": "🇲🇨", "NICARAGUA": "🇳🇮",
    "NIGERIA": "🇳🇬", "NORUEGA": "🇳🇴", "NUEVA ZELANDA": "🇳🇿", "PAKISTÁN": "🇵🇰", "PANAMÁ": "🇵🇦",
    "PARAGUAY": "🇵🇾", "PAÍSES BAJOS": "🇳🇱", "PERÚ": "🇵🇪", "POLONIA": "🇵🇱", "PORTUGAL": "🇵🇹",
    "QATAR": "🇶🇦", "RUMANIA": "🇷🇴", "SENEGAL": "🇸🇳", "SERBIA": "🇷🇸", "SINGAPUR": "🇸🇬",
    "SOMALIA": "🇸🇴", "SUDÁFRICA": "🇿🇦", "SUDÁN": "🇸🇩", "SUECIA": "🇸🇪", "SUIZA": "🇨🇭",
    "SURINAME": "🇸🇷", "TAILANDIA": "🇹🇭", "TRINIDAD Y TABAGO": "🇹🇹", "TURQUÍA": "🇹🇷", "TÚNEZ": "🇹🇳",
    "UCRANIA": "🇺🇦", "URUGUAY": "🇺🇾", "UZBEKISTÁN": "🇺🇿", "VENEZUELA": "🇻🇪", "VIET NAM": "🇻🇳"
};

function obtenerPaisFormateado(nombrePais) {
    if (!nombrePais || nombrePais === 'Sin país') {
        return 'Méx';
    }

    let limpio = nombrePais.trim().replace(/^[A-Za-z]{2}\s+/i, '');

    let abr = limpio.slice(0, 3);
    abr = abr.charAt(0).toUpperCase() + abr.slice(1).toLowerCase();

    return abr;
}

/// =====================================================
// RANKING PRINCIPAL — SOLO 5 USUARIOS
// =====================================================

async function cargarRanking() {

    const contenedor =
        document.querySelector('#rankingList');

    if (!contenedor) return;

    try {

        const respuesta =
            await fetch('../php/ranking.php');

        const resultado =
            await respuesta.json();

        console.log("📊 Ranking recibido:", resultado);

        if (resultado.status !== 'success') {

            console.error(
                "❌ Error del ranking:",
                resultado.message
            );

            return;
        }

        contenedor.innerHTML = '';

        // SOLO LOS PRIMEROS 5
        const primerosCinco =
            resultado.data.slice(0, 5);

        primerosCinco.forEach(
            (user, index) => {

                const abr =
                    obtenerPaisFormateado(
                        user.pais_codigo
                    );

                const nombreMostrar =
                    user.nombre
                        ? user.nombre.split(' ')[0]
                        : (user.username || 'Usuario');

                const item =
                    document.createElement('div');

                item.className =
                    'ranking-item';

                item.innerHTML = `

                    <span>
                        ${index + 1}. 
                        ${abr} 
                        ${nombreMostrar}
                    </span>

                    <span>
                        ${user.puntaje || 0} XP
                    </span>

                `;

                contenedor.appendChild(item);

            }
        );

    } catch (error) {

        console.error(
            "❌ Error al obtener el ranking:",
            error
        );

    }

}


// =====================================================
// RANKING DEL MODAL — TODOS LOS USUARIOS
// =====================================================

async function cargarRankingModal() {

    const tbody =
        document.getElementById(
            'tbodyRankingMundial'
        );

    if (!tbody) {

        console.error(
            "❌ No existe #tbodyRankingMundial"
        );

        return;
    }

    try {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="text-center">

                    Cargando ranking...

                </td>

            </tr>

        `;

        const respuesta =
            await fetch('../php/ranking.php');

        const resultado =
            await respuesta.json();

        console.log(
            "🏆 Ranking completo:",
            resultado
        );

        if (resultado.status !== 'success') {

            throw new Error(
                resultado.message ||
                'No se pudo obtener el ranking.'
            );

        }

        tbody.innerHTML = '';

        // =================================================
        // IMPORTANTE:
        // AQUÍ NO USAMOS slice(0,5)
        // SE MUESTRAN TODOS
        // =================================================

        resultado.data.forEach(
            (user, index) => {

                const abr =
                    obtenerPaisFormateado(
                        user.pais_codigo
                    );

                const nombreMostrar =
                    user.nombre
                        ? user.nombre.split(' ')[0]
                        : (user.username || 'Usuario');

                const tr =
                    document.createElement('tr');

                tr.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${abr}
                    </td>

                    <td>
                        ${nombreMostrar}
                    </td>

                    <td class="fw-bold">
                        ${user.puntaje || 0} XP
                    </td>

                `;

                tbody.appendChild(tr);

            }
        );


        // =================================================
        // SI NO HAY USUARIOS
        // =================================================

        if (resultado.data.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="text-center text-muted">

                        No hay usuarios en el ranking.

                    </td>

                </tr>

            `;

        }

    } catch (error) {

        console.error(
            "❌ Error cargando ranking completo:",
            error
        );

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="text-center text-danger">

                    Error al conectar con el servidor.

                </td>

            </tr>

        `;

    }

}


// =====================================================
// INICIALIZAR RANKING
// =====================================================

document.addEventListener(
    'DOMContentLoaded',
    function () {

        console.log(
            "🏆 Inicializando ranking..."
        );

        // Cargar los 5 principales
        cargarRanking();


        // =============================================
        // MODAL
        // =============================================

        const modalRanking =
            document.getElementById(
                'modalRanking'
            );

        if (modalRanking) {

            modalRanking.addEventListener(
                'show.bs.modal',
                function () {

                    console.log(
                        "🏆 Abriendo ranking completo..."
                    );

                    cargarRankingModal();

                }
            );

        }

    }
);