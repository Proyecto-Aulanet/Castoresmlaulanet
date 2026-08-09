
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

    $stmt = $pdo->prepare("
        SELECT
            idusuario,
            nombre,
            apellidop,
            apellidom,
            username,
            email,
            fechaNac,
            foto_perfil
        FROM usuario
        WHERE idusuario = :idusuario
        LIMIT 1
    ");

    $stmt->execute([
        "idusuario" => $idusuario
    ]);

    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {

        echo json_encode([
            "status" => "error",
            "message" => "Usuario no encontrado"
        ]);

        exit;
    }

    echo json_encode([
        "status" => "success",
        "usuario" => $usuario
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "status" => "error",
        "message" => "Error MySQL: " . $e->getMessage()
    ]);

}
?>

