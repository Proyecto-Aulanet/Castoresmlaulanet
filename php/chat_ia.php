<?php
header('Content-Type: application/json; charset=utf-8');

// Incluimos tu archivo de conexión original
include 'conexion.php';

$data = json_decode(file_get_contents('php://input'), true);
$mensajeUsuario = $data['mensaje'] ?? '';

if (empty($mensajeUsuario)) {
    echo json_encode(['respuesta' => 'Error: El mensaje enviado está vacío.']);
    exit;
}

// Tu clave de API completa de Google AI Studio
$apiKey = "AQ.Ab8RN6JO4y1ICbms4YMe0Umng5egDA5Whsn2YNFjy53XqNvQag"; 

// URL de la API de Gemini
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;

// Tus instrucciones de sistema personalizadas para el tutor
$systemInstruction = "Eres 'Amigo Nahui', un asistente experto en la enseñanza del náhuatl de Puebla. "
                    . "Tu objetivo es ayudar a los estudiantes a aprender vocabulario, pronunciación, gramática y aspectos culturales del náhuatl. "
                    . "Sé amable, pedagógico y usa ejemplos sencillos y claros. "
                    . "Cuando el usuario salude en español, responde con un saludo en náhuatl acompañado de su traducción al español. "
                    . "Si el usuario pregunta por una palabra o frase en náhuatl, proporciona: "
                    . "1) La traducción al español, 2) El significado cultural o contextual, 3) Ejemplo de uso en una oración. "
                    . "Si el usuario hace preguntas complejas, responde paso a paso con explicaciones detalladas y ejemplos prácticos. "
                    . "Si el usuario pregunta algo fuera del tema del náhuatl, responde con: "
                    . "'Mi especialidad es el náhuatl y no puedo responder preguntas fuera de este tema.' "
                    . "Tu misión es motivar y guiar al estudiante en su aprendizaje del náhuatl de manera respetuosa, divertida y culturalmente enriquecedora.";

// Construcción del Payload JSON estructurado con systemInstruction nativo
$payload = [
    "systemInstruction" => [
        "parts" => [
            ["text" => $systemInstruction]
        ]
    ],
    "contents" => [
        [
            "parts" => [
                ["text" => $mensajeUsuario]
            ]
        ]
    ]
];

// Configuración de la petición cURL hacia Google
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

// Evitar bloqueos de certificados SSL trabajando en servidor local (localhost)
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);

// Validar si existió un problema de conexión local (cURL)
if (curl_errno($ch)) {
    $errorCurl = curl_error($ch);
    echo json_encode(['respuesta' => 'Error de conexión local (cURL): ' . $errorCurl]);
    curl_close($ch);
    mysqli_close($conn);
    exit;
}

curl_close($ch);

$responseArray = json_decode($response, true);

// =========================================================================
// PROCESAMIENTO DE RESPUESTA O EXTRACOCCIÓN DE ERROR EN PANTALLA
// =========================================================================
if (isset($responseArray['candidates'][0]['content']['parts'][0]['text'])) {
    // Si la API responde con éxito, extraemos el texto limpio
    $respuestaIA = $responseArray['candidates'][0]['content']['parts'][0]['text'];
    echo json_encode(['respuesta' => $respuestaIA]);
} else {
    // Si la API regresa un error, lo extraemos detalladamente para verlo en la burbuja del chat
    if (isset($responseArray['error']['message'])) {
        $errorDetalle = $responseArray['error']['message'];
    } else {
        $errorDetalle = 'Respuesta inesperada del servidor. JSON devuelto: ' . json_encode($responseArray);
    }
    
    echo json_encode([
        'respuesta' => 'Error de Google: ' . $errorDetalle
    ]);
}

mysqli_close($conn);
?>