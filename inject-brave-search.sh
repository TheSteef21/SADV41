#!/data/data/com.termux/files/usr/bin/bash
set -e
python3 - << 'PY'
import os

root = os.getcwd()
widget_abs = os.path.join(root, "assets", "brave-search-widget.js")
updated = 0

for dirpath, dirnames, filenames in os.walk(root):
    dirnames[:] = [d for d in dirnames if not d.startswith(".")]
    for fn in filenames:
        if not fn.lower().endswith(".html"):
            continue
        html_path = os.path.join(dirpath, fn)
        rel_src = os.path.relpath(widget_abs, dirpath).replace("\\", "/")
        tag = f'<script src="{rel_src}" defer></script>'

        with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        if "brave-search-widget.js" in content:
            continue

        if "</body>" in content:
            new_content = content.replace("</body>", f"  {tag}\n</body>", 1)
        else:
            new_content = content + f"\n{tag}\n"

        with open(html_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        updated += 1
        print(f"[INJECTED] {os.path.relpath(html_path, root)} -> {rel_src}")

print(f"Total HTML actualizados con Brave Search Widget: {updated}")
PY
