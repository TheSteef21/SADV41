#!/bin/bash
PROJECT_DIR="$HOME/sadv41"
LOG_FILE="loop.log"
INTERVAL=1800  # 30 minutos de pausa mínima entre chequeos

cd "$PROJECT_DIR" || exit 1

echo "🗿 [SADV41 - Bucle de Monitoreo Sísmico Iniciado]" >> "$LOG_FILE"

while true; do
    echo "=== $(date '+%Y-%m-%d %H:%M:%S') Ejecutando chequeo USGS ===" >> "$LOG_FILE"
    # Ejecuta el bot con filtro para Panamá y magnitud mínima 3.7
    python3 instagram_bot.py --check-panama --min-mag 3.7 >> "$LOG_FILE" 2>&1
    sleep "$INTERVAL"
done
