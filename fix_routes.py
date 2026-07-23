from pathlib import Path
import shutil
import re

# Ruta del proyecto (el script debe estar en la raíz)
ROOT = Path(__file__).parent

# Carpetas que se corregirán
TARGETS = ["pages_ext", "pages_int"]

# Recursos que usan rutas absolutas
FOLDERS = [
    "assets",
    "styles",
    "js",
    "Recursos",
    "json",
    "php"
]

modificados = 0
analizados = 0

for carpeta in TARGETS:

    carpeta_actual = ROOT / carpeta

    if not carpeta_actual.exists():
        continue

    for archivo in carpeta_actual.rglob("*.html"):

        analizados += 1

        contenido = archivo.read_text(encoding="utf-8")

        original = contenido

        # Calcula cuántos niveles hay desde el html hasta la raíz del proyecto
        profundidad = len(archivo.relative_to(ROOT).parents) - 1

        base = "../" * profundidad

        for recurso in FOLDERS:

            patron = rf'([\'"\(])/{recurso}/'

            reemplazo = rf'\1{base}{recurso}/'

            contenido = re.sub(
                patron,
                reemplazo,
                contenido
            )

        if contenido != original:

            # respaldo
            shutil.copy2(
                archivo,
                str(archivo) + ".bak"
            )

            archivo.write_text(
                contenido,
                encoding="utf-8"
            )

            modificados += 1

print()
print("="*40)
print("Proceso terminado")
print("="*40)
print("Archivos analizados :", analizados)
print("Archivos modificados:", modificados)
print("="*40)