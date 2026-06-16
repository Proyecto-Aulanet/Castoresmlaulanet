<?php
header("Content-Type: application/json");
include("conexion.php");

// Asegurar que la comunicación use UTF-8 para no romper caracteres especiales o acentos
mysqli_set_charset($conn, "utf8");

if (isset($_GET["idmision"])) {
    $idmision = mysqli_real_escape_string($conn, $_GET["idmision"]);

    // Consulta los reactivos pertenecientes a la misión seleccionada
    $sql = "SELECT * FROM pregunta WHERE idmision = '$idmision' ORDER BY RAND() LIMIT 5";
    $resultado = mysqli_query($conn, $sql);

    $preguntas = [];
    if ($resultado) {
        while($fila = mysqli_fetch_assoc($resultado)){
            $preguntas[] = $fila;
        }
    }
    echo json_encode($preguntas);
} else {
    echo json_encode(["error" => "Falta parámetro idmision"]);
}
?>