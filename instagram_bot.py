#!/usr/bin/env python3
# ==============================================================================
# SADV41 // TSEC MONITOR - instagram_bot.py (Con Colaboración @NoticiasBurunga)
# ==============================================================================

import os
import sys
import json
import math
import requests
from io import BytesIO
from datetime import datetime, timezone, timedelta
from instagrapi import Client
from instagrapi.types import Usertag
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.expanduser("~/sadv41")
SESSION_FILE = os.path.join(BASE_DIR, "ig_session.json")
TEMP_IMG = os.path.join(BASE_DIR, "alert_temp.jpg")

MAGNITUD_MINIMA_PUBLICAR = float(os.environ.get("MAG_MIN", "2.5"))
CARTO_KEY = "cb1_4ne6_1_3c19f375f3946685db2cfede"
COLLABORATOR_USERNAME = "NoticiasBurunga"

def deg2num(lat_deg, lon_deg, zoom):
    lat_rad = math.radians(lat_deg)
    n = 2.0 ** zoom
    xtile = int((lon_deg + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
    return (xtile, ytile)

def get_pixel_offset(lat_deg, lon_deg, zoom):
    lat_rad = math.radians(lat_deg)
    n = 2.0 ** zoom
    x = ((lon_deg + 180.0) / 360.0) * n * 256
    y = (1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n * 256
    return x, y

def generate_map_background(lat, lon, zoom=8):
    center_x, center_y = deg2num(lat, lon, zoom)
    global_x, global_y = get_pixel_offset(lat, lon, zoom)
    
    grid_img = Image.new('RGB', (5 * 256, 5 * 256), color='#0a0f14')
    start_x = center_x - 2
    start_y = center_y - 2
    
    headers = {"User-Agent": "Mozilla/5.0 (SADV41 TSEC Monitor)"}
    
    for i in range(5):
        for j in range(5):
            tx, ty = start_x + i, start_y + j
            url = f"https://basemaps.cartocdn.com/rastertiles/voyager/{zoom}/{tx}/{ty}.png?key={CARTO_KEY}"
            try:
                r = requests.get(url, headers=headers, timeout=5)
                if r.status_code == 200:
                    tile = Image.open(BytesIO(r.content)).convert('RGB')
                    grid_img.paste(tile, (i * 256, j * 256))
            except Exception:
                pass

    epi_x = global_x - (start_x * 256)
    epi_y = global_y - (start_y * 256)
    
    left = max(0, int(epi_x - 540))
    top = max(0, int(epi_y - 540))
    cropped = grid_img.crop((left, top, left + 1080, top + 1080))
    
    final_epi_x = int(epi_x - left)
    final_epi_y = int(epi_y - top)
    
    return cropped, final_epi_x, final_epi_y

def get_font(size, bold=True):
    font_paths = [
        "/system/fonts/Roboto-Bold.ttf" if bold else "/system/fonts/Roboto-Regular.ttf",
        "/system/fonts/DroidSans-Bold.ttf" if bold else "/system/fonts/DroidSans.ttf"
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()

def get_tectonic_zone(lat, lon):
    if lat < 6.0 and lon < -80.0:
        return "Placa de Nazca // Zona de Fractura de Panamá"
    elif lat >= 6.0 and lat <= 10.0 and lon >= -83.0 and lon <= -77.0:
        return "Microplaca de Panamá // Cinturón Deformado"
    elif lon < -83.0:
        return "Placa de Cocos // Zona de Subducción del Pacífico"
    else:
        return "Placa del Caribe // Frontera Norte-Oriental"

def generate_alert_image(mag, place, time_str, lat, lon):
    img, epi_x, epi_y = generate_map_background(lat, lon, zoom=8)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    alert_color = (255, 51, 51) if mag >= 5.0 else (255, 204, 0)
    
    draw.ellipse([epi_x - 80, epi_y - 80, epi_x + 80, epi_y + 80], outline=(*alert_color, 100), width=4)
    draw.ellipse([epi_x - 45, epi_y - 45, epi_x + 45, epi_y + 45], outline=(*alert_color, 180), width=6)
    draw.ellipse([epi_x - 15, epi_y - 15, epi_x + 15, epi_y + 15], fill=(*alert_color, 240))
    
    draw.rectangle([0, 600, 1080, 1080], fill=(10, 15, 20, 225))
    draw.line([(0, 600), (1080, 600)], fill=alert_color, width=8)

    font_title = get_font(34, bold=True)
    font_mag = get_font(72, bold=True)
    font_text = get_font(38, bold=True)
    font_sub = get_font(30, bold=False)

    draw.text((40, 625), "SADV41 // TSEC MONITOR", fill='#00e5ff', font=font_title)
    draw.text((800, 625), "LIVE FEED", fill='#ff3333' if mag>=5.0 else '#ffcc00', font=font_title)

    draw.text((40, 680), f"ALERTA SÍSMICA: M {mag:.1f}", fill=alert_color, font=font_mag)

    draw.text((40, 780), f"UBICACIÓN:", fill='#00e5ff', font=font_sub)
    draw.text((40, 815), f"{place}", fill='#ffffff', font=font_text)

    draw.text((40, 880), f"FECHA / HORA LOCAL:", fill='#00e5ff', font=font_sub)
    draw.text((40, 915), f"{time_str} (Hora PA)", fill='#e8e8e8', font=font_text)

    plate_zone = get_tectonic_zone(lat, lon)
    draw.text((40, 1010), f"TECTÓNICA: {plate_zone}", fill='#a0a0a0', font=font_sub)

    img.convert('RGB').save(TEMP_IMG, quality=95)
    return TEMP_IMG

def format_alert_copy(event):
    props = event['properties']
    coords = event['geometry']['coordinates']
    
    mag = props['mag']
    place = props['place']
    depth = coords[2]
    lon, lat = coords[0], coords[1]
    
    utc_time = datetime.fromtimestamp(props['time'] / 1000.0, tz=timezone.utc)
    pa_time = utc_time - timedelta(hours=5)
    time_str = pa_time.strftime('%d/%m/%Y, %I:%M:%S %p')

    plate_zone = get_tectonic_zone(lat, lon)
    icon = "🔴" if mag >= 5.0 else ("🟠" if mag >= 4.0 else ("🟡" if mag >= 3.0 else "🟢"))

    copy = f"""{icon} ALERTA SÍSMICA LIVE // SADV41 INTSEC
🌋 CINTURÓN DE FUEGO DEL PACÍFICO

MAGNITUD: M {mag:.1f}
UBICACIÓN: {place}
PROFUNDIDAD: {depth:.0f} km
FECHA / HORA: {time_str} (Hora Panamá)
COORDENADAS: [{abs(lat):.2f}°{'N' if lat>=0 else 'S'}, {abs(lon):.2f}°{'W' if lon<0 else 'E'}]

🧩 ENTORNO TECTÓNICO: {plate_zone}
📡 MONITOREO TSEC: Red 4 Placas (Cocos-Nazca-Caribe-Panamá)
🛰 TELEMETRÍA: CARTO Voyager / USGS Live Feed

Cc: @NoticiasBurunga

#SADV41 #TSEC #CinturonDeFuego #PlacaDeCocos #PlacaDeNazca #PlacaDelCaribe #SismosPanama #USGS #A217 #NoticiasBurunga #CristoEstaPorVenir"""
    return copy, time_str, mag, lat, lon

def send_alert(event_json_str):
    try:
        event = json.loads(event_json_str)
        caption, time_str, mag, lat, lon = format_alert_copy(event)
        
        if mag < MAGNITUD_MINIMA_PUBLICAR:
            print(f"[BOT] Evento omitido (M {mag:.1f} < M {MAGNITUD_MINIMA_PUBLICAR}).")
            return

        print("=== PROCESANDO PUBLICACIÓN AUTOMÁTICA CON COLABORACIÓN ===")
        print(caption)

        if not os.path.exists(SESSION_FILE):
            print("⚠️ Ejecuta primero 'python3 ig_login.py' para autenticar.")
            return

        cl = Client()
        cl.load_settings(SESSION_FILE)
        
        # Obtener información del usuario para etiqueta e invitación de colaborador
        usertags = []
        coauthors = []
        try:
            collab_user = cl.user_info_by_username(COLLABORATOR_USERNAME)
            usertags.append(Usertag(user=collab_user, x=0.5, y=0.5))
            coauthors.append(collab_user.pk)
            print(f"[IG] Configurada colaboración para @{COLLABORATOR_USERNAME}")
        except Exception as e_collab:
            print(f"⚠️ No se pudo obtener la info de @{COLLABORATOR_USERNAME}: {e_collab}")

        img_path = generate_alert_image(mag, event['properties']['place'], time_str, lat, lon)
        
        print("[IG] Publicando en Instagram con invitación a colaborador...")
        try:
            # Intenta publicar enviando la solicitud de co-autoría (colaborativo)
            media = cl.photo_upload(
                img_path, 
                caption=caption, 
                usertags=usertags, 
                coauthor_producers=coauthors
            )
        except Exception:
            # Fallback a etiqueta estándar en la foto si la API restringe co-authoring directo
            media = cl.photo_upload(img_path, caption=caption, usertags=usertags)
            
        print(f"✓ Publicación realizada con éxito! ID: {media.pk}")

    except Exception as e:
        print(f"❌ Error durante el envío: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        send_alert(sys.argv[1])
    else:
        print("Uso: python3 instagram_bot.py '<json_feature>'")
