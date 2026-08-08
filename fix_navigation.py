from pathlib import Path
import re
import shutil

ROOT = Path(__file__).parent

TARGETS = [
    "pages_ext",
    "pages_int"
]

modificados = 0
analizados = 0

for carpeta in TARGETS:

    ruta = ROOT / carpeta

    if not ruta.exists():
        continue

    for archivo in ruta.rglob("*.html"):

        analizados += 1

        contenido = archivo.read_text(encoding="utf-8")

        original = contenido

        profundidad = len(archivo.relative_to(ROOT).parents) - 1

        base = "../" * profundidad


        # Corrige rutas absolutas de páginas internas
        contenido = re.sub(
            r"(['\"])\/(pages_int\/[^'\"]+)\1",
            lambda m: m.group(1) + base + m.group(2) + m.group(1),
            contenido
        )


        # Corrige rutas absolutas de páginas externas
        contenido = re.sub(
            r"(['\"])\/(pages_ext\/[^'\"]+)\1",
            lambda m: m.group(1) + base + m.group(2) + m.group(1),
            contenido
        )


        if contenido != original:

            shutil.copy2(
                archivo,
                str(archivo) + ".bak_nav"
            )

            archivo.write_text(
                contenido,
                encoding="utf-8"
            )

            modificados += 1


print()
print("==============================")
print("Corrección de navegación lista")
print("==============================")
print("Archivos analizados :", analizados)
print("Archivos modificados:", modificados)
print("==============================")