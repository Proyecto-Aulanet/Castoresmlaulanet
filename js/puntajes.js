console.log("Puntajes cargado");


function obtenerPuntajePracticas(misiones){

    let total = 0;


    misiones.forEach(id => {

        let puntos =
        parseInt(
            localStorage.getItem(
                "puntaje_mision_" + id
            )
        ) || 0;


        total += puntos;

    });


    return total;

}