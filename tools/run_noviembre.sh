#!/data/data/com.termux/files/usr/bin/bash
set -e
cd ~/sadv41
echo ">> SADV41 Noviembre Push"
# Si quedo un rebase a medias de antes
if [ -d ".git/rebase-merge" ] || [ -d ".git/rebase-apply" ]; then
  echo "!! Rebase a medias detectado, abortando para empezar limpio"
  git rebase --abort || true
fi
git fetch origin
# Intenta rebase, si falla por USSS lo resuelve solo
if ! git pull --rebase origin main; then
  echo ">> Conflicto detectado, resolviendo USSS/.ss_job_application.html con --theirs"
  git checkout --theirs USSS/.ss_job_application.html 2>/dev/null || true
  git add USSS/.ss_job_application.html 2>/dev/null || true
  git rebase --continue || true
fi
git add -A
if ! git diff --cached --quiet; then
  git commit -m "SADV41 TSEC: Widget Noviembre 🇵🇦👑🇺🇸 - Feliz Mes de Noviembre"
else
  echo "Nada nuevo para commitear"
fi
git push origin main
echo "✅ Push OK - $(git log --oneline -1)"
