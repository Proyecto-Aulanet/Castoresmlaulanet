<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Método no permitido"
    ]);
    exit;
}

$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Datos JSON no válidos o vacíos."
    ]);
    exit;
}

$nombre    = trim($data["nombre"] ?? "");
$apellidop = trim($data["apellidop"] ?? "");
$apellidom = trim($data["apellidom"] ?? "");
$username  = trim($data["username"] ?? "");
$email     = trim($data["email"] ?? "");
$password  = trim($data["password"] ?? "");
$fechaNac  = !empty($data["fechaNac"]) ? $data["fechaNac"] : null;

$idpais   = (isset($data["idpais"]) && is_numeric($data["idpais"]) && (int)$data["idpais"] > 0) ? (int)$data["idpais"] : null;
$idestado = (isset($data["idestado"]) && is_numeric($data["idestado"]) && (int)$data["idestado"] > 0) ? (int)$data["idestado"] : null;

if (empty($nombre) || empty($apellidop) || empty($apellidom) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "Por favor llena todos los campos obligatorios."
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO Usuario (
            nombre, 
            apellidop, 
            apellidom, 
            username, 
            password, 
            email, 
            fechaNac, 
            idpais, 
            idestado
        ) VALUES (
            :nombre, 
            :apellidop, 
            :apellidom, 
            :username, 
            :password, 
            :email, 
            :fechaNac, 
            :idpais, 
            :idestado
        )
    ");

    $stmt->bindValue(':nombre', $nombre);
    $stmt->bindValue(':apellidop', $apellidop);
    $stmt->bindValue(':apellidom', $apellidom);
    $stmt->bindValue(':username', !empty($username) ? $username : null);
    $stmt->bindValue(':password', password_hash($password, PASSWORD_BCRYPT));
    $stmt->bindValue(':email', $email);
    $stmt->bindValue(':fechaNac', $fechaNac);
    $stmt->bindValue(':idpais', $idpais, $idpais ? PDO::PARAM_INT : PDO::PARAM_NULL);
    $stmt->bindValue(':idestado', $idestado, $idestado ? PDO::PARAM_INT : PDO::PARAM_NULL);

    $stmt->execute();

    echo json_encode([
        "status"  => "success",
        "message" => "¡Usuario registrado exitosamente!"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Error MySQL: " . $e->getMessage()
    ]);
}
?>