#!/usr/bin/env python3
"""SADV41 Sismos: detecta sismos de Panamá (USGS) y genera alertas visuales M>=2.5"""
import argparse, json, math, os, re, sys, io
from datetime import datetime, timedelta, timezone
import requests
from PIL import Image, ImageDraw, ImageFont

USGS = "https://earthquake.usgs.gov/fdsnws/event/1/query"
STATE = "last_event.json"
IMG = "latest.jpg"
PTY = timezone(timedelta(hours=-5))

def traducir_lugar(place_en):
    p = place_en or ""
    p = p.replace(" of ", " de ").replace("Panama","Panamá")
    p = re.sub(r'\bNE\b','NE',p); p = re.sub(r'\bNW\b','NO',p)
    p = re.sub(r'\bSE\b','SE',p); p = re.sub(r'\bSW\b','SO',p)
    return p

def fetch_latest(min_mag):
    start = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
    r = requests.get(USGS, params={
        "format":"geojson","orderby":"time","limit":50,
        "minmagnitude":min_mag,"starttime":start,
        "minlatitude":7,"maxlatitude":10.5,
        "minlongitude":-83.5,"maxlongitude":-77,
    }, timeout=30)
    r.raise_for_status()
    feats = r.json().get("features", [])
    return feats[0] if feats else None

def font(size):
    for f in ("/system/fonts/Roboto-Bold.ttf","/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"):
        try: return ImageFont.truetype(f,size)
        except: pass
    return ImageFont.load_default()

def make_image(ev,path):
    p=ev["properties"]; lon,lat,depth=ev["geometry"]["coordinates"]; mag=p["mag"]
    lugar_es=traducir_lugar(p["place"])
    zoom=9; lat_rad=math.radians(lat); n=2.0**zoom
    xtile=(lon+180.0)/360.0*n; ytile=(1.0-math.asinh(math.tan(lat_rad))/math.pi)/2.0*n
    cx,cy=int(xtile),int(ytile); px=int((xtile-cx)*256); py=int((ytile-cy)*256)
    map_img=Image.new("RGBA",(5*256,5*256),"#0a0f14")
    for i in range(-2,3):
        for j in range(-2,3):
            url=f"https://a.basemaps.cartocdn.com/dark_all/{zoom}/{cx+i}/{cy+j}.png"
            # Fallback OSM si CARTO falla
            try:
                r=requests.get(url,timeout=5,headers={"User-Agent":"SADV41"})
                if r.status_code==200:
                    tile=Image.open(io.BytesIO(r.content)).convert("RGBA")
                    map_img.paste(tile,((i+2)*256,(j+2)*256))
            except: pass
    center_px=2*256+px; center_py=2*256+py
    final_img=Image.new("RGBA",(1080,1080),"#0a0f14")
    crop=map_img.crop((center_px-540,center_py-540,center_px+540,center_py+540))
    final_img.paste(crop,(0,0))
    d=ImageDraw.Draw(final_img)
    col="#ff3b30" if mag>=6 else "#ff9500" if mag>=5 else "#ffd60a"
    radio=int(30+(mag*12))
    d.ellipse([540-radio,540-radio,540+radio,540+radio],fill=col+"60",outline=col,width=3)
    d.ellipse([534,534,546,546],fill="#ffffff")
    d.text((540+radio+25,540-45),f"M {mag:.1f}",fill="#ffffff",font=font(65))
    d.text((540+radio+25,540+25),lugar_es,fill="#e8eef5",font=font(35))
    d.text((40,1010),"SADV41 // Fuente: USGS // M>=2.5",fill="#5aa9ff",font=font(28))
    final_img.convert("RGB").save(path,"JPEG",quality=95)

def caption(ev):
    p=ev["properties"]
    when=datetime.fromtimestamp(p["time"]/1000,PTY).strftime("%d/%m/%Y %I:%M %p")
    lugar_es=traducir_lugar(p["place"])
    return f"⚠️ Sismo M{p['mag']:.1f} - {lugar_es}\n{when} (hora Panamá)\nProf: {ev['geometry']['coordinates'][2]:.0f} km\n\nFuente: USGS #Panama #Sismo #SADV41 #TSEC"

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--check-panama",action="store_true")
    parser.add_argument("--min-mag",type=float,default=2.5)
    parser.add_argument("--force",action="store_true")
    args=parser.parse_args()
    if args.check_panama:
        print(f"🔍 USGS M>={args.min_mag} Panamá...")
        ev=fetch_latest(args.min_mag)
        if not ev: print("ℹ️ No sismos"); sys.exit(2)
        ev_id=ev["id"]
        last_id=None
        if os.path.exists(STATE) and not args.force:
            try:
                with open(STATE) as f: last_id=json.load(f).get("id")
            except: pass
        if ev_id==last_id and not args.force: print(f"ℹ️ Ya procesado {ev_id}"); sys.exit(2)
        print(f"⚡ Nuevo: {ev['properties']['title']}")
        make_image(ev,IMG)
        print(f"✅ {IMG}\n{caption(ev)}")
        with open(STATE,"w") as f: json.dump({"id":ev_id,"time":ev["properties"]["time"]},f)

if __name__=="__main__": main()
