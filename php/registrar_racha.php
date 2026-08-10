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

    // =====================================================
    // REGISTRAR EL DÍA ACTUAL
    // =====================================================

    $sql = "INSERT INTO racha
            (idusuario, fecha, dia_completado)
            VALUES (?, CURDATE(), 1)

            ON DUPLICATE KEY UPDATE
            dia_completado = 1";


    $stmt =
        $pdo->prepare($sql);


    $stmt->execute([
        $idusuario
    ]);


    // =====================================================
    // OBTENER FECHAS
    // =====================================================

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


    // =====================================================
    // CALCULAR RACHA
    // =====================================================

    $racha = 0;


    if (!empty($fechas)) {

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


        if ($diferencia <= 1) {

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

        }

    }


    // =====================================================
    // RESPUESTA
    // =====================================================

    echo json_encode([

        "status" =>
            "success",

        "message" =>
            "Racha registrada correctamente",

        "racha" =>
            $racha

    ]);


} catch (PDOException $e) {

    echo json_encode([

        "status" =>
            "error",

        "message" =>
            "Error al registrar la racha",

        "error" =>
            $e->getMessage()

    ]);

}

?>