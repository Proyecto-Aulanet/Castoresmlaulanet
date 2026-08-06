<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


try {

    // =====================================================
    // COMPROBAR CATEGORÍA
    // =====================================================

    if (
        !isset($_GET["categoria"]) ||
        !is_numeric($_GET["categoria"])
    ) {

        echo json_encode([
            "status" => "error",
            "message" => "No se recibió una categoría válida."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }


    $categoria = (int) $_GET["categoria"];


    // =====================================================
    // CATEGORÍA → MISIONES
    // =====================================================

    $categorias = [

        1 => [3, 4, 5],        // Abecedario

        2 => [6, 7, 8],        // Saludos

        3 => [11, 12, 13],     // Tiempo

        4 => [15, 16, 17],     // Sociedad

        5 => [19, 20, 21],     // Plantas

        6 => [23, 24],         // Alimentos

        7 => [26, 27, 28],     // Animales

        8 => [30, 31, 32],     // Colores

        9 => [34, 35],         // Números

        10 => [37, 38]         // Partes del cuerpo

    ];


    // =====================================================
    // COMPROBAR CATEGORÍA
    // =====================================================

    if (!isset($categorias[$categoria])) {

        echo json_encode([
            "status" => "error",
            "message" => "La categoría no existe."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }


    $misiones = $categorias[$categoria];


    // =====================================================
    // CREAR PLACEHOLDERS
    // =====================================================

    $placeholders = [];

    foreach ($misiones as $i => $mision) {

        $placeholders[] = ":mision" . $i;

    }


    $listaMisiones =
        implode(",", $placeholders);


    // =====================================================
    // OBTENER 5 PREGUNTAS ALEATORIAS
    // DE TODAS LAS MISIONES DE LA CATEGORÍA
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

        WHERE idmision IN ($listaMisiones)

        ORDER BY RAND()

        LIMIT 5

    ";


    $stmt = $pdo->prepare($sql);


    foreach ($misiones as $i => $mision) {

        $stmt->bindValue(
            ":mision" . $i,
            $mision,
            PDO::PARAM_INT
        );

    }


    $stmt->execute();


    $preguntas =
        $stmt->fetchAll(PDO::FETCH_ASSOC);


    // =====================================================
    // COMPROBAR PREGUNTAS
    // =====================================================

    if (!$preguntas) {

        echo json_encode([
            "status" => "error",
            "message" => "No existen preguntas para esta categoría."
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


        $stmtOpciones =
            $pdo->prepare($sqlOpciones);


        $stmtOpciones->bindValue(
            ":idpregunta",
            $pregunta["idpregunta"],
            PDO::PARAM_INT
        );


        $stmtOpciones->execute();


        $pregunta["opciones"] =
            $stmtOpciones->fetchAll(PDO::FETCH_ASSOC);

    }


    unset($pregunta);


    // =====================================================
    // RESPUESTA FINAL
    // =====================================================

    echo json_encode([

        "status" => "success",

        "categoria" => $categoria,

        "misiones_origen" => $misiones,

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