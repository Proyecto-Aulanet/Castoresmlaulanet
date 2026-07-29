<?php
// obtener_mascotas.php
header('Content-Type: application/json');

// Ruta relativa desde este archivo PHP hacia la carpeta de las mascotas
$directorioMascotas = '../Recursos/mascotas/';

$respuesta = [
    'success' => false,
    'data' => [],
    'message' => ''
];

if (is_dir($directorioMascotas)) {
    $archivos = scandir($directorioMascotas);
    $imagenes = [];

    foreach ($archivos as $archivo) {
        // Ignorar referencias de carpetas
        if ($archivo !== '.' && $archivo !== '..') {
            $extension = strtolower(pathinfo($archivo, PATHINFO_EXTENSION));
            
            // Validar que solo tome archivos de imagen
            if (in_array($extension, ['png', 'jpg', 'jpeg', 'webp', 'svg'])) {
                $imagenes[] = [
                    'nombre' => $archivo,
                    'url' => '../Recursos/mascotas/' . $archivo
                ];
            }
        }
    }

    $respuesta['success'] = true;
    $respuesta['data'] = $imagenes;
} else {
    $respuesta['message'] = 'La carpeta de mascotas no existe o la ruta es incorrecta.';
}

echo json_encode($respuesta);
?>