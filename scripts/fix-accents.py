import re, pathlib
files = {
 "src/sections/Stats.tsx": ('accentClassName="absolute -bottom-6 right-0 sm:-bottom-8"', 'accentClassName="absolute -top-12 right-0 -rotate-6 sm:-top-16 lg:-top-24"'),
 "src/sections/Steps.tsx": ('accentClassName="absolute -bottom-6 right-0 sm:-bottom-8"', 'accentClassName="absolute -top-12 right-0 -rotate-6 sm:-top-16 lg:-top-24"'),
 "src/sections/Creators.tsx": ('accentClassName="absolute -bottom-6 right-0 sm:-bottom-8"', 'accentClassName="absolute -top-12 right-0 -rotate-6 sm:-top-16 lg:-top-24"'),
 "src/sections/FAQ.tsx": ('accentClassName="absolute -bottom-6 right-0 sm:-bottom-8"', 'accentClassName="absolute -top-12 right-0 -rotate-6 sm:-top-16 lg:-top-24"'),
 "src/sections/MissionLog.tsx": ('accentClassName="absolute -bottom-7 right-0 sm:-bottom-9"', 'accentClassName="absolute -top-12 right-0 -rotate-6 sm:-top-16 lg:-top-24"'),
}
for path, (old, new) in files.items():
    p = pathlib.Path(path)
    text = p.read_text(encoding="utf-8")
    assert old in text, path
    p.write_text(text.replace(old, new), encoding="utf-8")
    print("updated", path)
