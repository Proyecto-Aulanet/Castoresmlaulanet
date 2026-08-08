from pathlib import Path
import re

ROOT = Path(__file__).parent
LECCIONES = ROOT / "pages_int" / "lecciones"

patron = re.compile(
    r'<div\s+class="headerint-logo">.*?</div>',
    re.DOTALL
)

modificados = 0

for archivo in LECCIONES.rglob("*.html"):

    texto = archivo.read_text(encoding="utf-8")

    nuevo = """<div class="headerint-logo">

                    <img src="../../../Recursos/logos/logos.svg" alt="logo" class="img-fluid"
                        style="max-width:185px;" data-aos="fade-right">

                </div>"""

    # Solo reemplaza si aún existe alguno de los logos viejos
    if "utp_svg.svg" in texto or "logo_completo_svg.svg" in texto:
        texto = patron.sub(nuevo, texto, count=1)
        archivo.write_text(texto, encoding="utf-8")
        modificados += 1
        print(f"✔ {archivo}")

print(f"\nSe modificaron {modificados} archivos.")