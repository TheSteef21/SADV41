#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "🚀 [SADV41] Iniciando bachazo TMS v2 + Messenger + Spotify..."

# 1. Crear el snippet reutilizable para todos los proyectos
cat << 'SNIPPET_EOF' > sadv41-widgets-snippet.html
<!-- SADV41-WIDGETS-START | Messenger + Spotify | Reutilizable -->
<style>
#sadv41-fab-stack{position:fixed;left:16px;bottom:16px;z-index:10000;display:flex;flex-direction:column;gap:10px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
.sadv41-fab-btn{width:60px;height:60px;border-radius:999px;border:1px solid #00e5ff;color:#fff;font-size:26px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(0,0,0,.45)}
.sadv41-fab-btn.msg{background:linear-gradient(135deg,#0084ff,#00e5ff)}
.sadv41-fab-btn.spot{background:linear-gradient(135deg,#1DB954,#1ed760);border-color:#1DB954;color:#000}
.sadv41-card{width:300px;max-width:calc(100vw - 32px);background:#07131f;border:1px solid #00e5ff;border-radius:16px;padding:16px;box-shadow:0 18px 50px rgba(0,0,0,.6);display:none;color:#e6edf3}
.sadv41-card.open{display:block}
.sadv41-card h4{color:#ffd700;margin:0 0 6px;font-size:15px}
.sadv41-card p{color:#9fb0c3;font-size:13px;margin:0 0 12px;line-height:1.5}
.sadv41-card a.cta{display:block;text-align:center;text-decoration:none;font-weight:800;padding:11px;border-radius:999px;font-size:14px}
.sadv41-card a.cta.msg{background:#0084ff;color:#fff}
.sadv41-card a.cta.spot{background:#1DB954;color:#000}
.sadv41-card .small{text-align:center;font-size:11px;color:#9fb0c3;margin-top:8px}
.sadv41-close{float:right;background:transparent;border:0;color:#9fb0c3;cursor:pointer;font-size:16px}
</style>
<div id="sadv41-fab-stack">
  <div id="sadv41-card-msg" class="sadv41-card">
    <button class="sadv41-close" data-close="sadv41-card-msg">x</button>
    <h4>Messenger - Canal SADV41</h4>
    <p>Unete al canal oficial. Actualizaciones TMS, ecuaciones, despliegues y memoria recursiva. Solapamiento discreto.</p>
    <a class="cta msg" href="https://www.messenger.com/channel/61554018924556" target="_blank" rel="noopener">Abrir canal -></a>
    <div class="small">SADV41 - Time Make Space - Panama</div>
  </div>
  <div id="sadv41-card-spot" class="sadv41-card">
    <button class="sadv41-close" data-close="sadv41-card-spot">x</button>
    <h4>Spotify - 3 meses gratis</h4>
    <p>Mi referral SADV41. Prueba 3 meses gratis con mi enlace. Musica, motivacion y SADV41 Music.</p>
    <a class="cta spot" href="https://open.spotify.com/referral/003988e58c5d863711ce35278c66785f53a04d248c0fd8b116a577?si=fGM0R1MCT0me_qn5CtqVmg&utm_source=copy-link&locale=es&sci=spotify%3Acard-config%3A5IucLbrjbi1ulYi3cpFglY" target="_blank" rel="noopener">Reclamar 3 meses gratis -></a>
    <div class="small">Enlace de referral SADV41 - se abre en Spotify</div>
  </div>
  <button id="sadv41-btn-msg" class="sadv41-fab-btn msg" aria-label="Canal Messenger">💬</button>
  <button id="sadv41-btn-spot" class="sadv41-fab-btn spot" aria-label="Spotify 3 meses gratis">🎵</button>
</div>
<script>
(function(){
  function toggle(id){
    var el=document.getElementById(id);
    if(!el) return;
    var wasOpen=el.classList.contains('open');
    document.querySelectorAll('.sadv41-card').forEach(function(c){c.classList.remove('open')});
    if(!wasOpen) el.classList.add('open');
  }
  var b1=document.getElementById('sadv41-btn-msg');
  var b2=document.getElementById('sadv41-btn-spot');
  if(b1) b1.addEventListener('click',function(){toggle('sadv41-card-msg')});
  if(b2) b2.addEventListener('click',function(){toggle('sadv41-card-spot')});
  document.querySelectorAll('.sadv41-close').forEach(function(btn){
    btn.addEventListener('click',function(){document.getElementById(btn.getAttribute('data-close')).classList.remove('open')});
  });
})();
</script>
<!-- SADV41-WIDGETS-END -->
SNIPPET_EOF

# 2. Crear el inyector inteligente y blindado
cat << 'INJECT_EOF' > inject-sadv41-widgets.sh
#!/data/data/com.termux/files/usr/bin/bash
set -e

if [ -f "$HOME/bin/sadv41-widgets-snippet.html" ]; then
  SNIPPET_FILE="$HOME/bin/sadv41-widgets-snippet.html"
elif [ -f "$HOME/SADV41/sadv41-widgets-snippet.html" ]; then
  SNIPPET_FILE="$HOME/SADV41/sadv41-widgets-snippet.html"
else
  SNIPPET_FILE="$(dirname "$0")/sadv41-widgets-snippet.html"
fi

inject_one() {
  local file="$1"
  if [ ! -f "$file" ]; then echo "⚠️ No existe: $file"; return 0; fi
  if grep -q "SADV41-WIDGETS-START" "$file"; then echo "✅ Ya inyectado: $file"; return 0; fi
  if [ -f "$SNIPPET_FILE" ]; then
    tmp=$(mktemp)
    awk -v sf="$SNIPPET_FILE" 'BEGIN{while((getline l < sf)>0) s=s l "\n"} /<\/body>/{print s; print; next} {print}' "$file" > "$tmp" && mv "$tmp" "$file"
    echo "💉 Inyectado Messenger + Spotify en: $file"
  else
    echo "❌ Falta snippet: $SNIPPET_FILE"
  fi
}

if [ "$1" = "--install" ]; then
  mkdir -p "$HOME/bin" "$HOME/SADV41"
  cp "$0" "$HOME/bin/sadv41-inject"
  chmod +x "$HOME/bin/sadv41-inject"
  cp sadv41-widgets-snippet.html "$HOME/bin/" 2>/dev/null || true
  cp sadv41-widgets-snippet.html "$HOME/SADV41/" 2>/dev/null || true
  grep -q 'HOME/bin' "$HOME/.bashrc" 2>/dev/null || echo 'export PATH="$HOME/bin:$PATH"' >> "$HOME/.bashrc"
  echo "✅ Shortcut instalado: sadv41-inject"
  exit 0
fi

if [ $# -eq 0 ]; then
  for f in "ECUACIONES/TMS/index.html" "TimeMakeSpace/🇵🇦🌌⭐️/index.html" "GORRA/index.html" *.html; do
    [ -f "$f" ] && inject_one "$f"
  done
else
  for f in "$@"; do inject_one "$f"; done
fi
INJECT_EOF

chmod +x inject-sadv41-widgets.sh
./inject-sadv41-widgets.sh --install
export PATH="$HOME/bin:$PATH"

# 3. Crear el SuperHTML v2 completo
cat << 'HTML_EOF' > SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SADV41 - Time Make Space - Ecuacion + Messenger + Spotify</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#030305;color:#e6edf3;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6}
a{color:#00e5ff}
.top{position:sticky;top:0;z-index:20;background:rgba(3,3,5,.92);border-bottom:1px solid #1e2e3d}
.top-inner{max-width:1100px;margin:0 auto;padding:12px 18px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.logo{font-weight:900;letter-spacing:.14em;font-size:13px}.logo span{color:#ffd700}
.top nav{display:flex;gap:14px;flex-wrap:wrap;font-size:13px}.top nav a{text-decoration:none;color:#9fb0c3}
.hero{max-width:1100px;margin:0 auto;padding:42px 18px 18px;text-align:center}
.kicker{color:#00e5ff;font-weight:800;letter-spacing:.22em;font-size:12px;text-transform:uppercase}
h1{font-size:clamp(32px,6vw,56px);line-height:.95;margin:12px 0 8px}.h1-gold{color:#ffd700}
.hero p{max-width:760px;margin:10px auto;color:#9fb0c3}
.badges{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:16px 0}
.badge{border:1px solid #1e2e3d;background:#0a0e18;padding:7px 12px;border-radius:999px;font-size:12px}.badge b{color:#00e5ff}
.wrap{max-width:1100px;margin:0 auto;padding:10px 18px 120px}
.card{background:#0a0e18;border:1px solid #1e2e3d;border-radius:18px;padding:22px;margin:16px 0}
.card h2{font-size:22px;margin-bottom:8px}.card h2 i{color:#00e5ff;font-style:normal}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:14px}
@media(max-width:820px){.grid{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.grid{grid-template-columns:1fr}}
.mini{background:#0e1622;border:1px solid #1e2e3d;border-radius:14px;padding:16px}
.mini h3{color:#ffd700;font-size:16px;margin:6px 0}.mini p{font-size:13.5px;color:#9fb0c3}.mini b{color:#00e5ff}
.formula{text-align:center;background:#07131f;border:1px solid #00e5ff;border-radius:16px;padding:22px;margin:14px 0}
.formula .big{font-size:clamp(22px,4.5vw,36px);font-weight:900;color:#00e5ff}.formula .big span{color:#ffd700}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media(max-width:760px){.cols{grid-template-columns:1fr}}
.scenario{border-radius:14px;padding:18px;background:#0e1622;border:1px solid #1e2e3d}.scenario h3{color:#ffd700}.scenario .res{font-size:22px;font-weight:900;color:#00e5ff;margin:10px 0}
.table{width:100%;border-collapse:collapse;margin-top:12px;font-size:14px}.table th,.table td{border:1px solid #1e2e3d;padding:9px;text-align:left}.table th{background:#0a1a26;color:#00e5ff}
.hl{background:#07131f;border:1px solid #00e5ff;border-radius:16px;padding:18px}.hl b{color:#ffd700}
code{background:#0b1420;border:1px solid #1e2e3d;padding:2px 6px;border-radius:6px;color:#ffd700;font-size:12.5px}
pre{background:#050a10;border:1px solid #1e2e3d;border-radius:12px;padding:14px;overflow:auto;font-size:12px;line-height:1.5;color:#cfe6ff;white-space:pre-wrap}
.btn{display:inline-block;background:#00e5ff;color:#00121a;font-weight:800;text-decoration:none;padding:11px 18px;border-radius:999px;margin:6px 6px 0 0}
.btn.gold{background:#ffd700;color:#1a1200}.btn.msg{background:#0084ff;color:#fff}.btn.spot{background:#1DB954;color:#000}
.footer{text-align:center;color:#9fb0c3;padding:20px;font-size:13px}
#tms-widget{position:fixed;right:16px;bottom:16px;width:320px;max-width:calc(100vw - 32px);z-index:9999;background:#07131f;border:1px solid #00e5ff;border-radius:18px;overflow:hidden;box-shadow:0 12px 35px rgba(0,229,255,.2)}
#tms-head{background:linear-gradient(90deg,#00e5ff,#ffd700);color:#00121a;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;cursor:move;font-weight:900;font-size:13px;user-select:none}
#tms-head button{background:#00121a;color:#fff;border:0;width:28px;height:28px;border-radius:999px;cursor:pointer}
#tms-body{padding:14px}#tms-body label{font-size:12px;color:#9fb0c3;display:block;margin:7px 0 3px}#tms-body input{width:100%;background:#030305;border:1px solid #1e2e3d;color:#fff;padding:8px 10px;border-radius:10px}
.presets{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px}.presets button{flex:1;background:#0e1622;border:1px solid #1e2e3d;color:#00e5ff;padding:7px;border-radius:999px;cursor:pointer;font-size:12px;font-weight:800}
#tms-result{background:#030305;border:1px solid #ffd700;border-radius:12px;padding:12px;margin-top:10px;text-align:center}#tms-result .big{font-size:20px;color:#ffd700;font-weight:900}
</style>
</head>
<body>
<header class="top"><div class="top-inner"><div class="logo">SADV41 <span>TIME MAKE SPACE</span></div><nav><a href="#variables">Variables</a><a href="#ecuacion">Ecuacion</a><a href="#escenarios">Escenarios</a><a href="#canal">Canal + Spotify</a><a href="#gorra">GORRA</a><a href="#despliegue">Despliegue</a></nav></div></header>
<section class="hero">
<div class="kicker">SADV41 - Nucleo Matematico - Panama - v2 + Messenger + Spotify</div>
<h1>Ecuacion de Produccion<br><span class="h1-gold">Espacio-Temporal</span></h1>
<p>Marco cuantitativo para crear mundos virtuales con IA, vibe coding y memoria recursiva-retroalimentativa. El espacio se habita a traves del tiempo.</p>
<div class="badges"><span class="badge">T = <b>(S x Cf) / (P x M_IA x Rm)</b></span><span class="badge">Canal: <b>Messenger inyectado</b></span><span class="badge">Spotify: <b>3 meses gratis</b></span></div>
<a class="btn" href="#ecuacion">Ver ecuacion -></a><a class="btn gold" href="#escenarios">Ver escenarios</a><a class="btn msg" href="https://www.messenger.com/channel/61554018924556" target="_blank" rel="noopener">Messenger -></a><a class="btn spot" href="https://open.spotify.com/referral/003988e58c5d863711ce35278c66785f53a04d248c0fd8b116a577?si=fGM0R1MCT0me_qn5CtqVmg&utm_source=copy-link&locale=es&sci=spotify%3Acard-config%3A5IucLbrjbi1ulYi3cpFglY" target="_blank" rel="noopener">Spotify 3 meses -></a>
</section>
<div class="wrap">
<section id="variables" class="card"><h2><i>01 /</i> Variables</h2>
<div class="grid">
<div class="mini"><h3>T - Tiempo</h3><p>Duracion completa. <b>Es lo que despejamos.</b></p></div>
<div class="mini"><h3>S - Espacio</h3><p><b>S = D x F x H</b><br>D = densidad / sistemas, F = fidelidad, H = narrativa</p></div>
<div class="mini"><h3>P - Personas</h3><p><b>P = 1</b> individual. <b>P mayor a 1,000</b> estudio AAA.</p></div>
<div class="mini"><h3>M_IA - Multiplicador IA</h3><p>Agentes + vibe coding. <b>1 sin IA, mayor a 1 con agentes.</b></p></div>
<div class="mini"><h3>Cf - Friccion</h3><p>Resistencia de integracion. <b>A mayor S, mayor Cf.</b></p></div>
<div class="mini"><h3>Rm - Memoria recursiva</h3><p>Continuidad contextual. <b>Evita reconstruir desde cero.</b></p></div>
</div></section>
<section id="ecuacion" class="card"><h2><i>02 /</i> Ecuacion Maestra</h2>
<div class="formula"><div class="big">T = <span>(S x Cf)</span> / (P x M_IA)</div><div>Forma base</div></div>
<div class="formula" style="border-color:#ffd700"><div class="big">Trec = <span>(S x Cf)</span> / (P x M_IA x Rm)</div><div>Modo recursivo SADV41</div></div>
<p><b>Lectura:</b> Duplicar M_IA o Rm reduce T a la mitad. Duplicar S duplica T.</p></section>
<section id="escenarios" class="card"><h2><i>03 /</i> Escenarios Calibrados</h2>
<div class="cols">
<div class="scenario"><h3>A - Prototipo</h3><p>P=1, M_IA=20, S=1, Cf=1</p><div class="res">T = 0.05 anos = 2.6 semanas</div></div>
<div class="scenario"><h3>B - Escala AAA</h3><p>P=1,000, M_IA=5, S=20,000, Cf=1.25</p><div class="res">T = 5 anos</div></div>
</div>
<table class="table"><tr><th>Parametro</th><th>Prototipo</th><th>AAA</th><th>Nodo Termux</th></tr><tr><td>P</td><td>1</td><td>1,000</td><td>1</td></tr><tr><td>M_IA</td><td>20</td><td>5</td><td>25</td></tr><tr><td>S</td><td>1</td><td>20,000</td><td>2</td></tr><tr><td>Cf</td><td>1.0</td><td>1.25</td><td>1.1</td></tr><tr><td>Rm</td><td>1</td><td>1</td><td><b>2.5</b></td></tr><tr><td><b>Resultado</b></td><td><b>0.05 anos</b></td><td><b>5 anos</b></td><td><b>0.0352 anos = 12.8 dias</b></td></tr></table></section>
<section id="memoria" class="card"><h2><i>04 /</i> Axioma SADV41</h2>
<div class="hl"><b>El contenido NO es desafio cuando hay memoria recursiva-retroalimentativa</b>, en vez de recolectar toda la base en cada proyecto. <b>El verdadero desafio es el espacio-tiempo:</b> habitar el espacio a traves del tiempo, con direccion estructural continua y solapamiento discreto.</div>
<p style="margin-top:12px">Nucleo Luma AI / Proton: Cuando subas archivo, texto, enlace o captura desde Luma AI (Proton), se procesa, integra y analiza dentro del nucleo SADV41. Queda como memoria Rm para el siguiente ciclo.</p></section>
<section id="canal" class="card" style="border-color:#0084ff"><h2><i>05 /</i> Canal Messenger + Spotify - Inyectados</h2>
<p>Ambos enlaces estan inyectados como widget flotante abajo a la izquierda en <b>todas</b> las paginas del proyecto y en todos los proyectos futuros con el shortcut. No son iframes bloqueados, son botones flotantes que abren en pestana nueva.</p>
<p style="margin-top:10px"><b>Messenger:</b> <a href="https://www.messenger.com/channel/61554018924556" target="_blank" rel="noopener">Abrir canal SADV41</a></p>
<p><b>Spotify - 3 meses gratis:</b> <a href="https://open.spotify.com/referral/003988e58c5d863711ce35278c66785f53a04d248c0fd8b116a577?si=fGM0R1MCT0me_qn5CtqVmg&utm_source=copy-link&locale=es&sci=spotify%3Acard-config%3A5IucLbrjbi1ulYi3cpFglY" target="_blank" rel="noopener">Reclamar referral</a></p>
<p style="margin-top:10px"><a class="btn msg" href="https://www.messenger.com/channel/61554018924556" target="_blank" rel="noopener">Unirse al canal -></a><a class="btn spot" href="https://open.spotify.com/referral/003988e58c5d863711ce35278c66785f53a04d248c0fd8b116a577?si=fGM0R1MCT0me_qn5CtqVmg&utm_source=copy-link&locale=es&sci=spotify%3Acard-config%3A5IucLbrjbi1ulYi3cpFglY" target="_blank" rel="noopener">Spotify 3 meses gratis -></a></p>
</section>
<section id="gorra" class="card"><h2><i>06 /</i> GORRA - Proyecto incluido</h2>
<p>La pagina <b>GORRA</b> tambien recibe la misma inyeccion. Mismo sistema, mismos widgets.</p>
<p style="margin-top:10px"><a class="btn gold" href="https://thesteef21.github.io/SADV41/GORRA/" target="_blank" rel="noopener">Ver GORRA -></a><a class="btn" href="https://thesteef21.github.io/SADV41/ECUACIONES/TMS/index.html" target="_blank" rel="noopener">Ver TMS</a><a class="btn" href="https://thesteef21.github.io/SADV41/TimeMakeSpace/%F0%9F%87%B5%F0%9F%87%A6%F0%9F%8C%8C%E2%AD%90%EF%B8%8F/" target="_blank" rel="noopener">Ver TimeMakeSpace</a></p></section>
<section id="despliegue" class="card"><h2><i>07 /</i> Despliegue + Shortcut Termux</h2>
<p>Shortcut <code>sadv41-inject</code> inyecta Messenger + Spotify en cualquier HTML futuro. Detecta si ya esta inyectado y no duplica.</p>
<pre>sadv41-inject mi-pagina.html
sadv41-inject *.html
sadv41-inject GORRA/index.html ECUACIONES/TMS/index.html</pre></section>
<div class="footer">SADV41 - Time Make Space - El espacio se habita a traves del tiempo. La memoria sostiene el ciclo. La discrecion protege el nodo. Panama</div>
</div>
<div id="tms-widget"><div id="tms-head"><span>SADV41 - CALCULADOR TMS</span><button id="tms-toggle">_</button></div>
<div id="tms-body"><div class="presets"><button data-preset="proto">Prototipo</button><button data-preset="aaa">Escala AAA</button><button data-preset="nodo">Nodo Termux</button></div>
<label>S - Espacio</label><input id="in-S" type="number" step="0.1" value="2">
<label>Cf - Friccion</label><input id="in-Cf" type="number" step="0.05" value="1.1">
<label>P - Personas</label><input id="in-P" type="number" step="1" value="1">
<label>M_IA - Multiplicador IA</label><input id="in-MIA" type="number" step="1" value="25">
<label>Rm - Memoria</label><input id="in-Rm" type="number" step="0.1" value="2.5">
<div id="tms-result"><div class="big" id="tms-out">0.0352 anos</div><small id="tms-out2">12.8 dias - 1.83 semanas</small></div></div></div>
<script>
var $=function(id){return document.getElementById(id)};
function calc(){var S=parseFloat($('in-S').value)||0,Cf=parseFloat($('in-Cf').value)||0,P=parseFloat($('in-P').value)||1,MIA=parseFloat($('in-MIA').value)||1,Rm=parseFloat($('in-Rm').value)||1;var T=(S*Cf)/(P*MIA*Rm);$('tms-out').textContent=T.toFixed(4)+' anos';$('tms-out2').textContent=(T*365).toFixed(1)+' dias - '+(T*52).toFixed(2)+' semanas';}
['in-S','in-Cf','in-P','in-MIA','in-Rm'].forEach(function(id){$(id).addEventListener('input',calc)});
document.querySelectorAll('[data-preset]').forEach(function(b){b.addEventListener('click',function(){var p=b.dataset.preset;if(p==='proto'){$('in-S').value=1;$('in-Cf').value=1;$('in-P').value=1;$('in-MIA').value=20;$('in-Rm').value=1;}if(p==='aaa'){$('in-S').value=20000;$('in-Cf').value=1.25;$('in-P').value=1000;$('in-MIA').value=5;$('in-Rm').value=1;}if(p==='nodo'){$('in-S').value=2;$('in-Cf').value=1.1;$('in-P').value=1;$('in-MIA').value=25;$('in-Rm').value=2.5;}calc();})});
calc();
var collapsed=false;$('tms-toggle').addEventListener('click',function(){collapsed=!collapsed;$('tms-body').style.display=collapsed?'none':'block';$('tms-toggle').textContent=collapsed?'+':'_';});
</script>
</body>
</html>
HTML_EOF

# Inyectar el snippet limpio en el SuperHTML recién generado
sadv41-inject SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html

# 4. Desplegar a las 3 rutas sin sobrescribir GORRA si ya existe
mkdir -p "ECUACIONES/TMS" "TimeMakeSpace/🇵🇦🌌⭐️" "GORRA"
cp SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html "ECUACIONES/TMS/index.html"
cp SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html "TimeMakeSpace/🇵🇦🌌⭐️/index.html"

if [ -f "GORRA/index.html" ]; then
  echo "🧢 GORRA/index.html existe -> inyectando widgets sin sobrescribir..."
  sadv41-inject "GORRA/index.html"
else
  echo "🧢 GORRA/index.html no existia -> creando desde plantilla v2..."
  cp SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html "GORRA/index.html"
fi

# 5. Subir a GitHub Pages
git add "ECUACIONES/TMS/index.html" "TimeMakeSpace/🇵🇦🌌⭐️/index.html" "GORRA/index.html" SADV41_TMS_SuperHTML_v2_Messenger_Spotify.html inject-sadv41-widgets.sh sadv41-widgets-snippet.html
git commit -m "TMS v2 + Messenger + Spotify + GORRA" || echo "ℹ️ Sin cambios nuevos para commitear"
git push origin main

echo "✅ ¡Bachazo completado! Revisa tus rutas en GitHub Pages."
