async function cargarCategorias(){

const response=

await fetch(

"/api/get_categorias.php",

{

credentials:
"include"

}

);

const data=
await response.json();

console.log(data);

}

cargarCategorias();