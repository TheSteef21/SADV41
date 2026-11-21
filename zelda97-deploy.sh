#!/data/data/com.termux/files/usr/bin/bash
cd ~/SADV41 || exit 1
find . -name "index.html" | while read f; do
  grep -q "ZELDA97" "$f" && echo "skip: $f" && continue
  grep -qi "</body>" "$f" && sed -i 's|</body>|<!-- ZELDA97 OK -->\n</body>|I' "$f" && echo "OK: $f"
done
git add -A && git commit -m "easter-egg: Zelda 97 Spaceworld Overdump SADV41

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01W53Ph3x1fe1kKZSEx3tciS" && git push origin main
echo "OVERDUMP deployed."
