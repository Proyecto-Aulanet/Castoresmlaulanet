console.log("Medallas JS cargado");


const informacionMedallas = {


1:{
nombre:"CALLY",
descripcion:"Guardiana del Abecedario",
imagen:"medalla_abecedario.png"
},

2:{
nombre:"XOLO",
descripcion:"Guardián de los Saludos",
imagen:"medalla_saludos.png"
},

3:{
nombre:"YAJ",
descripcion:"Guardián del Tiempo",
imagen:"medalla_tiempo.png"
},

4:{
nombre:"VENI",
descripcion:"Guardiana de la Sociedad",
imagen:"medalla_sociedad.png"
},

5:{
nombre:"AJOTL",
descripcion:"Guardián de las Plantas",
imagen:"medalla_plantas.png"
},

6:{
nombre:"AST",
descripcion:"Guardián de Frutas y Verduras",
imagen:"medalla_alimentos.png"
},

7:{
nombre:"MAMCHA",
descripcion:"Guardián de los Animales",
imagen:"medalla_animales.png"
},

8:{
nombre:"GUAMAY",
descripcion:"Guardián de los Colores",
imagen:"medalla_colores.png"
},

9:{
nombre:"DILO",
descripcion:"Guardián de los Números",
imagen:"medalla_numeros.png"
},

10:{
nombre:"LONI",
descripcion:"Guardián del Cuerpo",
imagen:"medalla_cuerpo.png"
}


};



async function cargarMedallasUsuario(){


try{


const sesion =
await fetch("../php/sesion_usuario.php");


const usuario =
await sesion.json();



const idusuario =
usuario.usuario.idusuario;



const respuesta =
await fetch(
`../php/get_lecciones.php?accion=mis_medallas&idusuario=${idusuario}`
);



const datos =
await respuesta.json();



console.log(
"Mis medallas:",
datos
);



mostrarMedallas(datos.data);



}catch(error){

console.error(
"Error cargando medallas",
error
);

}


}





function mostrarMedallas(medallas){


const contenedor =
document.querySelector(".medallas-grid");



if(!contenedor)
return;



contenedor.innerHTML="";



medallas.forEach(m=>{


const info =
informacionMedallas[m.idmedalla];



if(info){


contenedor.innerHTML += `

<div class="medalla-slot">


<img 
src="../Recursos/medallas/${info.imagen}"
class="img-fluid"
width="80">


<h6>
${info.nombre}
</h6>


<small>
${info.descripcion}
</small>


</div>

`;

}


});



}

document.addEventListener(
"DOMContentLoaded",
()=>{

cargarMedallasUsuario();

});

async function guardarResultadoExamen(idExamen, puntajeObtenido) {
    try {
        const sesionRes = await fetch("../php/sesion_usuario.php");
        const usuarioData = await sesionRes.json();
        const idUsuario = usuarioData.usuario.idusuario;

        const respuesta = await fetch("../php/medallas.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idusuario: idUsuario,
                idexamen: idExamen,
                puntaje_obtenido: puntajeObtenido
            })
        });

        const resultado = await respuesta.json();

        if (resultado.status === "success") {
            if (resultado.medalla_otorgada) {
                const medallaGanada = informacionMedallas[resultado.idmedalla];
                
                alert(`¡Felicidades! Ganaste la medalla: ${medallaGanada ? medallaGanada.nombre : ''}\n${resultado.mensaje}`);
            } else {
                alert(resultado.mensaje);
            }
        } else {
            console.error("Error devuelto por la API:", resultado.message);
        }

    } catch (error) {
        console.error("Error al procesar el examen:", error);
    }
}