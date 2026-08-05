<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "conexion.php";

try {
    $sql = "
        SELECT 
            u.idusuario,
            u.nombre,
            u.username,
            COALESCE(p.nombre, 'Sin país') AS pais_codigo,
            COALESCE(SUM(pu.puntos), 0) AS puntaje
        FROM usuario u
        LEFT JOIN pais p ON u.idpais = p.idpais
        LEFT JOIN Puntaje pu ON u.idusuario = pu.idusuario
        GROUP BY u.idusuario, u.nombre, u.username, p.nombre
        ORDER BY puntaje DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data"   => $data
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => $e->getMessage()
    ]);
}