<?php

header("Content-Type: application/json");

include("conexion.php");

$idcategoria = $_GET["idcategoria"];

$sql = "
SELECT * 
FROM mision
WHERE idcategoria = '$idcategoria'
";

$resultado = mysqli_query($conn, $sql);

$misiones = [];

while($fila = mysqli_fetch_assoc($resultado)){

    $misiones[] = $fila;

}

echo json_encode($misiones);

?>