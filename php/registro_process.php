<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "conexion.php";

function formatoNombre($texto){

    return mb_convert_case(
        strtolower(trim($texto)),
        MB_CASE_TITLE,
        "UTF-8"
    );

}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Método no permitido"
    ]);
    exit;
}

$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Datos JSON no válidos o vacíos."
    ]);
    exit;
}

$accion = strtolower(trim($data["accion"] ?? "crear"));

try {
    switch ($accion) {

        // ==============================================================
        // insertar
        // ==============================================================
        case "crear":
        case "insertar":
            $nombre    = formatoNombre($data["nombre"] ?? "");
            $apellidop = formatoNombre($data["apellidop"] ?? "");
            $apellidom = formatoNombre($data["apellidom"] ?? "");
            $username  = trim($data["username"] ?? "");
            $email     = trim($data["email"] ?? "");
            $password  = trim($data["password"] ?? "");
            $fechaNac  = !empty($data["fechaNac"]) ? $data["fechaNac"] : null;

            $idpais   = (isset($data["idpais"]) && is_numeric($data["idpais"]) && (int)$data["idpais"] > 0) ? (int)$data["idpais"] : null;
            $idestado = (isset($data["idestado"]) && is_numeric($data["idestado"]) && (int)$data["idestado"] > 0) ? (int)$data["idestado"] : null;

            if (empty($nombre) || empty($apellidop) || empty($apellidom) || empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode([
                    "status"  => "error",
                    "message" => "Por favor llena todos los campos obligatorios."
                ]);
                exit;
            }

            $stmt = $pdo->prepare("
                INSERT INTO usuario (
                    nombre, 
                    apellidop, 
                    apellidom, 
                    username, 
                    password, 
                    email, 
                    fechaNac, 
                    idpais, 
                    idestado
                ) VALUES (
                    :nombre, 
                    :apellidop, 
                    :apellidom, 
                    :username, 
                    :password, 
                    :email, 
                    :fechaNac, 
                    :idpais, 
                    :idestado
                )
            ");

            $stmt->bindValue(':nombre', $nombre);
            $stmt->bindValue(':apellidop', $apellidop);
            $stmt->bindValue(':apellidom', $apellidom);
            $stmt->bindValue(':username', !empty($username) ? $username : null);
            $stmt->bindValue(':password', password_hash($password, PASSWORD_BCRYPT));
            $stmt->bindValue(':email', $email);
            $stmt->bindValue(':fechaNac', $fechaNac);
            $stmt->bindValue(':idpais', $idpais, $idpais ? PDO::PARAM_INT : PDO::PARAM_NULL);
            $stmt->bindValue(':idestado', $idestado, $idestado ? PDO::PARAM_INT : PDO::PARAM_NULL);

            $stmt->execute();

            echo json_encode([
                "status"    => "success",
                "message"   => "¡usuario registrado exitosamente!",
                "idusuario" => $pdo->lastInsertId()
            ]);
            break;

        // ==============================================================
        // consulta
        // ==============================================================
        case "leer":
        case "consultar":
            $idusuario = (isset($data["idusuario"]) && is_numeric($data["idusuario"])) ? (int)$data["idusuario"] : null;

            if ($idusuario) {
                $stmt = $pdo->prepare("
                    SELECT u.idusuario, u.nombre, u.apellidop, u.apellidom, u.username, u.email, u.fechaNac, u.idpais, u.idestado,
                           COALESCE(p.nombre, 'Sin especificar') AS pais,
                           COALESCE(e.nombre, 'Sin especificar') AS estado
                    FROM usuario u
                    LEFT JOIN pais p ON u.idpais = p.idpais
                    LEFT JOIN estado e ON u.idestado = e.idestado
                    WHERE u.idusuario = :idusuario
                ");
                $stmt->bindValue(':idusuario', $idusuario, PDO::PARAM_INT);
                $stmt->execute();
                $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                $stmt = $pdo->query("
                    SELECT u.idusuario, u.nombre, u.apellidop, u.apellidom, u.username, u.email, u.fechaNac, u.idpais, u.idestado,
                           COALESCE(p.nombre, 'Sin especificar') AS pais,
                           COALESCE(e.nombre, 'Sin especificar') AS estado
                    FROM usuario u
                    LEFT JOIN pais p ON u.idpais = p.idpais
                    LEFT JOIN estado e ON u.idestado = e.idestado
                ");
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }

            echo json_encode([
                "status" => "success",
                "data"   => $resultado
            ]);
            break;

        // ==============================================================
        // modificar
        // ==============================================================
        case "modificar":
        case "actualizar":
            $idusuario = (isset($data["idusuario"]) && is_numeric($data["idusuario"]) && (int)$data["idusuario"] > 0) ? (int)$data["idusuario"] : 0;

            if ($idusuario <= 0) {
                http_response_code(400);
                echo json_encode([
                    "status"  => "error",
                    "message" => "Se requiere el 'idusuario' válido para modificar."
                ]);
                exit;
            }

            $nombre    = formatoNombre($data["nombre"] ?? "");
            $apellidop = formatoNombre($data["apellidop"] ?? "");
            $apellidom = formatoNombre($data["apellidom"] ?? "");
            $username  = trim($data["username"] ?? "");
            $email     = trim($data["email"] ?? "");
            $password  = trim($data["password"] ?? "");
            $fechaNac  = !empty($data["fechaNac"]) ? $data["fechaNac"] : null;

            $idpais   = (isset($data["idpais"]) && is_numeric($data["idpais"]) && (int)$data["idpais"] > 0) ? (int)$data["idpais"] : null;
            $idestado = (isset($data["idestado"]) && is_numeric($data["idestado"]) && (int)$data["idestado"] > 0) ? (int)$data["idestado"] : null;

            if (empty($nombre) || empty($apellidop) || empty($apellidom) || empty($email)) {
                http_response_code(400);
                echo json_encode([
                    "status"  => "error",
                    "message" => "Por favor llena los campos obligatorios."
                ]);
                exit;
            }

            if (!empty($password)) {
                $stmt = $pdo->prepare("
                    UPDATE usuario SET 
                        nombre = :nombre, 
                        apellidop = :apellidop, 
                        apellidom = :apellidom, 
                        username = :username, 
                        password = :password, 
                        email = :email, 
                        fechaNac = COALESCE(:fechaNac, fechaNac),
                        idpais = COALESCE(:idpais, idpais),
                        idestado = COALESCE(:idestado, idestado)
                    WHERE idusuario = :idusuario
                ");
                $stmt->bindValue(':password', password_hash($password, PASSWORD_BCRYPT));
            } else {
                $stmt = $pdo->prepare("
                    UPDATE usuario SET 
                        nombre = :nombre, 
                        apellidop = :apellidop, 
                        apellidom = :apellidom, 
                        username = :username, 
                        email = :email, 
                        fechaNac = COALESCE(:fechaNac, fechaNac),
                        idpais = COALESCE(:idpais, idpais),
                        idestado = COALESCE(:idestado, idestado)
                    WHERE idusuario = :idusuario
                ");
            }

            $stmt->bindValue(':nombre', $nombre);
            $stmt->bindValue(':apellidop', $apellidop);
            $stmt->bindValue(':apellidom', $apellidom);
            $stmt->bindValue(':username', !empty($username) ? $username : null);
            $stmt->bindValue(':email', $email);
            $stmt->bindValue(':fechaNac', $fechaNac);
            $stmt->bindValue(':idpais', $idpais, $idpais ? PDO::PARAM_INT : PDO::PARAM_NULL);
            $stmt->bindValue(':idestado', $idestado, $idestado ? PDO::PARAM_INT : PDO::PARAM_NULL);
            $stmt->bindValue(':idusuario', $idusuario, PDO::PARAM_INT);

            

            $stmt->execute();

            echo json_encode([
                "status"  => "success",
                "message" => "¡usuario actualizado exitosamente!"
            ]);
            break;

            

// ==============================================================
// guardar foto perfil
// ==============================================================

case "foto":

    $idusuario = (int)($data["idusuario"] ?? 0);
    $ruta_imagen = trim($data["ruta_imagen"] ?? "");


    if($idusuario <= 0 || empty($ruta_imagen)){

        http_response_code(400);

        echo json_encode([
            "status"=>"error",
            "message"=>"Datos de foto incompletos"
        ]);

        exit;

    }


    // desactivar foto anterior
    $stmt = $pdo->prepare("
        UPDATE FotoPerfil 
        SET activa = FALSE
        WHERE idusuario = :idusuario
    ");

    $stmt->bindValue(
        ":idusuario",
        $idusuario,
        PDO::PARAM_INT
    );

    $stmt->execute();



    // insertar nueva foto

    $stmt = $pdo->prepare("
        INSERT INTO FotoPerfil
        (
            idusuario,
            ruta_imagen,
            activa
        )
        VALUES
        (
            :idusuario,
            :ruta_imagen,
            TRUE
        )
    ");


    $stmt->bindValue(
        ":idusuario",
        $idusuario,
        PDO::PARAM_INT
    );


    $stmt->bindValue(
        ":ruta_imagen",
        $ruta_imagen
    );


    $stmt->execute();



    echo json_encode([

        "status"=>"success",

        "message"=>"Foto guardada correctamente"

    ]);


break;



// ==============================================================
// eliminar
// ==============================================================

case "eliminar":
case "borrar":

    $idusuario = (
        isset($data["idusuario"]) &&
        is_numeric($data["idusuario"]) &&
        (int)$data["idusuario"] > 0
    )
    ? (int)$data["idusuario"]
    : 0;


    if ($idusuario <= 0) {

        http_response_code(400);

        echo json_encode([
            "status"  => "error",
            "message" => "Se requiere un 'idusuario' válido para eliminar."
        ]);

        exit;
    }



    // ==========================================================
    // ELIMINAR FOTO DE PERFIL
    // ==========================================================

    $stmt = $pdo->prepare("
        DELETE FROM FotoPerfil
        WHERE idusuario = :idusuario
    ");

    $stmt->bindValue(
        ':idusuario',
        $idusuario,
        PDO::PARAM_INT
    );

    $stmt->execute();



    // ==========================================================
    // ELIMINAR RACHA
    // ==========================================================

    $stmt = $pdo->prepare("
        DELETE FROM usuario
        WHERE idusuario = :idusuario
    ");

    $stmt->bindValue(
        ':idusuario',
        $idusuario,
        PDO::PARAM_INT
    );

    $stmt->execute();


    if ($stmt->rowCount() > 0) {

        echo json_encode([
            "status"  => "success",
            "message" => "usuario eliminado exitosamente."
        ]);

    } else {

        http_response_code(404);

        echo json_encode([
            "status"  => "error",
            "message" => "No se encontró ningún usuario con ese ID."
        ]);

    }

break;

        default:
            http_response_code(400);

            echo json_encode([
                "status"  => "error",
                "message" => "Acción no válida. Usa: crear, leer, modificar o eliminar."
            ]);

            break;

    }

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "status"  => "error",
        "message" => "Error MySQL: " . $e->getMessage()
    ]);

}

?>