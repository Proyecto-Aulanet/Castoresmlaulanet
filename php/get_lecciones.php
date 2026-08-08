<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'conexion.php';

$input = json_decode(file_get_contents('php://input'), true);
$accion = $_GET['accion'] ?? $_POST['accion'] ?? $input['accion'] ?? '';

try {
    switch ($accion) {

        // ==============================================================
        // 1. Obtener avance y puntaje semanal del usuario
        // ==============================================================
        case 'puntaje_semanal':
            $idusuario = intval($_GET['idusuario'] ?? $input['idusuario'] ?? $_POST['idusuario'] ?? 0);

            if ($idusuario <= 0) {
                echo json_encode(["status" => "error", "message" => "Se requiere un ID de usuario válido"]);
                exit;
            }

            // Suma de puntos acumulados en la semana actual (Lunes a Domingo)
            $stmt = $pdo->prepare("
                SELECT 
                    COALESCE(SUM(puntos), 0) AS total_puntos_semana,
                    COUNT(DISTINCT DATE(fecha)) AS dias_activos_semana
                FROM Puntaje 
                WHERE idusuario = ? 
                  AND YEARWEEK(fecha, 1) = YEARWEEK(CURDATE(), 1)
            ");
            $stmt->execute([$idusuario]);
            $resumenSemanal = $stmt->fetch(PDO::FETCH_ASSOC);

            // Obtener el desglose de puntaje agrupado por día de la semana actual
            $stmtDias = $pdo->prepare("
                SELECT 
                    DATE(fecha) AS fecha,
                    DAYNAME(fecha) AS dia_nombre,
                    SUM(puntos) AS puntos_obtenidos
                FROM Puntaje
                WHERE idusuario = ? 
                  AND YEARWEEK(fecha, 1) = YEARWEEK(CURDATE(), 1)
                GROUP BY DATE(fecha), DAYNAME(fecha)
                ORDER BY fecha ASC
            ");
            $stmtDias->execute([$idusuario]);
            $desgloseDias = $stmtDias->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => "success",
                "data"   => [
                    "idusuario"            => $idusuario,
                    "total_puntos_semana"  => intval($resumenSemanal['total_puntos_semana']),
                    "dias_activos_semana"  => intval($resumenSemanal['dias_activos_semana']),
                    "desglose_dias"        => $desgloseDias
                ]
            ]);
            break;

        // ==============================================================
        // 2. Obtener la lista de lecciones (Misiones) y su Examen
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
                FROM mision m
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
        // 3. Obtener preguntas + sus Opciones según ID de la Lección/Misión
        // ==============================================================
       case 'preguntas':

    $idleccion = intval(
        $_GET['idleccion'] 
        ?? $input['idleccion'] 
        ?? $_POST['idleccion'] 
        ?? 0
    );


    if ($idleccion <= 0) {

        echo json_encode([
            "status"=>"error",
            "message"=>"Se requiere un ID de misión válido"
        ]);

        exit;
    }


    // Obtener preguntas directamente de la misión
    $stmtPreguntas = $pdo->prepare("

        SELECT 
            idpregunta,
            idmision,
            texto_esp,
            texto_nah,
            puntaje

        FROM Pregunta

        WHERE idmision = ?

        ORDER BY idpregunta ASC

    ");


    $stmtPreguntas->execute([$idleccion]);

    $preguntas = $stmtPreguntas->fetchAll(PDO::FETCH_ASSOC);



    // Obtener opciones
    foreach($preguntas as &$pregunta){

        $stmtOpciones = $pdo->prepare("

            SELECT 
                idopcion,
                texto_esp,
                texto_nah,
                correcto

            FROM Opcion

            WHERE idpregunta = ?

        ");


        $stmtOpciones->execute([
            $pregunta['idpregunta']
        ]);


        $pregunta['opciones'] =
            $stmtOpciones->fetchAll(PDO::FETCH_ASSOC);

    }



    echo json_encode([
        "status"=>"success",
        "data"=>$preguntas
    ]);


break;

        // ==============================================================
        // 4. Guardar resultado del examen, racha, medalla e insertar puntaje
        // ==============================================================
        case 'guardar_resultado':
            $idusuario   = intval($input['idusuario'] ?? $_POST['idusuario'] ?? 0);
            $idleccion   = intval($input['idleccion'] ?? $_POST['idleccion'] ?? 0); // idmision
            $idexamen    = intval($input['idexamen'] ?? $_POST['idexamen'] ?? 0);
            $puntos      = intval($input['puntos'] ?? $_POST['puntos'] ?? 0);
            $idmedalla   = isset($input['idmedalla']) ? intval($input['idmedalla']) : null;
            $hora_inicio = $input['hora_inicio'] ?? $_POST['hora_inicio'] ?? date('Y-m-d H:i:s');

            if ($idusuario <= 0 || $idleccion <= 0 || $idexamen <= 0) {
                echo json_encode(["status" => "error", "message" => "Datos incompletos (idusuario, idleccion, idexamen son requeridos)"]);
                exit;
            }

            $pdo->beginTransaction();

            // 1. Guardar IntentoExamen
            $stmtIntento = $pdo->prepare("
                INSERT INTO IntentoExamen (idusuario, idexamen, hora_inicio, hora_fin, puntaje) 
                VALUES (?, ?, ?, NOW(), ?)
            ");
            $stmtIntento->execute([$idusuario, $idexamen, $hora_inicio, $puntos]);

            // 2. Insertar registros en Puntaje
            $stmtPuntaje = $pdo->prepare("
                INSERT INTO Puntaje (idusuario, idexamen, puntos, fecha) 
                VALUES (?, ?, ?, NOW())
            ");
            $stmtPuntaje->execute([$idusuario, $idexamen, $puntos]);
            $idpuntaje = $pdo->lastInsertId();

            // 3. Registrar o actualizar racha del día
            $stmtRacha = $pdo->prepare("
                INSERT INTO racha (idusuario, fecha, dia_completado) 
                VALUES (?, CURRENT_DATE(), TRUE)
                ON DUPLICATE KEY UPDATE dia_completado = TRUE
            ");
            $stmtRacha->execute([$idusuario]);

            $stmtGetRacha = $pdo->prepare("SELECT idracha FROM racha WHERE idusuario = ? AND fecha = CURRENT_DATE()");
            $stmtGetRacha->execute([$idusuario]);
            $idracha = $stmtGetRacha->fetch(PDO::FETCH_ASSOC)['idracha'] ?? null;

            // 4. Actualizar o Vincular en Lecciones_usuario
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

            // 5. Asignar medalla si aplica
            $medallaOtorgada = false;
            if ($idmedalla && $idmedalla > 0) {
                $stmtMedalla = $pdo->prepare("
                    INSERT IGNORE INTO Usuario_Medalla (idusuario, idmedalla, fecha_obtenida) 
                    VALUES (?, ?, NOW())
                ");
                $stmtMedalla->execute([$idusuario, $idmedalla]);
                $medallaOtorgada = $stmtMedalla->rowCount() > 0;
            }

            // 6. Obtener el total acumulado de la semana para respuesta directa
            $stmtTotalSemana = $pdo->prepare("
                SELECT COALESCE(SUM(puntos), 0) AS total_semana
                FROM Puntaje 
                WHERE idusuario = ? AND YEARWEEK(fecha, 1) = YEARWEEK(CURDATE(), 1)
            ");
            $stmtTotalSemana->execute([$idusuario]);
            $totalPuntosSemana = $stmtTotalSemana->fetch(PDO::FETCH_ASSOC)['total_semana'];

            $pdo->commit();

            echo json_encode([
                "status"               => "success",
                "message"              => "¡Examen registrado con éxito!",
                "medalla_otorgada"     => $medallaOtorgada,
                "idpuntaje"            => $idpuntaje,
                "puntos_ganados"       => $puntos,
                "total_puntos_semana"  => intval($totalPuntosSemana)
            ]);
            break;
            // ==============================================================
// 5. Guardar medalla obtenida
// ==============================================================
case 'mis_medallas':

$idusuario = intval($_GET['idusuario']);


$stmt = $pdo->prepare("
SELECT 
idmedalla,
fecha_obtenida

FROM Usuario_Medalla

WHERE idusuario=?

ORDER BY fecha_obtenida ASC
");


$stmt->execute([$idusuario]);


echo json_encode([

"status"=>"success",

"data"=>$stmt->fetchAll(PDO::FETCH_ASSOC)

]);


break;
case 'verificar_medalla':

$idusuario =
intval($_GET['idusuario']);

$idmedalla =
intval($_GET['idmedalla']);



$stmt=$pdo->prepare("

SELECT COUNT(*) total

FROM Usuario_Medalla

WHERE idusuario=?
AND idmedalla=?

");


$stmt->execute([

$idusuario,
$idmedalla

]);



$resultado =
$stmt->fetch(PDO::FETCH_ASSOC);



echo json_encode([

"obtenida" =>
$resultado['total'] > 0

]);



break;
case 'puntaje_total':

$idusuario=intval($_GET['idusuario']);


$stmt=$pdo->prepare("

SELECT COALESCE(SUM(puntos),0) total

FROM Puntaje

WHERE idusuario=?

");


$stmt->execute([$idusuario]);


echo json_encode([

"status"=>"success",

"total"=>$stmt->fetchColumn()

]);


break;

        // ==============================================================
        // 5. Reporte completo para administradores/métricas
        // ==============================================================
        case 'reporte_examenes':
            $stmt = $pdo->query("
                SELECT 
                    ie.idintento,
                    CONCAT(u.nombre, ' ', u.apellidop, ' ', u.apellidom) AS nombre_completo,
                    u.username,
                    COALESCE(p.nombre, 'Sin especificar') AS pais,
                    COALESCE(e.nombre, 'Sin especificar') AS estado,
                    m.nombre_esp AS leccion_espanol,
                    m.nombre_nah AS leccion_nahuatl,
                    ex.idexamen,
                    ie.puntaje,
                    ie.hora_inicio,
                    ie.hora_fin,
                    TIMEDIFF(ie.hora_fin, ie.hora_inicio) AS tiempo_tardado,
                    TIMESTAMPDIFF(SECOND, ie.hora_inicio, ie.hora_fin) AS segundos_totales
                FROM IntentoExamen ie
                INNER JOIN usuario u ON ie.idusuario = u.idusuario
                LEFT JOIN pais p ON u.idpais = p.idpais
                LEFT JOIN estado e ON u.idestado = e.idestado
                INNER JOIN Examen ex ON ie.idexamen = ex.idexamen
                INNER JOIN mision m ON ex.idmision = m.idmision
                ORDER BY ie.hora_fin DESC
            ");

            echo json_encode([
                "status" => "success",
                "data"   => $stmt->fetchAll(PDO::FETCH_ASSOC)
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