<?php

header("Content-Type: application/json");
session_start();
require_once "conexion.php";

if (!isset($_SESSION["idusuario"])) {
    echo json_encode([
        "status"=>"error",
        "message"=>"No hay sesión."
    ]);
    exit;
}

$idusuario = $_SESSION["idusuario"];

$sql = "

SELECT
e.idexamen,
e.idmision,
m.nombre AS categoria,
p.puntos,
p.fecha

FROM puntaje p

INNER JOIN examen e
ON p.idexamen=e.idexamen

INNER JOIN mision m
ON e.idmision=m.idmision

WHERE p.idusuario=?

ORDER BY e.idmision;

";

$stmt=$conexion->prepare($sql);
$stmt->bind_param("i",$idusuario);
$stmt->execute();

$resultado=$stmt->get_result();

$examenes=[];

while($fila=$resultado->fetch_assoc()){

    $examenes[]=$fila;

}

echo json_encode([
    "status"=>"success",
    "examenes"=>$examenes
]);