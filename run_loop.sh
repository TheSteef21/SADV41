#!/bin/bash
PROJECT_DIR="$HOME/sadv41"
LOG_FILE="loop.log"
INTERVAL=1800  # 30 minutos

cd "$PROJECT_DIR" || exit 1
echo "🗿 [SADV41 - Bucle de Monitoreo Sísmico Iniciado (Umbral 2.5)]" >> "$LOG_FILE"

while true; do
    echo "=== $(date '+%Y-%m-%d %H:%M:%S') Ejecutando chequeo USGS ===" >> "$LOG_FILE"
    python3 post_72h_sismos.py >> "$LOG_FILE" 2>&1
    sleep "$INTERVAL"
done
