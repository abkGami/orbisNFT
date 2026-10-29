"""Generate original, licence-clean visual assets for Orbis.Nft.

Outputs
  public/texture.png          film-grain overlay used with mix-blend-mode: lighten
  public/posters/*.webp|.jpg  procedural deep-space posters (video fallbacks + og:image)
  public/favicon.svg

Everything here is generated from code, so no third-party artwork is copied.
Run:  python scripts/generate_assets.py
"""
from __future__ import annotations

import math
import os
import random

from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
POSTERS = os.path.join(PUBLIC, "posters")

NAVY = (1, 8, 40)
NAVY_2 = (4, 16, 58)
CREAM = (239, 244, 255)
NEON = (111, 255, 0)
VIOLET = (183, 36, 255)
INDIGO = (124, 58, 237)


def ensure_dirs() -> None:
    os.makedirs(POSTERS, exist_ok=True)


def make_texture(size: int = 448) -> None:
    """Fine grain. Mostly black with very sparse, dim specks.

    Grayscale (no alpha) so the overlay can stay a light file; opacity and
    mix-blend-mode are applied in CSS. Kept subtle on purpose: at 0.6 opacity
    with `lighten`, dense specks read as falling snow rather than film grain.
    """
    rng = random.Random(7)
    # Quantised levels keep the PNG small while still reading as grain.
    levels = [0, 1, 2, 3, 4, 6, 8, 10, 12, 15, 18, 22, 26, 31,
              37, 44, 52, 62, 74, 88, 104, 122, 142, 164]
    img = Image.new("L", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            n = rng.random()
            if n > 0.9993:  # rare sparkle
                v = rng.choice(levels[17:])
            elif n > 0.982:
                v = rng.choice(levels[9:14])
            else:
                v = rng.choice(levels[:5])
            px[x, y] = v
    img.save(os.path.join(PUBLIC, "texture.png"), optimize=True)


def radial_layer(size, color, center, radius, strength):
    """A soft radial glow as a separate RGBA layer."""
    w, h = size
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    steps = 26
    for i in range(steps, 0, -1):
        t = i / steps
        r = radius * t
        alpha = int(strength * (1 - t) ** 2.1)
        if alpha <= 0:
            continue
        d.ellipse(
            [center[0] - r, center[1] - r * 0.78, center[0] + r, center[1] + r * 0.78],
            fill=(color[0], color[1], color[2], alpha),
        )
    return layer.filter(ImageFilter.GaussianBlur(radius * 0.16))


def make_poster(name: str, seed: int, accent: tuple[int, int, int], accent_pos=(0.72, 0.42),
                accent_scale=0.55, bright: float = 1.0) -> None:
    w, h = 1600, 900
    rng = random.Random(seed)

    # Base vertical gradient navy -> navy-2 -> navy
    base = Image.new("RGB", (w, h), NAVY)
    d = ImageDraw.Draw(base)
    for y in range(h):
        t = y / (h - 1)
        # ease in/out so the middle lifts gently
        e = math.sin(t * math.pi) ** 1.4
        c = tuple(int(NAVY[i] + (NAVY_2[i] - NAVY[i]) * e * 0.9) for i in range(3))
        d.line([(0, y), (w, y)], fill=c)

    img = base.convert("RGBA")

    # Nebula glows
    glows = [
        (accent, (accent_pos[0] * w, accent_pos[1] * h), w * accent_scale, 120),
        (INDIGO, (w * (accent_pos[0] - 0.34), h * (accent_pos[1] + 0.22)), w * 0.42, 90),
        (NEON, (w * (accent_pos[0] + 0.18), h * (accent_pos[1] + 0.34)), w * 0.2, 34),
        ((70, 90, 190), (w * (accent_pos[0] - 0.1), h * (accent_pos[1] - 0.42)), w * 0.5, 60),
    ]
    for color, center, radius, strength in glows:
        img = Image.alpha_composite(img, radial_layer((w, h), color, center, radius, strength))

    # Star field
    stars = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(stars)
    for _ in range(1400):
        x = rng.uniform(0, w)
        y = rng.uniform(0, h)
        # denser stars toward the glow so it reads as a nebula core
        r = rng.random() ** 3
        radius = 0.6 + r * 1.9
        alpha = int(rng.uniform(40, 210) * bright)
        sd.ellipse([x - radius, y - radius, x + radius, y + radius], fill=(*CREAM, alpha))
    for _ in range(26):
        x = rng.uniform(0, w)
        y = rng.uniform(0, h)
        radius = rng.uniform(2.2, 4.4)
        sd.ellipse([x - radius * 4, y - radius * 4, x + radius * 4, y + radius * 4], fill=(*CREAM, 18))
        sd.ellipse([x - radius, y - radius, x + radius, y + radius], fill=(*CREAM, 235))
    stars = stars.filter(ImageFilter.GaussianBlur(0.4))
    img = Image.alpha_composite(img, stars)

    # A faint orbital arc for depth
    arc = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ad = ImageDraw.Draw(arc)
    cx, cy = w * 0.5, h * 0.52
    for ring, alpha in ((0.46, 26), (0.62, 16)):
        box = [cx - w * ring, cy - h * ring * 0.5, cx + w * ring, cy + h * ring * 0.5]
        ad.ellipse(box, outline=(*CREAM, alpha), width=2)
    arc = arc.filter(ImageFilter.GaussianBlur(1.2))
    img = Image.alpha_composite(img, arc)

    # Vignette
    vig = Image.new("L", (w, h), 0)
    vd = ImageDraw.Draw(vig)
    vd.ellipse([-w * 0.35, -h * 0.55, w * 1.35, h * 1.55], fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(180))
    black = Image.new("RGBA", (w, h), (0, 0, 0, 255))
    img = Image.composite(img, black, vig)

    out = img.convert("RGB")
    out.save(os.path.join(POSTERS, f"{name}.webp"), "WEBP", quality=76, method=6)
    out.save(os.path.join(POSTERS, f"{name}.jpg"), "JPEG", quality=78, optimize=True, progressive=True)


def make_og() -> None:
    src = Image.open(os.path.join(POSTERS, "hero.jpg"))
    # crop to 1200x630 from the centre
    tw, th = 1200, 630
    ratio = tw / th
    sw, sh = src.size
    if sw / sh > ratio:
        nw = int(sh * ratio)
        src = src.crop(((sw - nw) // 2, 0, (sw + nw) // 2, sh))
    else:
        nh = int(sw / ratio)
        src = src.crop((0, (sh - nh) // 2, sw, (sh + nh) // 2))
    src = src.resize((tw, th), Image.LANCZOS)
    src.save(os.path.join(PUBLIC, "og.jpg"), "JPEG", quality=82, optimize=True, progressive=True)


FAVICON = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#010828"/>
  <circle cx="32" cy="32" r="13" fill="none" stroke="#EFF4FF" stroke-width="2.5" opacity=".85"/>
  <ellipse cx="32" cy="32" rx="24" ry="9" fill="none" stroke="#6FFF00" stroke-width="2.5"
    transform="rotate(-28 32 32)"/>
  <circle cx="49" cy="21" r="3.4" fill="#6FFF00"/>
</svg>
"""


def main() -> None:
    ensure_dirs()
    make_texture()
    make_poster("hero", 11, VIOLET, (0.74, 0.44), 0.6, 1.05)
    make_poster("about", 23, INDIGO, (0.30, 0.56), 0.7, 0.9)
    make_poster("object", 37, VIOLET, (0.5, 0.5), 0.46, 1.0)
    make_poster("roadmap", 41, (60, 90, 200), (0.6, 0.4), 0.55, 0.8)
    make_poster("mint", 53, VIOLET, (0.68, 0.6), 0.55, 0.95)
    make_poster("cta", 67, (150, 50, 230), (0.5, 0.5), 0.75, 0.9)
    make_og()
    with open(os.path.join(PUBLIC, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(FAVICON)
    print("assets written")


if __name__ == "__main__":
    main()
