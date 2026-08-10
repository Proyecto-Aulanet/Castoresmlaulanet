<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

try {

    // ==========================================
    // VERIFICAR SESIÓN
    // ==========================================

    if (!isset($_SESSION["idusuario"])) {

        echo json_encode([
            "status" => "error",
            "message" => "No hay una sesión activa."
        ]);

        exit;
    }

    $idusuario = (int)$_SESSION["idusuario"];


    // ==========================================
    // RECIBIR DATOS
    // ==========================================

    $datos = json_decode(
        file_get_contents("php://input"),
        true
    );

    $idmision = isset($datos["idmision"])
        ? (int)$datos["idmision"]
        : 0;

    $puntaje = isset($datos["puntaje"])
        ? (int)$datos["puntaje"]
        : 0;


    if ($idmision <= 0) {

        echo json_encode([
            "status" => "error",
            "message" => "No se recibió una misión válida."
        ]);

        exit;
    }


    // ==========================================
    // BUSCAR ID EXAMEN
    // ==========================================

    $stmt = $pdo->prepare("
        SELECT idexamen
        FROM examen
        WHERE idmision = :idmision
        LIMIT 1
    ");

    $stmt->execute([
        ":idmision" => $idmision
    ]);

    $idexamen = $stmt->fetchColumn();


    if (!$idexamen) {

        echo json_encode([
            "status" => "error",
            "message" => "No existe un examen asociado a esta misión.",
            "idmision" => $idmision
        ]);

        exit;
    }


    // ==========================================
    // REGISTRAR INTENTO
    // ==========================================

    $stmt = $pdo->prepare("
        INSERT INTO intentoexamen
        (
            idusuario,
            idexamen,
            hora_inicio,
            hora_fin,
            puntaje
        )
        VALUES
        (
            :idusuario,
            :idexamen,
            NOW(),
            NOW(),
            :puntaje
        )
    ");

    $stmt->execute([
        ":idusuario" => $idusuario,
        ":idexamen" => (int)$idexamen,
        ":puntaje" => $puntaje
    ]);


    // ==========================================
    // RESPUESTA
    // ==========================================

    echo json_encode([
        "status" => "success",
        "message" => "Examen registrado correctamente.",
        "idusuario" => $idusuario,
        "idexamen" => (int)$idexamen,
        "idmision" => $idmision,
        "puntaje" => $puntaje
    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "status" => "error",
        "message" => "Error MySQL: " . $e->getMessage()
    ]);

}

?>