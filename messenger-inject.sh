#!/data/data/com.termux/files/usr/bin/bash
CHANNEL_ID="61554018924556"
MARKER="sadv41-messenger-widget"
TARGET_DIR="${1:-.}"
C='\033[0;36m'; G='\033[0;32m'; Y='\033[1;33m'; R='\033[0;31m'; N='\033[0m'
echo -e "${C}═══════════════════════════════════════${N}"
echo -e "${Y}  SADV41 · Widget Messenger Injector${N}"
echo -e "${C}  Canal: messenger.com/channel/${CHANNEL_ID}${N}"
echo -e "${C}  Directorio: ${TARGET_DIR}${N}"
echo -e "${C}═══════════════════════════════════════${N}"
if ! command -v python3 &>/dev/null; then
  echo -e "${R}Error: instala python con: pkg install python${N}"; exit 1
fi
python3 - "$TARGET_DIR" "$MARKER" "$CHANNEL_ID" << 'PYEOF'
import sys, re
from pathlib import Path
target = Path(sys.argv[1]).expanduser().resolve()
marker = sys.argv[2]
channel_id = sys.argv[3]
WIDGET = f"""
<!-- SADV41 Messenger Widget -->
<div id="{marker}" style="position:fixed;bottom:20px;right:20px;z-index:99999;display:flex;flex-direction:column;align-items:center;gap:4px;">
  <a href="https://www.messenger.com/channel/{channel_id}" target="_blank" rel="noopener" title="Canal SADV41 en Facebook Messenger" style="display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#0084ff,#00c6ff);box-shadow:0 4px 16px rgba(0,132,255,0.5);transition:transform .2s,box-shadow .2s;text-decoration:none;" onmouseover="this.style.transform='scale(1.12)';this.style.boxShadow='0 6px 24px rgba(0,132,255,0.7)'" onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 4px 16px rgba(0,132,255,0.5)'"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 36 36" fill="white"><path d="M18 2C9.163 2 2 8.615 2 17c0 4.552 1.978 8.633 5.148 11.503L7 32l3.566-1.896C12.287 30.962 15.079 31.5 18 31.5 26.837 31.5 34 24.885 34 16.5S26.837 2 18 2zm1.78 20.078l-4.55-4.86-8.882 4.86 9.774-10.371 4.669 4.859 8.762-4.859-9.773 10.371z"/></svg></a>
  <span style="font-size:9px;color:#fff;background:rgba(0,0,0,0.6);border-radius:4px;padding:1px 5px;font-family:sans-serif;letter-spacing:.5px;pointer-events:none;">SADV41</span>
</div>
"""
files = list(target.rglob("*.html"))
modified = skipped = errors = 0
for fp in files:
    try: content = fp.read_text(encoding="utf-8", errors="replace")
    except: errors += 1; continue
    if marker in content: skipped += 1; continue
    import re as _re
    if _re.search(r"</body>", content, _re.IGNORECASE):
        new = _re.sub(r"(</body>)", WIDGET + r"\1", content, count=1, flags=_re.IGNORECASE)
    elif _re.search(r"</html>", content, _re.IGNORECASE):
        new = _re.sub(r"(</html>)", WIDGET + r"\1", content, count=1, flags=_re.IGNORECASE)
    else: new = content + WIDGET
    try: fp.write_text(new, encoding="utf-8"); modified += 1
    except: errors += 1
print(f"\n✅ Inyectados: {modified} | ⏭ Ya tenían: {skipped} | ❌ Errores: {errors} | 📄 Total: {len(files)}")
PYEOF
echo -e "\n${G}✅ Listo.${N} Para instalar como comando global:\n  cp ~/SADV41/messenger-inject.sh \$PREFIX/bin/msgwidget && chmod +x \$PREFIX/bin/msgwidget"
