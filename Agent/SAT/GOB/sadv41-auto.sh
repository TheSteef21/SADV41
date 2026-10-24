#!/usr/bin/env bash
# sadv41-auto.sh — señales USGS + Aseo + SADV41 en un solo script (Termux).
#
# Uso:
#   bash sadv41-auto.sh [comando] [opciones]
#
# Comandos:
#   todo      (por defecto) usgs -> aseo -> sadv41
#   usgs      baja el feed del USGS, filtra y escribe SISMOS/data/*.json
#   aseo      comprueba que la página Aseo sigue arriba y con su enlace de WhatsApp
#   sadv41    trae cambios del repo y sube SOLO SISMOS/data (commit + push)
#   widget    prueba la inyección del widget (con --aplicar la ejecuta de verdad)
#   loop      repite "todo" cada N segundos (por defecto 900 = 15 min)
#
# Opciones:
#   --prueba      no escribe ni sube nada; solo muestra qué haría
#   --sin-push    hace commit pero no push
#   --publicar    si hay sismo nuevo, llama a ig_publish.py del bot (apagado por defecto)
#   --aplicar     con "widget": aplica la inyección en vez de solo probar
#   --intervalo N segundos entre vueltas de "loop"
#
# Variables opcionales (se pueden definir antes del comando):
#   SADV41_DIR    carpeta del repo (por defecto ~/SADV41, o ~/sadv41 si solo existe esa)
#   MAG_GLOBAL    magnitud mínima mundial        (por defecto 3.7)
#   MAG_PANAMA    magnitud mínima en la región   (por defecto 2.5)
#   BBOX          latmin,latmax,lonmin,lonmax    (por defecto 5,11,-86,-76: Panamá y alrededores)
#   BOT_DIR       carpeta del bot de Instagram   (por defecto ~/sadv41)
#
# Requiere: pkg install curl jq git

set -u

# ---------- configuración ----------
if [ -n "${SADV41_DIR:-}" ]; then
  REPO="$SADV41_DIR"
elif [ -d "$HOME/SADV41/.git" ]; then
  REPO="$HOME/SADV41"
else
  REPO="$HOME/sadv41"
fi
BOT_DIR="${BOT_DIR:-$HOME/sadv41}"
DATA_DIR="$REPO/SISMOS/data"
ASEO_DIR="$REPO/SATV41/COM/Aseo"
PAGES_BASE="${PAGES_BASE:-https://thesteef21.github.io/SADV41}"
USGS_URL="${USGS_URL:-https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson}"
MAG_GLOBAL="${MAG_GLOBAL:-3.7}"
MAG_PANAMA="${MAG_PANAMA:-2.5}"
BBOX="${BBOX:-5,11,-86,-76}"
STATE="${STATE_DIR:-$HOME/.sadv41-auto}"
LOG="$STATE/auto.log"

CMD="todo"; PRUEBA=0; SIN_PUSH=0; PUBLICAR=0; APLICAR=0; INTERVALO=900
HAY_NUEVO=0; FALLOS=0

while [ $# -gt 0 ]; do
  case "$1" in
    todo|usgs|aseo|sadv41|widget|loop) CMD="$1" ;;
    --prueba) PRUEBA=1 ;;
    --sin-push) SIN_PUSH=1 ;;
    --publicar) PUBLICAR=1 ;;
    --aplicar) APLICAR=1 ;;
    --intervalo) shift; INTERVALO="${1:-900}" ;;
    -h|--ayuda) sed -n '2,31p' "$0"; exit 0 ;;
    *) echo "Opción desconocida: $1 (usa --ayuda)"; exit 2 ;;
  esac
  shift
done

mkdir -p "$STATE"
TMP_DIR="$(mktemp -d)"

log() {
  local msg; msg="$(date '+%Y-%m-%d %H:%M:%S') $*"
  echo "$msg"
  echo "$msg" >> "$LOG"
  if [ -f "$LOG" ] && [ "$(wc -c < "$LOG")" -gt 1000000 ]; then
    tail -n 500 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
  fi
}

need() {
  local c missing=0
  for c in "$@"; do
    command -v "$c" >/dev/null 2>&1 || { echo "Falta '$c'. Instálalo con: pkg install $c"; missing=1; }
  done
  [ "$missing" -eq 0 ] || exit 3
}

