#!/data/data/com.termux/files/usr/bin/bash
set -e
cd ~/sadv41
if [ -d ".git/rebase-merge" ] || [ -d ".git/rebase-apply" ]; then git rebase --abort || true; fi
git fetch origin
if ! git pull --rebase origin main; then
  git checkout --theirs USSS/.ss_job_application.html 2>/dev/null || true
  git add USSS/.ss_job_application.html 2>/dev/null || true
  git rebase --continue || true
fi
git add -A
if ! git diff --cached --quiet; then
  git commit -m "SADV41 TSEC: Widget Noviembre 🇵🇦👑🇺🇸 - Feliz Mes de la Patria"
fi
git push origin main
