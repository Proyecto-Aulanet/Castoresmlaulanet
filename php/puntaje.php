<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Validar que exista la sesión
if (!isset($_SESSION["idusuario"])) {
    echo json_encode([
        "status" => "error",
        "message" => "No hay una sesión activa de usuario"
    ]);
    exit;
}

$idusuario = $_SESSION["idusuario"];

$host = "localhost";
$db   = "nahui";
$user = "root";
$pass = "bruno";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $pass
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "No se pudo conectar a la base de datos: " . $e->getMessage()
    ]);
    exit;
}

try {
    // Suma todos los puntos obtenidos por el usuario en la tabla Puntaje
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(puntos), 0) AS puntos_totales 
        FROM Puntaje 
        WHERE idusuario = :idusuario
    ");
    $stmt->execute([":idusuario" => $idusuario]);
    $resultado = $stmt->fetch();

    echo json_encode([
        "status" => "success",
        "puntos_totales" => (int)$resultado['puntos_totales']
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error al consultar los puntos: " . $e->getMessage()
    ]);
}
?>