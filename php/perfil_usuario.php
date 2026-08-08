<?php

session_start();
header("Content-Type: application/json; charset=UTF-8");
require_once "conexion.php";

if (!isset($_SESSION["idusuario"])) {

    echo json_encode([
        "status" => "error",
        "message" => "No hay sesión activa"
    ]);

    exit;
}

$idusuario = $_SESSION["idusuario"];

$sql = "SELECT

u.idusuario,
u.nombre,

(
SELECT ruta_imagen
FROM FotoPerfil
WHERE idusuario = u.idusuario
AND activa = 1
LIMIT 1
) AS foto,

IFNULL((
SELECT SUM(puntos)
FROM Puntaje
WHERE idusuario = u.idusuario
),0) AS xp

FROM usuario u

WHERE u.idusuario = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$idusuario]);

$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

if(!$usuario){

    echo json_encode([
        "status"=>"error"
    ]);

    exit;
}

$rutaFoto="";

if(!empty($usuario["foto"])){

    $rutaFoto="/Castoresmlaulanet/".str_replace("../","",$usuario["foto"]);

}

echo json_encode([

"status"=>"success",

"usuario"=>[

"idusuario"=>$usuario["idusuario"],

"nombre"=>$usuario["nombre"],

"foto"=>$rutaFoto,

"xp"=>$usuario["xp"]

]

]);