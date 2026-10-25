/* SADV41 — íconos flotantes arrastrables (un solo archivo para todo el sitio) */
(function () {
  var IDS = ['sadv41-floating-container', 'stevendior-agent-hub'];
  var KEY = 'sadv41_pos_';
  var THRESH = 6;

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function clamp(el) {
    var r = el.getBoundingClientRect(), w = window.innerWidth, h = window.innerHeight;
    var x = Math.min(Math.max(0, r.left), Math.max(0, w - r.width));
    var y = Math.min(Math.max(0, r.top), Math.max(0, h - r.height));
    el.style.left = x + 'px'; el.style.top = y + 'px';
  }
  function free(el) {
    var r = el.getBoundingClientRect();
    el.style.transform = 'none'; el.style.right = 'auto'; el.style.bottom = 'auto';
    el.style.left = r.left + 'px'; el.style.top = r.top + 'px';
  }

  function make(el) {
    if (el.__drag) return; el.__drag = true;
    el.style.touchAction = 'none';
    el.style.cursor = 'grab';
    var sx, sy, ox, oy, moved = false, down = false, pid = null;

    var saved = store(KEY + el.id);
    if (saved) {
      try { var p = JSON.parse(saved); free(el); el.style.left = p.x + 'px'; el.style.top = p.y + 'px'; clamp(el); } catch (e) {}
    }

    el.addEventListener('touchstart', function (e) { e.stopImmediatePropagation(); }, true);

    el.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      down = true; moved = false; pid = e.pointerId;
      sx = e.clientX; sy = e.clientY;
      var r = el.getBoundingClientRect(); ox = r.left; oy = r.top;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', end);
      window.addEventListener('pointercancel', end);
    });
    function onMove(e) {
      if (!down || e.pointerId !== pid) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved) {
        if (Math.abs(dx) < THRESH && Math.abs(dy) < THRESH) return;
        moved = true;
        var m = el.querySelector('#sadv41-menu'); if (m) m.style.display = 'none';
        free(el); el.style.cursor = 'grabbing';
        var r2 = el.getBoundingClientRect(); ox = r2.left; oy = r2.top; sx = e.clientX; sy = e.clientY; dx = 0; dy = 0;
      }
      el.style.left = (ox + dx) + 'px'; el.style.top = (oy + dy) + 'px';
      clamp(el);
      e.preventDefault();
    }
    function end(e) {
      if (!down || (e && e.pointerId !== pid)) return;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      down = false; el.style.cursor = 'grab';
      if (moved) {
        var r = el.getBoundingClientRect();
        store(KEY + el.id, JSON.stringify({ x: Math.round(r.left), y: Math.round(r.top) }));
        el.__justDragged = true; setTimeout(function () { el.__justDragged = false; }, 350);
      } else {
        var m = el.querySelector('#sadv41-menu');
        if (m && e && e.pointerType === 'touch' && !e.target.closest('a')) m.style.display = (m.style.display === 'block' ? 'none' : 'block');
      }
    }
    el.addEventListener('click', function (e) {
      if (el.__justDragged) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }

  function init() {
    IDS.forEach(function (id) { var el = document.getElementById(id); if (el) make(el); });
  }
  window.addEventListener('resize', function () {
    IDS.forEach(function (id) { var el = document.getElementById(id); if (el && el.style.left && el.style.transform === 'none') clamp(el); });
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
