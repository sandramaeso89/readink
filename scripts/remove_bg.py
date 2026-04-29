"""Script puntual para hacer transparente el fondo blanco del logo.

Uso:
    python scripts/remove_bg.py src/assets/readink-logo.png

Detecta pixeles cercanos al blanco y los convierte en transparentes,
preservando los bordes del badge oscuro y el icono ambar.
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image


WHITE_THRESHOLD = 235


def remove_white_background(src: Path, dst: Path, threshold: int = WHITE_THRESHOLD) -> None:
    image = Image.open(src).convert("RGBA")
    pixels = image.load()
    width, height = image.size

    for y in range(height):
        for x in range(width):
            r, g, b, _ = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (0, 0, 0, 0)

    image.save(dst, "PNG")


def main() -> None:
    if len(sys.argv) < 2:
        print("Uso: python scripts/remove_bg.py <ruta-imagen>")
        sys.exit(1)

    src = Path(sys.argv[1])
    if not src.exists():
        print(f"No existe: {src}")
        sys.exit(1)

    remove_white_background(src, src)
    print(f"Fondo blanco eliminado: {src}")


if __name__ == "__main__":
    main()
