from PIL import Image
from pathlib import Path

src = Path("shots/frames")
out = Path("public/posters")
for name, frame in (("mint", "hero"), ("roadmap", "about")):
    im = Image.open(src / f"{frame}.png").convert("RGB")
    w, h = im.size
    im = im.resize((1600, round(h * 1600 / w)), Image.LANCZOS)
    im.save(out / f"{name}.webp", "WEBP", quality=82, method=6)
    im.save(out / f"{name}.jpg", "JPEG", quality=78, optimize=True, progressive=True)
    print(name, im.size, (out / f"{name}.webp").stat().st_size)
