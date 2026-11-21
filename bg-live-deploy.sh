#!/data/data/com.termux/files/usr/bin/bash
REPO_DIR="$HOME/SADV41"
VIDEO_ID="wQXEBSZKO0U"
MARKER="<!-- SADV41-LIVE-BG -->"

SNIPPET="$MARKER
<style>
  #sadv41-yt-bg {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: -9999;
    overflow: hidden;
    pointer-events: none;
    background: #000;
  }
  #sadv41-yt-bg iframe {
    position: absolute;
    top: 50%; left: 50%;
    width: 177.78vh;
    height: 100vh;
    min-width: 100vw;
    min-height: 56.25vw;
    transform: translate(-50%, -50%);
    opacity: 0.28;
    filter: contrast(1.1) brightness(0.8);
    border: none;
  }
  #sadv41-audio-btn {
    position: fixed;
    bottom: 14px; right: 14px;
    z-index: 9999;
    background: rgba(10, 10, 12, 0.85);
    color: #d4af37;
    border: 1px solid rgba(212, 175, 55, 0.45);
    padding: 6px 10px;
    font-family: 'Courier New', monospace;
    font-size: 11px;
    letter-spacing: 1px;
    border-radius: 6px;
    cursor: pointer;
    backdrop-filter: blur(6px);
  }
</style>
<div id=\"sadv41-yt-bg\">
  <iframe id=\"sadv41-yt-frame\" src=\"https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${VIDEO_ID}&playsinline=1&rel=0&showinfo=0&modestbranding=1&enablejsapi=1\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe>
</div>
<button id=\"sadv41-audio-btn\" onclick=\"toggleSadv41Audio()\">🔇 LIVE BG</button>
<script>
  var sadv41Muted = true;
  function toggleSadv41Audio() {
    var f = document.getElementById('sadv41-yt-frame');
    var b = document.getElementById('sadv41-audio-btn');
    sadv41Muted = !sadv41Muted;
    f.contentWindow.postMessage(JSON.stringify({
      event: 'command',
      func: sadv41Muted ? 'mute' : 'unMute',
      args: []
    }), '*');
    b.textContent = sadv41Muted ? '🔇 LIVE BG' : '🔊 LIVE BG';
  }
</script>"

export SNIPPET
export MARKER

find "$REPO_DIR" -type f -name "*.html" ! -path "*/.git/*" | while read -r file; do
  python3 -c '
import os, sys

filepath = sys.argv[1]
marker = os.environ["MARKER"]
snippet = os.environ["SNIPPET"]

with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

if marker in content:
    print(f"⏭️  Ya activo en: {filepath}")
    sys.exit(0)

if "</body>" in content:
    updated = content.replace("</body>", snippet + "\n</body>", 1)
elif "</html>" in content:
    updated = content.replace("</html>", snippet + "\n</html>", 1)
else:
    updated = content + "\n" + snippet

with open(filepath, "w", encoding="utf-8") as f:
    f.write(updated)
print(f"✅ Inyectado en: {filepath}")
' "$file"
done

cd "$REPO_DIR"
git add -A
[ -f "Agent/index.html" ] && git add -f Agent/index.html
git commit -m "feat: fondo YouTube Live wQXEBSZKO0U en nodos SADV41 · Protocolo 131"
git push origin main && echo "🚀 Todos los nodos SADV41 actualizados con fondo Live."
