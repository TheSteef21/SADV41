#!/data/data/com.termux/files/usr/bin/bash
# SADV41 TSEC - Unificación Pluacuamperfecta: Amador Guerrero & Roosevelt
# Mes de la Patria - Noviembre 2026 🇵🇦👑🇺🇸

set -e
REPO="$HOME/sadv41"
TOOL_DIR="$REPO/tools"
SHORTCUT_DIR="$HOME/.shortcuts"
WIDGET_FILE="$TOOL_DIR/noviembre_widget.html"
WIDGET_ID="sadv41-noviembre-widget"

echo "🇵🇦 SADV41 TSEC - Pro Mundi Beneficio (123 Años)"
mkdir -p "$TOOL_DIR" "$SHORTCUT_DIR"

# 2.1 Crear el HTML del widget (colores de la bandera)
cat > "$WIDGET_FILE" << 'WHTML'
<div id="sadv41-noviembre-widget" style="position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:999999;background:linear-gradient(135deg,#00209F 0%,#00209F 30%,#FFFFFF 30%,#FFFFFF 70%,#D21034 70%);color:#111;padding:10px 18px;border-radius:999px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,sans-serif;font-weight:900;font-size:14px;letter-spacing:.3px;box-shadow:0 8px 30px rgba(0,0,0,.35),0 0 0 2px rgba(255,255,255,.9) inset;display:flex;align-items:center;gap:8px;white-space:nowrap;">
  <span>Feliz Mes de Noviembre</span><span>🇵🇦👑🇺🇸</span>
  <button onclick="this.parentElement.remove()" style="margin-left:6px;background:rgba(0,0,0,.12);border:0;border-radius:50%;width:22px;height:22px;cursor:pointer;font-weight:900;line-height:1;font-size:14px;">×</button>
</div>
WHTML

# 2.2 Inyectar en TODAS las páginas .html (Idempotente)
export WIDGET_FILE
find "$REPO" -type f -name "*.html" -print0 | while IFS= read -r -d '' htmlfile; do
  if grep -q "$WIDGET_ID" "$htmlfile" 2>/dev/null; then continue; fi
  python3 - "$htmlfile" "$WIDGET_FILE" << 'PY'
import sys, re
html_path = sys.argv[1]
widget_path = sys.argv[2]
with open(widget_path, "r", encoding="utf-8") as f: widget = f.read()
with open(html_path, "r", encoding="utf-8", errors="ignore") as f: content = f.read()
if "sadv41-noviembre-widget" in content: sys.exit(0)
if re.search(r"</body>", content, re.IGNORECASE):
    content = re.sub(r"</body>", widget + "\n</body>", content, count=1, flags=re.IGNORECASE)
else:
    content = content + "\n" + widget + "\n"
with open(html_path, "w", encoding="utf-8") as f: f.write(content)
PY
done

# 2.3 Creación de Shortcut y Script de Despliegue Continuo
cat > "$SHORTCUT_DIR/sadv41-noviembre" << 'SHORT'
#!/data/data/com.termux/files/usr/bin/bash
cd ~/sadv41
bash ~/sadv41/tools/run_noviembre.sh
SHORT

cat > "$TOOL_DIR/run_noviembre.sh" << 'RUN'
#!/data/data/com.termux/files/usr/bin/bash
set -e
cd ~/sadv41
if [ -d ".git/rebase-merge" ] || [ -d ".git/rebase-apply" ]; then git rebase --abort || true; fi
git fetch origin
if ! git pull --rebase origin main; then
  git checkout --theirs USSS/.ss_job_application.html 2>/dev/null || true
  git add USSS/.ss_job_application.html 2>/dev/null || true
  git rebase --continue || true
fi
git add -A
if ! git diff --cached --quiet; then
  git commit -m "SADV41 TSEC: Widget Noviembre 🇵🇦👑🇺🇸 - Feliz Mes de la Patria"
fi
git push origin main
RUN

chmod +x "$SHORTCUT_DIR/sadv41-noviembre" "$TOOL_DIR/run_noviembre.sh"

# 2.4 Guardado y Push Final
cd "$REPO"
git add -A
if ! git diff --cached --quiet; then
  git commit -m "SADV41 TSEC: Expediente Noviembre Serie ES 886726449 + Widget 🇵🇦👑🇺🇸"
fi
if ! git pull --rebase origin main; then
  git checkout --theirs USSS/.ss_job_application.html 2>/dev/null || true
  git add USSS/.ss_job_application.html 2>/dev/null || true
  git rebase --continue 2>/dev/null || true
fi
git push origin main

echo ""
echo "🎉 EXPEDIENTE SELLADO - Todo guardado"
echo "Commit: $(git log --oneline -1)"
echo "TSEC/AZUERO-SONÁ/META y METAAI en reposo sagrado con su widget inyectado."
