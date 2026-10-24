#!/usr/bin/env bash
# Inyecta (o quita) el widget SATV41 en los .html de varios repositorios.
# Uso:  bash inyectar-widget.sh [--prueba] [--quitar] [repo1 repo2 ...]
# Sin repos usa: ~/SADV41  ~/usgs  ~/lapizasuli
# No hace commit ni push: tú revisas con git diff y subes cada repo.

SRC="https://thesteef21.github.io/SADV41/Agent/SAT/GOB/satv41-widget.js"
TAG="<script src=\"${SRC}\" defer></script>"
PRUEBA=0
QUITAR=0
REPOS=()

for a in "$@"; do
  case "$a" in
    --prueba) PRUEBA=1 ;;
    --quitar) QUITAR=1 ;;
    -h|--ayuda) sed -n '2,5p' "$0"; exit 0 ;;
    *) REPOS+=("$a") ;;
  esac
done
if [ "${#REPOS[@]}" -eq 0 ]; then
  REPOS=("$HOME/SADV41" "$HOME/usgs" "$HOME/lapizasuli")
fi

ORIG="$(pwd)"
[ "$PRUEBA" -eq 1 ] && echo "MODO PRUEBA: no se modifica ningún archivo."

for repo in "${REPOS[@]}"; do
  echo
  if [ ! -d "$repo/.git" ]; then
    echo "⚠ No encontré un repositorio en: $repo (omitido)"
    continue
  fi
  cd "$repo" || continue
  echo "== $(basename "$repo") =="
  if [ -n "$(git status --porcelain)" ]; then
    echo "  ⚠ Hay cambios sin guardar; git diff los mostrará junto con los del widget."
  fi

  hechos=0; ya=0; sin=0
  while IFS= read -r -d '' f; do
    if [ "$QUITAR" -eq 1 ]; then
      if grep -qF "$SRC" "$f"; then
        echo "  - quitar: $f"
        [ "$PRUEBA" -eq 0 ] && sed -i "s|${TAG}||" "$f"
        hechos=$((hechos+1))
      fi
      continue
    fi
    if grep -qF 'satv41-widget.js' "$f"; then
      ya=$((ya+1)); continue
    fi
    if ! grep -qi '</body>' "$f"; then
      echo "  ? sin </body>: $f"
      sin=$((sin+1)); continue
    fi
    echo "  + inyectar: $f"
    [ "$PRUEBA" -eq 0 ] && sed -i "0,/<\/body>/I s|</body>|${TAG}&|I" "$f"
    hechos=$((hechos+1))
  done < <(find . -type f \( -name '*.html' -o -name '*.htm' \) \
      -not -path '*/.git/*' -not -path '*/node_modules/*' \
      -not -path './SAT/*' \
      -not -path './Agent/SAT/GOB/index.html' \
      -not -name 'SAT.html' -not -name 'gobernanza.html' -print0)

  echo "  Resumen: $hechos modificados, $ya ya tenían el widget, $sin sin </body>."
  [ "$PRUEBA" -eq 0 ] && git diff --stat | tail -n 1
  cd "$ORIG" || exit 1
done

echo
echo "Listo. Revisa con 'git diff' en cada repo y sube con commit + push."
