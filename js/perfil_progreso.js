document.addEventListener("DOMContentLoaded",()=>{

fetch("/Castoresmlaulanet/php/perfil_usuario.php")

.then(response=>response.json())

.then(data=>{

if(data.status!="success") return;

const usuario=data.usuario;

//=========================
// FOTO
//=========================

const foto=document.getElementById("fotoPerfil");

if(foto && usuario.foto!=""){

foto.src=usuario.foto;

}

//=========================
// NOMBRE
//=========================

const nombre=document.getElementById("nombrePerfil");

if(nombre){

nombre.textContent=usuario.nombre;

}

//=========================
// XP
//=========================

const xp=Number(usuario.xp);

const textoXP=document.getElementById("xpUsuario");

if(textoXP){

textoXP.textContent=xp.toLocaleString();

}

})

.catch(error=>console.log(error));

});