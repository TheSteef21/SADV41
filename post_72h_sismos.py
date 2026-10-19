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

# --- CONFIGURACIÓN ---
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
    
    start_str = start_utc.strftime('%Y-%m-%dT%H:%M:%S')
    end_str = now_utc.strftime('%Y-%m-%dT%H:%M:%S')
    
    url = f"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime={start_str}&endtime={end_str}&minmagnitude={MIN_MAGNITUDE}"
    if USE_PANAMA_BOUNDS:
        url += PANAMA_BOUNDS
        
    print(f"🌐 Consultando USGS (Últimas {HOURS_LOOKBACK}h, Mag >={MIN_MAGNITUDE})...")
    resp = requests.get(url, timeout=15)
    if resp.status_code == 200:
        data = resp.json()
        return data.get("features", [])
    else:
        print(f"❌ Error al consultar USGS: Status {resp.status_code}")
        return []

def create_card_image(mag, place, event_time_str, depth):
    width, height = 1080, 1080
    bg_color = (18, 18, 18)
    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    try:
        font_large = ImageFont.truetype("/system/fonts/Roboto-Bold.ttf", 110)
        font_title = ImageFont.truetype("/system/fonts/Roboto-Bold.ttf", 50)
        font_sub = ImageFont.truetype("/system/fonts/Roboto-Regular.ttf", 36)
        font_footer = ImageFont.truetype("/system/fonts/Roboto-Regular.ttf", 30)
    except Exception:
        font_large = font_title = font_sub = font_footer = ImageFont.load_default()

    if mag >= 6.0:
        mag_color = (239, 68, 68)
    elif mag >= 4.5:
        mag_color = (245, 158, 11)
    else:
        mag_color = (234, 179, 8)

    draw.text((80, 100), "SADM41 / TSEC - ALERTA SÍSMICA", fill=(156, 163, 175), font=font_sub)
    draw.line([(80, 160), (1000, 160)], fill=(55, 65, 81), width=3)

    draw.ellipse([(390, 250), (690, 550)], outline=mag_color, width=12)
    draw.text((540, 370), f"M{mag:.1f}", fill=mag_color, font=font_large, anchor="mm")

    draw.text((540, 640), "UBICACIÓN", fill=(156, 163, 175), font=font_footer, anchor="mm")
    
    place_clean = place.replace("Panama", "Panamá")
    draw.text((540, 710), place_clean, fill=(255, 255, 255), font=font_title, anchor="mm")

    draw.text((540, 810), f"Fecha/Hora: {event_time_str}", fill=(209, 213, 219), font=font_sub, anchor="mm")
    draw.text((540, 870), f"Profundidad: {depth} km", fill=(156, 163, 175), font=font_sub, anchor="mm")

    draw.line([(80, 960), (1000, 960)], fill=(55, 65, 81), width=2)
    draw.text((540, 1010), "SADV41 🗿 • Fuente: USGS", fill=(107, 114, 128), font=font_footer, anchor="mm")

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
        print("✅ No se encontraron eventos en las últimas 72 horas.")
        return

    pending_events = [f for f in features if f["id"] not in posted_ids]
    pending_events.sort(key=lambda x: x["properties"]["time"])

    print(f"📌 Total de sismos encontrados: {len(features)}")
    print(f"🆕 Sismos pendientes por publicar: {len(pending_events)}")

    if not pending_events:
        print("👍 Todos los sismos de las últimas 72h ya están publicados.")
        return

    cl = login_instagram()

    for idx, event in enumerate(pending_events, start=1):
        event_id = event["id"]
        props = event["properties"]
        geom = event["geometry"]

        mag = props.get("mag", 0.0)
        place = props.get("place", "Ubicación desconocida")
        time_ms = props.get("time")
        depth = geom["coordinates"][2] if len(geom["coordinates"]) > 2 else 0

        dt_utc = datetime.fromtimestamp(time_ms / 1000.0, tz=timezone.utc)
        dt_panama = dt_utc - timedelta(hours=5)
        time_formatted = dt_panama.strftime("%d/%m/%Y %I:%M %p (hora Panamá)")

        print(f"\n[Post {idx}/{len(pending_events)}] Procesando {event_id}: M{mag} - {place}")

        img_path = create_card_image(mag, place, time_formatted, depth)

        caption = (
            f"⚠️ SISMO REGISTRADO | M{mag:.1f}\n\n"
            f"📍 Ubicación: {place}\n"
            f"📅 Fecha/Hora: {time_formatted}\n"
            f"📏 Profundidad: {depth} km\n\n"
            f"🗿 Monitoreo automático SADV41 / TSEC\n"
            f"#sismo #terremoto #panama #usgs #sadv41 #alerta"
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
            wait_time = 40
            print(f"⏳ Esperando {wait_time}s antes de la siguiente publicación...")
            time.sleep(wait_time)

    if os.path.exists(TEMP_IMAGE):
        os.remove(TEMP_IMAGE)

if __name__ == "__main__":
    main()
