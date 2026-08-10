<?php
session_start();
header('Content-Type: application/json');
require_once "conexion.php"; 

$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['idusuario']) || !isset($datos['idmedalla'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos o sin sesión"]);
    exit;
}

$idusuario = $_SESSION['idusuario'];
$idmedalla = intval($datos['idmedalla']);

$query = "INSERT IGNORE INTO medallas_usuario (idusuario, idmedalla) VALUES (?, ?)";
$stmt = $conexion->prepare($query);
$stmt->bind_param("ii", $idusuario, $idmedalla);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al guardar medalla"]);
}
?>