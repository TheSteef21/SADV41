#!/usr/bin/env bash
BASE_DIR="$HOME/sadv41"
LOG_FILE="$BASE_DIR/tsec_monitor.log"
INTERVALO=60

echo "[$(date '+%Y-%m-%d %H:%M:%S')] INICIANDO BUCLE DE MONITOREO SÍSMICO TSEC..." >> "$LOG_FILE"

while true; do
    if [ -f "$BASE_DIR/medir.sh" ]; then
        bash "$BASE_DIR/medir.sh"
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERR: No se encuentra medir.sh" >> "$LOG_FILE"
    fi
    sleep "$INTERVALO"
done
