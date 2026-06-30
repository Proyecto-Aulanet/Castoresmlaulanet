<?php

session_start();

require_once "conexion.php";

if(
!isset(
$_SESSION[
"idusuario"
]
)
){

http_response_code(401);

echo json_encode([

"status"=>"error",

"message"=>
"No autorizado"

]);

exit;

}

try{

$stmt=
$pdo->prepare("

SELECT

idcategoria,
nombre_esp,
nombre_nah,
descripcion_esp,
imagen

FROM Categoria

");

$stmt->execute();

$datos=
$stmt->fetchAll();

echo json_encode([

"status"=>"success",

"usuario"=>
$_SESSION[
"nombre_completo"
],

"data"=>$datos

]);

}catch(Exception $e){

echo json_encode([

"status"=>"error"

]);

}