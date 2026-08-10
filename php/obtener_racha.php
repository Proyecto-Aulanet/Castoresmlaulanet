<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";


if (!isset($_SESSION["idusuario"])) {

    echo json_encode([
        "status" => "error",
        "message" => "No hay sesión activa"
    ]);

    exit;
}


$idusuario =
    $_SESSION["idusuario"];


try {

    $sql = "SELECT fecha
            FROM racha
            WHERE idusuario = ?
            AND dia_completado = 1
            ORDER BY fecha DESC";


    $stmt =
        $pdo->prepare($sql);


    $stmt->execute([
        $idusuario
    ]);


    $fechas =
        $stmt->fetchAll(
            PDO::FETCH_COLUMN
        );


    if (empty($fechas)) {

        echo json_encode([
            "status" => "success",
            "racha" => 0
        ]);

        exit;

    }


    $hoy =
        new DateTime(
            date("Y-m-d")
        );


    $ultimaFecha =
        new DateTime(
            $fechas[0]
        );


    $diferencia =
        $hoy->diff(
            $ultimaFecha
        )->days;


    if ($diferencia > 1) {

        echo json_encode([
            "status" => "success",
            "racha" => 0
        ]);

        exit;

    }


    $racha = 1;


    for (
        $i = 1;
        $i < count($fechas);
        $i++
    ) {

        $fechaAnterior =
            new DateTime(
                $fechas[$i - 1]
            );


        $fechaActual =
            new DateTime(
                $fechas[$i]
            );


        $diferencia =
            $fechaAnterior->diff(
                $fechaActual
            )->days;


        if ($diferencia === 1) {

            $racha++;

        } else {

            break;

        }

    }


    echo json_encode([

        "status" =>
            "success",

        "racha" =>
            $racha

    ]);


} catch (PDOException $e) {

    echo json_encode([

        "status" =>
            "error",

        "message" =>
            "Error al consultar la racha"

    ]);

}

?>