<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "conexion.php";

$accion = $_GET['accion'] ?? '';

try {
    if ($accion === 'paises') {
        $stmt = $pdo->query("SELECT idpais, nombre FROM Pais");
        $paises = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            "status" => "success",
            "data" => $paises
        ]);
    } 
    elseif ($accion === 'estados') {
        $idpais = isset($_GET['idpais']) ? intval($_GET['idpais']) : 1;

        $stmt = $pdo->prepare("SELECT idestado, nombre FROM Estado WHERE idpais = ?");
        $stmt->execute([$idpais]);
        $estados = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            "status" => "success",
            "data" => $estados
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Acción no válida."
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error al obtener los datos: " . $e->getMessage()
    ]);
}
?>