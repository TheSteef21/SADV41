#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-$HOME/sadv41}"
cd "$REPO" || exit 1

echo "🛡️ Aplicando parche anti-bloqueo CORS / Brave Shields..."

mkdir -p "$REPO/NOVIEMBRE/TSEC" "$REPO/SISMOS"

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
      }).catch(e => {});

    const getColor = m => m >= 6.0 ? '#ef4444' : m >= 5.0 ? '#f97316' : m >= 4.0 ? '#eab308' : '#06b6d4';
    const fmtFecha = t => new Date(t).toLocaleString('es-PA', { timeZone: 'America/Panama' });

    async function fetchConFallback(urls) {
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            let feat = null;
            if (data.features) feat = data.features;
            else if (data.contents) {
              feat = typeof data.contents === 'string' ? JSON.parse(data.contents).features : data.contents.features;
            }
            if (feat && feat.length > 0) return feat;
          }
        } catch (e) {
          console.warn('Falló intento en:', url);
        }
      }
      throw new Error('Todas las rutas de conexión fallaron');
    }

    async function cargarSismosNacionales() {
      const statusEl = document.getElementById('status');
      const ini = new Date(Date.now() - 30 * 86400000).toISOString();
      const rawUsgs = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${ini}&minmagnitude=2.5&minlatitude=5.0&maxlatitude=11.0&minlongitude=-84.5&maxlongitude=-76.0&orderby=time&limit=2000`;

      const fuentes = [
        rawUsgs,
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson',
        'https://api.allorigins.win/raw?url=' + encodeURIComponent(rawUsgs),
        'https://corsproxy.io/?' + encodeURIComponent(rawUsgs),
        '../../sismos.json',
        '../sismos.json',
        './sismos.json'
      ];

      try {
        const rawFeatures = await fetchConFallback(fuentes);
        const sismos = rawFeatures.filter(f => {
          if (!f.geometry || !f.geometry.coordinates) return false;
          const [lon, lat] = f.geometry.coordinates;
          return lat >= 5.0 && lat <= 11.0 && lon >= -84.5 && lon <= -76.0 && (f.properties.mag || 0) >= 2.5;
        });

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
      } catch (err) {
        statusEl.style.background = '#7f1d1d';
        statusEl.style.color = '#fca5a5';
        statusEl.textContent = '❌ Error de red al conectar con USGS';
      }
    }

    cargarSismosNacionales();
  </script>
</body>
</html>
HTML

cp "$REPO/NOVIEMBRE/TSEC/index.html" "$REPO/SISMOS/index.html"

git add NOVIEMBRE/TSEC/index.html SISMOS/index.html
git commit -m "fix(cors): agregar proxies de rescate y fallback local para Brave Browser" || true
git push origin main 2>/dev/null || git push origin master 2>/dev/null || true

echo "🚀 Parche multirruta aplicado y subido a GitHub."
