<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


try {

    // =====================================================
    // COMPROBAR ID DE MISIÓN
    // =====================================================

    if (
        !isset($_GET["idmision"]) ||
        !is_numeric($_GET["idmision"])
    ) {

        echo json_encode([
            "status" => "error",
            "message" => "No se recibió una misión válida."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }


    $idmision = (int) $_GET["idmision"];


    // =====================================================
    // OBTENER 10 PREGUNTAS ALEATORIAS
    // =====================================================

    $sql = "

        SELECT
            idpregunta,
            idexamen,
            idmision,
            texto_esp,
            texto_nah,
            puntaje

        FROM pregunta

        WHERE idmision = :idmision

        ORDER BY RAND()

        LIMIT 10

    ";


    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(
        ":idmision",
        $idmision,
        PDO::PARAM_INT
    );

    $stmt->execute();


    $preguntas = $stmt->fetchAll(PDO::FETCH_ASSOC);


    // =====================================================
    // COMPROBAR QUE EXISTAN PREGUNTAS
    // =====================================================

    if (!$preguntas) {

        echo json_encode([
            "status" => "error",
            "message" => "No existen preguntas para esta misión."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }


    // =====================================================
    // OBTENER OPCIONES DE CADA PREGUNTA
    // =====================================================

    foreach ($preguntas as &$pregunta) {


        $sqlOpciones = "

            SELECT
                idopcion,
                texto_esp,
                texto_nah,
                idpregunta,
                correcto

            FROM opcion

            WHERE idpregunta = :idpregunta

            ORDER BY RAND()

        ";


        $stmtOpciones = $pdo->prepare($sqlOpciones);


        $stmtOpciones->bindValue(
            ":idpregunta",
            $pregunta["idpregunta"],
            PDO::PARAM_INT
        );


        $stmtOpciones->execute();


        $opciones =
            $stmtOpciones->fetchAll(PDO::FETCH_ASSOC);


        // Agregar las opciones dentro de la pregunta

        $pregunta["opciones"] = $opciones;

    }


    unset($pregunta);


    // =====================================================
    // RESPUESTA FINAL
    // =====================================================

    echo json_encode([

        "status" => "success",

        "idmision" => $idmision,

        "total" => count($preguntas),

        "preguntas" => $preguntas

    ], JSON_UNESCAPED_UNICODE);


} catch (PDOException $e) {


    echo json_encode([

        "status" => "error",

        "message" => "Error de base de datos.",
        
        "error" => $e->getMessage()

    ], JSON_UNESCAPED_UNICODE);

}
?>