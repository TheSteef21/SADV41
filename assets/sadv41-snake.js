(function () {
  if (window.__SADV41_SNAKE_LOADED__) return;
  window.__SADV41_SNAKE_LOADED__ = true;

  const ZK_URL = "https://newsletters.zero-knowledge.com/subscribe?ref=5CT4xeMzTD";
  const WA_STEVEN = "https://wa.me/50769362166";
  const IG_STEVEN = "https://instagram.com/stevendioroficial";
  const ARTIST_URL = "https://thesteef21.github.io/SADV41/Artist";
  const SNAP_DIST = 48;
  const MIN_GAP = 8;

  const style = document.createElement("style");
  style.textContent = `
    .sadv41-zk-bar {
      width: 100%;
      background: linear-gradient(90deg, #090d16, #1e1b4b, #090d16);
      color: #f8fafc;
      border-bottom: 1px solid #38bdf8;
      border-top: 1px solid #38bdf8;
      padding: 10px 14px;
      text-align: center;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 13px;
      z-index: 9990;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .sadv41-zk-bar a {
      background: #38bdf8;
      color: #090d16;
      font-weight: 800;
      padding: 5px 12px;
      border-radius: 999px;
      text-decoration: none;
      font-size: 12px;
      transition: transform 0.15s ease;
    }
    .sadv41-zk-bar a:hover { transform: scale(1.05); }

    .sadv41-mag-widget {
      position: fixed !important;
      z-index: 99999 !important;
      touch-action: none;
      user-select: none;
      cursor: grab;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 10px 14px;
      border-radius: 999px;
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 700;
      font-size: 13px;
      color: #fff;
      text-decoration: none;
      box-shadow: 0 8px 24px rgba(0,0,0,0.55);
      border: 2px solid rgba(255,255,255,0.22);
      transition: box-shadow 0.2s, border-color 0.2s;
    }
    .sadv41-mag-widget:active { cursor: grabbing; }
    .sadv41-mag-widget.snake-linked {
      border-color: #9bbc0f !important;
      box-shadow: 0 0 16px #9bbc0f, 0 6px 18px rgba(0,0,0,0.65) !important;
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
      <span>🌌 <strong>Zero-Knowledge Newsletter · SADV41</strong> — Inteligencia y tecnología sin límites</span>
      <a href="${ZK_URL}" target="_blank" rel="noopener">Suscribirse Ahora ↗</a>
    `;
    return bar;
  }

  document.body.insertBefore(createZKBar("top"), document.body.firstChild);
  document.body.appendChild(createZKBar("bottom"));

  const existingMsg = document.querySelector(".msg-float");
  if (existingMsg) existingMsg.remove();

  // Nodos globales enfocados a StevenDiorOficial / SADV41
  const nodesData = [
    { id: "w-st", label: "🎵 StevenDior", href: ARTIST_URL, bg: "#0284c7" },
    { id: "w-ig", label: "📸 @stevendioroficial", href: IG_STEVEN, bg: "#db2777" },
    { id: "w-wa", label: "📲 WhatsApp SADV41", href: WA_STEVEN, bg: "#16a34a" },
    { id: "w-zk", label: "🌌 ZK News", href: ZK_URL, bg: "#4f46e5" },
    { id: "w-sn", label: "🐍 Nokia Snake", href: "#snake", bg: "#306230" }
  ];

  const widgets = [];
  const startY = Math.max(80, window.innerHeight - 310);

  nodesData.forEach((data, idx) => {
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

    const state = {
      el,
      x: 14,
      y: startY + idx * 52,
      w: el.offsetWidth || 145,
      h: el.offsetHeight || 40,
      moved: false
    };
    el.style.left = state.x + "px";
    el.style.top = state.y + "px";
    widgets.push(state);
  });

  function resolveCollisionsAndMagnetism(activeWidget) {
    const maxW = window.innerWidth;
    const maxH = window.innerHeight;

    widgets.forEach(w => {
      w.w = w.el.offsetWidth || 145;
      w.h = w.el.offsetHeight || 40;
      w.x = Math.max(6, Math.min(maxW - w.w - 6, w.x));
      w.y = Math.max(6, Math.min(maxH - w.h - 6, w.y));
    });

    let linkedCount = 0;

    for (let pass = 0; pass < 4; pass++) {
      for (let i = 0; i < widgets.length; i++) {
        for (let j = i + 1; j < widgets.length; j++) {
          const a = widgets[i];
          const b = widgets[j];

          const dx = (b.x + b.w / 2) - (a.x + a.w / 2);
          const dy = (b.y + b.h / 2) - (a.y + a.h / 2);
          const dist = Math.hypot(dx, dy);

          const idealDist = (a.w + b.w) / 2 + MIN_GAP;
          if (dist < idealDist + SNAP_DIST && dist > 0) {
            if (pass === 0) linkedCount++;
            const target = (activeWidget === a) ? b : a;
            const anchor = (activeWidget === a) ? a : b;
            if (Math.abs(dx) >= Math.abs(dy)) {
              const dir = dx >= 0 ? 1 : -1;
              target.x = anchor.x + dir * (anchor.w + MIN_GAP);
              target.y = anchor.y;
            } else {
              const dir = dy >= 0 ? 1 : -1;
              target.x = anchor.x;
              target.y = anchor.y + dir * (anchor.h + MIN_GAP);
            }
          }

          const overlapX = (a.w / 2 + b.w / 2 + MIN_GAP) - Math.abs((a.x + a.w / 2) - (b.x + b.w / 2));
          const overlapY = (a.h / 2 + b.h / 2 + MIN_GAP) - Math.abs((a.y + a.h / 2) - (b.y + b.h / 2));

          if (overlapX > 0 && overlapY > 0) {
            const mover = (activeWidget === b) ? a : b;
            const fixed = (mover === a) ? b : a;
            if (overlapX < overlapY) {
              mover.x += (mover.x >= fixed.x ? overlapX : -overlapX);
            } else {
              mover.y += (mover.y >= fixed.y ? overlapY : -overlapY);
            }
          }

          [a, b].forEach(item => {
            item.x = Math.max(6, Math.min(maxW - item.w - 6, item.x));
            item.y = Math.max(6, Math.min(maxH - item.h - 6, item.y));
          });
        }
      }
    }

    const allLinked = linkedCount >= widgets.length - 1;
    widgets.forEach(w => {
      w.el.style.left = w.x + "px";
      w.el.style.top = w.y + "px";
      w.el.classList.toggle("snake-linked", allLinked);
    });
  }

  widgets.forEach(w => {
    let dragging = false, offX = 0, offY = 0;

    const onDown = (e) => {
      const pt = e.touches ? e.touches[0] : e;
      dragging = true;
      w.moved = false;
      offX = pt.clientX - w.x;
      offY = pt.clientY - w.y;
    };

    const onMove = (e) => {
      if (!dragging) return;
      const pt = e.touches ? e.touches[0] : e;
      w.moved = true;
      w.x = pt.clientX - offX;
      w.y = pt.clientY - offY;
      resolveCollisionsAndMagnetism(w);
    };

    const onUp = () => { dragging = false; };

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

  window.addEventListener("resize", () => resolveCollisionsAndMagnetism(null));
  setTimeout(() => resolveCollisionsAndMagnetism(null), 150);

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
