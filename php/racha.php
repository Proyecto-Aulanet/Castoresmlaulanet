<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

// Reemplaza esta línea con la ruta real a tu archivo de conexión a la BD
require_once '../php/conexion.php'; 

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $id_usuario = isset($_GET['idusuario']) ? intval($_GET['idusuario']) : 0;

    if ($id_usuario <= 0) {
        echo json_encode(["exito" => false, "mensaje" => "ID de usuario inválido."]);
        exit;
    }

    // Consultar racha del usuario
    $query = "SELECT racha_actual, ultima_fecha FROM racha WHERE id_usuario = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($row = $resultado->fetch_assoc()) {
        $racha_actual = intval($row['racha_actual']);
        $ultima_fecha = $row['ultima_fecha'];
        
        $hoy = date('Y-m-d');
        $ayer = date('Y-m-d', strtotime('-1 day'));

        // Si la última actividad no fue ni hoy ni ayer, la racha expiró y vuelve a 0
        if ($ultima_fecha != $hoy && $ultima_fecha != $ayer) {
            $racha_actual = 0;
            $update = $conexion->prepare("UPDATE racha SET racha_actual = 0 WHERE id_usuario = ?");
            $update->bind_param("i", $id_usuario);
            $update->execute();
        }

        echo json_encode([
            "exito" => true,
            "racha_actual" => $racha_actual,
            "ultima_fecha" => $ultima_fecha
        ]);
    } else {
        // Si no existe registro de racha para el usuario, se devuelve 0
        echo json_encode([
            "exito" => true,
            "racha_actual" => 0,
            "ultima_fecha" => null
        ]);
    }
    exit;
}

// ==========================================
// 2. REGISTRAR ACTIVIDAD / COMPLETAR MISIÓN (POST)
// ==========================================
if ($metodo === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $id_usuario = isset($data['idusuario']) ? intval($data['idusuario']) : 0;
    $id_mision = isset($data['idmision']) ? intval($data['idmision']) : 0;

    if ($id_usuario <= 0 || $id_mision <= 0) {
        echo json_encode(["exito" => false, "mensaje" => "Datos incompletos."]);
        exit;
    }

    $hoy = date('Y-m-d');
    $ayer = date('Y-m-d', strtotime('-1 day'));

    // 1. Verificar registro actual de racha
    $query = "SELECT racha_actual, ultima_fecha FROM racha WHERE id_usuario = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $res = $stmt->get_result();

    $nueva_racha = 1;

    if ($row = $res->fetch_assoc()) {
        $ultima_fecha = $row['ultima_fecha'];
        $racha_actual = intval($row['racha_actual']);

        if ($ultima_fecha === $hoy) {
            // Ya completó una misión hoy, mantiene su racha
            $nueva_racha = $racha_actual;
        } elseif ($ultima_fecha === $ayer) {
            // Entrenó ayer, sube +1 a la racha
            $nueva_racha = $racha_actual + 1;
        } else {
            // Rompió el hábito, reinicia en 1 día
            $nueva_racha = 1;
        }

        // Actualizar racha
        $stmt_upd = $conexion->prepare("UPDATE racha SET racha_actual = ?, ultima_fecha = ? WHERE id_usuario = ?");
        $stmt_upd->bind_param("isi", $nueva_racha, $hoy, $id_usuario);
        $stmt_upd->execute();
    } else {
        // Primer registro de racha para el usuario
        $stmt_ins = $conexion->prepare("INSERT INTO racha (id_usuario, racha_actual, ultima_fecha) VALUES (?, 1, ?)");
        $stmt_ins->bind_param("is", $id_usuario, $hoy);
        $stmt_ins->execute();
        $nueva_racha = 1;
    }

    // 2. Guardar el progreso de la misión en lecciones_usuario
    $stmt_prog = $conexion->prepare("INSERT INTO lecciones_usuario (id_usuario, id_mision, fecha_completado) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE fecha_completado = NOW()");
    if ($stmt_prog) {
        $stmt_prog->bind_param("ii", $id_usuario, $id_mision);
        $stmt_prog->execute();
    }

    echo json_encode([
        "exito" => true,
        "mensaje" => "¡Racha actualizada con éxito!",
        "racha_actual" => $nueva_racha
    ]);
    exit;
}

// Si la petición no es GET ni POST
echo json_encode(["exito" => false, "mensaje" => "Método no permitido."]);