
<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

try {

    // =========================================
    // VERIFICAR SESIÓN
    // =========================================

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


    // =========================================
    // OBTENER INFORMACIÓN DEL USUARIO
    // =========================================

    $stmt = $pdo->prepare("
        SELECT
            idusuario,
            nombre,
            foto_perfil
        FROM usuario
        WHERE idusuario = :idusuario
        LIMIT 1
    ");

    $stmt->execute([
        ":idusuario" => $idusuario
    ]);

    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);


    if (!$usuario) {

        echo json_encode([
            "status" => "error",
            "message" => "No se encontró el usuario."
        ]);

        exit;
    }


    // =========================================
    // OBTENER XP
    // =========================================

    $xp = 0;

    try {

        $stmtXP = $pdo->prepare("
            SELECT COALESCE(SUM(puntos), 0)
            FROM puntaje
            WHERE idusuario = :idusuario
        ");

        $stmtXP->execute([
            ":idusuario" => $idusuario
        ]);

        $xp = (int)$stmtXP->fetchColumn();

    } catch (PDOException $e) {

        $xp = 0;
    }


    // =========================================
    // OBTENER MEDALLAS
    // =========================================

    $medallas = 0;
    $totalMedallas = 0;

    try {

        $stmtMedallas = $pdo->prepare("
            SELECT COUNT(*)
            FROM usuario_medalla
            WHERE idusuario = :idusuario
        ");

        $stmtMedallas->execute([
            ":idusuario" => $idusuario
        ]);

        $medallas = (int)$stmtMedallas->fetchColumn();


        $stmtTotalMedallas = $pdo->query("
            SELECT COUNT(*)
            FROM medalla
        ");

        $totalMedallas =
            (int)$stmtTotalMedallas->fetchColumn();

    } catch (PDOException $e) {

        $medallas = 0;
        $totalMedallas = 0;
    }


    // =========================================
    // OBTENER EXÁMENES REALIZADOS
    // =========================================

    $examenes = 0;
    $totalExamenes = 0;

    try {

        $stmtExamenes = $pdo->prepare("
            SELECT COUNT(*)
            FROM puntaje
            WHERE idusuario = :idusuario
        ");

        $stmtExamenes->execute([
            ":idusuario" => $idusuario
        ]);

        $examenes =
            (int)$stmtExamenes->fetchColumn();


        $stmtTotalExamenes = $pdo->query("
            SELECT COUNT(*)
            FROM examen
        ");

        $totalExamenes =
            (int)$stmtTotalExamenes->fetchColumn();

    } catch (PDOException $e) {

        $examenes = 0;
        $totalExamenes = 0;
    }


    // =========================================
    // CALCULAR NIVEL
    // =========================================

    $nivel = 1;

    if ($xp >= 100) {

        $nivel =
            floor($xp / 100) + 1;

    }


    // =========================================
    // FOTO DE PERFIL
    // =========================================

    $foto = null;

    if (
        isset($usuario["foto_perfil"]) &&
        !empty($usuario["foto_perfil"])
    ) {

        $foto =
            $usuario["foto_perfil"];

    }


    // =========================================
    // RESPUESTA
    // =========================================

    echo json_encode([

        "status" => "success",

        "usuario" => [

            "idusuario" =>
                (int)$usuario["idusuario"],

            "nombre" =>
                $usuario["nombre"],

            "nivel" =>
                $nivel,

            "xp" =>
                $xp,

            "medallas" =>
                $medallas,

            "totalMedallas" =>
                $totalMedallas,

            "examenes" =>
                $examenes,

            "totalExamenes" =>
                $totalExamenes,

            "foto" =>
                $foto

        ]

    ], JSON_UNESCAPED_UNICODE);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "status" => "error",

        "message" =>
            "Error MySQL: " .
            $e->getMessage()

    ]);

}
?>

