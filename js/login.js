async function iniciarSesion(){

const email=
document
.getElementById(
"email"
)
.value;

const password=
document
.getElementById(
"password"
)
.value;

const res=
await fetch(
"/api/login_process.php",
{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:
JSON.stringify({

email,
password

}),

credentials:
"include"

}

);

const datos=
await res.json();

if(
datos.status
===
"success"
){

window.location.href=
datos.redirect;

}
else{

alert(
datos.message
);

}

}