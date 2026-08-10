<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

if (!isset($_SESSION["idusuario"])) {

    echo json_encode([
        "status" => "error",
        "message" => "Sesión no iniciada",
        "medallas" => []
    ]);

    exit;
}

$idusuario = (int)$_SESSION["idusuario"];

try {

    $stmt = $pdo->prepare("
        SELECT idmedalla
        FROM usuario_medalla
        WHERE idusuario = :idusuario
    ");

    $stmt->execute([
        "idusuario" => $idusuario
    ]);

    $medallas = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $medallas = array_map("intval", $medallas);

    echo json_encode([
        "status" => "success",
        "medallas" => $medallas
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "status" => "error",
        "message" => "Error MySQL: " . $e->getMessage(),
        "medallas" => []
    ]);

}

?>