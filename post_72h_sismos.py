#!/usr/bin/env python3
import os
import sys
import json
import time
import getpass
import requests
from datetime import datetime, timedelta, timezone
from PIL import Image, ImageDraw, ImageFont

try:
    from instagrapi import Client
except ImportError:
    print("❌ 'instagrapi' no está instalado. Ejecuta: pip install instagrapi pillow requests")
    sys.exit(1)

POSTED_FILE = "posted_events.json"
SESSION_FILE = "ig_session.json"
TEMP_IMAGE = "temp_sismo.jpg"

HOURS_LOOKBACK = 72
MIN_MAGNITUDE = 2.5
USE_PANAMA_BOUNDS = True
PANAMA_BOUNDS = "&minlatitude=6.5&maxlatitude=10.5&minlongitude=-83.5&maxlongitude=-77.0"

def load_posted_events():
    if os.path.exists(POSTED_FILE):
        try:
            with open(POSTED_FILE, "r") as f:
                return set(json.load(f))
        except Exception:
            return set()
    return set()

def save_posted_event(event_id):
    posted = load_posted_events()
    posted.add(event_id)
    with open(POSTED_FILE, "w") as f:
        json.dump(list(posted), f, indent=2)

def fetch_usgs_events():
    now_utc = datetime.now(timezone.utc)
    start_utc = now_utc - timedelta(hours=HOURS_LOOKBACK)
    url = f"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime={start_utc.strftime('%Y-%m-%dT%H:%M:%S')}&endtime={now_utc.strftime('%Y-%m-%dT%H:%M:%S')}&minmagnitude={MIN_MAGNITUDE}"
    if USE_PANAMA_BOUNDS:
        url += PANAMA_BOUNDS
        
    print(f"🌐 Consultando USGS (Últimas {HOURS_LOOKBACK}h, Mag >={MIN_MAGNITUDE})...")
    resp = requests.get(url, timeout=15)
    if resp.status_code == 200:
        return resp.json().get("features", [])
    print(f"❌ Error al consultar USGS: Status {resp.status_code}")
    return []

def create_card_image(mag, place, event_time_str, depth, lat, lon):
    width, height = 1080, 1080
    img = Image.new("RGB", (width, height), color=(18, 18, 18))
    draw = ImageDraw.Draw(img)
    
    try:
        font_large = ImageFont.truetype("/system/fonts/Roboto-Bold.ttf", 110)
        font_title = ImageFont.truetype("/system/fonts/Roboto-Bold.ttf", 50)
        font_sub = ImageFont.truetype("/system/fonts/Roboto-Regular.ttf", 36)
        font_footer = ImageFont.truetype("/system/fonts/Roboto-Regular.ttf", 30)
        font_coord = ImageFont.truetype("/system/fonts/Roboto-Regular.ttf", 26)
    except Exception:
        font_large = font_title = font_sub = font_footer = font_coord = ImageFont.load_default()

    mag_color = (239, 68, 68) if mag >= 6.0 else (245, 158, 11) if mag >= 4.5 else (74, 222, 128) if mag >= 2.5 else (234, 179, 8)

    draw.text((80, 100), "SADM41 / TSEC - ALERTA SÍSMICA (ESTELA)", fill=(156, 163, 175), font=font_sub)
    draw.line([(80, 160), (1000, 160)], fill=(55, 65, 81), width=3)
    draw.ellipse([(390, 250), (690, 550)], outline=mag_color, width=12)
    draw.text((540, 370), f"M{mag:.1f}", fill=mag_color, font=font_large, anchor="mm")
    
    draw.text((540, 610), "UBICACIÓN", fill=(156, 163, 175), font=font_footer, anchor="mm")
    draw.text((540, 680), place.replace("Panama", "Panamá"), fill=(255, 255, 255), font=font_title, anchor="mm")
    draw.text((540, 750), f"Coordenadas: {lat:.4f}, {lon:.4f}", fill=(56, 189, 248), font=font_coord, anchor="mm")
    draw.text((540, 810), f"Fecha/Hora: {event_time_str}", fill=(209, 213, 219), font=font_sub, anchor="mm")
    draw.text((540, 870), f"Profundidad: {depth} km", fill=(156, 163, 175), font=font_sub, anchor="mm")
    
    draw.line([(80, 960), (1000, 960)], fill=(55, 65, 81), width=2)
    draw.text((540, 1010), "SADV41 🗿 • Fuente: USGS • Mapeo Integrado", fill=(107, 114, 128), font=font_footer, anchor="mm")

    img.save(TEMP_IMAGE, "JPEG", quality=95)
    return TEMP_IMAGE

