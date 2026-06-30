<?php

session_start();

require_once "conexion.php";

if($_SERVER["REQUEST_METHOD"]!=="POST"){

http_response_code(405);

echo json_encode([
"status"=>"error"
]);

exit;

}

$json=file_get_contents("php://input");

$data=json_decode($json,true);

$email=
trim(
$data["email"] ?? ""
);

$password=
trim(
$data["password"] ?? ""
);

if(
empty($email)
||
empty($password)
){

echo json_encode([

"status"=>"error",

"message"=>
"Completa todos los campos"

]);

exit;

}

try{

$stmt=$pdo->prepare("

SELECT

idusuario,
nombre,
apellidop,
apellidom,
username,
password

FROM Usuario

WHERE email=:email

LIMIT 1

");

$stmt->execute([

"email"=>$email

]);

$usuario=
$stmt->fetch();

if(!$usuario){

echo json_encode([

"status"=>"error",

"message"=>
"Usuario no encontrado"

]);

exit;

}

if(
$password
===
$usuario["password"]
){

$_SESSION[
"idusuario"
]
=
$usuario[
"idusuario"
];

$_SESSION[
"nombre_completo"
]
=
$usuario["nombre"]

." "

.$usuario["apellidop"]

." "

.$usuario["apellidom"];

echo json_encode([

"status"=>"success",

"redirect"=>
"/pages_int/inicio.html"

]);

}else{

echo json_encode([

"status"=>"error",

"message"=>
"Contraseña incorrecta"

]);

}

}catch(Exception $e){

echo json_encode([

"status"=>"error",

"message"=>
"Error interno"

]);

}