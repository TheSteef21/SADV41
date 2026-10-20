#!/usr/bin/env python3
import os
import sys
import json
import time
import argparse
import hashlib
import getpass
import requests
from datetime import datetime, timezone
from PIL import Image, ImageDraw, ImageFont

try:
    from instagrapi import Client
except ImportError:
    print("❌ 'instagrapi' no está instalado. Ejecuta: pip install instagrapi pillow requests")
    sys.exit(1)

# --- CONFIGURACIÓN ---
STATE = "posted_events.json"
IMG = "latest.jpg"

# REGLA ESTRICTA: Desde el 9 de octubre de 2026 a las 12:55 PM (UTC-5 / Panamá) -> 17:55:00 UTC
START_TIMESTAMP_MS = int(datetime(2026, 10, 9, 17, 55, 0, tzinfo=timezone.utc).timestamp() * 1000)

def load_posted():
    if os.path.exists(STATE):
        try:
            return json.load(open(STATE, "r"))
        except:
            return []
    return []

def save_posted(ev_id):
    posted = load_posted()
    if ev_id not in posted:
        posted.append(ev_id)
        json.dump(posted, open(STATE, "w"), indent=2)

def fetch_events(min_mag):
    # Consultar sismos desde el inicio definido hasta ahora en la región de Panamá / Centroamérica
    url = f"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2026-10-09T17:55:00&minmagnitude={min_mag}&minlatitude=6.5&maxlatitude=10.5&minlongitude=-83.5&maxlongitude=-77.0"
    print(f"🌐 Consultando USGS con filtro estricto (Mag >={min_mag}, desde 09/Oct 12:55 PM)...")
    try:
        r = requests.get(url, timeout=30)
        if r.ok:
            return r.json().get("features", [])
    except Exception as e:
        print(f"⚠️ Error al conectar con USGS: {e}")
    return []

def make_image(ev, filename):
    props = ev["properties"]
    geom = ev["geometry"]
    mag = props.get("mag", 0.0)
    place = props.get("place", "Ubicación desconocida")
    
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

    mag_color = (239, 68, 68) if mag >= 6.0 else ((245, 158, 11) if mag >= 4.5 else (234, 179, 8))

    draw.text((80, 100), "SADV41 / TSEC - ALERTA SÍSMICA", fill=(156, 163, 175), font=font_sub)
    draw.line([(80, 160), (1000, 160)], fill=(55, 65, 81), width=3)

    draw.ellipse([(390, 250), (690, 550)], outline=mag_color, width=12)
    draw.text((540, 370), f"M{mag:.1f}", fill=mag_color, font=font_large, anchor="mm")

    draw.text((540, 640), "UBICACIÓN", fill=(156, 163, 175), font=font_footer, anchor="mm")
    place_clean = place.replace("Panama", "Panamá")
    draw.text((540, 710), place_clean, fill=(255, 255, 255), font=font_title, anchor="mm")

    time_ms = props.get("time")
    dt_utc = datetime.fromtimestamp(time_ms / 1000.0, tz=timezone.utc)
    dt_panama = dt_utc - timedelta(hours=5) if 'timedelta' in globals() else dt_utc
    from datetime import timedelta
    dt_panama = dt_utc - timedelta(hours=5)
    time_formatted = dt_panama.strftime("%d/%m/%Y %I:%M %p (hora Panamá)")

    draw.text((540, 810), f"Fecha/Hora: {time_formatted}", fill=(209, 213, 219), font=font_sub, anchor="mm")
    depth = geom["coordinates"][2] if len(geom["coordinates"]) > 2 else 0
    draw.text((540, 870), f"Profundidad: {depth} km", fill=(156, 163, 175), font=font_sub, anchor="mm")

    draw.line([(80, 960), (1000, 960)], fill=(55, 65, 81), width=2)
    draw.text((540, 1010), "SADV41 🗿 • Fuente: USGS", fill=(107, 114, 128), font=font_footer, anchor="mm")

    img.save(filename, "JPEG", quality=95)
    return time_formatted, depth

def run_bot(min_mag):
    features = fetch_events(min_mag)
    if not features:
        print("✅ No hay sismos que cumplan con los filtros establecidos.")
        return

    posted = load_posted()
    # Filtrar estrictamente desde la fecha clave y magnitud >= 4.0
    pending = [f for f in features if f["id"] not in posted and f["properties"]["time"] >= START_TIMESTAMP_MS and f["properties"]["mag"] >= min_mag]
    pending.sort(key=lambda x: x["properties"]["time"])

    print(f"📌 Sismos totales en rango: {len(features)} | Pendientes por publicar: {len(pending)}")
    if not pending:
        print("👍 Todos los sismos históricos válidos ya están publicados.")
        return

    # Iniciar sesión en Instagram usando sesión persistente o credenciales
    cl = Client()
    session_file = "ig_session.json"
    if os.path.exists(session_file):
        try:
            cl.load_settings(session_file)
            cl.get_timeline_feed()
        except:
            pass
    
    if not cl.user_id:
        print("🔐 Se requiere autenticación de Instagram:")
        user = input("Usuario: ").strip()
        pwd = getpass.getpass("Contraseña: ")
        cl.login(user, pwd)
        cl.dump_settings(session_file)

    for ev in pending:
        ev_id = ev["id"]
        props = ev["properties"]
        mag = props.get("mag", 0.0)
        place = props.get("place", "Ubicación desconocida")
        
        print(f"\n🚀 Procesando sismo {ev_id} | M{mag} - {place}")
        time_formatted, depth = make_image(ev, IMG)
        
        caption = (
            f"⚠️ SISMO REGISTRADO | M{mag:.1f}\n\n"
            f"📍 Ubicación: {place}\n"
            f"📅 Fecha/Hora: {time_formatted}\n"
            f"📏 Profundidad: {depth} km\n\n"
            f"🗿 Monitoreo automático SADV41 / TSEC\n"
            f"#sismo #terremoto #panama #usgs #sadv41 #alerta"
        )
        
        try:
            media = cl.photo_upload(IMG, caption)
            save_posted(ev_id)
            print(f"✅ ¡Publicado exitosamente! Enlace: https://instagram.com/p/{media.code}/")
            time.sleep(35) # Pausa estratégica entre publicaciones
        except Exception as e:
            print(f"❌ Error al publicar en Instagram: {e}")
            break

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--min-mag", type=float, default=4.0)
    a = ap.parse_args()
    run_bot(a.min_mag)
