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

try {

    $sql = "INSERT INTO Racha
            (idusuario, fecha, dia_completado)
            VALUES (?, CURDATE(), TRUE)
            ON DUPLICATE KEY UPDATE
            dia_completado = TRUE";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([$idusuario]);

    echo json_encode([
        "status" => "success",
        "message" => "Actividad registrada correctamente"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "status" => "error",
        "message" => "Error al registrar la racha"
    ]);

}

?>