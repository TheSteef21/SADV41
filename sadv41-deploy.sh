#!/data/data/com.termux/files/usr/bin/bash
set -e

# 1. Ubicar o clonar el repositorio SADV41
REPO_DIR="$HOME/SADV41"
if [ ! -d "$REPO_DIR/.git" ]; then
  echo "Clonando repositorio SADV41..."
  git clone https://github.com/thesteef21/SADV41.git "$REPO_DIR"
fi

cd "$REPO_DIR"
git pull origin main || true

# 2. Crear estructura completa de directorios
mkdir -p \
  "MEMES/AMPYMIZADOS" \
  "Artist/RomanticStyle/Fest/La12" \
  "AMERICA/GASTRONOMICA/REPOSTERIA/PCM" \
  "AMERICA/GASTRONOMICA/REPOSTERÍA/PLM" \
  "FOODS/JL" \
  "EVENTOS/LA_GRAN_CHORRERA" \
  "DON"

# 3. Página: MEMES/AMPYMIZADOS
cat << 'EOF' > "MEMES/AMPYMIZADOS/index.html"
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AMPYMIZADOS | SADV41 Memes</title>
<style>
  body { margin:0; font-family:system-ui,sans-serif; background:#0d1117; color:#f0f6fc; }
  header { background:#161b22; padding:16px; text-align:center; border-bottom:1px solid #30363d; position:sticky; top:0; }
  .tags { display:flex; gap:8px; overflow-x:auto; padding:12px; justify-content:center; }
  .tag { background:#21262d; padding:6px 14px; border-radius:20px; font-size:13px; border:1px solid #30363d; }
  .container { max-width:600px; margin:auto; padding:12px; }
  .card { background:#161b22; border:1px solid #30363d; border-radius:12px; padding:16px; margin-bottom:16px; }
  .card h3 { margin:0 0 8px; font-size:18px; }
  .meta { color:#8b949e; font-size:13px; }
  footer { text-align:center; padding:24px; color:#8b949e; font-size:12px; }
  a { color:#58a6ff; text-decoration:none; }
</style>
</head>
<body>
<header><strong>😂 AMPYMIZADOS — SADV41 🇵🇦⚛️</strong></header>
<div class="tags">
  <span class="tag">VIRALES</span>
  <span class="tag">PANAMÁ</span>
  <span class="tag">MEMAZOS</span>
  <span class="tag">TENDENCIA</span>
</div>
<div class="container">
  <div class="card">
    <h3>Cuando abres la refri a las 3 AM buscando un milagro</h3>
    <p>La refri: "¿Qué buscas, un tesoro?" 😂🔥</p>
    <div class="meta">SADV41 Memes • Arraiján & Panamá</div>
  </div>
  <div class="card">
    <h3>Expectativa vs Realidad</h3>
    <p>Panamá clásico cuando dices "voy saliendo" y todavía estás buscando las llaves.</p>
    <div class="meta">Tendencia Local • 14.2K reacciones</div>
  </div>
</div>
<footer>
  Contacto: <a href="https://wa.me/50769362166">WhatsApp</a> • 
  <a href="https://instagram.com/stevendioroficial">@stevendioroficial</a> • 
  <a href="https://thesteef21.github.io/SADV41/Artist">SADV41 Artist</a>
</footer>
</body>
</html>
EOF

# 4. Página: Artist/RomanticStyle & Fest/La12
cat << 'EOF' > "Artist/RomanticStyle/index.html"
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>La Doce Romantic Fest | SADV41 Artist</title>
<style>
  body { margin:0; font-family:system-ui,sans-serif; background:#090b10; color:#fff; }
  .hero { background:linear-gradient(135deg,#1f0a1d,#0d1326); padding:32px 16px; text-align:center; border-bottom:2px solid #e11d48; }
  .badge { background:#e11d48; padding:4px 12px; border-radius:99px; font-size:12px; font-weight:bold; }
  .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; max-width:720px; margin:20px auto; padding:0 16px; }
  .artist { background:#151923; border:1px solid #262c3d; border-radius:10px; padding:16px; text-align:center; }
  .btn { display:inline-block; margin-top:14px; background:#e11d48; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:bold; }
</style>
</head>
<body>
<div class="hero">
  <span class="badge">● EN VIVO / ROMANTIC STYLE PANAMÁ</span>
  <h1>LA DOCE ROMANTIC FEST</h1>
  <p>El festival de Romantic Style más grande de Panamá • Arraiján / Burunga</p>
  <a class="btn" href="./Fest/La12/">Ver Cronograma en Vivo La 12</a>
</div>
<div class="grid">
  <div class="artist"><strong>NIGGA / FLEX</strong><p>Romantic Style</p></div>
  <div class="artist"><strong>EL ROOCKIE</strong><p>Clásicos</p></div>
  <div class="artist"><strong>NANDO BOOM</strong><p>Leyenda</p></div>
  <div class="artist"><strong>ALDO RANKS</strong><p>Full Show</p></div>
  <div class="artist"><strong>PRINCESSA</strong><p>Invitada</p></div>
  <div class="artist"><strong>SECH / CANAL</strong><p><a href="https://www.instagram.com/channel/AbYspuDtWbu3IVDO/" style="color:#fda4af;">Ir al Canal IG</a></p></div>
</div>
</body>
</html>
EOF

cat << 'EOF' > "Artist/RomanticStyle/Fest/La12/index.html"
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>La Doce Romantic Fest - En Vivo La 12</title>
<style>
  body { margin:0; font-family:system-ui,sans-serif; background:#0b0e14; color:#f8fafc; padding:16px; }
  .box { max-width:600px; margin:auto; background:#141923; border:1px solid #273043; border-radius:12px; padding:20px; }
  ul { line-height:1.8; padding-left:20px; }
  .btn { display:block; text-align:center; background:#2563eb; color:#fff; padding:12px; border-radius:8px; text-decoration:none; margin-top:12px; font-weight:bold; }
</style>
</head>
<body>
<div class="box">
  <h2>🔴 LA DOCE - ROMANTIC FEST (LA 12)</h2>
  <p><strong>Cronograma de Hoy:</strong></p>
  <ul>
    <li>07:00 PM - Apertura de Puertas / Warm Up DJ</li>
    <li>08:30 PM - Show de Apertura</li>
    <li>09:45 PM - Invitados Especiales Romantic Style</li>
    <li>11:00 PM - Artistas Principales en Tarima</li>
    <li>01:00 AM - Cierre del Festival</li>
  </ul>
  <a class="btn" href="https://maps.google.com/?q=Arraijan+Panama">📍 Ubicación: La 12, Arraiján, Panamá</a>
  <a class="btn" style="background:#16a34a;" href="https://wa.me/50769362166">💬 Contacto / Accesos SADV41</a>
</div>
</body>
</html>
EOF

# 5. Página: Panadería Canela y Miel (PCM y PLM)
for DIR in "AMERICA/GASTRONOMICA/REPOSTERIA/PCM" "AMERICA/GASTRONOMICA/REPOSTERÍA/PLM"; do
cat << 'EOF' > "$DIR/index.html"
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Panadería Canela y Miel - Vacante Conductor</title>
<style>
  body { margin:0; font-family:system-ui,sans-serif; background:#fdf8f0; color:#1e293b; padding:16px; }
  .card { max-width:600px; margin:auto; background:#fff; border:2px solid #d97706; border-radius:14px; padding:22px; box-shadow:0 4px 12px rgba(0,0,0,0.08); }
  .banner { background:#b91c1c; color:#fff; text-align:center; padding:8px; border-radius:8px; font-weight:bold; }
  h1 { color:#1e3a8a; text-align:center; margin-bottom:6px; }
  .btn { display:block; background:#16a34a; color:#fff; text-align:center; padding:14px; border-radius:10px; text-decoration:none; font-weight:bold; margin-top:16px; }
</style>
</head>
<body>
<div class="card">
  <div class="banner">🇵🇦 ¡FELIZ MES DE LA PATRIA! — PANADERÍA CANELA Y MIEL</div>
  <h1>¡NECESITAMOS CONDUCTOR!</h1>
  <p style="text-align:center;"><strong>Ubicación:</strong> Burunga, Arraiján (Panamá Oeste)</p>
  <h3>Requisitos:</h3>
  <ul>
    <li>Licencia Tipo D (vigente)</li>
    <li>Que conozca Burunga y áreas aledañas</li>
    <li>Con muchas ganas de trabajar</li>
    <li>Responsable, puntual y con actitud de servicio</li>
  </ul>
  <h3>Cómo aplicar:</h3>
  <p>Entrega tu hoja de vida directamente en la panadería o envíala por WhatsApp.</p>
  <a class="btn" href="https://wa.me/50762345678?text=Hola,%20env%C3%ADo%20mi%20hoja%20de%20vida%20para%20la%20vacante%20de%20Conductor">📲 Enviar Hoja de Vida: +507 6234-5678</a>
</div>
</body>
</html>
EOF
done

# 6. Página: FOODS/JL (Menú Combo del Día hasta las 5 AM)
cat << 'EOF' > "FOODS/JL/index.html"
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FOODS JL - Combo del Día | SADV41</title>
<style>
  body { margin:0; font-family:system-ui,sans-serif; background:#18181b; color:#fafafa; padding:16px; }
  .wrap { max-width:650px; margin:auto; }
  h1 { text-align:center; color:#facc15; margin-bottom:4px; }
  .sub { text-align:center; color:#a1a1aa; margin-bottom:20px; }
  .item { display:flex; justify-content:space-between; background:#27272a; padding:12px 16px; border-radius:10px; margin-bottom:10px; border-left:4px solid #ef4444; }
  .price { font-weight:bold; color:#4ade80; font-size:18px; }
  .btn { display:block; background:#22c55e; color:#052e16; text-align:center; padding:14px; border-radius:10px; text-decoration:none; font-weight:bold; margin-top:18px; }
</style>
</head>
<body>
<div class="wrap">
  <h1>🍔 COMBO DEL DÍA — FOODS JL</h1>
  <p class="sub">⏰ Atendiendo hasta las 5:00 de la mañana</p>
  <div class="item"><span>Hamburguesa Sencilla</span><span class="price">$3.50</span></div>
  <div class="item"><span>Hamburguesa Especial (con papas)</span><span class="price">$4.50</span></div>
  <div class="item"><span>Combo de Hamburguesa (con soda y papas)</span><span class="price">$5.50</span></div>
  <div class="item"><span>Hamburguesa Triple en Combo</span><span class="price">$6.50</span></div>
  <div class="item"><span>Salchipapas / Salchipapas Mixtas</span><span class="price">$3.50</span></div>
  <div class="item"><span>Choripapa</span><span class="price">$3.50</span></div>
  <div class="item"><span>Salchipollo</span><span class="price">$5.50</span></div>
  <div class="item"><span>Tacos (Unidad) / Combo de Tacos</span><span class="price">$1.75 / $5.00</span></div>
  <div class="item"><span>Hot Dog Sencillo / Especial / Combo</span><span class="price">$2.50 / $4.00 / $5.50</span></div>
  <div class="item"><span>Arepa Rellena / Arepa en Combo</span><span class="price">$3.50 / $5.50</span></div>
  <div class="item"><span>Empanadas / Papas Rellenas Mixtas</span><span class="price">$1.00</span></div>
  <a class="btn" href="https://wa.me/50769362166?text=Hola,%20quiero%20hacer%20un%20pedido%20del%20Combo%20del%20D%C3%ADa">📲 Pedir por WhatsApp</a>
</div>
</body>
</html>
EOF

# 7. Página: EVENTOS/LA_GRAN_CHORRERA (Desfile 28 de Noviembre)
cat << 'EOF' > "EVENTOS/LA_GRAN_CHORRERA/index.html"
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Banda Independiente La Gran Chorrera - 28 de Noviembre</title>
<style>
  body { margin:0; font-family:system-ui,sans-serif; background:#041e12; color:#ecfdf5; padding:16px; text-align:center; }
  .card { max-width:600px; margin:auto; background:#064e3b; border:2px solid #facc15; border-radius:16px; padding:24px; }
  h1 { color:#facc15; font-size:28px; margin:10px 0; }
  .tag { background:#dc2626; padding:5px 12px; border-radius:99px; font-weight:bold; font-size:13px; }
  .info { background:#022c22; padding:14px; border-radius:10px; margin:16px 0; line-height:1.7; }
</style>
</head>
<body>
<div class="card">
  <span class="tag">🇵🇦 DESFILE INDEPENDENCIA DE PANAMÁ DE ESPAÑA</span>
  <h1>BANDA INDEPENDIENTE LA GRAN CHORRERA</h1>
  <p><em>Fundada en 2014 • #LaBandaDelWest</em></p>
  <div class="info">
    <strong>📅 Fecha:</strong> 28 de Noviembre<br>
    <strong>📍 Punto de Encuentro:</strong> Parque Libertador, La Chorrera<br>
    <strong>🕔 Hora:</strong> 5:00 PM<br>
    <strong>🎖️ Código:</strong> Vestimenta de Gala
  </div>
  <p>Cobertura digital SADV41 • <a href="https://instagram.com/stevendioroficial" style="color:#facc15;">@stevendioroficial</a></p>
</div>
</body>
</html>
EOF

# 8. Desplegar automáticamente a GitHub Pages
git add .
git commit -m "Despliegue SADV41: AMPYMIZADOS, RomanticStyle/La12, Canela y Miel PCM/PLM, FOODS/JL y La Gran Chorrera" || echo "Sin cambios nuevos para commit"
git push origin main

echo "✅ ¡Listo! Páginas creadas y enviadas a https://thesteef21.github.io/SADV41/"

