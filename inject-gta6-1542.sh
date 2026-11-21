#!/data/data/com.termux/files/usr/bin/bash
TARGET="$HOME/SADV41/GAMING/GTA/VI/STORY/index.html"
mkdir -p "$(dirname "$TARGET")"

if [ ! -f "$TARGET" ]; then
  cat << 'HTML' > "$TARGET"
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GTA VI · STORY · ARCHIVO 1542 · SADV41</title>
  <style>
    body { background: #070709; color: #e5e5e5; font-family: 'Courier New', monospace; margin: 0; padding: 20px; }
  </style>
</head>
<body>
</body>
</html>
HTML
fi

python3 - << 'PY'
import os

target = os.path.expanduser("~/SADV41/GAMING/GTA/VI/STORY/index.html")
marker = "<!-- SADV41-GTA6-STORY-1542 -->"

block = f"""{marker}
<section id="sadv41-story-1542" style="max-width:960px;margin:28px auto;padding:24px;background:rgba(10,10,14,0.88);border:1px solid rgba(212,175,55,0.45);border-radius:12px;font-family:'Courier New',monospace;color:#f1f1f1;box-shadow:0 0 28px rgba(0,0,0,0.85);backdrop-filter:blur(8px);">
  <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(212,175,55,0.3);padding-bottom:12px;margin-bottom:18px;flex-wrap:wrap;gap:8px;">
    <span style="color:#d4af37;font-weight:bold;letter-spacing:2px;font-size:13px;">◈ ARCHIVO CRONOLÓGICO 1542 (MDXLII) · EJE 42-15</span>
    <span style="color:#888;font-size:11px;">GTA VI STORY · PROTOCOLO 131 · SADV41</span>
  </div>

  <p style="font-size:13px;line-height:1.6;color:#ccc;margin-bottom:18px;">
    <strong>1542 (MDXLII):</strong> Año común comenzado en domingo del calendario juliano; el 6 de enero Francisco de Montejo funda Mérida en Yucatán, coincidiendo con el eje numérico <strong>1542 / 42-15</strong>, la Audiencia de Panamá y la exploración del Pacífico.
  </p>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-bottom:22px;">
    <div style="background:rgba(20,20,26,0.9);border:1px solid #2a2a35;border-radius:8px;padding:16px;">
      <div style="color:#ff4d6d;font-weight:bold;font-size:12px;letter-spacing:1.5px;margin-bottom:10px;">✝ FALLECIDOS EN 1542</div>
      <ul style="list-style:none;padding:0;margin:0;font-size:12.5px;line-height:1.7;color:#ddd;">
        <li><strong>#1 Catherine Howard</strong> — Reina (esposa de Enrique VIII).</li>
        <li><strong>#2 Hernando de Soto (1496–1542)</strong> — Explorador español (presencia clave en Centroamérica y Panamá antes del Misisipi).</li>
        <li><strong>#3 Lisa del Giocondo (1479–1542)</strong> — Figura florentina retratada en la <em>Mona Lisa</em>.</li>
        <li><strong>#4 James V (1512–1542)</strong> — Rey de Escocia.</li>
      </ul>
    </div>

    <div style="background:rgba(20,20,26,0.9);border:1px solid #2a2a35;border-radius:8px;padding:16px;">
      <div style="color:#4cc9f0;font-weight:bold;font-size:12px;letter-spacing:1.5px;margin-bottom:10px;">★ NACIDOS EN 1542</div>
      <ul style="list-style:none;padding:0;margin:0;font-size:12.5px;line-height:1.7;color:#ddd;">
        <li><strong>#1 Mary, Queen of Scots (1542–1587)</strong> — Reina de Escocia (hija de James V, fallecido ese mismo año).</li>
        <li><strong>#2 Álvaro de Mendaña de Neira (1542–1595)</strong> — Explorador y navegante español del Pacífico.</li>
        <li><strong>#3 Richard Grenville (1542–1591)</strong> — Político y navegante inglés.</li>
      </ul>
    </div>
  </div>

  <div style="background:linear-gradient(135deg,rgba(14,28,24,0.92),rgba(10,14,18,0.95));border:1px solid rgba(46,204,113,0.45);border-radius:10px;padding:18px;">
    <div style="color:#2ecc71;font-weight:bold;font-size:13px;letter-spacing:1px;margin-bottom:8px;">🇵🇦🌴 GESTIÓN TURISMO PTY · RUTAS MARÍTIMAS PANAMÁ</div>
    <p style="font-size:12.5px;color:#d8f3dc;margin:0 0 12px 0;line-height:1.5;">
      Experiencias seguras y cómodas desde Panamá hacia el Pacífico y el Caribe:
    </p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;font-size:11.5px;">
      <span style="background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.4);padding:4px 9px;border-radius:5px;">🏝️ San Blas</span>
      <span style="background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.4);padding:4px 9px;border-radius:5px;">🏝️ Taboga</span>
      <span style="background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.4);padding:4px 9px;border-radius:5px;">🏝️ Archipiélago de Las Perlas</span>
      <span style="background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.4);padding:4px 9px;border-radius:5px;">🐒 Isla Monos</span>
      <span style="background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.4);padding:4px 9px;border-radius:5px;">⛵ Tour Bahía de Panamá</span>
      <span style="background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.4);padding:4px 9px;border-radius:5px;">🛥️ Alquiler de Yates</span>
    </div>
    <div style="font-size:12px;color:#b7e4c7;line-height:1.6;border-top:1px dashed rgba(46,204,113,0.3);padding-top:10px;">
      <strong>📅 Protocolo de Reserva:</strong> Indicar <em>Destino de interés</em>, <em>Fecha del viaje</em> y <em>Cantidad de pasajeros</em>. Confirmación mediante abono del <strong>50%</strong> para emisión de punto de encuentro y recomendaciones.
    </div>
  </div>
</section>
"""

with open(target, "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

if marker in html:
    print("⏭️  El bloque 1542 + Gestión Turismo PTY ya estaba inyectado.")
else:
    if "</body>" in html:
        html = html.replace("</body>", block + "\n</body>", 1)
    else:
        html += "\n" + block
    with open(target, "w", encoding="utf-8") as f:
        f.write(html)
    print("✅ Inyectado en GAMING/GTA/VI/STORY/index.html")
PY

[ -f "$HOME/SADV41/bg-live-deploy.sh" ] && bash "$HOME/SADV41/bg-live-deploy.sh"
git add GAMING/GTA/VI/STORY/index.html
git commit -m "feat(gta-vi-story): archivo 1542 y nodo Gestión Turismo PTY · SADV41"
git push origin main && echo "🚀 Desplegado en https://thesteef21.github.io/SADV41/GAMING/GTA/VI/STORY/"
