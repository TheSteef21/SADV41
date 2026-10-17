#!/usr/bin/env python3
"""SADV41 Sismos: detecta sismos de Panamá (USGS) y publica en Instagram."""
import argparse, hashlib, json, os, sys, time
from datetime import datetime, timedelta, timezone
import requests

USGS = "https://earthquake.usgs.gov/fdsnws/event/1/query"
STATE = "last_event.json"
IMG = "latest.jpg"
PAGES_IMG = "https://thesteef21.github.io/SADV41/latest.jpg"
GRAPH = "https://graph.facebook.com/v21.0"
PTY = timezone(timedelta(hours=-5))


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
    from PIL import Image, ImageDraw, ImageFont
    p = ev["properties"]
    depth = ev["geometry"]["coordinates"][2]
    when = datetime.fromtimestamp(p["time"] / 1000, PTY).strftime("%d/%m/%Y %I:%M %p")

    def font(size):
        for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",):
            try:
                return ImageFont.truetype(f, size)
            except OSError:
                pass
        return ImageFont.load_default(size)

    img = Image.new("RGB", (1080, 1080), "#0a0f14")
    d = ImageDraw.Draw(img)
    mag = p["mag"]
    col = "#ff3b30" if mag >= 6 else "#ff9500" if mag >= 5 else "#ffd60a"
    d.text((540, 150), "SISMO PANAMÁ", font=font(64), fill="#e8eef5", anchor="mm")
    d.text((540, 430), f"M{mag:.1f}", font=font(300), fill=col, anchor="mm")
    d.text((540, 680), p["place"], font=font(44), fill="#e8eef5", anchor="mm")
    d.text((540, 760), when + " (hora Panamá)", font=font(40), fill="#9fb0c3", anchor="mm")
    d.text((540, 820), f"Profundidad: {depth:.0f} km", font=font(40), fill="#9fb0c3", anchor="mm")
    d.text((540, 990), "SADV41 // Fuente: USGS", font=font(32), fill="#5aa9ff", anchor="mm")
    img.save(path, "JPEG", quality=92)


def caption(ev):
    p = ev["properties"]
    when = datetime.fromtimestamp(p["time"] / 1000, PTY).strftime("%d/%m/%Y %I:%M %p")
    return (f"Sismo M{p['mag']:.1f} - {p['place']}\n{when} (hora Panamá)\n"
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
    uid, tok = os.getenv("IG_USER_ID"), os.getenv("IG_ACCESS_TOKEN")
    if not uid or not tok:
        print("Faltan IG_USER_ID / IG_ACCESS_TOKEN: se omite la publicación.")
        return 0
    cap = json.load(open(STATE))["caption"]
    want = hashlib.sha256(open(IMG, "rb").read()).hexdigest()
    url = f"{PAGES_IMG}?v={int(time.time())}"
    for _ in range(16):  # espera a que GitHub Pages sirva la imagen nueva
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