# ---------- USGS ----------
usgs() {
  need curl jq
  mkdir -p "$DATA_DIR"
  local tmp="$TMP_DIR/feed.json" ev="$TMP_DIR/ev.json"
  rm -f "$ev.new"

  if ! curl -fsS --max-time 30 --retry 2 "$USGS_URL" -o "$tmp"; then
    log "✗ USGS: no se pudo descargar el feed (no se modificó nada)"; return 1
  fi
  if ! jq -e '.features | type == "array"' "$tmp" >/dev/null 2>&1; then
    log "✗ USGS: respuesta no válida (no se modificó nada)"; return 1
  fi

  local la0 la1 lo0 lo1
  IFS=, read -r la0 la1 lo0 lo1 <<< "$BBOX"
  if ! jq --argjson mg "$MAG_GLOBAL" --argjson mp "$MAG_PANAMA" \
        --argjson la0 "$la0" --argjson la1 "$la1" --argjson lo0 "$lo0" --argjson lo1 "$lo1" '
      [ .features[]
        | select(.properties.mag != null and .geometry.coordinates != null)
        | { id: .id,
            mag: .properties.mag,
            place: (.properties.place // "Ubicación no indicada"),
            time: .properties.time,
            url: .properties.url,
            lon: .geometry.coordinates[0],
            lat: .geometry.coordinates[1],
            depth: .geometry.coordinates[2] }
        | .panama = (.lat >= $la0 and .lat <= $la1 and .lon >= $lo0 and .lon <= $lo1)
        | select(.mag >= $mg or (.panama and .mag >= $mp)) ]
      | sort_by(-.time)' "$tmp" > "$ev"; then
    log "✗ USGS: error al filtrar (revisa MAG_GLOBAL, MAG_PANAMA y BBOX)"; return 1
  fi

  local n; n="$(jq 'length' "$ev")"
  local old new
  old="$(jq -S -c '.events' "$DATA_DIR/usgs_latest.json" 2>/dev/null || echo null)"
  new="$(jq -S -c '.' "$ev")"

  if [ "$old" != "$new" ]; then
    if [ "$PRUEBA" -eq 1 ]; then
      log "[prueba] USGS: $n eventos filtrados; se actualizaría usgs_latest.json"
    else
      jq -n --arg gen "$(date -u +%FT%TZ)" --arg src "$USGS_URL" \
         --argjson mg "$MAG_GLOBAL" --argjson mp "$MAG_PANAMA" --slurpfile ev "$ev" \
         '{generated:$gen, source:$src, min_mag_global:$mg, min_mag_panama:$mp,
           count:($ev[0]|length), events:$ev[0]}' > "$DATA_DIR/usgs_latest.json.new" \
        && mv "$DATA_DIR/usgs_latest.json.new" "$DATA_DIR/usgs_latest.json"
      log "✓ USGS: $n eventos filtrados (hubo cambios)"
    fi
  else
    log "✓ USGS: $n eventos, sin cambios"
  fi

  # ---- sismos nuevos (evita repetir y evita publicar eventos viejos en la primera corrida) ----
  local seen="$STATE/usgs_seen.txt"
  if [ ! -f "$seen" ]; then
    if [ "$PRUEBA" -eq 1 ]; then
      log "[prueba] primera corrida: se marcarían $n eventos como vistos, sin generar alerta"
    else
      jq -r '.[].id' "$ev" > "$seen"
      log "• Primera corrida: $n eventos marcados como vistos (sin alerta)"
    fi
    return 0
  fi

  jq -r '.[].id' "$ev" | grep -vxFf "$seen" > "$ev.new" || true
  if [ ! -s "$ev.new" ]; then
    log "• Sin sismos nuevos"; return 0
  fi

  local primero; primero="$(head -n 1 "$ev.new")"
  local cuantos; cuantos="$(wc -l < "$ev.new" | tr -d ' ')"
  local evjson; evjson="$(jq -c --arg id "$primero" '.[] | select(.id == $id)' "$ev")"

  local mag place t lat lon depth url pan hora
  mag="$(jq -r '.mag' <<< "$evjson")"
  place="$(jq -r '.place' <<< "$evjson")"
  t="$(jq -r '.time' <<< "$evjson")"
  lat="$(jq -r '.lat | (.*100|round/100)' <<< "$evjson")"
  lon="$(jq -r '.lon | (.*100|round/100)' <<< "$evjson")"
  depth="$(jq -r '.depth | (.*10|round/10)' <<< "$evjson")"
  url="$(jq -r '.url // ""' <<< "$evjson")"
  pan="$(jq -r '.panama' <<< "$evjson")"
  hora="$(TZ=America/Panama date -d "@$((t / 1000))" '+%d/%m/%Y %H:%M' 2>/dev/null || echo "$t")"

  local tags="#SADV41 #TSEC #SismosYTerremotos #AlertaSísmica"
  [ "$pan" = "true" ] && tags="$tags #SismosPanama"
  local caption
  caption="$(printf '🚨 SISMO M%s | %s\n\n🕒 %s (hora de Panamá)\n📍 Lat %s, Lon %s · Profundidad %s km\n📡 Fuente: USGS %s\n🔗 Reporte en vivo: %s/SISMOS/SEC.html\n\n%s' \
    "$mag" "$place" "$hora" "$lat" "$lon" "$depth" "$url" "$PAGES_BASE" "$tags")"

  if [ "$PRUEBA" -eq 1 ]; then
    log "[prueba] sismo nuevo M$mag $place ($cuantos nuevos); se escribiría last_event.json"
    return 0
  fi

  jq -n --arg caption "$caption" --argjson event "$evjson" --arg gen "$(date -u +%FT%TZ)" \
     '{caption:$caption, event:$event, generated:$gen}' > "$DATA_DIR/last_event.json.new" \
    && mv "$DATA_DIR/last_event.json.new" "$DATA_DIR/last_event.json"
  cat "$ev.new" >> "$seen"
  HAY_NUEVO=1
  log "🚨 Sismo nuevo M$mag — $place ($cuantos nuevos). last_event.json actualizado"

  if [ "$PUBLICAR" -eq 1 ]; then publicar; fi
  return 0
}

