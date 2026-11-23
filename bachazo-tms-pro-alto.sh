#!/data/data/com.termux/files/usr/bin/bash
set -e
cd "$HOME/SADV41"
echo "🚀 [SADV41 PRO ALTO] Desplegando TMS v2 + Messenger + Spotify"

# 1. Snippet Messenger + Spotify
cat << 'SNIPPET_EOF' > sadv41-widgets-snippet.html
<!-- SADV41-WIDGETS-START | Messenger + Spotify -->
<style>
#sadv41-fab-stack{position:fixed;left:16px;bottom:16px;z-index:10000;display:flex;flex-direction:column;gap:10px;font-family:system-ui,sans-serif}
.sadv41-fab-btn{width:56px;height:56px;border-radius:999px;border:1px solid #00e5ff;color:#fff;font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 28px rgba(0,0,0,.55)}
.sadv41-fab-btn.msg{background:linear-gradient(135deg,#0084ff,#00e5ff)}
.sadv41-fab-btn.spot{background:linear-gradient(135deg,#1DB954,#1ed760);border-color:#1DB954;color:#000}
.sadv41-card{width:300px;max-width:calc(100vw - 32px);background:#07131f;border:1px solid #00e5ff;border-radius:16px;padding:16px;box-shadow:0 18px 50px rgba(0,0,0,.75);display:none;color:#e6edf3}
.sadv41-card.open{display:block}
.sadv41-card h4{color:#ffd700;margin:0 0 6px;font-size:15px}
.sadv41-card p{color:#9fb0c3;font-size:13px;margin:0 0 12px;line-height:1.5}
.sadv41-card a.cta{display:block;text-align:center;text-decoration:none;font-weight:800;padding:11px;border-radius:999px;font-size:14px}
.sadv41-card a.cta.msg{background:#0084ff;color:#fff}
.sadv41-card a.cta.spot{background:#1DB954;color:#000}
.sadv41-close{float:right;background:transparent;border:0;color:#9fb0c3;cursor:pointer;font-size:16px}
</style>
<div id="sadv41-fab-stack">
  <div id="sadv41-card-msg" class="sadv41-card">
    <button class="sadv41-close" data-close="sadv41-card-msg">✕</button>
    <h4>Messenger · Canal SADV41</h4>
    <p>Actualizaciones TMS, ecuaciones y despliegues.</p>
    <a class="cta msg" href="https://www.messenger.com/channel/61554018924556" target="_blank" rel="noopener">Abrir canal →</a>
  </div>
  <div id="sadv41-card-spot" class="sadv41-card">
    <button class="sadv41-close" data-close="sadv41-card-spot">✕</button>
    <h4>Spotify · 3 meses gratis</h4>
    <p>Referral oficial SADV41.</p>
    <a class="cta spot" href="https://open.spotify.com/referral/003988e58c5d863711ce35278c66785f53a04d248c0fd8b116a577?si=fGM0R1MCT0me_qn5CtqVmg&utm_source=copy-link&locale=es&sci=spotify%3Acard-config%3A5IucLbrjbi1ulYi3cpFglY" target="_blank" rel="noopener">Reclamar 3 meses →</a>
  </div>
  <button id="sadv41-btn-msg" class="sadv41-fab-btn msg">💬</button>
  <button id="sadv41-btn-spot" class="sadv41-fab-btn spot">🎵</button>
</div>
<script>
(function(){
  function toggle(id){var el=document.getElementById(id);if(!el)return;var w=el.classList.contains('open');document.querySelectorAll('.sadv41-card').forEach(function(c){c.classList.remove('open')});if(!w)el.classList.add('open');}
  document.getElementById('sadv41-btn-msg').addEventListener('click',function(){toggle('sadv41-card-msg')});
  document.getElementById('sadv41-btn-spot').addEventListener('click',function(){toggle('sadv41-card-spot')});
  document.querySelectorAll('.sadv41-close').forEach(function(b){b.addEventListener('click',function(){document.getElementById(b.getAttribute('data-close')).classList.remove('open')})});
})();
</script>
<!-- SADV41-WIDGETS-END -->
SNIPPET_EOF

# 2. Inyector global
cat << 'INJECT_EOF' > inject-sadv41-widgets.sh
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
INJECT_EOF
chmod +x inject-sadv41-widgets.sh
./inject-sadv41-widgets.sh --install
export PATH="$HOME/bin:$PATH"

# 3. SuperHTML v2 - usa tu plantilla completa anterior, solo cambia el footer
# Si ya tienes SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html, solo inyecta y agrega firma:
if [ -f "SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html" ]; then
  echo "Usando tu plantilla v2 existente + firma Meta GFX"
else
  echo "⚠️ No existe SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html - crea primero tu plantilla v2 y vuelve a correr"
  exit 1
fi

# 4. Agregar firma Meta GFX en footer si no existe
for F in "SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html"; do
  if ! grep -q "Meta GFX" "$F"; then
    tmp=$(mktemp)
    awk '/<\/body>/{print "<!-- FIRMA META GFX --><footer style=\"text-align:center;padding:1.5rem 1rem;border-top:1px solid rgba(229,185,76,.28);color:#94a3b8;font-size:.84rem;\"><p><strong style=\"color:#fae094;\">SADV41 · Time Make Space</strong></p><p>Arte y código generados por <strong style=\"color:#00e5ff;\">Meta GFX — Meta AI de WhatsApp</strong></p><p>Guardado por Steven Dior · Panamá · 21 Nov 2026</p><p>Tú eres lo que hace soberana a una nación.</p></footer>"; print; next} {print}' "$F" > "$tmp" && mv "$tmp" "$F"
    echo "✍️ Firma Meta GFX agregada en: $F"
  fi
done

sadv41-inject SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html

# 5. Desplegar a 3 rutas
mkdir -p "ECUACIONES/TMS" "TimeMakeSpace/🇵🇦🌌⭐️" "GORRA"
cp SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html "ECUACIONES/TMS/index.html"
cp SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html "TimeMakeSpace/🇵🇦🌌⭐️/index.html"
if [ -f "GORRA/index.html" ]; then
  echo "🧢 GORRA existe -> solo inyectar"
  sadv41-inject "GORRA/index.html"
else
  cp SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html "GORRA/index.html"
fi

git add "ECUACIONES/TMS/index.html" "TimeMakeSpace/🇵🇦🌌⭐️/index.html" "GORRA/index.html" SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html inject-sadv41-widgets.sh sadv41-widgets-snippet.html
git commit -m "PRO ALTO: TMS v2 + Messenger + Spotify + Firma Meta GFX" || echo "ℹ️ Sin cambios"
git push origin main
echo "✅ PRO ALTO completado + Firma Meta GFX"
