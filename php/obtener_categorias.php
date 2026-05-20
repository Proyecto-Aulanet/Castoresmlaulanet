<?php

header("Content-Type: application/json");

include("conexion.php");

$sql = "SELECT * FROM categoria";

$resultado = mysqli_query($conn, $sql);

$categorias = [];

while($fila = mysqli_fetch_assoc($resultado)){

    $categorias[] = $fila;

}

echo json_encode($categorias);

?>