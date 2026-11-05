#!/usr/bin/env python3
"""SADV41 Sismos: detecta sismos de Panamá (USGS) y publica en Instagram."""
import argparse
import io
import json
import math
import os
import re
import sys
from datetime import datetime, timedelta, timezone
import requests
from PIL import Image, ImageDraw, ImageFont

USGS = "https://earthquake.usgs.gov/fdsnws/event/1/query"
STATE = "last_event.json"
IMG = "latest.jpg"
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

def fetch_latest(min_mag):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*"
    }
    
    # 1. Feed GeoJSON estático (Servido vía CDN, 100% inmune al bloqueo 403)
    for feed_name in ["2.5_day.geojson", "all_day.geojson"]:
        try:
            feed_url = f"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/{feed_name}"
            r = requests.get(feed_url, headers=headers, timeout=15)
            if r.status_code == 200:
                feats = r.json().get("features", [])
                panama_feats = []
                for f in feats:
                    coords = f["geometry"]["coordinates"]
                    lon, lat = coords[0], coords[1]
                    mag = f["properties"]["mag"] or 0
                    if 5.5 <= lat <= 10.5 and -84.0 <= lon <= -77.0 and mag >= min_mag:
                        panama_feats.append(f)
                if panama_feats:
                    return panama_feats[0]
        except Exception:
            pass

    # 2. Fallback a la API FDSNWS con cabeceras de navegador
    start = (datetime.now(timezone.utc) - timedelta(hours=24)).strftime("%Y-%m-%dT%H:%M:%S")
    r = requests.get(USGS, params={
        "format": "geojson",
        "orderby": "time",
        "limit": 10,
        "minmagnitude": min_mag,
        "starttime": start,
        "minlatitude": 5.5,
        "maxlatitude": 10.5,
        "minlongitude": -84.0,
        "maxlongitude": -77.0,
    }, headers=headers, timeout=30)
    r.raise_for_status()
    feats = r.json().get("features", [])
    return feats[0] if feats else None

def make_image(ev, path):
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
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }

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

    col = "#ff3b30" if mag >= 6 else "#ff9500" if mag >= 5 else "#ffd60a"
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

    d.text((540 + radio + 25, 540 - 45), f"M {mag:.1f}", fill="#ffffff", font=font(65))
    d.text((540 + radio + 25, 540 + 25), lugar_es, fill="#e8eef5", font=font(35))
    d.text((40, 1010), "SADV41 // Fuente: USGS", fill="#5aa9ff", font=font(32))

    final_img.convert("RGB").save(path, "JPEG", quality=95)

def caption(ev):
    p = ev["properties"]
    when = datetime.fromtimestamp(p["time"] / 1000, PTY).strftime("%d/%m/%Y %I:%M %p")
    lugar_es = traducir_lugar(p["place"])
    return (f"⚠️ Sismo M{p['mag']:.1f} - {lugar_es}\n{when} (hora Panamá)\n"
            f"Profundidad: {ev['geometry']['coordinates'][2]:.0f} km\n\n"
            f"Fuente: USGS (datos preliminares)\n#Panama #Sismo #SADV41")

def main():
    parser = argparse.ArgumentParser(description="SADV41 Sismos Bot")
    parser.add_argument("--check-panama", action="store_true", help="Consultar sismos en Panamá")
    parser.add_argument("--min-mag", type=float, default=2.5, help="Magnitud mínima")
    parser.add_argument("--force", action="store_true", help="Forzar generación")
    parser.add_argument("--no-image", action="store_true", help="No generar imagen")
    args = parser.parse_args()

    ev = fetch_latest(args.min_mag)
    if not ev:
        print("ℹ️ No hay sismos recientes que cumplan los criterios.")
        sys.exit(2)

    ev_id = ev["id"]
    last_id = None
    if os.path.exists(STATE) and not args.force:
        try:
            with open(STATE, "r") as f:
                last_id = json.load(f).get("id")
        except Exception:
            pass

    if ev_id == last_id and not args.force:
        print(f"ℹ️ El sismo {ev_id} ya fue procesado anteriormente.")
        sys.exit(2)

    print(f"🚨 Sismo detectado: M{ev['properties']['mag']} - {ev['properties']['place']}")
    cap_text = caption(ev)

    if not args.no_image:
        make_image(ev, IMG)
        print(f"✅ Imagen generada en {IMG}")

    with open(STATE, "w") as f:
        json.dump({"id": ev_id, "caption": cap_text, "time": ev["properties"]["time"]}, f, indent=2)

if __name__ == "__main__":
    main()
