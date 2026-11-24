(() => {
  if (window.__SADV41_BRAVE_LOADED__) return;
  window.__SADV41_BRAVE_LOADED__ = true;

  const style = document.createElement("style");
  style.textContent = `
    #sadv41-brave-fab {
      position: fixed;
      bottom: 18px;
      right: 18px;
      z-index: 99998;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 15px;
      border-radius: 999px;
      border: 1px solid rgba(0, 229, 255, 0.45);
      background: rgba(5, 8, 16, 0.92);
      color: #00e5ff;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.4px;
      cursor: pointer;
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.65), 0 0 14px rgba(0, 229, 255, 0.18);
      backdrop-filter: blur(10px);
      transition: transform 0.18s ease, border-color 0.18s ease;
    }
    #sadv41-brave-fab:hover {
      transform: translateY(-2px);
      border-color: #ffd700;
      color: #ffd700;
    }
    #sadv41-brave-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(2, 4, 10, 0.82);
      backdrop-filter: blur(8px);
      padding: 16px;
      overflow-y: auto;
    }
    #sadv41-brave-backdrop.open { display: flex; justify-content: center; align-items: flex-start; }
    #sadv41-brave-modal {
      width: 100%;
      max-width: 780px;
      margin-top: 24px;
      background: #070a12;
      border: 1px solid rgba(0, 229, 255, 0.32);
      border-radius: 16px;
      padding: 18px;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
    }
    .sb-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .sb-title {
      font-size: 15px;
      font-weight: 800;
      color: #ffd700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sb-badge {
      font-family: ui-monospace, monospace;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(0, 229, 255, 0.14);
      color: #00e5ff;
      border: 1px solid rgba(0, 229, 255, 0.35);
    }
    .sb-close {
      cursor: pointer;
      background: rgba(255, 82, 82, 0.14);
      color: #ff5252;
      border: 1px solid rgba(255, 82, 82, 0.35);
      border-radius: 8px;
      padding: 5px 10px;
      font-weight: 700;
      font-size: 12px;
    }
    .sb-form {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 14px;
    }
    .sb-input {
      flex: 1;
      min-width: 210px;
      padding: 10px 13px;
      border-radius: 10px;
      border: 1px solid rgba(0, 229, 255, 0.35);
      background: #030305;
      color: #fff;
      font-size: 13px;
    }
    .sb-btn {
      cursor: pointer;
      padding: 10px 15px;
      border-radius: 10px;
      border: 1px solid rgba(255, 215, 0, 0.45);
      background: rgba(255, 215, 0, 0.14);
      color: #ffd700;
      font-weight: 700;
      font-size: 13px;
    }
    .sb-btn.secondary {
      border-color: rgba(0, 229, 255, 0.32);
      background: rgba(0, 229, 255, 0.08);
      color: #00e5ff;
      font-size: 12px;
      padding: 7px 11px;
    }
    .sb-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 10px;
    }
    .sb-chip {
      cursor: pointer;
      font-size: 11px;
      padding: 4px 9px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
    }
    .sb-chip:hover { border-color: #00e5ff; color: #00e5ff; }
    .sb-config {
      display: none;
      margin-top: 12px;
      padding: 12px;
      border-radius: 10px;
      background: rgba(3, 3, 5, 0.85);
      border: 1px solid rgba(155, 109, 255, 0.3);
      font-size: 12px;
    }
    .sb-config.open { display: grid; gap: 8px; }
    .sb-config input {
      width: 100%;
      padding: 7px 10px;
      border-radius: 7px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: #0b0f1c;
      color: #fff;
      font-family: monospace;
      font-size: 12px;
    }
    .sb-status {
      margin-top: 12px;
      font-size: 12px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .sb-results {
      margin-top: 12px;
      display: grid;
      gap: 11px;
      max-height: 55vh;
      overflow-y: auto;
    }
    .sb-card {
      background: rgba(13, 19, 34, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 12px;
      padding: 13px;
    }
    .sb-card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 6px;
    }
    .sb-card a {
      color: #00e5ff;
      font-weight: 700;
      font-size: 14px;
      text-decoration: none;
    }
    .sb-card a:hover { text-decoration: underline; }
    .sb-meta {
      font-family: ui-monospace, monospace;
      font-size: 11px;
      color: #ffd700;
      margin-bottom: 8px;
    }
    .sb-snippet {
      font-size: 12.5px;
      color: #e2e8f0;
      background: rgba(0, 0, 0, 0.35);
      border-left: 2px solid #00e5ff;
      padding: 7px 10px;
      margin-top: 6px;
      border-radius: 0 6px 6px 0;
    }
  `;
  document.head.appendChild(style);

  const path = window.location.pathname.toLowerCase();
  let quickQueries = [
    "S&P 500 VOO rendimiento hoy",
    "Ondo Finance RWA BSC BlackRock",
    "Panamá economía e inversión"
  ];
  if (path.includes("pancake")) {
    quickQueries = [
      "PancakeSwap V3 liquidity APR BSC",
      "Ondo Finance tokenized stocks BSC",
      "SQQQ ProShares UltraPro Short QQQ"
    ];
  } else if (path.includes("artist")) {
    quickQueries = [
      "432 Hz music production mastering",
      "ISRC UPC music royalties protection",
      "Panama urban folk fusion music"
    ];
  }

  const fab = document.createElement("button");
  fab.id = "sadv41-brave-fab";
  fab.type = "button";
  fab.innerHTML = `<span>⚡</span><span>BRAVE LLM</span>`;
  document.body.appendChild(fab);

  const backdrop = document.createElement("div");
  backdrop.id = "sadv41-brave-backdrop";
  backdrop.innerHTML = `
    <div id="sadv41-brave-modal" role="dialog" aria-label="SADV41 Brave Search LLM Context">
      <div class="sb-head">
        <div class="sb-title">
          SADV41 // BRAVE LLM CONTEXT
          <span class="sb-badge">GROUNDING + SOURCES</span>
        </div>
        <div style="display:flex;gap:6px;">
          <button type="button" class="sb-btn secondary" id="sbToggleCfg">⚙ API / Nodo</button>
          <button type="button" class="sb-close" id="sbClose">✕</button>
        </div>
      </div>

      <div class="sb-config" id="sbConfigPanel">
        <div>
          <label style="color:#ffd700;font-weight:700;">1. Puente Local Termux (Recomendado · sin CORS):</label>
          <input type="text" id="sbBridgeUrl" placeholder="http://127.0.0.1:3000/api/brave-context" />
        </div>
        <div>
          <label style="color:#00e5ff;font-weight:700;">Token Puente Local (ADV41_TOKEN ≥ 32 chars):</label>
          <input type="password" id="sbNodeToken" placeholder="Pega tu ADV41_TOKEN local..." />
        </div>
        <div>
          <label style="color:#cbb4ff;font-weight:700;">2. O Brave X-Subscription-Token directo (solo guardado en tu navegador):</label>
          <input type="password" id="sbBraveKey" placeholder="BSA..." />
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button type="button" class="sb-btn secondary" id="sbSaveCfg">Guardar en este dispositivo</button>
        </div>
      </div>

      <form class="sb-form" id="sbForm">
        <input type="text" class="sb-input" id="sbQuery" placeholder="Consulta de contexto web en tiempo real..." required />
        <button type="submit" class="sb-btn">Buscar Contexto</button>
      </form>

      <div class="sb-chips" id="sbChips">
        ${quickQueries.map(q => `<button type="button" class="sb-chip" data-q="${q.replace(/"/g, "&quot;")}">${q}</button>`).join("")}
      </div>

      <div class="sb-status">
        <span id="sbStatusText">Listo · Endpoint: /res/v1/llm/context</span>
        <button type="button" class="sb-btn secondary" id="sbCopyContext" style="display:none;">Copiar Grounding</button>
      </div>

      <div class="sb-results" id="sbResults"></div>
    </div>
  `;
  document.body.appendChild(backdrop);

  const esc = (str) => String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const bridgeInput = document.getElementById("sbBridgeUrl");
  const nodeTokenInput = document.getElementById("sbNodeToken");
  const braveKeyInput = document.getElementById("sbBraveKey");

  bridgeInput.value = localStorage.getItem("SADV41_BRAVE_BRIDGE") || "http://127.0.0.1:3000/api/brave-context";
  nodeTokenInput.value = localStorage.getItem("SADV41_NODE_TOKEN") || "";
  braveKeyInput.value = localStorage.getItem("SADV41_BRAVE_KEY") || "";

  fab.addEventListener("click", () => {
    backdrop.classList.add("open");
    document.getElementById("sbQuery").focus();
  });
  document.getElementById("sbClose").addEventListener("click", () => backdrop.classList.remove("open"));
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) backdrop.classList.remove("open"); });

  document.getElementById("sbToggleCfg").addEventListener("click", () => {
    document.getElementById("sbConfigPanel").classList.toggle("open");
  });

  document.getElementById("sbSaveCfg").addEventListener("click", () => {
    localStorage.setItem("SADV41_BRAVE_BRIDGE", bridgeInput.value.trim() || "http://127.0.0.1:3000/api/brave-context");
    localStorage.setItem("SADV41_NODE_TOKEN", nodeTokenInput.value.trim());
    localStorage.setItem("SADV41_BRAVE_KEY", braveKeyInput.value.trim());
    document.getElementById("sbStatusText").textContent = "Configuración guardada localmente en el navegador ✓";
    document.getElementById("sbConfigPanel").classList.remove("open");
  });

  let lastRawContext = "";

  async function executeBraveContext(query) {
    const statusEl = document.getElementById("sbStatusText");
    const resultsEl = document.getElementById("sbResults");
    const copyBtn = document.getElementById("sbCopyContext");

    const bridgeUrl = (localStorage.getItem("SADV41_BRAVE_BRIDGE") || "http://127.0.0.1:3000/api/brave-context").trim();
    const nodeToken = (localStorage.getItem("SADV41_NODE_TOKEN") || "").trim();
    const braveKey = (localStorage.getItem("SADV41_BRAVE_KEY") || "").trim();

    statusEl.textContent = `Consultando Brave LLM Context para "${query}"...`;
    resultsEl.innerHTML = "";
    copyBtn.style.display = "none";

    let data = null;

    // 1. Intentar puente local Termux (127.0.0.1:3000) si hay token o no hay llave directa
    if (nodeToken || !braveKey) {
      try {
        const res = await fetch(`${bridgeUrl}?q=${encodeURIComponent(query)}`, {
          headers: nodeToken ? { "X-ADV41-Token": nodeToken } : {}
        });
        if (res.ok) {
          data = await res.json();
          statusEl.textContent = "Conectado vía Nodo Local Termux (127.0.0.1:3000) ✓";
        }
      } catch (_) {}
    }

    // 2. Intentar llamada directa si existe llave en localStorage
    if (!data && braveKey) {
      try {
        const res = await fetch(`https://api.search.brave.com/res/v1/llm/context?q=${encodeURIComponent(query)}`, {
          headers: {
            "Accept": "application/json",
            "X-Subscription-Token": braveKey
          }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
        statusEl.textContent = "Conectado directamente a api.search.brave.com ✓";
      } catch (err) {
        statusEl.innerHTML = `CORS/Red bloqueó llamada directa (${esc(err.message)}). <a href="https://search.brave.com/search?q=${encodeURIComponent(query)}" target="_blank" rel="noopener noreferrer" style="color:#ffd700;">Abrir en Brave Search ↗</a> o activa <code>brave_bridge.js</code> en Termux.`;
        return;
      }
    }

    if (!data) {
      document.getElementById("sbConfigPanel").classList.add("open");
      statusEl.innerHTML = `Configura tu <strong>ADV41_TOKEN</strong> local o tu <strong>X-Subscription-Token</strong> de Brave. <a href="https://search.brave.com/search?q=${encodeURIComponent(query)}" target="_blank" rel="noopener noreferrer" style="color:#ffd700;">Buscar en web ↗</a>`;
      return;
    }

    const generic = (data.grounding && Array.isArray(data.grounding.generic)) ? data.grounding.generic : [];
    const sources = data.sources || {};

    if (!generic.length) {
      statusEl.textContent = "Sin fragmentos de grounding devueltos para esta consulta.";
      return;
    }

    const linesForCopy = [];
    resultsEl.innerHTML = generic.map(item => {
      const src = sources[item.url] || {};
      const host = src.hostname || (() => { try { return new URL(item.url).hostname; } catch { return ""; } })();
      const ageLabel = Array.isArray(src.age) && src.age.length ? src.age[0] : "";
      const snippets = Array.isArray(item.snippets) ? item.snippets : [];

      linesForCopy.push(`[${item.title}] (${item.url})\n` + snippets.map(s => `- ${s}`).join("\n"));

      return `
        <article class="sb-card">
          <div class="sb-card-head">
            <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.title || item.url)}</a>
          </div>
          <div class="sb-meta">${esc(host)}${ageLabel ? " · " + esc(ageLabel) : ""}</div>
          ${snippets.map(s => `<div class="sb-snippet">${esc(s)}</div>`).join("")}
        </article>
      `;
    }).join("");

    lastRawContext = linesForCopy.join("\n\n");
    copyBtn.style.display = "inline-block";
  }

  document.getElementById("sbForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("sbQuery").value.trim();
    if (q) executeBraveContext(q);
  });

  document.querySelectorAll(".sb-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const q = chip.dataset.q;
      document.getElementById("sbQuery").value = q;
      executeBraveContext(q);
    });
  });

  document.getElementById("sbCopyContext").addEventListener("click", function () {
    if (!lastRawContext) return;
    navigator.clipboard.writeText(lastRawContext).then(() => {
      const orig = this.textContent;
      this.textContent = "Contexto Copiado ✓";
      setTimeout(() => { this.textContent = orig; }, 1600);
    });
  });
})();
