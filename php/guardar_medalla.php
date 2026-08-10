<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


/*
=====================================================
VERIFICAR SESIÓN
=====================================================
*/

if (!isset($_SESSION["idusuario"])) {

    echo json_encode([
        "status" => "error",
        "message" => "No hay una sesión activa."
    ]);

    exit;
}


/*
=====================================================
OBTENER DATOS
=====================================================
*/

$datos = json_decode(
    file_get_contents("php://input"),
    true
);


if (
    !$datos ||
    !isset($datos["idmedalla"])
) {

    echo json_encode([
        "status" => "error",
        "message" => "No se recibió el ID de la medalla."
    ]);

    exit;
}


$idusuario = (int)$_SESSION["idusuario"];

$idmedalla = (int)$datos["idmedalla"];


/*
=====================================================
VALIDAR ID
=====================================================
*/

if ($idusuario <= 0 || $idmedalla <= 0) {

    echo json_encode([
        "status" => "error",
        "message" => "ID de usuario o medalla inválido."
    ]);

    exit;
}


try {


    /*
    =================================================
    VERIFICAR SI YA TIENE LA MEDALLA
    =================================================
    */

    $stmt = $pdo->prepare("
        SELECT idusuario_medalla
        FROM usuario_medalla
        WHERE idusuario = :idusuario
        AND idmedalla = :idmedalla
        LIMIT 1
    ");


    $stmt->execute([

        "idusuario" => $idusuario,

        "idmedalla" => $idmedalla

    ]);


    if ($stmt->fetch()) {

        echo json_encode([

            "status" => "success",

            "message" => "El usuario ya tiene esta medalla.",

            "idmedalla" => $idmedalla

        ]);

        exit;
    }


    /*
    =================================================
    GUARDAR MEDALLA
    =================================================
    */

    $stmt = $pdo->prepare("
        INSERT INTO usuario_medalla
        (
            idusuario,
            idmedalla
        )
        VALUES
        (
            :idusuario,
            :idmedalla
        )
    ");


    $stmt->execute([

        "idusuario" => $idusuario,

        "idmedalla" => $idmedalla

    ]);


    /*
    =================================================
    RESPUESTA
    =================================================
    */

    echo json_encode([

        "status" => "success",

        "message" => "Medalla guardada correctamente.",

        "idusuario" => $idusuario,

        "idmedalla" => $idmedalla

    ]);


} catch (PDOException $e) {


    http_response_code(500);


    echo json_encode([

        "status" => "error",

        "message" => "Error MySQL: " . $e->getMessage()

    ]);

}

?>