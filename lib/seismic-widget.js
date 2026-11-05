/* SADV41 · Alerta de sismos + versículos · ¡Mantente a salvo! @Sismosyterremotos */
(function(){
  if(window.__sadv41Alerta||document.getElementById('sadv41-seismic-widget')||document.getElementById('widget-safe'))return; window.__sadv41Alerta=true;
  var MIN_MAG=2.5,CADA_MS=300000,FRESCO_MIN=60,MAX_KM_FALLA=25;
  var cs=document.currentScript;
  var BASE=(cs&&cs.src?cs.src:location.href).replace(/[?#].*$/,'').replace(/[^\/]*$/,'');
  var ROOT=new URL('../',BASE).href;
  var TSEC=ROOT+'NOVIEMBRE/TSEC/';
  var IG='https://t.me/Sismosyterremotos';
  var KEY='sadv41_sismos_vistos';
  var VISTOS=null,VERSOS=null,FALLA,TOAST_T=null;
  var RESPALDO=[
    {ref:'Salmos 46:1',code:'PSA.46.1',exp:'Dios es refugio y ayuda en cualquier momento; no estás solo.'},
    {ref:'Isaías 41:10',code:'ISA.41.10',exp:'Dios promete estar contigo y sostenerte; no enfrentas esto solo.'},
    {ref:'Salmos 4:8',code:'PSA.4.8',exp:'Hay una paz que permite descansar sabiendo que Dios cuida.'},
    {ref:'Salmos 91:1-2',code:'PSA.91.1-2',exp:'Quien se refugia en Dios encuentra amparo en medio del peligro.'},
    {ref:'Josué 1:9',code:'JOS.1.9',exp:'Ánimo y valentía: Dios va contigo a donde vayas.'},
    {ref:'Deuteronomio 31:6',code:'DEU.31.6',exp:'La promesa es compañía: Dios va contigo y no te suelta.'}
  ];

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){}return null;}
  function hace(ms){var m=Math.max(0,Math.round((Date.now()-ms)/60000));
    if(m<60)return 'hace '+m+' min';var h=Math.round(m/60);if(h<48)return 'hace '+h+' h';return 'hace '+Math.round(h/24)+' d';}
  function distKm(lat,lon,line){
    var k=Math.cos(lat*Math.PI/180),best=Infinity;
    function P(c){return [(c[0]-lon)*111.32*k,(c[1]-lat)*110.57];}
    for(var i=0;i<line.length-1;i++){
      var a=P(line[i]),b=P(line[i+1]),dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy;
      var t=L?Math.max(0,Math.min(1,-(a[0]*dx+a[1]*dy)/L)):0;
      var x=a[0]+t*dx,y=a[1]+t*dy,d=Math.sqrt(x*x+y*y);if(d<best)best=d;
    }
    return best;
  }

  function versos(cb){
    if(VERSOS)return cb(VERSOS);
    fetch(ROOT+'BIBLIA/temas.json').then(function(r){if(!r.ok)throw new Error('x');return r.json();}).then(function(d){
      var ok={miedo:1,paz:1,esperanza:1,soledad:1,ansiedad:1},out=[];
      (d.temas||[]).forEach(function(t){if(ok[t.id])(t.refs||[]).forEach(function(r){out.push({ref:r[0],code:r[1],exp:t.explica});});});
      VERSOS=out.length?out:RESPALDO;cb(VERSOS);
    }).catch(function(){VERSOS=RESPALDO;cb(VERSOS);});
  }
  function azar(cb){versos(function(v){cb(v[Math.floor(Math.random()*v.length)]);});}
  function versoHTML(v){
    return '<div style="margin-top:6px">📖 <a style="color:#00e5ff" target="_blank" rel="noopener" href="https://www.bible.com/es/bible/149/'+
      encodeURIComponent(v.code)+'.RVR1960">'+esc(v.ref)+'</a><br><span style="opacity:.9">'+esc(v.exp)+'</span></div>';
  }
  function falla(cb){
    if(FALLA!==undefined)return cb(FALLA);
    fetch(TSEC+'pedro-miguel-falla.geojson').then(function(r){return r.json();}).then(function(g){
      var l=null;(g.features||[]).forEach(function(f){if(f.geometry&&f.geometry.type==='LineString')l=f.geometry.coordinates;});
      FALLA=l;cb(l);
    }).catch(function(){FALLA=null;cb(null);});
  }
  function consultar(cb){
    var ini=new Date(Date.now()-24*36e5).toISOString().slice(0,19);
    var url='https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=time&limit=100'+
      '&minlatitude=5&maxlatitude=11&minlongitude=-84&maxlongitude=-76&minmagnitude='+MIN_MAG+'&starttime='+ini;
    fetch(url).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
      .then(function(d){cb(null,d.features||[]);}).catch(function(e){cb(e);});
  }

  var wrap=document.createElement('div');
  wrap.id='sadv41-seismic-widget';
  wrap.setAttribute('style','position:fixed;right:8px;top:84px;z-index:2147483645;font:12px/1.4 system-ui,sans-serif;color:#f1f5f9;max-width:min(92vw,300px)');
  wrap.innerHTML=
    '<button id="s41a-b" style="display:block;margin-left:auto;background:#0a0a0acc;color:#00e5ff;border:1px solid #00e5ff;border-radius:14px;padding:5px 10px;font:600 11px/1.3 system-ui,sans-serif;cursor:pointer;text-align:center">🛟 ¡Mantente a salvo!<br>@Sismosyterremotos</button>'+
    '<div id="s41a-p" style="display:none;margin-top:6px;background:#0b0f19;border:1px solid #1e293b;border-top:3px solid #ef4444;border-radius:12px;padding:10px">'+
      '<div id="s41a-e" style="opacity:.85">Consultando sismos…</div>'+
      '<div id="s41a-v"></div>'+
      '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">'+
        '<button id="s41a-n" style="background:#2563eb;color:#fff;border:0;border-radius:6px;padding:5px 8px;cursor:pointer">🔔 Activar avisos</button>'+
        '<button id="s41a-r" style="background:#1e293b;color:#fff;border:1px solid #334155;border-radius:6px;padding:5px 8px;cursor:pointer">🎲 Otro versículo</button>'+
      '</div>'+
      '<div style="margin-top:8px"><a style="color:#00e5ff" href="'+TSEC+'">🗺️ Mapa sísmico y falla Pedro Miguel</a><br>'+
      '<a style="color:#00e5ff" target="_blank" rel="noopener" href="'+IG+'">@Sismosyterremotos en Telegram</a></div>'+
      '<div style="font-size:10px;opacity:.6;margin-top:8px">Avisa de sismos M≥'+MIN_MAG+' (USGS) mientras esta página esté abierta. Es informativo: la información oficial es de SINAPROC y el Instituto de Geociencias (UP). Ante un sismo fuerte, protégete primero.</div>'+
    '</div>';
  document.body.appendChild(wrap);
  var $=function(id){return document.getElementById(id);};
  $('s41a-b').onclick=function(){var p=$('s41a-p');p.style.display=p.style.display==='none'?'block':'none';if(p.style.display==='block')verso();};
  function verso(){azar(function(v){$('s41a-v').innerHTML=versoHTML(v);});}
  $('s41a-r').onclick=verso;
  function btnNotif(){
    var b=$('s41a-n');if(!('Notification' in window)){b.style.display='none';return;}
    if(Notification.permission==='granted'){b.textContent='🔔 Avisos activos';b.disabled=true;}
    else if(Notification.permission==='denied'){b.textContent='🔕 Avisos bloqueados';b.disabled=true;}
  }
  $('s41a-n').onclick=function(){try{Notification.requestPermission().then(function(){btnNotif();swReg(function(){});});}catch(e){btnNotif();}};
  btnNotif();

  function toast(html){
    var t=$('s41a-t');
    if(!t){t=document.createElement('div');t.id='s41a-t';
      t.setAttribute('style','position:fixed;bottom:12px;left:50%;transform:translateX(-50%);width:min(94vw,360px);z-index:2147483647;background:#0b0f19;color:#f1f5f9;border:1px solid #ef4444;border-top:4px solid #ef4444;border-radius:12px;padding:10px 12px;font:13px/1.45 system-ui,sans-serif;box-shadow:0 6px 20px #000a');
      document.body.appendChild(t);}
    t.innerHTML='<button style="float:right;background:none;border:0;color:#94a3b8;font-size:18px;cursor:pointer" aria-label="Cerrar">×</button>'+html;
    t.style.display='block';t.querySelector('button').onclick=function(){t.style.display='none';};
    clearTimeout(TOAST_T);TOAST_T=setTimeout(function(){t.style.display='none';},90000);
  }

  var SWREG=null;
  function swReg(cb){
    if(SWREG)return cb(SWREG);
    if(!('serviceWorker' in navigator))return cb(null);
    navigator.serviceWorker.register(ROOT+'lib/sw-alerta.js').then(function(reg){
      var w=reg.active||reg.waiting||reg.installing;
      if(!w)return cb(null);
      if(w.state==='activated'){SWREG=reg;return cb(reg);}
      w.addEventListener('statechange',function(){if(w.state==='activated'){SWREG=reg;cb(reg);}});
    }).catch(function(){cb(null);});
  }
  function notif(titulo,cuerpo){
    if(!('Notification' in window)||Notification.permission!=='granted')return;
    var o={body:cuerpo,data:{url:TSEC}};
    swReg(function(reg){
      try{if(reg&&reg.showNotification)reg.showNotification(titulo,o);else new Notification(titulo,o);}catch(e){}
    });
  }
  function avisar(nuevos,line){
    nuevos.sort(function(a,b){return b.properties.mag-a.properties.mag;});
    var f=nuevos[0],p=f.properties,c=f.geometry.coordinates;
    var dk=line?distKm(c[1],c[0],line):null;
    var titulo='Sismo M'+p.mag+' · '+(p.place||'Panamá');
    var cuerpo=hace(p.time)+' · prof. '+Math.round(c[2])+' km';
    var cerca=(dk!==null&&dk<=MAX_KM_FALLA)?'≈ '+dk.toFixed(0)+' km del trazo aproximado de la falla Pedro Miguel (cercano, no implica que la falla lo causó)':'';
    azar(function(v){
      toast('<b>🌎 '+esc(titulo)+'</b><br>'+esc(cuerpo)+(cerca?'<br><i>'+esc(cerca)+'</i>':'')+
        (nuevos.length>1?'<br>+'+(nuevos.length-1)+' sismo(s) más en la última hora':'')+versoHTML(v)+
        '<div style="margin-top:6px"><a style="color:#00e5ff" href="'+TSEC+'">🗺️ Ver en el mapa</a> · <span style="opacity:.7">¡Mantente a salvo! @Sismosyterremotos</span></div>');
      notif(titulo,cuerpo+' · '+v.ref);
    });
  }

  function revisar(){
    consultar(function(err,fs){
      if(err){$('s41a-e').textContent='Sin conexión con USGS ('+(err.message||'error')+')';return;}
      falla(function(line){
        if(VISTOS===null){try{VISTOS=JSON.parse(ls(KEY)||'[]');}catch(e){VISTOS=[];}}
        var nuevos=[];
        fs.forEach(function(f){
          if(VISTOS.indexOf(f.id)>-1)return;
          VISTOS.push(f.id);
          if((Date.now()-f.properties.time)/60000<=FRESCO_MIN)nuevos.push(f);
        });
        VISTOS=VISTOS.slice(-300);ls(KEY,JSON.stringify(VISTOS));
        if(fs.length){var u=fs[0].properties;$('s41a-e').textContent='Último M'+u.mag+' · '+hace(u.time)+' · '+(u.place||'');}
        else $('s41a-e').textContent='Sin sismos M≥'+MIN_MAG+' en las últimas 24 h.';
        if(nuevos.length)avisar(nuevos,line);
      });
    });
  }
  setTimeout(revisar,2500);setInterval(revisar,CADA_MS);
})();
