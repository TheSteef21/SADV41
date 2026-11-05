(function () {
  if (document.getElementById('sadv41-seismic-widget')) return;

  // 1. Estilos inyectados dinámicamente
  const style = document.createElement('style');
  style.innerHTML = `
    #sadv41-seismic-widget {
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 99999;
      background: #0f172a;
      color: #f8fafc;
      border: 1px solid #334155;
      padding: 10px 14px;
      border-radius: 10px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 13px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      gap: 10px;
      backdrop-filter: blur(8px);
      transition: transform 0.3s ease;
    }
    #sadv41-seismic-widget .pulse-dot {
      width: 10px;
      height: 10px;
      background-color: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
      animation: sadv41-pulse 1.6s infinite;
    }
    #sadv41-seismic-widget.alert .pulse-dot {
      background-color: #ef4444;
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    @keyframes sadv41-pulse {
      70% { box-shadow: 0 0 0 8px rgba(0, 0, 0, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
    }
    #sadv41-seismic-widget a {
      color: #38bdf8;
      text-decoration: none;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);

  // 2. Elemento del DOM
  const widget = document.createElement('div');
  widget.id = 'sadv41-seismic-widget';
  widget.innerHTML = `
    <div class="pulse-dot" id="seismic-status-dot"></div>
    <div>
      <span id="seismic-msg">Monitoreo Sísmico TSEC Activo</span>
      <a href="https://thesteef21.github.io/SADV41/NOVIEMBRE/TSEC/PEDROMIGUEL/index.html" target="_blank" style="margin-left:6px;">Ver Mapa ➔</a>
    </div>
  `;
  document.body.appendChild(widget);

  // 3. Consulta de actividad sísmica (USGS / Pedro Miguel M>=2.5)
  async function checkSeismicActivity() {
    try {
      const res = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.5&limit=1');
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const eq = data.features[0].properties;
        const place = eq.place;
        const mag = eq.mag;
        const dot = document.getElementById('seismic-status-dot');
        const msg = document.getElementById('seismic-msg');
        
        if (dot && msg) {
          msg.innerHTML = `Último sismo M${mag}: ${place}`;
          if (mag >= 4.5) widget.classList.add('alert');
        }
      }
    } catch (e) {
      console.log('TSEC Widget Sísmico activo en modo local');
    }
  }

  checkSeismicActivity();
  setInterval(checkSeismicActivity, 300000); // Actualiza cada 5 min
})();
