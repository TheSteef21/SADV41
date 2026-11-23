#!/data/data/com.termux/files/usr/bin/bash
set -e
if [ -f "$HOME/bin/sadv41-widgets-snippet.html" ]; then SNIPPET_FILE="$HOME/bin/sadv41-widgets-snippet.html";
elif [ -f "$HOME/SADV41/sadv41-widgets-snippet.html" ]; then SNIPPET_FILE="$HOME/SADV41/sadv41-widgets-snippet.html";
else SNIPPET_FILE="$(dirname "$0")/sadv41-widgets-snippet.html"; fi
inject_one(){
  local file="$1"
  [ ! -f "$file" ] && echo "⚠️ No existe: $file" && return 0
  grep -q "SADV41-WIDGETS-START" "$file" && echo "✅ Ya inyectado: $file" && return 0
  tmp=$(mktemp)
  awk -v sf="$SNIPPET_FILE" 'BEGIN{while((getline l < sf)>0) s=s l "\n"} /<\/body>/{print s; print; next} {print}' "$file" > "$tmp" && mv "$tmp" "$file"
  echo "💉 Inyectado: $file"
}
if [ "$1" = "--install" ]; then
  mkdir -p "$HOME/bin" "$HOME/SADV41"
  cp "$0" "$HOME/bin/sadv41-inject"; chmod +x "$HOME/bin/sadv41-inject"
  cp "$SNIPPET_FILE" "$HOME/bin/sadv41-widgets-snippet.html" 2>/dev/null || true
  cp "$SNIPPET_FILE" "$HOME/SADV41/sadv41-widgets-snippet.html" 2>/dev/null || true
  grep -q 'HOME/bin' "$HOME/.bashrc" 2>/dev/null || echo 'export PATH="$HOME/bin:$PATH"' >> "$HOME/.bashrc"
  echo "✅ sadv41-inject instalado"; exit 0
fi
if [ $# -eq 0 ]; then for f in "ECUACIONES/TMS/index.html" "TimeMakeSpace/🇵🇦🌌⭐️/index.html" "GORRA/index.html" *.html; do [ -f "$f" ] && inject_one "$f"; done
else for f in "$@"; do inject_one "$f"; done; fi
