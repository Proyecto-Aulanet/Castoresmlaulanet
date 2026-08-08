<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


if(!isset($_SESSION["idusuario"])){

    echo json_encode([
        "status"=>"error",
        "message"=>"No hay sesión activa"
    ]);

    exit;

}


$idusuario = $_SESSION["idusuario"];


try{


$stmt = $pdo->prepare("

SELECT

u.idusuario,
u.nombre,
u.apellidop,
u.apellidom,
u.username,
u.email,
u.fechaNac,

fp.ruta_imagen

FROM usuario u

LEFT JOIN FotoPerfil fp

ON u.idusuario = fp.idusuario
AND fp.activa = TRUE

WHERE u.idusuario = :idusuario

");


$stmt->execute([

"idusuario"=>$idusuario

]);


$usuario=$stmt->fetch(PDO::FETCH_ASSOC);



echo json_encode([

"status"=>"success",

"usuario"=>$usuario

]);



}catch(Exception $e){


echo json_encode([

"status"=>"error",

"message"=>"Error al consultar perfil"

]);


}

?>