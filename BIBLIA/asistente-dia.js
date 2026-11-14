(function(){
  if (window.__sadv41Dia) return; window.__sadv41Dia = true;
  var BASE = (document.currentScript && document.currentScript.src || "").replace(/[^\/]*$/, "");
  var norm = function(s){return (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");};
  var link = function(u){return "https://www.bible.com/es/bible/149/"+u+".RVR1960";};

  var btn = document.createElement("button");
  btn.textContent = "📖 ¿Cómo estuvo tu día?";
  btn.setAttribute("style","position:fixed;left:8px;bottom:8px;z-index:2147483646;background:#0a0a0acc;color:#00e5ff;border:1px solid #00e5ff;border-radius:20px;padding:6px 12px;font:600 12px system-ui,sans-serif;cursor:pointer");
  var box = document.createElement("div");
  box.setAttribute("style","display:none;position:fixed;left:8px;bottom:46px;width:min(92vw,340px);z-index:2147483646;background:#0b0f19;color:#f1f5f9;border:1px solid #1e293b;border-top:3px solid #3b82f6;border-radius:12px;padding:12px;font:14px/1.5 system-ui,sans-serif");
  box.innerHTML = '<div style="font-weight:700;margin-bottom:6px">¿Cómo estuvo tu día?</div>'+
    '<textarea id="s41t" rows="3" style="width:100%;box-sizing:border-box;background:#1e293b;color:#fff;border:1px solid #334155;border-radius:6px;padding:6px" placeholder="Cuéntame en tus palabras..."></textarea>'+
    '<button id="s41b" style="margin-top:6px;background:#2563eb;color:#fff;border:0;border-radius:6px;padding:6px 12px;cursor:pointer">Ver reflexión</button>'+
    '<div id="s41r" style="margin-top:8px"></div>'+
    '<div style="font-size:10px;opacity:.55;margin-top:8px">Lo que escribes no se guarda ni se envía. Esto es una reflexión, no consejería.</div>';
  document.body.appendChild(box); document.body.appendChild(btn);
  btn.onclick = function(){ box.style.display = box.style.display==="none"?"block":"none"; };

  var datos = null;
  function cargar(cb){ if(datos) return cb(datos);
    fetch(BASE+"temas.json").then(function(r){return r.json();}).then(function(d){datos=d;cb(d);})
    .catch(function(){document.getElementById("s41r").textContent="No pude cargar las reflexiones.";}); }

  document.getElementById("s41b").onclick = function(){
    var t = norm(document.getElementById("s41t").value), out = document.getElementById("s41r");
    if(!t.trim()){ out.textContent="Escribe unas palabras primero."; return; }
    cargar(function(d){
      var crisis = d.crisis_palabras.some(function(k){return t.indexOf(k)>-1;});
      if(crisis){
        out.innerHTML = '<div style="background:#3b1d1d;border:1px solid #ef4444;border-radius:8px;padding:8px">'+
          'Lo que cuentas es serio y mereces apoyo de una persona ahora. Si estás en peligro, llama al <b>911</b> '+
          'o busca a alguien de confianza cerca de ti. No tienes que pasar esto solo.</div>';
        return;
      }
      var mejor=null, max=0;
      d.temas.forEach(function(x){
        var n=0; x.palabras.forEach(function(p){ if(t.indexOf(norm(p))>-1) n++; });
        if(n>max){max=n;mejor=x;}
      });
      var r = mejor || d.defecto;
      out.innerHTML = '<div>'+r.explica+'</div>'+ r.refs.map(function(f){
        return '<div style="margin-top:6px"><a style="color:#00e5ff" target="_blank" rel="noopener" href="'+link(f[1])+'">📖 '+f[0]+'</a></div>';
      }).join("");
    });
  };
})();
