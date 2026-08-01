<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

if(!isset($_SESSION["idusuario"])){

    echo json_encode([
        "status"=>"error",
        "message"=>"No hay sesión activa"
    ]);

    exit;
}

$idusuario = $_SESSION["idusuario"];

try{

    // ===============================
    // DATOS DEL USUARIO
    // ===============================

    $sql = $pdo->prepare("
        SELECT
            u.nombre,
            u.apellidop,
            u.apellidom,
            fp.ruta_imagen

        FROM Usuario u

        LEFT JOIN FotoPerfil fp
            ON fp.idusuario=u.idusuario
            AND fp.activa=1

        WHERE u.idusuario=?
    ");

    $sql->execute([$idusuario]);

    $usuario = $sql->fetch(PDO::FETCH_ASSOC);



    // ===============================
    // XP TOTAL
    // ===============================

    $sql = $pdo->prepare("
        SELECT COALESCE(SUM(puntos),0) AS xp
        FROM Puntaje
        WHERE idusuario=?
    ");

    $sql->execute([$idusuario]);

    $xp = $sql->fetch(PDO::FETCH_ASSOC)["xp"];



    // ===============================
    // MEDALLAS
    // ===============================

    $sql = $pdo->prepare("
        SELECT COUNT(*) total
        FROM Usuario_Medalla
        WHERE idusuario=?
    ");

    $sql->execute([$idusuario]);

    $medallas = $sql->fetch(PDO::FETCH_ASSOC)["total"];



    $sql = $pdo->query("
        SELECT COUNT(*) total
        FROM Medalla
    ");

    $totalMedallas = $sql->fetch(PDO::FETCH_ASSOC)["total"];



    // ===============================
    // EXÁMENES
    // ===============================

    $sql = $pdo->prepare("
        SELECT COUNT(DISTINCT idexamen) total
        FROM Puntaje
        WHERE idusuario=?
    ");

    $sql->execute([$idusuario]);

    $examenes = $sql->fetch(PDO::FETCH_ASSOC)["total"];



    $sql = $pdo->query("
        SELECT COUNT(*) total
        FROM Examen
    ");

    $totalExamenes = $sql->fetch(PDO::FETCH_ASSOC)["total"];



    // ===============================
    // NIVEL
    // ===============================

    if($xp<500){

        $nivel="Castor Principiante";

    }elseif($xp<1500){

        $nivel="Castor Aprendiz";

    }elseif($xp<3000){

        $nivel="Castor Avanzado";

    }else{

        $nivel="Castor Experto";

    }



    echo json_encode([

        "status"=>"success",

        "usuario"=>[

            "nombre"=>$usuario["nombre"]." ".$usuario["apellidop"],

            "foto"=>$usuario["ruta_imagen"],

            "xp"=>$xp,

            "nivel"=>$nivel,

            "medallas"=>$medallas,

            "totalMedallas"=>$totalMedallas,

            "examenes"=>$examenes,

            "totalExamenes"=>$totalExamenes

        ]

    ]);

}catch(Exception $e){

    echo json_encode([
        "status"=>"error",
        "message"=>$e->getMessage()
    ]);

}