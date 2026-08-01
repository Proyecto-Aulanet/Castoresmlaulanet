<?php

session_start();
header("Content-Type: application/json; charset=UTF-8");
require_once "conexion.php";

if (!isset($_SESSION["idusuario"])) {

    echo json_encode([
        "status" => "error"
    ]);

    exit;
}

$sql = "SELECT ruta_imagen
        FROM FotoPerfil
        WHERE idusuario = ?
        AND activa = 1
        LIMIT 1";

$stmt = $pdo->prepare($sql);
$stmt->execute([$_SESSION["idusuario"]]);

$foto = $stmt->fetch(PDO::FETCH_ASSOC);

// Convertir la ruta relativa a absoluta
$ruta = "";

if ($foto && !empty($foto["ruta_imagen"])) {

    // Quita el "../" del inicio
    $ruta = str_replace("../", "", $foto["ruta_imagen"]);

    // Agrega la ruta base del proyecto
    $ruta = "/Castoresmlaulanet/" . $ruta;
}

echo json_encode([
    "status" => "success",
    "foto" => $ruta
]);