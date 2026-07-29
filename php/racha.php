<?php
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

require_once __DIR__ . '/conexion.php'; 

$metodo = $_SERVER['REQUEST_METHOD'];

try {
    if ($metodo === 'GET') {
        $idusuario = isset($_GET['idusuario']) ? intval($_GET['idusuario']) : 0;

        if ($idusuario <= 0) {
            echo json_encode(["exito" => false, "mensaje" => "ID de usuario inválido."]);
            exit;
        }

        $stmt = $pdo->prepare("
            SELECT COUNT(*) AS total_racha, MAX(fecha) AS ultima_fecha 
            FROM Racha 
            WHERE idusuario = ? AND dia_completado = TRUE
        ");
        $stmt->execute([$idusuario]);
        $row = $stmt->fetch();

        $racha_actual = $row ? intval($row['total_racha']) : 0;
        $ultima_fecha = $row ? $row['ultima_fecha'] : null;

        echo json_encode([
            "exito" => true,
            "racha_actual" => $racha_actual,
            "ultima_fecha" => $ultima_fecha
        ]);
        exit;
    }

    if ($metodo === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);

        $idusuario = isset($data['idusuario']) ? intval($data['idusuario']) : 0;
        $idmision  = isset($data['idmision'])  ? intval($data['idmision'])  : 0;

        if ($idusuario <= 0 || $idmision <= 0) {
            echo json_encode(["exito" => false, "mensaje" => "Datos incompletos."]);
            exit;
        }

        $hoy = date('Y-m-d');

        $stmt = $pdo->prepare("
            INSERT INTO Racha (idusuario, fecha, dia_completado, ultima_fecha) 
            VALUES (?, ?, TRUE, ?)
            ON DUPLICATE KEY UPDATE dia_completado = TRUE, ultima_fecha = VALUES(ultima_fecha)
        ");
        $stmt->execute([$idusuario, $hoy, $hoy]);

        $stmt_prog = $pdo->prepare("
            INSERT INTO lecciones_usuario (idusuario, idmision, completada, fecha_completado) 
            VALUES (?, ?, TRUE, NOW())
        ");
        $stmt_prog->execute([$idusuario, $idmision]);

        $stmt_cant = $pdo->prepare("SELECT COUNT(*) FROM Racha WHERE idusuario = ? AND dia_completado = TRUE");
        $stmt_cant->execute([$idusuario]);
        $nueva_racha = intval($stmt_cant->fetchColumn());

        echo json_encode([
            "exito" => true,
            "mensaje" => "¡Racha y nivel actualizados con éxito!",
            "racha_actual" => $nueva_racha
        ]);
        exit;
    }
} catch (Exception $e) {
    echo json_encode([
        "exito" => false,
        "mensaje" => "Error BD: " . $e->getMessage()
    ]);
    exit;
}

echo json_encode(["exito" => false, "mensaje" => "Método no permitido."]);