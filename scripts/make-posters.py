from PIL import Image
from pathlib import Path

src = Path("shots/frames")
out = Path("public/posters")

def wide(name, target_w=1600):
    im = Image.open(src / f"{name}.png").convert("RGB")
    w, h = im.size
    im = im.resize((target_w, round(h * target_w / w)), Image.LANCZOS)
    im.save(out / f"{name}.webp", "WEBP", quality=82, method=6)
    im.save(out / f"{name}.jpg", "JPEG", quality=78, optimize=True, progressive=True)
    print(name, im.size, (out / f"{name}.webp").stat().st_size, (out / f"{name}.jpg").stat().st_size)

def square(name, target=900):
    im = Image.open(src / f"{name}.png").convert("RGB")
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    im = im.crop((left, top, left + side, top + side)).resize((target, target), Image.LANCZOS)
    im.save(out / f"{name}.webp", "WEBP", quality=82, method=6)
    print(name, im.size, (out / f"{name}.webp").stat().st_size)

wide("hero")
wide("about")
wide("cta")
for n in ("nft1", "nft2", "nft3"):
    square(n)
