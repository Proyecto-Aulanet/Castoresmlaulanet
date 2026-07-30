<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

/* ===========================
   GUARDAR FOTO
=========================== */
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $datos = json_decode(file_get_contents("php://input"), true);

    if (!isset($datos["foto"])) {
        echo json_encode([
            "success" => false,
            "message" => "No se recibió ninguna imagen."
        ]);
        exit;
    }

    if (!isset($_SESSION["idusuario"])) {
        echo json_encode([
            "success" => false,
            "message" => "No hay usuario en sesión."
        ]);
        exit;
    }

    $idusuario = $_SESSION["idusuario"];
    $ruta = "../Recursos/mascotas/" . $datos["foto"];

    try {

        // Desactivar la foto anterior
        $sql = "UPDATE FotoPerfil
                SET activa = 0
                WHERE idusuario = ?";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$idusuario]);

        // Insertar la nueva foto
        $sql = "INSERT INTO FotoPerfil
                (idusuario,ruta_imagen,activa)
                VALUES(?,?,1)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$idusuario,$ruta]);

        echo json_encode([
            "success"=>true,
            "message"=>"Foto actualizada correctamente.",
            "ruta"=>$ruta
        ]);

    } catch(PDOException $e){

        echo json_encode([
            "success"=>false,
            "message"=>$e->getMessage()
        ]);

    }

    exit;
}

/* ===========================
   LISTAR MASCOTAS
=========================== */

$directorioMascotas = "../Recursos/mascotas/";

$respuesta = [
    "success"=>false,
    "data"=>[],
    "message"=>""
];

if(is_dir($directorioMascotas)){

    $archivos=scandir($directorioMascotas);

    foreach($archivos as $archivo){

        if($archivo=="." || $archivo==".."){
            continue;
        }

        $extension=strtolower(pathinfo($archivo,PATHINFO_EXTENSION));

        if(in_array($extension,["png","jpg","jpeg","webp","svg"])){

            $respuesta["data"][]=[

                "nombre"=>$archivo,

                "url"=>"../Recursos/mascotas/".$archivo

            ];

        }

    }

    $respuesta["success"]=true;

}else{

    $respuesta["message"]="No existe la carpeta.";

}

echo json_encode($respuesta);