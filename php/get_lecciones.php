<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$input = json_decode(file_get_contents('php://input'), true);
$accion = $_GET['accion'] ?? $_POST['accion'] ?? $input['accion'] ?? '';

try {
    switch ($accion) {

        // ==============================================================
        // 1. Obtener la lista de lecciones con su examen asignado
        // ==============================================================
        case 'listar':
            $stmt = $pdo->query("
                SELECT 
                    m.idmision AS idleccion, 
                    m.nombre_esp, 
                    m.nombre_nah, 
                    m.descripcion_esp, 
                    m.descripcion_nah, 
                    m.imagen, 
                    e.idexamen 
                FROM Mision m
                LEFT JOIN Examen e ON m.idmision = e.idmision
                ORDER BY m.idmision ASC
            ");
            $misiones = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => "success",
                "data"   => $misiones
            ]);
            break;

        // ==============================================================
        // 2. Obtener las preguntas del examen según el ID de la lección
        // ==============================================================
        case 'preguntas':
            $idleccion = isset($_GET['idleccion']) ? intval($_GET['idleccion']) : intval($input['idleccion'] ?? 0);

            if ($idleccion <= 0) {
                echo json_encode(["status" => "error", "message" => "Se requiere un ID de lección válido"]);
                exit;
            }

            $stmt = $pdo->prepare("
                SELECT idpregunta, idexamen, idmision, texto_esp, texto_nah, puntaje 
                FROM Pregunta 
                WHERE idmision = ?
            ");
            $stmt->execute([$idleccion]);
            $preguntas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => "success",
                "data"   => $preguntas
            ]);
            break;

        // ==============================================================
        // 3. Finalizar examen, guardar intento, avance, racha y medalla
        // ==============================================================
        case 'guardar_resultado':
            $idusuario   = intval($input['idusuario'] ?? $_POST['idusuario'] ?? 0);
            $idleccion   = intval($input['idleccion'] ?? $_POST['idleccion'] ?? 0);
            $idexamen    = intval($input['idexamen'] ?? $_POST['idexamen'] ?? 0);
            $puntos      = intval($input['puntos'] ?? $_POST['puntos'] ?? 0);
            $idmedalla   = isset($input['idmedalla']) ? intval($input['idmedalla']) : null;
            $hora_inicio = $input['hora_inicio'] ?? $_POST['hora_inicio'] ?? date('Y-m-d H:i:s');

            if ($idusuario <= 0 || $idleccion <= 0 || $idexamen <= 0) {
                echo json_encode(["status" => "error", "message" => "Faltan datos de usuario, lección o examen"]);
                exit;
            }

            $pdo->beginTransaction();

            $stmtIntento = $pdo->prepare("
                INSERT INTO IntentoExamen (idusuario, idexamen, hora_inicio, hora_fin, puntaje) 
                VALUES (?, ?, ?, NOW(), ?)
            ");
            $stmtIntento->execute([$idusuario, $idexamen, $hora_inicio, $puntos]);

            $stmtPuntaje = $pdo->prepare("
                INSERT INTO Puntaje (idusuario, idexamen, puntos, fecha) 
                VALUES (?, ?, ?, NOW())
            ");
            $stmtPuntaje->execute([$idusuario, $idexamen, $puntos]);
            $idpuntaje = $pdo->lastInsertId();

            $stmtRacha = $pdo->prepare("
                INSERT INTO Racha (idusuario, fecha, dia_completado) 
                VALUES (?, CURRENT_DATE(), TRUE)
                ON DUPLICATE KEY UPDATE dia_completado = TRUE
            ");
            $stmtRacha->execute([$idusuario]);

            $stmtGetRacha = $pdo->prepare("SELECT idracha FROM Racha WHERE idusuario = ? AND fecha = CURRENT_DATE()");
            $stmtGetRacha->execute([$idusuario]);
            $idracha = $stmtGetRacha->fetch(PDO::FETCH_ASSOC)['idracha'] ?? null;

            $stmtVerificar = $pdo->prepare("SELECT idleccion_usuario FROM Lecciones_usuario WHERE idusuario = ? AND idmision = ?");
            $stmtVerificar->execute([$idusuario, $idleccion]);
            $progresoExistente = $stmtVerificar->fetch(PDO::FETCH_ASSOC);

            if ($progresoExistente) {
                $stmtUpdate = $pdo->prepare("
                    UPDATE Lecciones_usuario 
                    SET idexamen = ?, idpuntaje = ?, idracha = ?, completada = TRUE, fecha_completado = NOW() 
                    WHERE idleccion_usuario = ?
                ");
                $stmtUpdate->execute([$idexamen, $idpuntaje, $idracha, $progresoExistente['idleccion_usuario']]);
            } else {
                $stmtInsert = $pdo->prepare("
                    INSERT INTO Lecciones_usuario (idusuario, idmision, idexamen, idpuntaje, idracha, completada, fecha_completado) 
                    VALUES (?, ?, ?, ?, ?, TRUE, NOW())
                ");
                $stmtInsert->execute([$idusuario, $idleccion, $idexamen, $idpuntaje, $idracha]);
            }

            $medallaOtorgada = false;
            if ($idmedalla && $idmedalla > 0) {
                $stmtMedalla = $pdo->prepare("
                    INSERT IGNORE INTO Usuario_Medalla (idusuario, idmedalla, fecha_obtenida) 
                    VALUES (?, ?, NOW())
                ");
                $stmtMedalla->execute([$idusuario, $idmedalla]);
                $medallaOtorgada = $stmtMedalla->rowCount() > 0;
            }

            $pdo->commit();

            echo json_encode([
                "status"           => "success",
                "message"          => "¡Lección completada y examen registrado!",
                "medalla_otorgada" => $medallaOtorgada,
                "idpuntaje"        => $idpuntaje
            ]);
            break;

        // ==============================================================
        // 4. Reporte completo: Exámenes + Lección + Tiempo + Procedencia
        // ==============================================================
        case 'reporte_examenes':
            $stmt = $pdo->query("
                SELECT 
                    ie.idintento,
                    CONCAT(u.nombre, ' ', u.apellidop, ' ', u.apellidom) AS nombre_completo,
                    u.username,
                    COALESCE(p.nombre, 'Sin especificar') AS pais,
                    COALESCE(e.nombre, 'Sin especificar') AS estado,
                    m.nombre_esp AS leccion_categoria,
                    m.nombre_nah AS leccion_nahuatl,
                    ex.idexamen,
                    ie.puntaje,
                    ie.hora_inicio,
                    ie.hora_fin,
                    TIMEDIFF(ie.hora_fin, ie.hora_inicio) AS tiempo_tardado,
                    TIMESTAMPDIFF(SECOND, ie.hora_inicio, ie.hora_fin) AS segundos_totales
                FROM IntentoExamen ie
                INNER JOIN Usuario u ON ie.idusuario = u.idusuario
                LEFT JOIN Pais p ON u.idpais = p.idpais
                LEFT JOIN Estado e ON u.idestado = e.idestado
                INNER JOIN Examen ex ON ie.idexamen = ex.idexamen
                INNER JOIN Mision m ON ex.idmision = m.idmision
                ORDER BY ie.hora_fin DESC
            ");

            $reporte = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => "success",
                "data"   => $reporte
            ]);
            break;

        default:
            echo json_encode(["status" => "error", "message" => "Acción no válida"]);
            break;
    }

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status"  => "error", 
        "message" => "Error interno del servidor: " . $e->getMessage()
    ]);
}
?>