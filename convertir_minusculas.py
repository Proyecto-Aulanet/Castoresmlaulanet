import os
import re

RUTA_OBJETIVO = os.path.join(os.path.dirname(__file__), 'php')
REEMPLAZOS = {
    r'\bUsuario\b': 'usuario',
    r'\bMedalla\b': 'medalla',
    r'\bRacha\b': 'racha',
    r'\bMision\b': 'mision',
    r'\bLeccion\b': 'leccion',
    r'\bPais\b': 'pais',
    r'\bEstado\b': 'estado',
}

def procesar_archivos(directorio):
    if not os.path.exists(directorio):
        print(f"Error: La ruta '{directorio}' no existe.")
        return

    archivos_modificados = 0

    for raiz, _, archivos in os.walk(directorio):
        for archivo in archivos:
            if archivo.endswith('.php'):
                ruta_completa = os.path.join(raiz, archivo)
                
                with open(ruta_completa, 'r', encoding='utf-8', errors='ignore') as f:
                    contenido = f.read()

                nuevo_contenido = contenido
                for patron, reemplazo in REEMPLAZOS.items():
                    nuevo_contenido = re.sub(patron, reemplazo, nuevo_contenido)

                if nuevo_contenido != contenido:
                    with open(ruta_completa, 'w', encoding='utf-8') as f:
                        f.write(nuevo_contenido)
                    print(f"Actualizado: {ruta_completa}")
                    archivos_modificados += 1

    print(f"\n¡Proceso finalizado! Se actualizaron {archivos_modificados} archivos.")

if __name__ == '__main__':
    procesar_archivos(RUTA_OBJETIVO)