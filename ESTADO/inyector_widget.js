(function() {
  var w = document.createElement('div');
  w.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;';
  var f = document.createElement('iframe');
  f.src = 'https://thesteef21.github.io/SADV41/ESTADO/widget_sadv41_inyectable.html';
  f.style.cssText = 'width:350px;height:600px;border:none;border-radius:12px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);';
  w.appendChild(f); document.body.appendChild(w);
})();