def login_instagram():
    cl = Client()
    if os.path.exists(SESSION_FILE):
        print("🔑 Cargando sesión existente desde ig_session.json...")
        try:
            cl.load_settings(SESSION_FILE)
            cl.get_timeline_feed()
            print("✅ Sesión validada correctamente.")
            return cl
        except Exception as e:
            print(f"⚠️ Sesión guardada no válida o expirada: {e}")

    print("\n🔐 Inicio de sesión requerido en Instagram:")
    username = input("👤 Usuario / Email: ").strip()
    password = getpass.getpass("🔑 Contraseña: ")

    try:
        print("🚀 Autenticando en Instagram...")
        cl.login(username, password)
        cl.dump_settings(SESSION_FILE)
        print("✅ Sesión iniciada y guardada en ig_session.json")
        return cl
    except Exception as e:
        print(f"❌ Error al iniciar sesión: {e}")
        sys.exit(1)

def main():
    posted_ids = load_posted_events()
    features = fetch_usgs_events()
    if not features:
        print(f"✅ No se encontraron eventos M>={MIN_MAGNITUDE} en las últimas 72 horas.")
        return

    pending_events = [f for f in features if f["id"] not in posted_ids]
    pending_events.sort(key=lambda x: x["properties"]["time"])

    if not pending_events:
        print(f"👍 Todos los sismos de las últimas 72h (M>={MIN_MAGNITUDE}) ya están publicados.")
        return

    cl = login_instagram()
    for idx, event in enumerate(pending_events, start=1):
        event_id = event["id"]
        props = event["properties"]
        geom = event["geometry"]

        mag = props.get("mag", 0.0)
        place = props.get("place", "Ubicación desconocida")
        lon = geom["coordinates"][0]
        lat = geom["coordinates"][1]
        depth = geom["coordinates"][2] if len(geom["coordinates"]) > 2 else 0

        dt_utc = datetime.fromtimestamp(props.get("time") / 1000.0, tz=timezone.utc)
        time_formatted = (dt_utc - timedelta(hours=5)).strftime("%d/%m/%Y %I:%M %p (hora Panamá)")

        print(f"\n[Post {idx}/{len(pending_events)}] Procesando {event_id}: M{mag} - {place}")
        img_path = create_card_image(mag, place, time_formatted, depth, lat, lon)

        gmaps_url = f"https://maps.google.com/?q={lat},{lon}&ll={lat},{lon}&z=9"

        caption = (
            f"⚠️ SISMO REGISTRADO (ESTELA) | M{mag:.1f}\n\n"
            f"📍 Ubicación: {place}\n"
            f"📅 Fecha/Hora: {time_formatted}\n"
            f"📏 Profundidad: {depth} km\n"
            f"🗺️ Mapeo Exacto: {gmaps_url}\n\n"
            f"🗿 Monitoreo automático SADV41 / TSEC - Estela de Placas\n"
            f"#sismo #terremoto #panama #usgs #sadv41 #alerta #geologia #mapas"
        )

        try:
            print("🚀 Subiendo post a Instagram...")
            cl.photo_upload(img_path, caption=caption)
            save_posted_event(event_id)
            print(f"✅ ¡Publicado exitosamente! ({event_id})")
        except Exception as e:
            print(f"❌ Error al subir {event_id}: {e}")
            break

        if idx < len(pending_events):
            time.sleep(40)

    if os.path.exists(TEMP_IMAGE):
        os.remove(TEMP_IMAGE)

if __name__ == "__main__":
    main()
