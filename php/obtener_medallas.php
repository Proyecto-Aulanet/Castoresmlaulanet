<?php
session_start();
header('Content-Type: application/json');
require_once "conexion.php"; 
if (!isset($_SESSION['idusuario'])) {
    echo json_encode(["status" => "error", "message" => "Sesión no iniciada", "medallas" => []]);
    exit;
}
$idusuario = $_SESSION['idusuario'];

$query = "SELECT idmedalla FROM medallas_usuario WHERE idusuario = ?";
$stmt = $conexion->prepare($query);
$stmt->bind_param("i", $idusuario);
$stmt->execute();
$resultado = $stmt->get_result();

$medallas = [];
while ($row = $resultado->fetch_assoc()) {
    $medallas[] = (int)$row['idmedalla'];
}

echo json_encode(["status" => "success", "medallas" => $medallas]);
?>