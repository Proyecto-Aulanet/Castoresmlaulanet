<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "conexion.php";

// Verificar sesión
if (!isset($_SESSION["idusuario"])) {
    if (isset($_GET["idusuario"]) && is_numeric($_GET["idusuario"])) {
        $idusuario = (int)$_GET["idusuario"];
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "No hay sesión activa"
        ]);
        exit;
    }
} else {
    $idusuario = $_SESSION["idusuario"];
}

try {
    // Suma de todos los puntos obtenidos en los exámenes
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(puntos), 0) AS puntaje_total
        FROM Puntaje
        WHERE idusuario = :idusuario
    ");
    $stmt->execute([":idusuario" => $idusuario]);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    $puntajeTotal = (int)$resultado['puntaje_total'];

    echo json_encode([
        "status" => "success",
        "puntaje_total" => $puntajeTotal,
        "idusuario" => $idusuario
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error al obtener el puntaje: " . $e->getMessage()
    ]);
}
?>