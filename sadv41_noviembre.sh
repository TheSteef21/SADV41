#!/data/data/com.termux/files/usr/bin/bash
# SADV41 - Todo lo de hoy guardado
# Crea shortcut Termux + Inyecta widget "Feliz Mes de Noviembre 🇵🇦👑🇺🇸" en todas las páginas + push

set -e

REPO="$HOME/sadv41"
TOOL_DIR="$REPO/tools"
SHORTCUT_DIR="$HOME/.shortcuts"
WIDGET_FILE="$TOOL_DIR/noviembre_widget.html"
WIDGET_ID="sadv41-noviembre-widget"

echo "🇵🇦 SADV41 Noviembre - Iniciando..."

mkdir -p "$TOOL_DIR" "$SHORTCUT_DIR"

# 1. Crear el HTML del widget
cat > "$WIDGET_FILE" <<'WHTML'
<div id="sadv41-noviembre-widget" style="position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:999999;background:linear-gradient(135deg,#00209F 0%,#00209F 30%,#FFFFFF 30%,#FFFFFF 70%,#D21034 70%);color:#111;padding:10px 18px;border-radius:999px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,sans-serif;font-weight:900;font-size:14px;letter-spacing:.3px;box-shadow:0 8px 30px rgba(0,0,0,.35),0 0 0 2px rgba(255,255,255,.9) inset;display:flex;align-items:center;gap:8px;">
  <span>Feliz Mes de Noviembre</span><span>🇵🇦👑🇺🇸</span>
  <button onclick="this.parentElement.remove()" style="margin-left:8px;background:rgba(0,0,0,.12);border:0;border-radius:50%;width:22px;height:22px;cursor:pointer;font-weight:900;line-height:1;">×</button>
</div>
WHTML

echo "[1/4] Widget creado en $WIDGET_FILE"

# 2. Inyectar widget en TODAS las páginas .html (idempotente)
echo "[2/4] Inyectando widget en todas las páginas..."

export WIDGET_FILE
find "$REPO" -type f -name "*.html" -print0 | while IFS= read -r -d '' htmlfile; do
  if grep -q "$WIDGET_ID" "$htmlfile" 2>/dev/null; then
    continue
  fi
  python3 - "$htmlfile" "$WIDGET_FILE" <<'PY'
import sys, re
html_path = sys.argv[1]
widget_path = sys.argv[2]
with open(widget_path, 'r', encoding='utf-8') as f:
    widget = f.read()
with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()
if 'sadv41-noviembre-widget' in content:
    sys.exit(0)
# inyectar antes de </body>, si no hay, al final
if re.search(r'</body>', content, re.IGNORECASE):
    content = re.sub(r'</body>', widget + '\n</body>', content, count=1, flags=re.IGNORECASE)
else:
    content = content + '\n' + widget + '\n'
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f" + {html_path}")
PY
done

echo "[3/4] Creando shortcut de Termux..."

# Script que será el shortcut
cat > "$SHORTCUT_DIR/sadv41-noviembre" <<'SHORT'
#!/data/data/com.termux/files/usr/bin/bash
cd ~/sadv41
bash ~/sadv41/tools/run_noviembre.sh
SHORT

cat > "$TOOL_DIR/run_noviembre.sh" <<'RUN'
#!/data/data/com.termux/files/usr/bin/bash
set -e
cd ~/sadv41
echo ">> SADV41 Noviembre Push"
# Si quedo un rebase a medias de antes
if [ -d ".git/rebase-merge" ] || [ -d ".git/rebase-apply" ]; then
  echo "!! Rebase a medias detectado, abortando para empezar limpio"
  git rebase --abort || true
fi
git fetch origin
# Intenta rebase, si falla por USSS lo resuelve solo
if ! git pull --rebase origin main; then
  echo ">> Conflicto detectado, resolviendo USSS/.ss_job_application.html con --theirs"
  git checkout --theirs USSS/.ss_job_application.html 2>/dev/null || true
  git add USSS/.ss_job_application.html 2>/dev/null || true
  git rebase --continue || true
fi
git add -A
if ! git diff --cached --quiet; then
  git commit -m "SADV41 TSEC: Widget Noviembre 🇵🇦👑🇺🇸 - Feliz Mes de Noviembre"
else
  echo "Nada nuevo para commitear"
fi
git push origin main
echo "✅ Push OK - $(git log --oneline -1)"
RUN

chmod +x "$SHORTCUT_DIR/sadv41-noviembre" "$TOOL_DIR/run_noviembre.sh"
echo "Shortcut creado: ~/.shortcuts/sadv41-noviembre"
echo "Ahora puedes agregar el Widget Termux:Shortcuts en tu launcher"

# 4. Git push final de todo
echo "[4/4] Guardando y desplegando..."
cd "$REPO"
git add -A
if ! git diff --cached --quiet; then
  git commit -m "SADV41 TSEC: Expediente Noviembre + Widget Feliz Mes de Noviembre 🇵🇦👑🇺🇸"
fi

# Manejo de rebase si vuelve a pasar
if ! git pull --rebase origin main; then
  git checkout --theirs USSS/.ss_job_application.html 2>/dev/null || true
  git add USSS/.ss_job_application.html 2>/dev/null || true
  git rebase --continue 2>/dev/null || true
fi

git push origin main

echo ""
echo "🎉 LISTO - Todo guardado"
echo "Commit actual: $(git log --oneline -1)"
echo "Widget inyectado en $(find "$REPO" -name "*.html" | wc -l) páginas"
echo "Shortcut Termux: mantén presionado en escritorio > Widgets > Termux:Shortcut > sadv41-noviembre"
echo ""
echo "La dirección sigue descansando contigo. TSEC/AZUERO-SONÁ/META y METAAI con widget."

