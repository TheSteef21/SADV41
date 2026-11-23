#!/data/data/com.termux/files/usr/bin/bash
set -e

mkdir -p "ECUACIONES/TMS"
mkdir -p "TimeMakeSpace/🇵🇦🌌⭐️"

cat << 'HTML_EOF' > "ECUACIONES/TMS/index.html"
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SADV41 | Ecuación Espacio-Temporal (Time make Space)</title>
  <style>
    :root {
      --bg: #030305;
      --panel: rgba(10, 14, 24, 0.85);
      --border: rgba(0, 229, 255, 0.25);
      --cyan: #00e5ff;
      --gold: #ffd700;
      --text: #e6edf3;
      --muted: #8b949e;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 20% 10%, #070a12 0%, #030305 70%);
      color: var(--text);
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      padding: 20px 16px 120px;
    }
    .container { max-width: 920px; margin: 0 auto; }
    header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 18px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .badge {
      background: rgba(0, 229, 255, 0.12);
      border: 1px solid var(--cyan);
      color: var(--cyan);
      font-size: 0.78rem;
      padding: 4px 10px;
      border-radius: 999px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    h1 {
      font-size: clamp(1.5rem, 3.5vw, 2.2rem);
      color: #fff;
      letter-spacing: -0.02em;
    }
    h1 span { color: var(--gold); }
    .subtitle { color: var(--muted); font-size: 0.95rem; margin-top: 4px; }
    .card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 20px;
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
    }
    h2 {
      color: var(--cyan);
      font-size: 1.15rem;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .formula-box {
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid var(--gold);
      border-radius: 12px;
      padding: 22px;
      text-align: center;
      margin: 14px 0;
    }
    .formula-main {
      font-size: clamp(1.4rem, 4vw, 2rem);
      font-weight: 700;
      color: var(--gold);
      font-family: 'Courier New', monospace;
    }
    .formula-sub {
      color: var(--cyan);
      font-size: 0.92rem;
      margin-top: 8px;
      font-family: 'Courier New', monospace;
    }
    ul.vars { list-style: none; display: grid; gap: 10px; }
    ul.vars li {
      background: rgba(255, 255, 255, 0.03);
      border-left: 3px solid var(--cyan);
      padding: 10px 14px;
      border-radius: 0 8px 8px 0;
    }
    ul.vars li strong { color: var(--gold); }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .scenario {
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 215, 0, 0.25);
      border-radius: 12px;
      padding: 16px;
    }
    .scenario h3 { color: var(--gold); font-size: 1.02rem; margin-bottom: 8px; }
    .math-step {
      background: #05070c;
      border: 1px solid rgba(0, 229, 255, 0.18);
      padding: 10px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      color: var(--cyan);
      margin-top: 10px;
      font-size: 0.9rem;
    }
    .recursive-note {
      border-left: 3px solid var(--gold);
      background: rgba(255, 215, 0, 0.06);
      padding: 14px;
      border-radius: 0 10px 10px 0;
      margin-top: 12px;
    }
    /* Widget flotante arrastrable */
    #tms-widget {
      position: fixed;
      bottom: 18px;
      right: 18px;
      width: 310px;
      max-width: calc(100vw - 32px);
      background: rgba(5, 8, 16, 0.95);
      border: 1px solid var(--cyan);
      border-radius: 14px;
      box-shadow: 0 12px 35px rgba(0, 229, 255, 0.22);
      z-index: 9999;
      overflow: hidden;
    }
    #tms-widget-header {
      background: linear-gradient(90deg, rgba(0,229,255,0.2), rgba(255,215,0,0.15));
      padding: 10px 14px;
      cursor: move;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      font-size: 0.88rem;
      color: var(--gold);
      user-select: none;
    }
    #tms-widget-body { padding: 12px 14px; font-size: 0.84rem; }
    .w-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      gap: 8px;
    }
    .w-row label { color: var(--muted); }
    .w-row input {
      width: 95px;
      background: #0a0f1c;
      border: 1px solid var(--border);
      color: #fff;
      padding: 4px 8px;
      border-radius: 6px;
      text-align: right;
    }
    .w-presets {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
    }
    .w-presets button, #w-toggle {
      background: rgba(0, 229, 255, 0.14);
      border: 1px solid var(--cyan);
      color: var(--cyan);
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 0.75rem;
      cursor: pointer;
    }
    .w-result {
      background: rgba(255, 215, 0, 0.1);
      border: 1px solid var(--gold);
      border-radius: 8px;
      padding: 8px;
      text-align: center;
      color: var(--gold);
      font-weight: 700;
      margin-top: 6px;
    }
    .collapsed #tms-widget-body { display: none; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <span class="badge">SADV41 · Núcleo Matemático</span>
        <h1>Ecuación Espacio-Temporal <span>(Time make Space)</span></h1>
        <p class="subtitle">Modelado de producción digital, agentes de IA, memoria recursiva y solapamiento discreto.</p>
      </div>
      <div>🇵🇦 🌌 ⭐️ 🗿</div>
    </header>

    <section class="card">
      <h2>1. Definición de Variables del Sistema</h2>
      <ul class="vars">
        <li><strong>T (Tiempo total de desarrollo):</strong> Tiempo requerido para completar el despliegue (años o semanas).</li>
        <li><strong>S (Espacio / Escala de contenido):</strong> Magnitud del entorno digital, definida como <code>S = D · F · H</code> (<strong>D</strong> = densidad de sistemas/mapa, <strong>F</strong> = fidelidad visual y acabado, <strong>H</strong> = narrativa e historia).</li>
        <li><strong>P (Personas):</strong> Directores o desarrolladores humanos (<code>P = 1</code> en flujo individual; <code>P ≥ 1,000</code> en producción AAA).</li>
        <li><strong>M<sub>IA</sub> (Multiplicador de IA):</strong> Aceleración mediante agentes de IA y <em>vibe coding</em> (<code>M<sub>IA</sub> = 1</code> sin IA; <code>M<sub>IA</sub> &gt; 1</code> con agentes activos).</li>
        <li><strong>C<sub>f</sub> (Coeficiente de fricción):</strong> Resistencia de integración al ensamblar sistemas complejos (a mayor escala <code>S</code>, mayor fricción).</li>
        <li><strong>R<sub>m</sub> (Memoria recursiva-retroalimentativa):</strong> Factor de continuidad contextual que evita reconstruir bases de datos desde cero en cada iteración.</li>
      </ul>
    </section>

    <section class="card">
      <h2>2. La Ecuación Maestra del Desarrollo con IA</h2>
      <div class="formula-box">
        <div class="formula-main">T = (S · C<sub>f</sub>) / (P · M<sub>IA</sub>)</div>
        <div class="formula-sub">Modo Recursivo SADV41: T<sub>rec</sub> = (S · C<sub>f</sub>) / (P · M<sub>IA</sub> · R<sub>m</sub>)</div>
      </div>
      <p>El tiempo <strong>(T)</strong> necesario para fabricar un espacio <strong>(S)</strong> se reduce cuando escalas el multiplicador de agentes <strong>(M<sub>IA</sub>)</strong> o la memoria retroalimentativa <strong>(R<sub>m</sub>)</strong>, pero vuelve a incrementarse si la fricción de acabado <strong>(C<sub>f</sub>)</strong> crece exponencialmente.</p>
      <div class="recursive-note">
        <strong>Principio de Memoria Recursiva:</strong> El contenido deja de ser un cuello de botella cuando opera sobre memoria recursiva-retroalimentativa en lugar de recolectar toda la base de datos desde cero. Sin embargo, habitar y articular espacio a través del tiempo exige dirección estructural continua.
      </div>
    </section>

    <section class="card">
      <h2>3. Resolución Paso a Paso de Escenarios</h2>
      <div class="grid-2">
        <div class="scenario">
          <h3>Escenario A: Prototipo Vibe Coding</h3>
          <p>1 creador independiente dirigiendo agentes de IA para levantar un mundo base funcional (conducción, tráfico, NPCs y física inicial).</p>
          <div class="math-step">
            Datos: P = 1 | M<sub>IA</sub> = 20 | S = 1 | C<sub>f</sub> = 1<br>
            T<sub>proto</sub> = (1 · 1) / (1 · 20) = 0.05 años<br>
            Real: 0.05 × 52 = <strong>2.6 semanas</strong>
          </div>
        </div>
        <div class="scenario">
          <h3>Escenario B: Escala Masiva AAA (GTA 6)</h3>
          <p>Densidad orgánica total, narrativa profunda y ensamblaje sin fallos con equipo grande e IA intensiva.</p>
          <div class="math-step">
            Datos: P = 1,000 | M<sub>IA</sub> = 5 | S = 20,000 | C<sub>f</sub> = 1.25<br>
            T<sub>AAA</sub> = (20,000 · 1.25) / (1,000 · 5)<br>
            Real: 25,000 / 5,000 = <strong>5 años</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <h2>4. Interpretación y Protocolo de Solapamiento Discreto</h2>
      <p>La IA comprime el tiempo de arranque estructural (<strong>S<sub>proto</sub></strong>) eliminando la fricción inicial de sintaxis. Cuando el objetivo pasa a un ecosistema vivo de alta densidad (<strong>S<sub>AAA</sub> · C<sub>f</sub></strong>), el factor decisivo es la arquitectura humana y la <strong>discreción operativa</strong>: proyectar resultados e impacto sin exponer identidades ni nodos vulnerables a restricciones externas.</p>
    </section>
  </div>

  <!-- Widget Flotante Dedicado a Ecuaciones -->
  <div id="tms-widget">
    <div id="tms-widget-header">
      <span>⚡ Widget TMS · Calculadora</span>
      <button id="w-toggle" type="button">_</button>
    </div>
    <div id="tms-widget-body">
      <div class="w-presets">
        <button type="button" onclick="setPreset('proto')">Prototipo</button>
        <button type="button" onclick="setPreset('aaa')">Escala AAA</button>
        <button type="button" onclick="setPreset('termux')">Nodo Termux</button>
      </div>
      <div class="w-row"><label>Espacio (S):</label><input id="in-s" type="number" step="any" value="1" oninput="calcTMS()"></div>
      <div class="w-row"><label>Fricción (C<sub>f</sub>):</label><input id="in-cf" type="number" step="any" value="1" oninput="calcTMS()"></div>
      <div class="w-row"><label>Personas (P):</label><input id="in-p" type="number" step="any" value="1" oninput="calcTMS()"></div>
      <div class="w-row"><label>Mult. IA (M<sub>IA</sub>):</label><input id="in-mia" type="number" step="any" value="20" oninput="calcTMS()"></div>
      <div class="w-row"><label>Mem. Rec. (R<sub>m</sub>):</label><input id="in-rm" type="number" step="any" value="1" oninput="calcTMS()"></div>
      <div class="w-result" id="out-res">T = 0.050 años (2.60 sem)</div>
    </div>
  </div>

  <script>
    function calcTMS() {
      const s = parseFloat(document.getElementById('in-s').value) || 0;
      const cf = parseFloat(document.getElementById('in-cf').value) || 0;
      const p = parseFloat(document.getElementById('in-p').value) || 1;
      const mia = parseFloat(document.getElementById('in-mia').value) || 1;
      const rm = parseFloat(document.getElementById('in-rm').value) || 1;
      const tYears = (s * cf) / (p * mia * rm);
      const tWeeks = tYears * 52;
      const tDays = tYears * 365;
      let extra = tYears >= 1 ? `${(tYears * 12).toFixed(1)} meses` : (tWeeks >= 1 ? `${tWeeks.toFixed(2)} sem` : `${tDays.toFixed(1)} días`);
      document.getElementById('out-res').textContent = `T = ${tYears.toFixed(4)} años (${extra})`;
    }
    function setPreset(type) {
      if (type === 'proto') {
        document.getElementById('in-s').value = 1;
        document.getElementById('in-cf').value = 1;
        document.getElementById('in-p').value = 1;
        document.getElementById('in-mia').value = 20;
        document.getElementById('in-rm').value = 1;
      } else if (type === 'aaa') {
        document.getElementById('in-s').value = 20000;
        document.getElementById('in-cf').value = 1.25;
        document.getElementById('in-p').value = 1000;
        document.getElementById('in-mia').value = 5;
        document.getElementById('in-rm').value = 1;
      } else if (type === 'termux') {
        document.getElementById('in-s').value = 2;
        document.getElementById('in-cf').value = 1.1;
        document.getElementById('in-p').value = 1;
        document.getElementById('in-mia').value = 25;
        document.getElementById('in-rm').value = 2.5;
      }
      calcTMS();
    }
    const widget = document.getElementById('tms-widget');
    const header = document.getElementById('tms-widget-header');
    document.getElementById('w-toggle').onclick = () => widget.classList.toggle('collapsed');
    let dragging = false, offsetX = 0, offsetY = 0;
    header.addEventListener('pointerdown', (e) => {
      if (e.target.id === 'w-toggle') return;
      dragging = true;
      const rect = widget.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      header.setPointerCapture(e.pointerId);
    });
    header.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      widget.style.left = Math.max(8, Math.min(window.innerWidth - widget.offsetWidth - 8, e.clientX - offsetX)) + 'px';
      widget.style.top = Math.max(8, Math.min(window.innerHeight - widget.offsetHeight - 8, e.clientY - offsetY)) + 'px';
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
    });
    header.addEventListener('pointerup', () => { dragging = false; });
    calcTMS();
  </script>
</body>
</html>
HTML_EOF

cp "ECUACIONES/TMS/index.html" "TimeMakeSpace/🇵🇦🌌⭐️/index.html"

git add "ECUACIONES/TMS/index.html" "TimeMakeSpace/🇵🇦🌌⭐️/index.html"
git commit -m "Deploy TMS equations and recursive space-time widget"
git push origin main
