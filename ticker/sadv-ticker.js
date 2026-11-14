/* SADV41 · Cintillo de valor (ticker) — se inyecta solo en cualquier página.
   Muestra el primer activo creado por SADV41 y su valor en vivo (DexScreener).
   Uso: <script defer src="https://thesteef21.github.io/SADV41/ticker/sadv-ticker.js"></script> */
(function () {
  "use strict";
  if (window.__sadvTickerLoaded) return;
  window.__sadvTickerLoaded = true;

  // ---------- CONFIG (editar aquí) ----------
  var CFG = {
    refreshMs: 60000,
    pxPerSecond: 55,
    tagline: "EL ORIGEN ES 0",
    assets: [
      {
        symbol: "SADV41", // primer activo creado por SADV41
        chain: "bsc",
        address: "0x9b633cc361b3e7aace80340fed9491265f29ffff",
        url: "https://four.meme/token/0x9b633cc361b3e7aace80340fed9491265f29ffff",
        enabled: true
      },
      {
        symbol: "GORRA",
        chain: "bsc",
        address: "0xd03115edb6794fa06304d43ee46f7f62b71bffff",
        url: "https://four.meme/token/0xd03115edb6794fa06304d43ee46f7f62b71bffff?code=BFEJ4KQR584G",
        enabled: false // pon true para mostrarlo también
      }
    ]
  };
  var CACHE_KEY = "sadv_ticker_v1", CLOSED_KEY = "sadv_ticker_closed";
  var BAR_H = 32;

  // ---------- formato ----------
  function fmtPrice(n) {
    if (!isFinite(n) || n <= 0) return "—";
    if (n >= 1) return "$" + n.toFixed(2);
    if (n >= 0.01) return "$" + n.toFixed(4);
    var d = Math.min(12, -Math.floor(Math.log10(n)) + 3);
    return "$" + n.toFixed(d);
  }
  function fmtUsd(n) {
    if (!isFinite(n) || n <= 0) return "—";
    var u = [[1e9, "B"], [1e6, "M"], [1e3, "K"]];
    for (var i = 0; i < u.length; i++) if (n >= u[i][0]) return "$" + (n / u[i][0]).toFixed(2) + u[i][1];
    return "$" + n.toFixed(2);
  }
  function fmtPct(n) {
    if (typeof n !== "number" || !isFinite(n)) return "";
    return (n >= 0 ? "▲ " : "▼ ") + Math.abs(n).toFixed(2) + "%";
  }
  window.SADVTicker = { fmt: { price: fmtPrice, usd: fmtUsd, pct: fmtPct } };

  if (typeof document === "undefined" || typeof fetch === "undefined") return;
  try { if (sessionStorage.getItem(CLOSED_KEY) === "1") return; } catch (e) {}

  var assets = CFG.assets.filter(function (a) { return a.enabled; });
  var data = {};   // symbol -> {price, mcap, change, ok}
  var shown = {};  // symbol -> valor mostrado (para el conteo animado)
  try {
    var c = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    assets.forEach(function (a) { if (c[a.symbol]) { data[a.symbol] = c[a.symbol]; shown[a.symbol] = c[a.symbol].price || 0; } });
  } catch (e) {}

  // ---------- DOM ----------
  var bar, track, closeBtn, styleEl;

  function css() {
    styleEl = document.createElement("style");
    styleEl.textContent =
      "#sadv-ticker{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;height:" + BAR_H + "px;" +
      "box-sizing:content-box;padding-bottom:env(safe-area-inset-bottom,0);background:#020617;" +
      "border-top:1px solid rgba(245,158,11,.55);box-shadow:0 -2px 14px rgba(245,158,11,.18);" +
      "font:12px/" + BAR_H + "px ui-monospace,Menlo,Consolas,monospace;color:#e2e8f0;overflow:hidden}" +
      "#sadv-ticker .st-track{display:flex;width:max-content;white-space:nowrap;will-change:transform;animation:sadvTick var(--st-dur,30s) linear infinite}" +
      "#sadv-ticker:hover .st-track{animation-play-state:paused}" +
      "#sadv-ticker .st-seg{display:flex;flex:none}" +
      "#sadv-ticker a.st-item{color:inherit;text-decoration:none;padding:0 22px;display:inline-flex;gap:8px;align-items:center}" +
      "#sadv-ticker .st-sym{color:#f59e0b;font-weight:700}" +
      "#sadv-ticker .st-price{color:#f1f5f9;font-weight:700;font-variant-numeric:tabular-nums}" +
      "#sadv-ticker .st-up{color:#34d399}#sadv-ticker .st-down{color:#fb7185}" +
      "#sadv-ticker .st-dim{color:#94a3b8}" +
      "#sadv-ticker .st-x{position:absolute;right:0;top:0;height:" + BAR_H + "px;width:32px;border:0;cursor:pointer;color:#94a3b8;" +
      "background:linear-gradient(90deg,transparent,#020617 40%);font:16px/" + BAR_H + "px inherit}" +
      "@keyframes sadvTick{from{transform:translateX(0)}to{transform:translateX(-50%)}}" +
      "@media (prefers-reduced-motion:reduce){#sadv-ticker .st-track{animation:none}}";
    document.head.appendChild(styleEl);
  }

  function span(cls, text) {
    var s = document.createElement("span");
    if (cls) s.className = cls;
    s.textContent = text;
    return s;
  }

  function buildItem(a, aria) {
    var d = data[a.symbol];
    var el = document.createElement("a");
    el.className = "st-item";
    el.href = a.url;
    el.target = "_blank";
    el.rel = "noopener";
    if (aria) el.tabIndex = -1;
    el.appendChild(span("st-sym", "◆ " + a.symbol));
    if (d && d.ok) {
      var p = span("st-price", fmtPrice(shown[a.symbol] != null ? shown[a.symbol] : d.price));
      p.setAttribute("data-sym", a.symbol);
      el.appendChild(p);
      if (typeof d.change === "number") el.appendChild(span(d.change >= 0 ? "st-up" : "st-down", fmtPct(d.change) + " 24h"));
      if (d.mcap) el.appendChild(span("st-dim", "MC " + fmtUsd(d.mcap)));
    } else {
      el.appendChild(span("st-dim", d ? "sin par en DEX todavía" : "cargando valor…"));
    }
    el.appendChild(span("st-dim", "· " + CFG.tagline));
    return el;
  }

  function buildSeg(reps, aria) {
    var seg = document.createElement("div");
    seg.className = "st-seg";
    if (aria) seg.setAttribute("aria-hidden", "true");
    for (var r = 0; r < reps; r++) assets.forEach(function (a) { seg.appendChild(buildItem(a, aria)); });
    return seg;
  }

  function render() {
    if (!track) return;
    track.textContent = "";
    var probe = buildSeg(1, false);
    track.appendChild(probe);
    var w = probe.getBoundingClientRect().width || 400;
    var reps = Math.max(1, Math.ceil((window.innerWidth || 800) / w));
    track.textContent = "";
    var seg = buildSeg(reps, false);
    track.appendChild(seg);
    track.appendChild(buildSeg(reps, true));
    var segW = seg.getBoundingClientRect().width || w * reps;
    track.style.setProperty("--st-dur", Math.max(12, segW / CFG.pxPerSecond).toFixed(1) + "s");
  }

  // ---------- datos ----------
  function pickPair(a, pairs) {
    var addr = a.address.toLowerCase(), best = null;
    (pairs || []).forEach(function (p) {
      if (a.chain && p.chainId !== a.chain) return;
      if (!p.baseToken || (p.baseToken.address || "").toLowerCase() !== addr) return;
      var liq = (p.liquidity && p.liquidity.usd) || 0;
      if (!best || liq > best.liq) best = { p: p, liq: liq };
    });
    return best && best.p;
  }

  function load(a) {
    return fetch("https://api.dexscreener.com/latest/dex/tokens/" + a.address)
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (j) {
        var p = pickPair(a, j && j.pairs), price = p ? parseFloat(p.priceUsd) : NaN;
        if (!p || !isFinite(price)) return { ok: false };
        return {
          ok: true,
          price: price,
          mcap: p.marketCap || p.fdv || 0,
          change: p.priceChange && typeof p.priceChange.h24 === "number" ? p.priceChange.h24 : null
        };
      })
      .catch(function () { return data[a.symbol] && data[a.symbol].ok ? data[a.symbol] : null; });
  }

  function countUp(sym, from, to) {
    var t0 = null, dur = 900;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      var v = from + (to - from) * e;
      shown[sym] = v;
      var els = bar.querySelectorAll('.st-price[data-sym="' + sym + '"]');
      for (var i = 0; i < els.length; i++) els[i].textContent = fmtPrice(v);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function refresh() {
    return Promise.all(assets.map(function (a) {
      return load(a).then(function (d) {
        if (!d) return;
        var firstOk = !(data[a.symbol] && data[a.symbol].ok);
        var prev = shown[a.symbol] || 0;
        data[a.symbol] = d;
        if (firstOk || !d.ok) { shown[a.symbol] = d.ok ? d.price : 0; render(); }
        else { render(); countUp(a.symbol, prev, d.price); }
      });
    })).then(function () {
      try {
        var c = {};
        assets.forEach(function (a) { if (data[a.symbol] && data[a.symbol].ok) c[a.symbol] = data[a.symbol]; });
        localStorage.setItem(CACHE_KEY, JSON.stringify(c));
      } catch (e) {}
    });
  }

  function init() {
    if (!assets.length || document.getElementById("sadv-ticker")) return;
    css();
    bar = document.createElement("div");
    bar.id = "sadv-ticker";
    bar.setAttribute("role", "status");
    bar.setAttribute("aria-label", "Valor del activo SADV41");
    track = document.createElement("div");
    track.className = "st-track";
    closeBtn = document.createElement("button");
    closeBtn.className = "st-x";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Cerrar cintillo");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", function () {
      try { sessionStorage.setItem(CLOSED_KEY, "1"); } catch (e) {}
      bar.remove();
      styleEl.remove();
      document.body.style.paddingBottom = prevPad;
    });
    bar.appendChild(track);
    bar.appendChild(closeBtn);
    document.body.appendChild(bar);
    var prevPad = document.body.style.paddingBottom;
    var cur = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
    document.body.style.paddingBottom = (cur + BAR_H) + "px";
    render();
    refresh();
    setInterval(refresh, CFG.refreshMs);
    var t;
    window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(render, 250); });
  }

  window.SADVTicker.refresh = refresh;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
