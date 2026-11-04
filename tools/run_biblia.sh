#!/data/data/com.termux/files/usr/bin/bash
set -e
REPO="$HOME/sadv41"
export SNIP='<script src="/SADV41/BIBLIA/biblia.js" defer></script>'
cd "$REPO"

if [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ]; then git rebase --abort || true; fi

if [ "$1" = "regen" ]; then
  [ -d "$HOME/biblia-build/bible-json" ] || git clone --depth 1 https://github.com/josevladimir/bible-json "$HOME/biblia-build/bible-json"
  node "$REPO/tools/biblia/build-biblia.js" "$HOME/biblia-build/bible-json" "$REPO/BIBLIA"
fi

echo "[1/2] Widget Biblia en paginas nuevas..."
find "$REPO" -type f -name '*.html' -not -path '*/BIBLIA/*' -not -path '*/.git/*' -print0 | while IFS= read -r -d '' f; do
  grep -q 'BIBLIA/biblia.js' "$f" 2>/dev/null && continue
  python3 - "$f" <<'PY'
import os, re, sys
p = sys.argv[1]; snip = os.environ["SNIP"]
c = open(p, encoding="utf-8", errors="ignore").read()
if "BIBLIA/biblia.js" in c: sys.exit(0)
if re.search(r"</body>", c, re.I):
    c = re.sub(r"</body>", snip + "\n</body>", c, count=1, flags=re.I)
else:
    c += "\n" + snip + "\n"
open(p, "w", encoding="utf-8").write(c)
print(" + " + p)
PY
done

echo "[2/2] Guardando y subiendo..."
git add -A
if ! git diff --cached --quiet; then
  git commit -m "SADV41: Biblia RVR1960 - widget y datos actualizados"
else
  echo "Nada nuevo para guardar"
fi
if ! git pull --rebase origin main; then
  git checkout --theirs USSS/.ss_job_application.html 2>/dev/null || true
  git add USSS/.ss_job_application.html 2>/dev/null || true
  git rebase --continue || true
fi
git push origin main
echo "Listo - $(git log --oneline -1)"
echo "https://thesteef21.github.io/SADV41/BIBLIA/"
