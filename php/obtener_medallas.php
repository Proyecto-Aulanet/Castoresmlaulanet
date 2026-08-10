<?php
session_start();
header('Content-Type: application/json');
require_once "conexion.php"; // Tu archivo de conexión a la BD

if (!isset($_SESSION['idusuario'])) {
    echo json_encode(["status" => "error", "message" => "Sesión no iniciada", "medallas" => []]);
    exit;
}

$idusuario = $_SESSION['idusuario'];

// Ajusta el nombre de la tabla y columnas según tu BD
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