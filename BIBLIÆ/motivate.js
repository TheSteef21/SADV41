/* Motívate en Cristo 🇵🇦 — presencia SADV41 / BIBLIÆ */
(function () {
  if (window.__cristoPresencia) return;
  window.__cristoPresencia = true;

  var VERSOS = [
  ["Proverbios 11:1","El peso falso es abominación a Jehová; mas la pesa cabal es su contentamiento."],
  ["Colosenses 3:23","Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres."],
  ["Proverbios 21:5","Los pensamientos del diligente ciertamente tienden a la abundancia."],
  ["Proverbios 16:3","Encomienda a Jehová tus obras, y tus pensamientos serán afirmados."],
  ["Salmo 16:6","Las cuerdas me cayeron en lugares deleitosos; en verdad la heredad es hermosa para mí."],
  ["Romanos 12:18","Si es posible, en cuanto dependa de vosotros, estad en paz con todos los hombres."],
  ["Jeremías 29:11","Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal."],
  ["Salmo 46:1","Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones."],
  ["Eclesiastés 4:9","Mejores son dos que uno; porque tienen mejor paga de su trabajo."],
  ["1 Corintios 16:14","Todas vuestras cosas sean hechas con amor."],
  ["Mateo 6:33","Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas."],
  ["Filipenses 4:13","Todo lo puedo en Cristo que me fortalece."],
  ["Juan 7:38","El que cree en mí, como dice la Escritura, de su interior correrán ríos de agua viva."],
  ["Apocalipsis 22:17","Y el Espíritu y la Esposa dicen: Ven. Y el que oye, diga: Ven. Y el que tiene sed, venga; y el que quiera, tome del agua de la vida gratuitamente."]
  ];
  window.CRISTO_VERSES = VERSOS;

  var LINEAS = [
    "Motívate en Cristo 🇵🇦",
    "Christ-motivation 🇵🇦⭐️🇺🇸",
    "Friends of 🇮🇱 From 🇵🇦🇺🇸",
    "And love for the world 🇨🇳🇨🇴🇷🇺👑⚛️☦️"
  ];

  var css = [
    "#cristo-presencia{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:2147483000;",
    "width:min(94vw,520px);font-family:Georgia,'Times New Roman',serif;color:#fff8e1;cursor:pointer;",
    "background:linear-gradient(135deg,rgba(10,16,40,.92),rgba(40,20,60,.92));",
    "border:1px solid rgba(255,215,106,.55);border-radius:18px;padding:10px 16px;text-align:center;",
    "box-shadow:0 4px 22px rgba(255,200,80,.28);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);",
    "animation:cristoIn 1.2s ease both;-webkit-tap-highlight-color:transparent}",
    "#cristo-presencia .cp-t{font-size:12px;letter-spacing:.08em;color:#ffd76a;margin-bottom:4px}",
    "#cristo-presencia .cp-v{transition:opacity .9s ease,transform .9s ease;font-size:14px;line-height:1.4}",
    "#cristo-presencia .cp-v.off{opacity:0;transform:translateY(6px)}",
    "#cristo-presencia .cp-r{display:block;margin-top:4px;font-size:12px;color:#ffd76a;font-style:italic}",
    "#cristo-presencia .cp-g{display:block;margin-top:6px;font-size:11px;letter-spacing:.14em;color:#ffd76a;opacity:.9;text-decoration:none}",
    "#cristo-presencia.min{width:auto;padding:8px 16px;border-radius:999px}",
    "#cristo-presencia.min .cp-v,#cristo-presencia.min .cp-t{display:none}",
    "#cristo-presencia .cp-m{display:none;font-size:13px;letter-spacing:1px}",
    "#cristo-presencia.min .cp-m{display:inline}",
    "#cristo-presencia.min .cp-g{display:inline;margin:0 0 0 10px}",
    "@keyframes cristoIn{from{opacity:0;transform:translate(-50%,20px)}to{opacity:1;transform:translate(-50%,0)}}"
  ].join("");

  function montar() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var box = document.createElement("div"); box.id = "cristo-presencia";
    box.innerHTML = '<div class="cp-t"></div><div class="cp-v"></div>' +
      '<span class="cp-m">✝️ CRISTO 🇵🇦</span>' +
      '<a class="cp-g" href="https://thesteef21.github.io/SADV41/GORRA/" target="_blank" rel="noopener">🧢 GORRA · souvenir</a>';
    document.body.appendChild(box);
    var t = box.querySelector(".cp-t"), v = box.querySelector(".cp-v");
    var i = Math.floor(Math.random() * VERSOS.length), l = 0;

    function mostrar() {
      v.classList.add("off");
      setTimeout(function () {
        var x = VERSOS[i % VERSOS.length];
        t.textContent = LINEAS[l % LINEAS.length];
        v.textContent = "";
        v.appendChild(document.createTextNode("“" + x[1] + "”"));
        var r = document.createElement("span"); r.className = "cp-r"; r.textContent = x[0];
        v.appendChild(r);
        v.classList.remove("off");
        i++; l++;
      }, 900);
    }
    mostrar();
    setInterval(mostrar, 9000);
    box.addEventListener("click", function (e) {
      if (e.target && e.target.closest && e.target.closest("a")) return; /* el enlace de la gorra no minimiza */
      box.classList.toggle("min");
    });
  }

  if (document.body) montar(); else document.addEventListener("DOMContentLoaded", montar);
})();
