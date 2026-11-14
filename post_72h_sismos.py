#!/usr/bin/env python3
"""
SADV41 - Post Masivo de Sismos 72 Horas (M>=3.5)
Consulta el USGS, genera afiches 1080x1080 y los publica en Instagram vía instagrapi.
"""
import os
import sys
import json
import time
import math
import io
import re
from datetime import datetime, timedelta, timezone

try:
    from instagrapi import Client
except ImportError:
    print("❌ 'instagrapi' no está instalado. Ejecuta: pip install instagrapi pillow requests")
    sys.exit(1)

import requests
from PIL import Image, ImageDraw, ImageFont

POSTED_FILE = "posted_events.json"
SESSION_FILE = "ig_session.json"
TEMP_IMAGE = "temp_sismo.jpg"

HOURS_LOOKBACK = 72
MIN_MAGNITUDE = 3.5
PTY = timezone(timedelta(hours=-5))

def traducir_lugar(place_en):
    p = place_en or ""
    p = p.replace(" of ", " de ")
    p = re.sub(r'\bNE\b', 'NE', p)
    p = re.sub(r'\bNW\b', 'NO', p)
    p = re.sub(r'\bSE\b', 'SE', p)
    p = re.sub(r'\bSW\b', 'SO', p)
    p = p.replace("Panama", "Panamá")
    p = p.replace("Costa Rica", "Costa Rica")
    return p

def fetch_sismos():
    start_time = (datetime.now(timezone.utc) - timedelta(hours=HOURS_LOOKBACK)).strftime("%Y-%m-%dT%H:%M:%S")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SADV41-SismosWatch/1.0",
        "Accept": "application/json"
    }
    
    url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
    params = {
        "format": "geojson",
        "orderby": "time-asc",
        "minmagnitude": MIN_MAGNITUDE,
        "starttime": start_time,
        "minlatitude": 6.5,
        "maxlatitude": 10.5,
        "minlongitude": -83.5,
        "maxlongitude": -77.0
    }
    
    try:
        r = requests.get(url, params=params, headers=headers, timeout=20)
        if r.status_code == 200:
            return r.json().get("features", [])
    except Exception as e:
        print(f"⚠️ Error consultando API directa USGS ({e}), intentando feed estático...")

    feed_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
    try:
        r = requests.get(feed_url, headers=headers, timeout=20)
        if r.status_code == 200:
            feats = r.json().get("features", [])
            filtrados = []
            now_ts = datetime.now(timezone.utc).timestamp() * 1000
            min_ts = now_ts - (HOURS_LOOKBACK * 3600 * 1000)
            for f in feats:
                coords = f["geometry"]["coordinates"]
                lon, lat = coords[0], coords[1]
                mag = f["properties"]["mag"] or 0
                evt_time = f["properties"]["time"]
                if (evt_time >= min_ts) and (6.5 <= lat <= 10.5) and (-83.5 <= lon <= -77.0) and (mag >= MIN_MAGNITUDE):
                    filtrados.append(f)
            filtrados.sort(key=lambda x: x["properties"]["time"])
            return filtrados
    except Exception as e:
        print(f"❌ Falló consulta a USGS: {e}")
    return []

