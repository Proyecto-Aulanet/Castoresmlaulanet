
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

    $sql = "
        SELECT

            u.idusuario,
            u.nombre,
            u.foto_perfil,

            IFNULL((
                SELECT SUM(puntos)
                FROM puntaje
                WHERE idusuario = u.idusuario
            ), 0) AS xp

        FROM usuario u

        WHERE u.idusuario = ?
    ";


    $stmt = $pdo->prepare($sql);

    $stmt->execute([$idusuario]);


    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);


    if (!$usuario) {

        echo json_encode([
            "status" => "error",
            "message" => "Usuario no encontrado"
        ]);

        exit;
    }


    /*
     * La ruta ya está guardada en usuario.foto_perfil.
     *
     * Si está vacía, dejamos la foto vacía.
     * Si ya comienza con /Castoresmlaulanet/,
     * no agregamos nuevamente la ruta.
     */

    $rutaFoto = "";

    if (!empty($usuario["foto_perfil"])) {

        $foto = $usuario["foto_perfil"];

        if (strpos($foto, "/Castoresmlaulanet/") === 0) {

            $rutaFoto = $foto;

        } else {

            $rutaFoto = "/Castoresmlaulanet/" . ltrim(
                str_replace("../", "", $foto),
                "/"
            );
        }
    }


    echo json_encode([

        "status" => "success",

        "usuario" => [

            "idusuario" => $usuario["idusuario"],

            "nombre" => $usuario["nombre"],

            "foto" => $rutaFoto,

            "xp" => $usuario["xp"]

        ]

    ]);


} catch (PDOException $e) {

    echo json_encode([

        "status" => "error",

        "message" => "Error MySQL: " . $e->getMessage()

    ]);

}

?>

