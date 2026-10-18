#!/usr/bin/env python3
"""SADV41 Sismos: detecta sismos de Panamá (USGS) y publica en Instagram."""
import argparse, hashlib, json, os, sys, time, math, re, io
from datetime import datetime, timedelta, timezone
import requests
from PIL import Image, ImageDraw, ImageFont

USGS = "https://earthquake.usgs.gov/fdsnws/event/1/query"
STATE = "last_event.json"
IMG = "latest.jpg"
PAGES_IMG = os.getenv("IMAGE_PUBLIC_URL", "https://thesteef21.github.io/SADV41/latest.jpg")
GRAPH = "https://graph.facebook.com/v21.0"
PTY = timezone(timedelta(hours=-5))

def traducir_lugar(place_en):
    p = place_en
    p = p.replace(" of ", " de ")
    p = re.sub(r'\bNE\b', 'NE', p)
    p = re.sub(r'\bNW\b', 'NO', p)
    p = re.sub(r'\bSE\b', 'SE', p)
    p = re.sub(r'\bSW\b', 'SO', p)
    p = p.replace("Panama", "Panamá")
    p = p.replace("Costa Rica", "Costa Rica")
    return p

def fetch_latest(min_mag):
    start = (datetime.now(timezone.utc) - timedelta(hours=6)).isoformat()
    r = requests.get(USGS, params={
        "format": "geojson", "orderby": "time", "limit": 1,
        "minmagnitude": min_mag, "starttime": start,
        "minlatitude": 5.5, "maxlatitude": 10.0,
        "minlongitude": -84.0, "maxlongitude": -77.0,
    }, timeout=30)
    r.raise_for_status()
    feats = r.json().get("features", [])
    return feats[0] if feats else None

def make_image(ev, path):
    p = ev["properties"]
    lon, lat, depth = ev["geometry"]["coordinates"]
    mag = p["mag"]
    lugar_es = traducir_lugar(p["place"])

    # 1. Calcular tiles del mapa
    zoom = 9
    lat_rad = math.radians(lat)
    n = 2.0 ** zoom
    xtile = (lon + 180.0) / 360.0 * n
    ytile = (1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n
    cx, cy = int(xtile), int(ytile)

    pixel_x = int((xtile - cx) * 256)
    pixel_y = int((ytile - cy) * 256)

    # 2. Descargar cuadrícula de CARTO Dark Matter
    map_img = Image.new("RGBA", (5 * 256, 5 * 256), "#0a0f14")
    headers = {"User-Agent": "SADV41-SismosWatch/1.0"}

    for i in range(-2, 3):
        for j in range(-2, 3):
            url = f"https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            try:
                r = requests.get(url, headers=headers, timeout=5)
                if r.status_code == 200:
                    tile = Image.open(io.BytesIO(r.content)).convert("RGBA")
                    map_img.paste(tile, ((i + 2) * 256, (j + 2) * 256))
            except:
                pass # Fondo oscuro de respaldo si falla un tile

    # 3. Recortar 1080x1080 centrado en el sismo
    center_px = (2 * 256) + pixel_x
    center_py = (2 * 256) + pixel_y

    final_img = Image.new("RGBA", (1080, 1080), "#0a0f14")
    crop = map_img.crop((center_px - 540, center_py - 540, center_px + 540, center_py + 540))
    final_img.paste(crop, (0, 0))

    d = ImageDraw.Draw(final_img)

    # 4. Impacto gráfico
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
    d.text((40, 1010), "SADV41 // Fuente: USGS", font=font(32), fill="#5aa9ff")

    final_img.convert("RGB").save(path, "JPEG", quality=95)

def caption(ev):
    p = ev["properties"]
    when = datetime.fromtimestamp(p["time"] / 1000, PTY).strftime("%d/%m/%Y %I:%M %p")
    lugar_es = traducir_lugar(p["place"])
    return (f"⚠️ Sismo M{p['mag']:.1f} - {lugar_es}\n{when} (hora Panamá)\n"
            f"Profundidad: {ev['geometry']['coordinates'][2]:.0f} km\n\n"
            f"Fuente: USGS (datos preliminares)\n#Panama #Sismo #SADV41")

def check(min_mag, no_image):
    ev = fetch_latest(min_mag)
    if not ev:
        print("Sin sismos recientes sobre el mínimo.")
        return 2
    last = json.load(open(STATE)).get("id") if os.path.exists(STATE) else None
    if ev["id"] == last:
        print("Sin sismo nuevo (ya procesado:", last, ")")
        return 2
    if not no_image:
        make_image(ev, IMG)
    json.dump({"id": ev["id"], "mag": ev["properties"]["mag"],
               "place": ev["properties"]["place"], "caption": caption(ev)},
              open(STATE, "w"), ensure_ascii=False, indent=2)
    print("Sismo nuevo:", ev["id"], "M", ev["properties"]["mag"], ev["properties"]["place"])
    return 0

def publish():
    uid, tok = os.getenv("IG_USER_ID"), (os.getenv("ACCESS_TOKEN") or os.getenv("IG_ACCESS_TOKEN"))
    if not uid or not tok:
        print("Faltan IG_USER_ID / IG_ACCESS_TOKEN: se omite la publicación.")
        return 0
    cap = json.load(open(STATE))["caption"]
    want = hashlib.sha256(open(IMG, "rb").read()).hexdigest()
    url = f"{PAGES_IMG}?v={int(time.time())}"
    for _ in range(16):
        try:
            r = requests.get(url, timeout=20)
            if r.ok and hashlib.sha256(r.content).hexdigest() == want:
                break
        except requests.RequestException:
            pass
        time.sleep(15)
    else:
        print("Pages no sirvió la imagen a tiempo.")
        return 1
    c = requests.post(f"{GRAPH}/{uid}/media", data={
        "image_url": url, "caption": cap, "access_token": tok}, timeout=60)
    print("media:", c.status_code, c.text)
    if not c.ok:
        return 1
    p = requests.post(f"{GRAPH}/{uid}/media_publish", data={
        "creation_id": c.json()["id"], "access_token": tok}, timeout=60)
    print("publish:", p.status_code, p.text)
    return 0 if p.ok else 1

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--check-panama", action="store_true")
    ap.add_argument("--min-mag", type=float, default=4.5)
    ap.add_argument("--no-image", action="store_true")
    ap.add_argument("--publish", action="store_true")
    a = ap.parse_args()
    if a.publish:
        sys.exit(publish())
    if a.check_panama:
        sys.exit(check(a.min_mag, a.no_image))
    ap.print_help()
