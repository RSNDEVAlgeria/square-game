import os

gameplay_path = r"c:\Users\Ets BENNEDDIF\Downloads\square game me\app\src\scenes\Gameplay.tsx"
new_ui_path = r"c:\Users\Ets BENNEDDIF\Downloads\square game me\app\src\scenes\gameplay_ui_new.txt"

with open(gameplay_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open(new_ui_path, 'r', encoding='utf-8') as f:
    new_ui_content = f.read()

# Lines 1 to 145 are indices 0 to 144.
# We want to keep lines covering lines 1 to 145.
# Python slicing [0:145] includes 0..144.
pre_content = lines[:145]

# We want to replace lines 146 to 423 (indices 145 to 422).
# So we keep from 423 onwards (indices 423...).
post_content = lines[423:]

# Double check
print(f"First line being replaced (146): {lines[145].strip()}")
print(f"Last line being replaced (423): {lines[422].strip()}")
print(f"First line kept after (424): {lines[423].strip() if len(lines) > 423 else 'EOF'}")

final_content = "".join(pre_content) + new_ui_content + "\n" + "".join(post_content)

with open(gameplay_path, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Successfully updated Gameplay.tsx")
