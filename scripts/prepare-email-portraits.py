"""Remove white backgrounds from Hai/DiHo email portrait sources."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
EMAIL_DIR = ROOT / "public" / "images" / "email"

PORTRAITS = (
    ("hai-portrait-source.png", "hai-email-portrait.png", 420),
    ("diho-portrait-source.png", "diho-email-portrait.png", 420),
)


def is_matte(r: int, g: int, b: int) -> bool:
    return (r >= 254 and g >= 252 and b >= 249) or (
        r >= 252 and g >= 252 and b >= 252 and max(r, g, b) - min(r, g, b) <= 4
    )


def flood_remove_matte(im: Image.Image) -> Image.Image:
    w, h = im.size
    px = im.load()
    remove = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        if not remove[y][x] and is_matte(*px[x, y][:3]):
            remove[y][x] = True
            q.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not remove[ny][nx] and is_matte(*px[nx, ny][:3]):
                remove[ny][nx] = True
                q.append((nx, ny))

    out = im.copy()
    opx = out.load()
    for y in range(h):
        for x in range(w):
            if remove[y][x]:
                opx[x, y] = (0, 0, 0, 0)
            else:
                r, g, b, a = opx[x, y]
                opx[x, y] = (r, g, b, 255)
    return out


def defringe(im: Image.Image) -> Image.Image:
    w, h = im.size
    px = im.load()
    out = im.copy()
    opx = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if a < 255 and r > 230 and g > 230 and b > 230:
                opx[x, y] = (0, 0, 0, 0)
            elif a == 255 and r > 252 and g > 252 and b > 252:
                trans = 0
                for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] == 0:
                        trans += 1
                if trans >= 2:
                    opx[x, y] = (0, 0, 0, 0)
    return out


def crop_to_content(im: Image.Image, pad: int = 10) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.size[0], x1 + pad)
    y1 = min(im.size[1], y1 + pad)
    return im.crop((x0, y0, x1, y1))


def resize_preserve_alpha(im: Image.Image, width: int) -> Image.Image:
    scale = width / im.size[0]
    height = round(im.size[1] * scale)
    r, g, b, a = im.split()
    rgb = Image.merge("RGB", (r, g, b)).resize((width, height), Image.Resampling.LANCZOS)
    alpha = a.resize((width, height), Image.Resampling.LANCZOS)
    out = rgb.convert("RGBA")
    out.putalpha(alpha)
    return out


def process(src_name: str, out_name: str, target_width: int) -> None:
    src = EMAIL_DIR / src_name
    out = EMAIL_DIR / out_name
    im = Image.open(src).convert("RGBA")
    im = flood_remove_matte(im)
    im = defringe(im)
    im = crop_to_content(im, pad=12)
    im = resize_preserve_alpha(im, target_width)
    im.save(out, optimize=True)
    print(f"Saved {out} ({im.size[0]}x{im.size[1]})")


def main() -> None:
    EMAIL_DIR.mkdir(parents=True, exist_ok=True)
    for src, out, width in PORTRAITS:
        process(src, out, width)


if __name__ == "__main__":
    main()
