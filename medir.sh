#!/usr/bin/env bash
BASE_DIR="$HOME/sadv41"
STATE_FILE="$BASE_DIR/processed_events.txt"
LOG_FILE="$BASE_DIR/tsec_monitor.log"
USGS_URL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"

mkdir -p "$BASE_DIR"
touch "$STATE_FILE"

LAT_MIN=6.5
LAT_MAX=10.0
LON_MIN=-83.5
LON_MAX=-76.5

RESPONSE=$(curl -s --connect-timeout 10 "$USGS_URL")

if [ -z "$RESPONSE" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERR: No se obtuvo respuesta de USGS" >> "$LOG_FILE"
    exit 1
fi

echo "$RESPONSE" | jq -c '.features[]' | while read -r feature; do
    EVENT_ID=$(echo "$feature" | jq -r '.id')
    MAG=$(echo "$feature" | jq -r '.properties.mag')
    PLACE=$(echo "$feature" | jq -r '.properties.place')
    LON=$(echo "$feature" | jq -r '.geometry.coordinates[0]')
    LAT=$(echo "$feature" | jq -r '.geometry.coordinates[1]')

    if grep -q "$EVENT_ID" "$STATE_FILE"; then
        continue
    fi

    IN_BOUNDS=$(awk -v lat="$LAT" -v lmin="$LAT_MIN" -v lmax="$LAT_MAX" \
                    -v lon="$LON" -v rmin="$LON_MIN" -v rmax="$LON_MAX" \
        'BEGIN { if (lat >= lmin && lat <= lmax && lon >= rmin && lon <= rmax) print 1; else print 0 }')

    if [ "$IN_BOUNDS" -eq 1 ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] NUEVO SISMO DETECTADO: M$MAG - $PLACE" >> "$LOG_FILE"
        echo "$EVENT_ID" >> "$STATE_FILE"
        python3 "$BASE_DIR/instagram_bot.py" "$feature" >> "$LOG_FILE" 2>&1
    fi
done
