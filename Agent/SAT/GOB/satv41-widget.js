/* SATV41 · widget flotante · se carga con <script src=".../satv41-widget.js" defer></script> */
(function () {
  'use strict';
  if (document.getElementById('satv41FloatingWidget')) return;

  var BASE = 'https://thesteef21.github.io/SADV41/Agent/SAT/GOB/';
  var TOKEN = '0x90036065b99A1026c07a0322d3C6269c8e33fFFf';

  function copiar(texto, boton) {
    var ok = function () {
      var antes = boton.getAttribute('data-label');
      boton.textContent = 'Copiado ✓';
      setTimeout(function () { boton.textContent = antes; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(ok, function () {});
    } else {
      var t = document.createElement('textarea');
      t.value = texto;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy'); ok(); } catch (e) {}
      document.body.removeChild(t);
    }
  }

  function init() {
    if (document.getElementById('satv41FloatingWidget') || !document.body) return;

    var wrap = document.createElement('div');
    wrap.id = 'satv41FloatingWidget';
    wrap.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;font-family:Inter,system-ui,sans-serif;';

    wrap.innerHTML =
      '<div id="satWidgetModal" style="display:none;margin-bottom:12px;width:300px;max-width:calc(100vw - 48px);background:rgba(10,13,18,.94);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border:1px solid rgba(0,255,136,.4);border-radius:16px;padding:16px;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.8);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:8px;margin-bottom:12px;">' +
          '<span style="font-size:11px;font-weight:bold;color:#00ff88;letter-spacing:1px;">SATV41 · HUB SADV41</span>' +
          '<button type="button" id="satWidgetClose" aria-label="Cerrar" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:18px;line-height:1;">&times;</button>' +
        '</div>' +
        '<p style="font-size:11px;color:#ccc;margin:0 0 10px;line-height:1.4;">Minería con propósito, telemetría y resiliencia.</p>' +
        '<button type="button" id="satWidgetCopy" data-label="Token CA: 0x9003...fFFf" style="width:100%;background:rgba(0,255,136,.1);border:1px solid rgba(0,255,136,.3);color:#00ff88;padding:8px;border-radius:8px;font-size:11px;font-family:monospace;text-align:left;cursor:pointer;margin-bottom:8px;">Token CA: 0x9003...fFFf</button>' +
        '<a href="' + BASE + '" target="_blank" rel="noopener" style="display:block;text-align:center;background:linear-gradient(90deg,#00ff88,#ffd700);color:#000;font-weight:bold;font-size:12px;padding:8px;border-radius:8px;text-decoration:none;">Ver Hub Principal</a>' +
        '<p style="font-size:10px;color:#888;margin:10px 0 0;line-height:1.4;">No es asesoría financiera. Verifica el contrato en <a href="https://bscscan.com/address/' + TOKEN + '" target="_blank" rel="noopener" style="color:#9fe;">BscScan</a> antes de interactuar.</p>' +
      '</div>' +
      '<button type="button" id="satWidgetToggle" aria-label="Abrir SATV41" aria-expanded="false" style="display:block;margin-left:auto;width:60px;height:60px;border-radius:50%;border:2px solid #00ff88;background:#0a0d12;cursor:pointer;overflow:hidden;box-shadow:0 0 15px rgba(0,255,136,.5);padding:0;">' +
        '<img src="' + BASE + '1792865341705.jpg" alt="SATV41" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src=\'https://placehold.co/100x100/0a0d12/00ff88?text=SAT\'">' +
      '</button>';

    document.body.appendChild(wrap);

    var modal = document.getElementById('satWidgetModal');
    var toggle = document.getElementById('satWidgetToggle');
    function abrir(v) {
      modal.style.display = v ? 'block' : 'none';
      toggle.setAttribute('aria-expanded', v ? 'true' : 'false');
    }
    toggle.addEventListener('click', function () { abrir(modal.style.display === 'none'); });
    document.getElementById('satWidgetClose').addEventListener('click', function () { abrir(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') abrir(false); });
    var cp = document.getElementById('satWidgetCopy');
    cp.addEventListener('click', function () { copiar(TOKEN, cp); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
