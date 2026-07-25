<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$input = json_decode(file_get_contents('php://input'), true);
$accion = $_GET['accion'] ?? $_POST['accion'] ?? $input['accion'] ?? '';

try {
    switch ($accion) {

        // ==============================================================
        // obtener la lista de lecciones con su examen asignado
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
                "data" => $misiones
            ]);
            break;

        // ==============================================================
        // obtiene las preguntas del examen segun el id de la leccion
        // ==============================================================
        case 'preguntas':
            $idleccion = isset($_GET['idleccion']) ? intval($_GET['idleccion']) : ($input['idleccion'] ?? 0);

            if ($idleccion <= 0) {
                echo json_encode(["status" => "error", "message" => "Se requiere un ID de lección válido"]);
                exit;
            }

            // busca las preguntas ligadas a la lección (idmision)
            $stmt = $pdo->prepare("
                SELECT idpregunta, idexamen, idmision, texto_esp, texto_nah, puntaje 
                FROM Pregunta 
                WHERE idmision = ?
            ");
            $stmt->execute([$idleccion]);
            $preguntas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => "success",
                "data" => $preguntas
            ]);
            break;

        // ==============================================================
        //  finalizar examen, guardar racha, avance y medalla
        // ==============================================================
        case 'guardar_resultado':
            $idusuario   = $input['idusuario'] ?? $_POST['idusuario'] ?? 0;
            $idleccion   = $input['idleccion'] ?? $_POST['idleccion'] ?? 0;
            $idexamen    = $input['idexamen'] ?? $_POST['idexamen'] ?? 0;
            $puntos      = $input['puntos'] ?? $_POST['puntos'] ?? 0;
            $idmedalla   = $input['idmedalla'] ?? $_POST['idmedalla'] ?? null; // ID de la medalla de la lección
            $hora_inicio = $input['hora_inicio'] ?? $_POST['hora_inicio'] ?? date('Y-m-d H:i:s');

            if ($idusuario <= 0 || $idleccion <= 0 || $idexamen <= 0) {
                echo json_encode(["status" => "error", "message" => "Faltan datos de usuario, lección o examen"]);
                exit;
            }

            $pdo->beginTransaction();

            // A. Registrar Intento (Corregido: ahora incluye $hora_inicio)
            $stmtIntento = $pdo->prepare("
                INSERT INTO IntentoExamen (idusuario, idexamen, hora_inicio, hora_fin, puntaje) 
                VALUES (?, ?, ?, NOW(), ?)
            ");
            $stmtIntento->execute([$idusuario, $idexamen, $hora_inicio, $puntos]);

            // B. Registrar Puntaje
            $stmtPuntaje = $pdo->prepare("
                INSERT INTO Puntaje (idusuario, idexamen, puntos, fecha) 
                VALUES (?, ?, ?, NOW())
            ");
            $stmtPuntaje->execute([$idusuario, $idexamen, $puntos]);
            $idpuntaje = $pdo->lastInsertId();

            // C. Registrar Racha Diaria
            $stmtRacha = $pdo->prepare("
                INSERT INTO Racha (idusuario, fecha, dia_completado) 
                VALUES (?, CURRENT_DATE(), TRUE)
                ON DUPLICATE KEY UPDATE dia_completado = TRUE
            ");
            $stmtRacha->execute([$idusuario]);

            $stmtGetRacha = $pdo->prepare("SELECT idracha FROM Racha WHERE idusuario = ? AND fecha = CURRENT_DATE()");
            $stmtGetRacha->execute([$idusuario]);
            $idracha = $stmtGetRacha->fetch(PDO::FETCH_ASSOC)['idracha'] ?? null;

            // D. Registrar/Actualizar Avance de la Lección
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

            // E. ASIGNAR MEDALLA AL USUARIO AL FINALIZAR
            $medallaOtorgada = false;
            if ($idmedalla) {
                $stmtMedalla = $pdo->prepare("
                    INSERT IGNORE INTO Usuario_Medalla (idusuario, idmedalla, fecha_obtenida) 
                    VALUES (?, ?, NOW())
                ");
                $stmtMedalla->execute([$idusuario, $idmedalla]);
                $medallaOtorgada = $stmtMedalla->rowCount() > 0;
            }

            $pdo->commit();

            echo json_encode([
                "status" => "success",
                "message" => "¡Lección completada!",
                "medalla_otorgada" => $medallaOtorgada,
                "idpuntaje" => $idpuntaje
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
    echo json_encode(["status" => "error", "message" => "Error interno: " . $e->getMessage()]);
}
?>