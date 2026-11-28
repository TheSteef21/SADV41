#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# SADV41 · DOCK MAGNÉTICO PENTA + SNAKE (Compacto & Adaptativo)
# ============================================================
set -e

REPO_DIR="$HOME/SADV41"
SHORTCUT_DIR="$HOME/.shortcuts"
SCRIPT_PATH="$SHORTCUT_DIR/SADV41-Snake-Sync.sh"

mkdir -p "$SHORTCUT_DIR"
cat << 'SELFEOF' > "$SCRIPT_PATH"
#!/data/data/com.termux/files/usr/bin/bash
bash "$HOME/SADV41/sadv41-snake-sync.sh"
SELFEOF
chmod +x "$SCRIPT_PATH"

cd "$REPO_DIR"
BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo main)
git pull --rebase origin "$BRANCH" || true

mkdir -p "assets"
cat << 'JSEOF' > "assets/sadv41-snake.js"
(function () {
  if (window.__SADV41_SNAKE_LOADED__) return;
  window.__SADV41_SNAKE_LOADED__ = true;

  const ZK_URL = "https://newsletters.zero-knowledge.com/subscribe?ref=5CT4xeMzTD";
  const WA_STEVEN = "https://wa.me/50769362166";
  const IG_STEVEN = "https://instagram.com/stevendioroficial";
  const ARTIST_URL = "https://thesteef21.github.io/SADV41/Artist";
  const DOCK_THRESHOLD = 46;
  const GAP = 8;

  const style = document.createElement("style");
  style.textContent = `
    .sadv41-zk-bar {
      width: 100%;
      background: linear-gradient(90deg, #090d16, #1e1b4b, #090d16);
      color: #f8fafc;
      border-bottom: 1px solid #38bdf8;
      border-top: 1px solid #38bdf8;
      padding: 8px 12px;
      text-align: center;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
      z-index: 9990;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .sadv41-zk-bar a {
      background: #38bdf8;
      color: #090d16;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 999px;
      text-decoration: none;
      font-size: 11px;
    }

    /* Cápsulas compactas (Verde: menos espacio, cero choque) */
    .sadv41-mag-widget {
      position: fixed !important;
      z-index: 99999 !important;
      touch-action: none;
      user-select: none;
      cursor: grab;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      height: 38px;
      padding: 0 10px;
      border-radius: 999px;
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 700;
      font-size: 11px;
      color: #fff;
      text-decoration: none;
      box-shadow: 0 6px 16px rgba(0,0,0,0.55);
      border: 1.5px solid rgba(255,255,255,0.28);
      transition: left 0.22s cubic-bezier(.22,1,.36,1), top 0.22s cubic-bezier(.22,1,.36,1), box-shadow 0.2s, border-color 0.2s;
      white-space: nowrap;
    }
    .sadv41-mag-widget.dragging {
      transition: none !important;
      cursor: grabbing;
      transform: scale(1.06);
    }
    .sadv41-mag-widget.snake-linked {
      border-color: #9bbc0f !important;
      box-shadow: 0 0 14px #9bbc0f, 0 4px 12px rgba(0,0,0,0.65) !important;
    }
    #sadv41-snake-modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(9, 13, 22, 0.92);
      z-index: 100000;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: monospace;
      color: #9bbc0f;
    }
    #sadv41-snake-canvas {
      background: #9bbc0f;
      border: 6px solid #0f380f;
      border-radius: 8px;
      image-rendering: pixelated;
    }
    .snake-controls {
      margin-top: 14px;
      display: grid;
      grid-template-columns: repeat(3, 56px);
      gap: 8px;
    }
    .snake-controls button {
      background: #306230;
      color: #9bbc0f;
      border: 2px solid #0f380f;
      border-radius: 8px;
      padding: 12px;
      font-size: 18px;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  function createZKBar(pos) {
    const bar = document.createElement("div");
    bar.className = "sadv41-zk-bar sadv41-zk-" + pos;
    bar.innerHTML = `
      <span>🌌 <strong>Zero-Knowledge · SADV41</strong></span>
      <a href="${ZK_URL}" target="_blank" rel="noopener">Suscribirse ↗</a>
    `;
    return bar;
  }

  document.body.insertBefore(createZKBar("top"), document.body.firstChild);
  document.body.appendChild(createZKBar("bottom"));

  const existingMsg = document.querySelector(".msg-float");
  if (existingMsg) existingMsg.remove();

  // 5 Nodos compactos (Penta)
  const nodesData = [
    { id: "w-st", label: "🎵 Dior", href: ARTIST_URL, bg: "#0284c7" },
    { id: "w-ig", label: "📸 IG", href: IG_STEVEN, bg: "#db2777" },
    { id: "w-wa", label: "📲 WA", href: WA_STEVEN, bg: "#16a34a" },
    { id: "w-zk", label: "🌌 ZK", href: ZK_URL, bg: "#4f46e5" },
    { id: "w-sn", label: "🐍 Snake", href: "#snake", bg: "#306230" }
  ];

  const widgets = [];
  nodesData.forEach((data) => {
    const el = document.createElement("a");
    el.id = data.id;
    el.className = "sadv41-mag-widget";
    el.textContent = data.label;
    el.style.background = data.bg;
    el.href = data.href;
    if (data.href !== "#snake") {
      el.target = "_blank";
      el.rel = "noopener";
    }
    document.body.appendChild(el);
    widgets.push({
      el,
      id: data.id,
      x: 12,
      y: 120,
      w: el.offsetWidth || 72,
      h: 38,
      moved: false
    });
  });

  function measureAll() {
    widgets.forEach(w => {
      w.w = w.el.offsetWidth || 72;
      w.h = w.el.offsetHeight || 38;
    });
  }

  // Ordenar como Dock en borde (Arriba, Abajo, Izquierda o Derecha)
  function arrangeAsDock(edge) {
    measureAll();
    const W = window.innerWidth;
    const H = window.innerHeight;

    if (edge === "bottom" || edge === "top") {
      const totalW = widgets.reduce((acc, w) => acc + w.w, 0) + GAP * (widgets.length - 1);
      let curX = Math.max(8, (W - totalW) / 2);
      const targetY = edge === "bottom" ? H - 52 : 44;
      widgets.forEach(w => {
        w.x = Math.min(W - w.w - 6, curX);
        w.y = targetY;
        curX += w.w + GAP;
      });
    } else {
      const totalH = widgets.reduce((acc, w) => acc + w.h, 0) + GAP * (widgets.length - 1);
      let curY = Math.max(54, (H - totalH) / 2);
      widgets.forEach(w => {
        w.x = edge === "right" ? W - w.w - 8 : 8;
        w.y = Math.min(H - w.h - 8, curY);
        curY += w.h + GAP;
      });
    }
    applyPositions(true);
  }

  // Formación Penta (Estrella de 5 puntas sin colisión) alrededor de un centro (cx, cy)
  function arrangeAsPenta(cx, cy) {
    measureAll();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const radius = 64; // Radio compacto que evita que los 5 nodos choquen
    const safeCx = Math.max(radius + 45, Math.min(W - radius - 45, cx));
    const safeCy = Math.max(radius + 55, Math.min(H - radius - 55, cy));

    widgets.forEach((w, idx) => {
      const angle = (-Math.PI / 2) + (idx * (2 * Math.PI / widgets.length));
      w.x = safeCx + Math.cos(angle) * radius - w.w / 2;
      w.y = safeCy + Math.sin(angle) * radius - w.h / 2;
    });
    applyPositions(true);
  }

  // Anticolisión estricta mientras se arrastra libremente
  function preventOverlap(active) {
    measureAll();
    const W = window.innerWidth;
    const H = window.innerHeight;

    for (let pass = 0; pass < 4; pass++) {
      for (let i = 0; i < widgets.length; i++) {
        for (let j = i + 1; j < widgets.length; j++) {
          const a = widgets[i];
          const b = widgets[j];
          const overlapX = (a.w / 2 + b.w / 2 + GAP) - Math.abs((a.x + a.w / 2) - (b.x + b.w / 2));
          const overlapY = (a.h / 2 + b.h / 2 + GAP) - Math.abs((a.y + a.h / 2) - (b.y + b.h / 2));
          if (overlapX > 0 && overlapY > 0) {
            const mover = (active === b) ? a : b;
            const fixed = (mover === a) ? b : a;
            if (overlapX < overlapY) {
              mover.x += (mover.x >= fixed.x ? overlapX : -overlapX);
            } else {
              mover.y += (mover.y >= fixed.y ? overlapY : -overlapY);
            }
          }
          [a, b].forEach(item => {
            item.x = Math.max(6, Math.min(W - item.w - 6, item.x));
            item.y = Math.max(6, Math.min(H - item.h - 6, item.y));
          });
        }
      }
    }
    applyPositions(false);
  }

  function applyPositions(linked) {
    widgets.forEach(w => {
      w.el.style.left = Math.round(w.x) + "px";
      w.el.style.top = Math.round(w.y) + "px";
      w.el.classList.toggle("snake-linked", linked);
    });
  }

  // Eventos de arrastre y auto-ordenamiento Dock / Penta al soltar
  widgets.forEach(w => {
    let dragging = false, offX = 0, offY = 0;

    const onDown = (e) => {
      const pt = e.touches ? e.touches[0] : e;
      dragging = true;
      w.moved = false;
      w.el.classList.add("dragging");
      offX = pt.clientX - w.x;
      offY = pt.clientY - w.y;
    };

    const onMove = (e) => {
      if (!dragging) return;
      const pt = e.touches ? e.touches[0] : e;
      w.moved = true;
      w.x = pt.clientX - offX;
      w.y = pt.clientY - offY;
      preventOverlap(w);
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      w.el.classList.remove("dragging");
      if (!w.moved) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const cx = w.x + w.w / 2;
      const cy = w.y + w.h / 2;

      // Detectar si se soltó cerca de un borde -> Modo Dock
      if (cy >= H - DOCK_THRESHOLD - 24) {
        arrangeAsDock("bottom");
      } else if (cy <= DOCK_THRESHOLD + 24) {
        arrangeAsDock("top");
      } else if (cx <= DOCK_THRESHOLD + 20) {
        arrangeAsDock("left");
      } else if (cx >= W - DOCK_THRESHOLD - 20) {
        arrangeAsDock("right");
      } else {
        // Si se suelta en el espacio abierto -> Formación Penta sin choque
        arrangeAsPenta(cx, cy);
      }
    };

    w.el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    w.el.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    w.el.addEventListener("click", (e) => {
      if (w.moved) {
        e.preventDefault();
        return;
      }
      if (w.id === "w-sn") {
        e.preventDefault();
        openNokiaSnake();
      }
    });
  });

  // Inicio ordenado como Dock inferior compacto sin tapar contenido
  window.addEventListener("resize", () => arrangeAsDock("bottom"));
  setTimeout(() => arrangeAsDock("bottom"), 120);

  // Mini-juego Nokia Snake
  function openNokiaSnake() {
    let modal = document.getElementById("sadv41-snake-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "sadv41-snake-modal";
      modal.innerHTML = `
        <div style="margin-bottom:8px;font-weight:bold;">🐍 NOKIA SNAKE · SADV41 (Puntos: <span id="sn-score">0</span>)</div>
        <canvas id="sadv41-snake-canvas" width="240" height="240"></canvas>
        <div class="snake-controls">
          <div></div><button data-dir="U">▲</button><div></div>
          <button data-dir="L">◀</button><button data-dir="D">▼</button><button data-dir="R">▶</button>
        </div>
        <button id="sn-close" style="margin-top:14px;background:#dc2626;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-weight:bold;">Cerrar</button>
      `;
      document.body.appendChild(modal);
      document.getElementById("sn-close").onclick = () => {
        modal.style.display = "none";
        clearInterval(window.__snakeLoop);
      };
    }
    modal.style.display = "flex";
    const canvas = document.getElementById("sadv41-snake-canvas");
    const ctx = canvas.getContext("2d");
    const box = 12;
    let snake = [{ x: 10 * box, y: 10 * box }, { x: 9 * box, y: 10 * box }];
    let dir = "R";
    let food = { x: 15 * box, y: 10 * box };
    let score = 0;
    document.getElementById("sn-score").textContent = score;

    modal.querySelectorAll("[data-dir]").forEach(btn => {
      btn.onclick = () => {
        const d = btn.getAttribute("data-dir");
        if (d === "U" && dir !== "D") dir = "U";
        if (d === "D" && dir !== "U") dir = "D";
        if (d === "L" && dir !== "R") dir = "L";
        if (d === "R" && dir !== "L") dir = "R";
      };
    });

    clearInterval(window.__snakeLoop);
    window.__snakeLoop = setInterval(() => {
      ctx.fillStyle = "#9bbc0f";
      ctx.fillRect(0, 0, 240, 240);

      ctx.fillStyle = "#0f380f";
      ctx.fillRect(food.x, food.y, box, box);

      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "#0f380f" : "#306230";
        ctx.fillRect(s.x, s.y, box - 1, box - 1);
      });

      let headX = snake[0].x;
      let headY = snake[0].y;
      if (dir === "U") headY -= box;
      if (dir === "D") headY += box;
      if (dir === "L") headX -= box;
      if (dir === "R") headX += box;

      if (headX < 0) headX = 240 - box;
      if (headX >= 240) headX = 0;
      if (headY < 0) headY = 240 - box;
      if (headY >= 240) headY = 0;

      if (headX === food.x && headY === food.y) {
        score += 10;
        document.getElementById("sn-score").textContent = score;
        food = {
          x: Math.floor(Math.random() * 20) * box,
          y: Math.floor(Math.random() * 20) * box
        };
      } else {
        snake.pop();
      }

      const newHead = { x: headX, y: headY };
      if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        snake = [{ x: 10 * box, y: 10 * box }];
        score = 0;
        document.getElementById("sn-score").textContent = score;
      } else {
        snake.unshift(newHead);
      }
    }, 130);
  }
})();
JSEOF

git add assets/sadv41-snake.js sadv41-snake-sync.sh
git commit -m "SADV41: Widgets compactos con formación Penta y Dock magnético en bordes" || echo "Sin cambios nuevos"
git pull --rebase origin "$BRANCH" || true
git push -u origin "$BRANCH"

echo "✅ Dock magnético Penta + Snake desplegado."
