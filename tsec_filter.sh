#!/bin/bash

# ==========================================
# TSEC / INTSEC - Filtro de Sismos Panamá (1.0 - 4.5)
# ==========================================

USGS_URL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
MIN_MAG=1.0
MAX_MAG=4.5

echo "=================================================="
echo "  TSEC MONITOREO SÍSMICO | PANAMÁ (${MIN_MAG}M - ${MAX_MAG}M)"
echo "=================================================="

if ! command -v jq &> /dev/null; then
    echo "Error: 'jq' no está instalado. Ejecuta 'pkg install jq'"
    exit 1
fi

curl -s "$USGS_URL" | jq -r --argjson min "$MIN_MAG" --argjson max "$MAX_MAG" '
  .features[] 
  | select(
      .properties.mag != null and 
      .properties.mag >= $min and 
      .properties.mag <= $max and 
      (.properties.place != null and (.properties.place | test("Panama"; "i")))
    ) 
  | [
      (.properties.time / 1000 | strftime("%Y-%m-%d %H:%M:%S")),
      .properties.mag,
      .properties.place,
      (.geometry.coordinates[2] | tostring + " km"),
      .properties.url
    ] 
  | @tsv
' | while IFS=$'\t' read -r fecha mag lugar profundidad url; do
    echo "🟢 [$fecha] Magnitud: ${mag}M | Prof: $profundidad"
    echo "   Ubicación: $lugar"
    echo "   Enlace: $url"
    echo "--------------------------------------------------"
done