def hacer_imagen(ev, path):
    p = ev["properties"]
    lon, lat, depth = ev["geometry"]["coordinates"]
    mag = p["mag"]
    lugar_es = traducir_lugar(p["place"])

    zoom = 9
    lat_rad = math.radians(lat)
    n = 2.0 ** zoom
    xtile = (lon + 180.0) / 360.0 * n
    ytile = (1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n
    cx, cy = int(xtile), int(ytile)

    pixel_x = int((xtile - cx) * 256)
    pixel_y = int((ytile - cy) * 256)

    map_img = Image.new("RGBA", (5 * 256, 5 * 256), "#0a0f14")
    headers = {"User-Agent": "Mozilla/5.0"}

    for i in range(-2, 3):
        for j in range(-2, 3):
            url = f"https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{zoom}/{cy+j}/{cx+i}"
            try:
                r = requests.get(url, headers=headers, timeout=5)
                if r.status_code == 200:
                    tile = Image.open(io.BytesIO(r.content)).convert("RGBA")
                    map_img.paste(tile, ((i + 2) * 256, (j + 2) * 256))
            except Exception:
                pass

    center_px = (2 * 256) + pixel_x
    center_py = (2 * 256) + pixel_y

    final_img = Image.new("RGBA", (1080, 1080), "#0a0f14")
    crop = map_img.crop((center_px - 540, center_py - 540, center_px + 540, center_py + 540))
    final_img.paste(crop, (0, 0))

    d = ImageDraw.Draw(final_img)
    col = "#ff3b30" if mag >= 6.0 else "#ff9500" if mag >= 5.0 else "#ffd60a"
    radio = int(30 + (mag * 12))

    d.ellipse([540 - radio, 540 - radio, 540 + radio, 540 + radio], fill=col + "60", outline=col, width=3)
    d.ellipse([540 - 6, 540 - 6, 540 + 6, 540 + 6], fill="#ffffff")

    def font(size):
        for f in ("/system/fonts/Roboto-Bold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"):
            try:
                return ImageFont.truetype(f, size)
            except OSError:
                pass
        return ImageFont.load_default()

    d.text((540 + radio + 20, 540 - 45), f"M {mag:.1f}", fill="#ffffff", font=font(65))
    d.text((540 + radio + 20, 540 + 25), lugar_es, fill="#e8eef5", font=font(35))
    d.text((40, 1010), "SADV41 // SismosWatch 72H", fill="#5aa9ff", font=font(32))

    final_img.convert("RGB").save(path, "JPEG", quality=95)

def generar_caption(ev):
    p = ev["properties"]
    fecha_pty = datetime.fromtimestamp(p["time"] / 1000, PTY).strftime("%d/%m/%Y %I:%M %p")
    lugar_es = traducir_lugar(p["place"])
    return (
        f"🚨 ALERTA SÍSMICA 72H | M{p['mag']:.1f}\n\n"
        f"📍 Ubicación: {lugar_es}\n"
        f"🕒 Fecha/Hora: {fecha_pty} (Hora Panamá)\n"
        f"📉 Profundidad: {ev['geometry']['coordinates'][2]:.1f} km\n\n"
        f"🌐 Las estelas hablan de lo que pasa. Siempre pendientes.\n"
        f"📡 Fuente: USGS / Protocolo SADV41\n"
        f"🔗 Registro completo: https://thesteef21.github.io/SADV41/SISMOS/SEC.html\n\n"
        f"#Panamá #Sismo #SADV41 #AlertaSísmica #TSEC #sismosyterremotos"
    )

def main():
    posted = set()
    if os.path.exists(POSTED_FILE):
        try:
            with open(POSTED_FILE, "r") as f:
                posted = set(json.load(f))
        except Exception:
            posted = set()

    print("🔍 Consultando sismos de las últimas 72 horas (M>=3.5)...")
    eventos = fetch_sismos()
    nuevos = [e for e in eventos if e["id"] not in posted]

    if not nuevos:
        print("ℹ️ No hay sismos nuevos de las últimas 72h por publicar.")
        sys.exit(0)

    print(f"📊 Se encontraron {len(nuevos)} sismo(s) nuevos por publicar.")

    user = os.getenv("IG_USERNAME")
    pwd = os.getenv("IG_PASSWORD")
    
    bot = Client()
    if os.path.exists(SESSION_FILE):
        try:
            bot.load_settings(SESSION_FILE)
            print("🔑 Sesión de Instagram cargada desde ig_session.json")
        except Exception as e:
            print(f"⚠️ No se pudo cargar sesión guardada: {e}")

    if user and pwd:
        try:
            bot.login(user, pwd)
            bot.dump_settings(SESSION_FILE)
            print("✅ Inicio de sesión exitoso en Instagram.")
        except Exception as e:
            print(f"❌ Error al iniciar sesión en Instagram: {e}")
            sys.exit(1)
    else:
        print("⚠️ IG_USERNAME y/o IG_PASSWORD no están exportados. Se procesarán y registrarán localmente.")

    for i, ev in enumerate(nuevos, start=1):
        p = ev["properties"]
        eid = ev["id"]
        print(f"\n[Post {i}/{len(nuevos)}] Procesando M{p['mag']} - {p['place']} ({eid})...")
        
        hacer_imagen(ev, TEMP_IMAGE)
        cap = generar_caption(ev)

        if user and pwd:
            try:
                media = bot.photo_upload(TEMP_IMAGE, cap)
                print(f"🚀 Publicado en Instagram: https://instagram.com/p/{media.code}/")
                posted.add(eid)
                with open(POSTED_FILE, "w") as f:
                    json.dump(list(posted), f, indent=2)
                time.sleep(20)
            except Exception as e:
                print(f"❌ Error publicando {eid}: {e}")
        else:
            posted.add(eid)
            with open(POSTED_FILE, "w") as f:
                json.dump(list(posted), f, indent=2)

    print("\n✅ Proceso completado exitosamente.")

if __name__ == "__main__":
    main()
