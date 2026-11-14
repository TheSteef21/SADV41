#!/usr/bin/env bash
# ==============================================================================
# SADV41 · Fix de Mapas Sísmicos Nacionales (TSEC y /SISMOS/)
# Restablece la carga dinámica de sismos a nivel nacional + réplicas M7.7
# ==============================================================================
set -euo pipefail

REPO="${REPO:-$HOME/sadv41}"
cd "$REPO" || exit 1

echo "🛡️ [SADV41] Generando mapas sísmicos con respaldo multiorigen..."

# 1. Crear / Sobrescribir NOVIEMBRE/TSEC/index.html
mkdir -p "$REPO/NOVIEMBRE/TSEC"
cat << 'HTML' > "$REPO/NOVIEMBRE/TSEC/index.html"
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SADV41 · Monitoreo Sísmico TSEC & Falla Pedro Miguel</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
  <style>
    html, body { margin:0; padding:0; height:100%; width:100%; background:#0b0f19; color:#f1f5f9; font-family:system-ui,-apple-system,sans-serif; overflow:hidden; }
    #header { position:absolute; top:0; left:0; right:0; height:48px; background:#0f172aed; border-bottom:1px solid #1e293b; z-index:1000; display:flex; align-items:center; justify-content:space-between; padding:0 12px; font-size:12px; backdrop-filter:blur(4px); }
    #header .title { font-weight:700; color:#00e5ff; display:flex; align-items:center; gap:6px; }
    #status { font-size:11px; padding:3px 8px; border-radius:12px; background:#1e293b; color:#94a3b8; border:1px solid #334155; }
    #map { position:absolute; top:48px; bottom:30px; left:0; right:0; }
    #footer { position:absolute; bottom:0; left:0; right:0; height:30px; background:#0b0f19; border-top:1px solid #1e293b; z-index:1000; display:flex; align-items:center; justify-content:space-between; padding:0 12px; font-size:11px; color:#64748b; }
    #widget-safe { position:fixed; top:60px; right:12px; z-index:1001; background:#0a0a0acc; border:1px solid #00e5ff; border-radius:14px; padding:6px 12px; font-size:11px; color:#00e5ff; text-align:center; text-decoration:none; box-shadow:0 4px 12px #0008; }
    .leaflet-tile-pane { filter: invert(1) hue-rotate(180deg) brightness(.85) contrast(.9); }
  </style>
</head>
<body>

  <div id="header">
    <div class="title">🛡️ SADV41 TSEC · Red Sísmica Nacional</div>
    <div id="status">Cargando sismos del USGS...</div>
  </div>

  <a id="widget-safe" href="https://t.me/Sismosyterremotos" target="_blank" rel="noopener">
    🛟 ¡Mantente a salvo!<br><b>@Sismosyterremotos</b>
  </a>

  <div id="map"></div>

  <div id="footer">
    <span>Nacional: 5.0°N–11.0°N / -84.5°W–-76.0°W</span>
    <span>Fuente: USGS FDSNWS / IGC-UP</span>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map').setView([8.0, -80.5], 7);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // Cargar Trazo de la Falla Pedro Miguel
    fetch('pedro-miguel-falla.geojson')
      .then(r => r.json())
      .then(g => {
        L.geoJSON(g, {
          style: { color: '#ef4444', weight: 3, dashArray: '6,6' },
          onEachFeature: (f, l) => {
            if (f.properties && f.properties.nombre) {
              l.bindPopup('<b>' + f.properties.nombre + '</b><br>' + (f.properties.tipo || 'Falla tectónica'));
            }
          }
        }).addTo(map);
      }).catch(e => console.log('Falla GeoJSON no hallado o en carga local'));

    const getColor = m => m >= 6.0 ? '#ef4444' : m >= 5.0 ? '#f97316' : m >= 4.0 ? '#eab308' : '#06b6d4';
    const fmtFecha = t => new Date(t).toLocaleString('es-PA', { timeZone: 'America/Panama' });

    async function cargarSismosNacionales() {
      const statusEl = document.getElementById('status');
      const ini = new Date(Date.now() - 30 * 86400000).toISOString(); // Últimos 30 días (Réplicas 7.7)
      
      const urlFDSNWS = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${ini}&minmagnitude=2.5&minlatitude=5.0&maxlatitude=11.0&minlongitude=-84.5&maxlongitude=-76.0&orderby=time&limit=2000`;
      const urlFeedCDN = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

      let sismos = [];

      try {
        const res = await fetch(urlFDSNWS);
        if (!res.ok) throw new Error('FDSNWS Status ' + res.status);
        const data = await res.json();
        sismos = data.features || [];
      } catch (errPrimary) {
        console.warn('API FDSNWS falló, activando respaldo CDN...', errPrimary);
        try {
          const res2 = await fetch(urlFeedCDN);
          if (!res2.ok) throw new Error('CDN Status ' + res2.status);
          const data2 = await res2.json();
          sismos = (data2.features || []).filter(f => {
            const [lon, lat] = f.geometry.coordinates;
            return lat >= 5.0 && lat <= 11.0 && lon >= -84.5 && lon <= -76.0 && f.properties.mag >= 2.5;
          });
        } catch (errSecondary) {
          statusEl.style.background = '#7f1d1d';
          statusEl.style.color = '#fca5a5';
          statusEl.textContent = '❌ Error de red al conectar con USGS';
          return;
        }
      }

      statusEl.style.background = '#065f46';
      statusEl.style.color = '#6ee7b7';
      statusEl.textContent = `● LIVE: ${sismos.length} sismos en Panamá (30d)`;

      sismos.forEach(f => {
        const [lon, lat, depth] = f.geometry.coordinates;
        const p = f.properties;
        const radius = Math.max(4, p.mag * 3.5);

        L.circleMarker([lat, lon], {
          radius: radius,
          color: getColor(p.mag),
          fillColor: getColor(p.mag),
          fillOpacity: 0.5,
          weight: 1.5
        }).addTo(map).bindPopup(`
          <div style="font-family:sans-serif; font-size:12px; color:#1e293b;">
            <b style="font-size:14px; color:${getColor(p.mag)}">M${p.mag.toFixed(1)}</b> - ${p.place || 'Panamá'}<br>
            <b>Hora:</b> ${fmtFecha(p.time)}<br>
            <b>Profundidad:</b> ${Math.round(depth)} km<br>
            <a href="${p.url}" target="_blank" rel="noopener">Ver reporte USGS ↗</a>
          </div>
        `);
      });
    }

    cargarSismosNacionales();
  </script>
</body>
</html>
HTML
echo "✅ NOVIEMBRE/TSEC/index.html actualizado"

# 2. Crear / Sobrescribir SISMOS/index.html
mkdir -p "$REPO/SISMOS"
cp "$REPO/NOVIEMBRE/TSEC/index.html" "$REPO/SISMOS/index.html"
echo "✅ SISMOS/index.html actualizado"

# 3. Commit y Push a GitHub
git add NOVIEMBRE/TSEC/index.html SISMOS/index.html
if git diff --cached --quiet; then
  echo "ℹ️ Los archivos ya estaban al día."
else
  git commit -m "fix(mapas): resolver carga dinamica de sismos nacionales y replicamiento M7.7 con respaldo CDN"
  if git push origin main 2>/dev/null || git push origin master 2>/dev/null; then
    echo "🚀 Mapas actualizados y publicados en GitHub Pages."
  else
    echo "⚠️ Commit realizado. Realiza git push cuando tengas conexión a GitHub."
  fi
fi