publicar() {
  if [ ! -f "$BOT_DIR/ig_publish.py" ]; then
    log "⚠ --publicar: no encuentro $BOT_DIR/ig_publish.py"; return 1
  fi
  if [ ! -f "$BOT_DIR/alert_temp.jpg" ]; then
    log "⚠ --publicar: falta $BOT_DIR/alert_temp.jpg (este script no genera la imagen)"; return 1
  fi
  cp "$DATA_DIR/last_event.json" "$BOT_DIR/last_event.json"
  ( cd "$BOT_DIR" && python ig_publish.py --image alert_temp.jpg ) \
    && log "✓ Instagram: publicado" || { log "✗ Instagram: ig_publish.py falló"; return 1; }
}

# ---------- Aseo ----------
aseo() {
  need curl
  local url="$PAGES_BASE/SATV41/COM/Aseo/" tmp="$TMP_DIR/aseo.html" code ok=1
  code="$(curl -s -o "$tmp" -w '%{http_code}' --max-time 20 "$url" || true)"
  if [ "$code" != "200" ]; then
    log "✗ Aseo: la página respondió HTTP $code ($url)"; ok=0
  else
    grep -q 'wa.me/' "$tmp" || { log "✗ Aseo: la página no tiene el enlace de WhatsApp"; ok=0; }
  fi
  [ -f "$ASEO_DIR/index.html" ] || { log "✗ Aseo: no existe $ASEO_DIR/index.html en el repo local"; ok=0; }
  [ "$ok" -eq 1 ] && log "✓ Aseo: página arriba, enlace de WhatsApp presente y archivo local presente"
  [ "$ok" -eq 1 ]
}

