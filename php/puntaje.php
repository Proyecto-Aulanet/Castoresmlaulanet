<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

// =====================================================
// OBTENER Y VALIDAR USUARIO DINÁMICAMENTE
// =====================================================
$input = json_decode(file_get_contents("php://input"), true) ?: [];

$idusuario = 0;
if (isset($_SESSION["idusuario"]) && (int)$_SESSION["idusuario"] > 0) {
    $idusuario = (int)$_SESSION["idusuario"];
} elseif (isset($input["idusuario"]) && (int)$input["idusuario"] > 0) {
    $idusuario = (int)$input["idusuario"];
} elseif (isset($_REQUEST["idusuario"]) && (int)$_REQUEST["idusuario"] > 0) {
    $idusuario = (int)$_REQUEST["idusuario"];
}

// Si no hay un idusuario autenticado ni enviado en la petición, rechazamos la solicitud
if ($idusuario <= 0) {
    echo json_encode([
        "status" => "error",
        "message" => "No hay una sesión activa de usuario ni se proporcionó idusuario."
    ]);
    exit;
}

$host = "localhost";
$db   = "nahui";
$user = "root";
$pass = "260622BrunX";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "No se pudo conectar a la BD: " . $e->getMessage()
    ]);
    exit;
}

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'POST') {
    // =====================================================
    // GUARDAR NUEVOS PUNTOS (Garantizando NOT NULL y Foreign Key)
    // =====================================================
    $puntos = isset($input['puntos']) ? (int)$input['puntos'] : (isset($_POST['puntos']) ? (int)$_POST['puntos'] : 0);
    $idexamen = isset($input['idexamen']) ? (int)$input['idexamen'] : (isset($_POST['idexamen']) ? (int)$_POST['idexamen'] : 0);

    if ($puntos > 0) {
        try {
            $idexamenValido = null;

            // 1. Verificar si el idexamen recibido existe en la tabla "examen"
            if ($idexamen > 0) {
                $checkStmt = $pdo->prepare("SELECT idexamen FROM examen WHERE idexamen = :idexamen LIMIT 1");
                $checkStmt->execute([':idexamen' => $idexamen]);
                $idexamenValido = $checkStmt->fetchColumn();
            }

            // 2. Si no existe, busca el primer idexamen disponible en la BD
            if (!$idexamenValido) {
                $fallbackStmt = $pdo->query("SELECT idexamen FROM examen ORDER BY idexamen ASC LIMIT 1");
                $idexamenValido = $fallbackStmt->fetchColumn();
            }

            // 3. Si la tabla "examen" está vacía, insertamos un registro base para cumplir con el NOT NULL
            if (!$idexamenValido) {
                $pdo->exec("INSERT INTO examen (idexamen) VALUES (1) ON DUPLICATE KEY UPDATE idexamen=idexamen");
                $idexamenValido = 1;
            }

            // 4. Insertar en Puntaje garantizando que idexamen NUNCA sea NULL
            $stmt = $pdo->prepare("
                INSERT INTO Puntaje (idusuario, idexamen, puntos, fecha) 
                VALUES (:idusuario, :idexamen, :puntos, NOW())
            ");
            
            $stmt->execute([
                ":idusuario" => $idusuario,
                ":idexamen"  => (int)$idexamenValido,
                ":puntos"    => $puntos
            ]);

            echo json_encode([
                "status" => "success",
                "message" => "Puntaje registrado correctamente en MySQL",
                "puntos_guardados" => $puntos,
                "idusuario" => $idusuario,
                "idexamen_usado" => (int)$idexamenValido
            ]);

        } catch (PDOException $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Error MySQL: " . $e->getMessage()
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "El puntaje a guardar debe ser mayor a 0"
        ]);
    }
}
?>