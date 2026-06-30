<?php
// api-categorias.php
require_once 'conexion.php'; // Cargamos la conexión que hicimos arriba

try {
    // Consultamos la tabla Categoria de tu script SQL
    $stmt = $pdo->prepare("SELECT idcategoria, nombre_esp, nombre_nah, descripcion_esp FROM Categoria");
    $stmt->execute();
    $resultados = $stmt->fetchAll();

    echo json_encode(["status" => "success", "data" => $resultados], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>