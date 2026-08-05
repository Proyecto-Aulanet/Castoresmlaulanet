<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'conexion.php'; 

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['idusuario']) || !isset($data['idexamen']) || !isset($data['puntaje_obtenido'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Faltan datos obligatorios: idusuario, idexamen o puntaje_obtenido."
    ]);
    exit;
}

$idusuario = (int)$data['idusuario'];
$idexamen = (int)$data['idexamen'];
$puntaje_obtenido = (int)$data['puntaje_obtenido'];

try {
    $queryExamen = "SELECT SUM(p.puntaje) AS puntaje_maximo, e.idmedalla 
                    FROM Examen e 
                    LEFT JOIN Pregunta p ON e.idexamen = p.idexamen 
                    WHERE e.idexamen = ? 
                    GROUP BY e.idexamen, e.idmedalla";

    $stmt = $conexion->prepare($queryExamen);
    $stmt->bind_param("i", $idexamen);
    $stmt->execute();
    $resultado = $stmt->get_result()->fetch_assoc();

    if (!$resultado) {
        echo json_encode(["status" => "error", "message" => "El examen especificado no existe."]);
        exit;
    }

    $puntaje_maximo = (int)($resultado['puntaje_maximo'] ?? 0);
    $idmedalla = $resultado['idmedalla'];

    if ($puntaje_maximo <= 0) {
        echo json_encode(["status" => "error", "message" => "El examen no tiene preguntas o puntaje asignado."]);
        exit;
    }

    $porcentaje = ($puntaje_obtenido / $puntaje_maximo) * 100;

    $stmtIntento = $conexion->prepare("INSERT INTO IntentoExamen (idusuario, idexamen, hora_fin, puntaje) VALUES (?, ?, NOW(), ?)");
    $stmtIntento->bind_param("iii", $idusuario, $idexamen, $puntaje_obtenido);
    $stmtIntento->execute();

    $stmtPuntaje = $conexion->prepare("INSERT INTO Puntaje (idusuario, idexamen, puntos) VALUES (?, ?, ?)");
    $stmtPuntaje->bind_param("iii", $idusuario, $idexamen, $puntaje_obtenido);
    $stmtPuntaje->execute();

    $medalla_otorgada = false;

    if ($porcentaje >= 80 && !empty($idmedalla)) {
        // Asignar medalla al usuario evitando duplicados si ya la obtuvo previamente
        $stmtMedalla = $conexion->prepare(
            "INSERT INTO Usuario_Medalla (idusuario, idmedalla) VALUES (?, ?) 
             ON DUPLICATE KEY UPDATE fecha_obtenida = fecha_obtenida"
        );
        $stmtMedalla->bind_param("ii", $idusuario, $idmedalla);
        $stmtMedalla->execute();

        if ($stmtMedalla->affected_rows > 0) {
            $medalla_otorgada = true;
        }
    }

    // 6. Respuesta JSON
    echo json_encode([
        "status" => "success",
        "porcentaje" => round($porcentaje, 2),
        "aprobo" => $porcentaje >= 80,
        "medalla_otorgada" => $medalla_otorgada,
        "idmedalla" => ($porcentaje >= 80) ? $idmedalla : null,
        "mensaje" => ($porcentaje >= 80) 
            ? "¡Felicidades! Lograste el " . round($porcentaje, 1) . "% y obtuviste una medalla." 
            : "Obtuviste " . round($porcentaje, 1) . "%. Necesitas al menos 80% para ganar la medalla."
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error interno en el servidor: " . $e->getMessage()
    ]);
}
?>