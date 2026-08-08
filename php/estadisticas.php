<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "conexion.php";

try {
    // Total de usuarios
    $stmtUsers = $pdo->query("SELECT COUNT(*) AS total FROM usuario");
    $totalUsuarios = (int)($stmtUsers->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    // Total de países distintos registrados
    $stmtPaises = $pdo->query("SELECT COUNT(DISTINCT idpais) AS total FROM usuario WHERE idpais IS NOT NULL AND idpais > 0");
    $totalPaises = (int)($stmtPaises->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    // Total de misiones
    $stmtMisiones = $pdo->query("SELECT COUNT(*) AS total FROM mision");
    $totalMisiones = (int)($stmtMisiones->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    // Gráfica Global (Agrupación corregida por nombre de país)
    $stmtGlobal = $pdo->query("
        SELECT COALESCE(p.nombre, 'Sin especificar') AS pais, COUNT(u.idusuario) AS cantidad
        FROM usuario u
        LEFT JOIN pais p ON u.idpais = p.idpais
        GROUP BY COALESCE(p.nombre, 'Sin especificar')
        ORDER BY cantidad DESC
    ");
    $datosGlobal = $stmtGlobal->fetchAll(PDO::FETCH_ASSOC);

    // Gráfica de Estados de México (o agrupamiento de estados)
    $stmtMexico = $pdo->query("
        SELECT COALESCE(e.nombre, 'Sin especificar') AS estado, COUNT(u.idusuario) AS cantidad
        FROM usuario u
        LEFT JOIN estado e ON u.idestado = e.idestado
        GROUP BY COALESCE(e.nombre, 'Sin especificar')
        ORDER BY cantidad DESC
    ");
    $datosMexico = $stmtMexico->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "contadores" => [
            "totalUsuarios" => $totalUsuarios,
            "totalPaises"   => $totalPaises,
            "totalMisiones" => $totalMisiones
        ],
        "graficas" => [
            "global" => $datosGlobal,
            "mexico" => $datosMexico
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Error MySQL: " . $e->getMessage()
    ]);
}
?>