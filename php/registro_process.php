<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

// 1. Validar que la petición sea POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Método no permitido"
    ]);
    exit;
}

// 2. Leer los datos JSON que manda JavaScript
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// Limpiar y capturar los datos
$nombre = trim($data["nombre"] ?? "");
$apellidop = trim($data["apellidop"] ?? "");
$apellidom = trim($data["apellidom"] ?? "");
$username = trim($data["username"] ?? "");
$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");
$fechaNac = $data["fechaNac"] ?? null;
$idpais = $data["idpais"] ?? null;
$idestado = $data["idestado"] ?? null;

// 3. Validar campos obligatorios según tu estructura NOT NULL
if (empty($nombre) || empty($apellidop) || empty($apellidom) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Por favor llena todos los campos obligatorios."
    ]);
    exit;
}

try {
    // 4. Insertar el nuevo usuario en la base de datos usando tu estructura exacta
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

    $stmt->execute([
        "nombre" => $nombre,
        "apellidop" => $apellidop,
        "apellidom" => $apellidom,
        "username" => !empty($username) ? $username : null,
        "password" => $password, // Nota: si usas hash, aquí iría password_hash()
        "email" => $email,
        "fechaNac" => !empty($fechaNac) ? $fechaNac : null,
        "idpais" => !empty($idpais) ? $idpais : null,
        "idestado" => !empty($idestado) ? $idestado : null
    ]);

    // 5. Responder éxito a JavaScript
    echo json_encode([
        "status" => "success",
        "message" => "¡Usuario registrado correctamente en la base de datos!"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    
    // Validar si el correo o username ya están registrados (error de duplicado en MySQL)
    if ($e->getCode() == 23000) {
        echo json_encode([
            "status" => "error",
            "message" => "El correo electrónico o el nombre de usuario ya están registrados."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Error al registrar en la base de datos."
        ]);
    }
}