#!/usr/bin/env python3
import sys
import json
import requests
from datetime import datetime, timezone, timedelta

INSTAGRAM_WEBHOOK_URL = "https://graph.facebook.com/v18.0/YOUR_INSTAGRAM_ACCOUNT_ID/media"
ACCESS_TOKEN = "YOUR_META_ACCESS_TOKEN"

def format_alert_copy(event):
    props = event['properties']
    coords = event['geometry']['coordinates']
    
    mag = props['mag']
    place = props['place']
    depth = coords[2]
    lon = coords[0]
    lat = coords[1]
    
    utc_time = datetime.fromtimestamp(props['time'] / 1000.0, tz=timezone.utc)
    pa_time = utc_time - timedelta(hours=5)
    time_str = pa_time.strftime('%d/%m/%Y, %I:%M:%S %p')

    icon = "🟡" if mag < 5.0 else "🔴"

    copy = f"""{icon} ALERTA SÍSMICA LIVE // SADV41 INTSEC

MAGNITUD: M {mag:.1f}
UBICACIÓN: {place}
PROFUNDIDAD: {depth} km
FECHA / HORA: {time_str} (Hora Panamá)
COORDENADAS: [{lat:.2f}°N, {lon:.2f}°W]

📡 MONITOREO TSEC: Protocolo Azuero-Soná A217
🛰 TELEMETRÍA: Landsat 9 OLI-2 / USGS Live Feed

#SADV41 #TSEC #SismosPanama #Panama #USGS #MonitorSismico #AzueroSona #A217 #CristoEstaPorVenir
"""
    return copy

def send_alert(event_json_str):
    try:
        event = json.loads(event_json_str)
        caption = format_alert_copy(event)
        
        print("=== COPY GENERADO ===")
        print(caption)

        payload = {
            "caption": caption,
            "access_token": ACCESS_TOKEN,
            "event_id": event['id'],
            "mag": event['properties']['mag']
        }

        if ACCESS_TOKEN != "YOUR_META_ACCESS_TOKEN":
            response = requests.post(INSTAGRAM_WEBHOOK_URL, data=payload, timeout=10)
            print(f"[BOT] Alerta enviada con éxito. Status: {response.status_code}")
        else:
            print("[BOT] Modo Simulación: Alerta generada localmente sin credenciales API.")

    except Exception as e:
        print(f"[BOT ERR] Fallo procesando la alerta: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        send_alert(sys.argv[1])
    else:
        print("Uso: python3 instagram_bot.py '<json_feature>'")
