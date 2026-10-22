#!/usr/bin/env python3
# ==============================================================================
# SADV41 // TSEC MONITOR - PUBLICADOR AUTOMÁTICO (RADIO ~700 KM PANAMÁ)
# ==============================================================================

import os
import json
import requests
from instagram_bot import send_alert

BASE_DIR = os.path.expanduser("~/sadv41")
STATE_FILE = os.path.join(BASE_DIR, "processed_events.txt")
USGS_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

# Radio de ~700 km centrado en Panamá (Cocos, Nazca, Caribe y Microplaca de Panamá)
LAT_MIN, LAT_MAX = 2.0, 15.0
LON_MIN, LON_MAX = -86.5, -73.5
MAG_MINIMA = 3.5

def main():
    if not os.path.exists(STATE_FILE):
        open(STATE_FILE, 'w').close()

    with open(STATE_FILE, 'r') as f:
        processed_ids = set(line.strip() for line in f if line.strip())

    print("[TSEC] Consultando USGS para sismos recientes en el radio de 700 km...")
    try:
        r = requests.get(USGS_URL, timeout=12)
        if r.status_code != 200:
            print(f"❌ Error al consultar la API de USGS. Status: {r.status_code}")
            return
        data = r.json()
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return

    features = data.get('features', [])
    nuevos_eventos = []

    for f in features:
        eid = f['id']
        mag = f['properties']['mag']
        coords = f['geometry']['coordinates']
        lon, lat = coords[0], coords[1]

        # Ignorar si ya se publicó anteriormente
        if eid in processed_ids:
            continue

        # Filtro de radio y magnitud mínima
        if mag is not None and mag >= MAG_MINIMA:
            if LAT_MIN <= lat <= LAT_MAX and LON_MIN <= lon <= LON_MAX:
                nuevos_eventos.append(f)

    # Ordenar cronológicamente (publicar del más antiguo al más reciente)
    nuevos_eventos.sort(key=lambda x: x['properties']['time'])

    if not nuevos_eventos:
        print("✓ No hay sismos nuevos pendientes por publicar en el área de 700 km.")
        return

    print(f"📡 Se encontraron {len(nuevos_eventos)} sismos nuevos. Iniciando publicaciones...")

    for event in nuevos_eventos:
        eid = event['id']
        mag = event['properties']['mag']
        place = event['properties']['place']
        
        print(f"\n🚀 Publicando: {eid} | M{mag:.1f} - {place}")
        send_alert(json.dumps(event))
        
        # Registrar ID para no repetir
        with open(STATE_FILE, 'a') as f:
            f.write(f"{eid}\n")

if __name__ == "__main__":
    main()