# ---------- SADV41 (git) ----------
sadv41() {
  need git
  if [ ! -d "$REPO/.git" ]; then log "✗ SADV41: $REPO no es un repositorio"; return 1; fi
  cd "$REPO" || return 1
  if [ -d "$HOME/SADV41/.git" ] && [ -d "$HOME/sadv41/.git" ] && [ "$HOME/SADV41" != "$HOME/sadv41" ]; then
    log "⚠ Existen ~/SADV41 y ~/sadv41 (en Termux son carpetas distintas). Usando: $REPO"
  fi

  local ajenos; ajenos="$(git status --porcelain | grep -v ' SISMOS/data' | grep -vc '^$' || true)"
  if [ "$PRUEBA" -eq 1 ]; then
    log "[prueba] SADV41: $ajenos cambios ajenos a SISMOS/data en el árbol"
  else
    if [ "${ajenos:-0}" -gt 0 ]; then
      git --no-pager pull --ff-only --autostash -q 2>/dev/null \
        || log "⚠ pull --ff-only no se pudo (hay cambios locales ajenos o historia distinta); sigo sin traer cambios"
    else
      git --no-pager pull --rebase --autostash -q 2>/dev/null || log "⚠ git pull --rebase falló; sigo con lo local"
    fi
  fi

  local mb; mb="$(du -sm .git 2>/dev/null | cut -f1)"
  if [ "${mb:-0}" -gt 700 ]; then
    log "⚠ .git pesa ${mb} MB: los push grandes pueden fallar con error 408"
  fi

  if [ -z "$(git status --porcelain -- SISMOS/data 2>/dev/null)" ]; then
    log "✓ SADV41: nada que subir en SISMOS/data"; return 0
  fi
  if [ "$PRUEBA" -eq 1 ]; then
    log "[prueba] SADV41: haría commit de SISMOS/data"; return 0
  fi

  git add -- SISMOS/data
  git commit -q -m "USGS: señales $(date -u '+%Y-%m-%d %H:%MZ')" -- SISMOS/data || { log "✗ commit falló"; return 1; }
  log "✓ SADV41: commit de SISMOS/data"
  if [ "$SIN_PUSH" -eq 1 ]; then log "• --sin-push: no se sube"; return 0; fi

  if git --no-pager push -q 2>/dev/null; then
    log "✓ SADV41: push hecho"
  else
    log "⚠ push rechazado; reintento con pull --rebase"
    if git --no-pager pull --rebase --autostash -q 2>/dev/null && git --no-pager push -q 2>/dev/null; then
      log "✓ SADV41: push hecho tras rebase"
    else
      log "✗ SADV41: push falló (conexión, error 408 o conflicto). El commit quedó en local"
      return 1
    fi
  fi
}

# ---------- widget ----------
widget() {
  local s="$REPO/Agent/SAT/GOB/inyectar-widget.sh"
  [ -f "$s" ] || { log "✗ widget: no encuentro $s"; return 1; }
  if [ "$APLICAR" -eq 1 ] && [ "$PRUEBA" -eq 0 ]; then
    bash "$s"
    log "• Widget aplicado. Revisa con 'git --no-pager diff --stat' ANTES de subir; este script no lo sube."
  else
    bash "$s" --prueba
    log "• Solo prueba. Para aplicar: bash sadv41-auto.sh widget --aplicar"
  fi
}

# ---------- orquestación ----------
paso() {
  local nombre="$1"; shift
  if "$@"; then :; else FALLOS=$((FALLOS + 1)); log "✗ Paso '$nombre' con problemas"; fi
}

todo() {
  FALLOS=0
  paso usgs usgs
  paso aseo aseo
  paso sadv41 sadv41
  if [ "$FALLOS" -eq 0 ]; then log "== Todo OK =="; else log "== Terminó con $FALLOS paso(s) con problemas =="; fi
  [ "$FALLOS" -eq 0 ]
}

# Evita dos ejecuciones al mismo tiempo (cron + loop, por ejemplo)
LOCK="$STATE/lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  if [ -d "$LOCK" ] && [ -n "$(find "$LOCK" -maxdepth 0 -mmin +30 2>/dev/null)" ]; then
    rmdir "$LOCK" 2>/dev/null; mkdir "$LOCK" 2>/dev/null || { echo "Ya hay otra ejecución en curso."; exit 4; }
  else
    echo "Ya hay otra ejecución en curso (si no es cierto: rmdir $LOCK)."; exit 4
  fi
fi
trap 'rmdir "$LOCK" 2>/dev/null; rm -rf "$TMP_DIR"' EXIT

case "$CMD" in
  todo)   todo ;;
  usgs)   usgs ;;
  aseo)   aseo ;;
  sadv41) sadv41 ;;
  widget) widget ;;
  loop)
    trap 'rmdir "$LOCK" 2>/dev/null; rm -rf "$TMP_DIR"; echo; echo "Loop detenido."; exit 0' INT TERM
    log "Loop cada ${INTERVALO}s. Ctrl+C para detener. (Sugerencia: termux-wake-lock)"
    while true; do
      todo || true
      sleep "$INTERVALO"
    done
    ;;
esac
