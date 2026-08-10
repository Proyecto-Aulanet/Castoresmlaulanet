<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

try {

    // ============================================
    // VERIFICAR SESIÓN
    // ============================================

    if (
        !isset($_SESSION["idusuario"]) ||
        (int)$_SESSION["idusuario"] <= 0
    ) {

        echo json_encode([
            "status" => "error",
            "message" => "No hay sesión activa."
        ]);

        exit;
    }

    $idusuario = (int)$_SESSION["idusuario"];


    // ============================================
    // OBTENER EXÁMENES REALIZADOS
    // ============================================

    $stmt = $pdo->prepare("
        SELECT
            p.idexamen,
            p.puntos,
            p.fecha,
            e.idmision
        FROM puntaje p
        INNER JOIN examen e
            ON e.idexamen = p.idexamen
        WHERE p.idusuario = :idusuario
        ORDER BY p.fecha DESC
    ");

    $stmt->execute([
        ":idusuario" => $idusuario
    ]);

    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);


    // ============================================
    // RESPUESTA
    // ============================================

    echo json_encode([
        "status" => "success",
        "examenes" => $resultados
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "status" => "error",
        "message" => "Error MySQL: " . $e->getMessage()
    ]);
}

?>