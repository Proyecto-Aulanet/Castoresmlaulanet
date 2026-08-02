<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");


if(isset($_SESSION["idusuario"])){

    echo json_encode([
        "status"=>"success",
        "usuario"=>[
            "idusuario"=>$_SESSION["idusuario"],
            "nombre"=>$_SESSION["nombre"]
        ]
    ]);

}else{

    echo json_encode([
        "status"=>"error",
        "message"=>"No hay sesión activa"
    ]);

}

?>