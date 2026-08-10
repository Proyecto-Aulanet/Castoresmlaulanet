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
            "message" => "No hay una sesión activa."
        ]);

        exit;
    }

    $idusuario = (int)$_SESSION["idusuario"];


    // ============================================
    // RECIBIR JSON
    // ============================================

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );


    if (!is_array($input)) {

        echo json_encode([
            "status" => "error",
            "message" => "Los datos recibidos no son válidos."
        ]);

        exit;
    }


    // ============================================
    // RECIBIR MISIÓN Y PUNTAJE
    // ============================================

    $idmision = isset($input["idmision"])
        ? (int)$input["idmision"]
        : 0;

    $puntos = isset($input["puntos"])
        ? (int)$input["puntos"]
        : 0;


    // ============================================
    // VALIDAR MISIÓN
    // ============================================

    if ($idmision <= 0) {

        echo json_encode([
            "status" => "error",
            "message" => "No se recibió una misión válida."
        ]);

        exit;
    }


    // ============================================
    // VALIDAR PUNTAJE
    // ============================================

    if ($puntos < 0 || $puntos > 100) {

        echo json_encode([
            "status" => "error",
            "message" => "El puntaje debe estar entre 0 y 100."
        ]);

        exit;
    }


    // ============================================
    // BUSCAR EXAMEN DE LA MISIÓN
    // ============================================

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


    // ============================================
    // VERIFICAR EXAMEN
    // ============================================

    if (!$idexamen) {

        echo json_encode([
            "status" => "error",
            "message" => "No existe un examen asociado a la misión " . $idmision
        ]);

        exit;
    }


    // ============================================
    // GUARDAR PUNTAJE
    // ============================================

    $stmt = $pdo->prepare("
        INSERT INTO puntaje
        (
            idusuario,
            idexamen,
            puntos,
            fecha
        )
        VALUES
        (
            :idusuario,
            :idexamen,
            :puntos,
            NOW()
        )
    ");

    $stmt->execute([
        ":idusuario" => $idusuario,
        ":idexamen" => (int)$idexamen,
        ":puntos" => $puntos
    ]);


    // ============================================
    // RESPUESTA
    // ============================================

    echo json_encode([
        "status" => "success",
        "message" => "Puntaje registrado correctamente.",
        "idusuario" => $idusuario,
        "idmision" => $idmision,
        "idexamen" => (int)$idexamen,
        "puntos_guardados" => $puntos
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "status" => "error",
        "message" => "Error MySQL: " . $e->getMessage()
    ]);
}

?>