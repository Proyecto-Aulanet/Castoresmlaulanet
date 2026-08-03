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


$idusuario = $_SESSION["idusuario"];


try {

    $sql = "SELECT fecha
            FROM Racha
            WHERE idusuario = ?
            AND dia_completado = 1
            ORDER BY fecha DESC";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([$idusuario]);

    $fechas = $stmt->fetchAll(PDO::FETCH_COLUMN);


    // Si no tiene actividades
    if (count($fechas) === 0) {

        echo json_encode([
            "status" => "success",
            "racha" => 0
        ]);

        exit;
    }


    $hoy = new DateTime();

    $ultimaFecha = new DateTime($fechas[0]);


    // Diferencia entre hoy y la última actividad
    $diferencia = $hoy->diff($ultimaFecha)->days;


    // Si no hizo actividad hoy ni ayer, la racha se perdió
    if ($diferencia > 1) {

        echo json_encode([
            "status" => "success",
            "racha" => 0
        ]);

        exit;
    }


    // Comenzamos la racha
    $racha = 1;


    for ($i = 1; $i < count($fechas); $i++) {

        $fechaAnterior = new DateTime($fechas[$i - 1]);
        $fechaActual = new DateTime($fechas[$i]);


        $diferencia = $fechaAnterior->diff($fechaActual)->days;


        // Si son días consecutivos
        if ($diferencia === 1) {

            $racha++;

        } else {

            break;

        }

    }


    echo json_encode([
        "status" => "success",
        "racha" => $racha
    ]);


} catch (PDOException $e) {

    echo json_encode([
        "status" => "error",
        "message" => "Error al consultar la racha"
    ]);

}