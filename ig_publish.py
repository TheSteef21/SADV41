import json, os
from instagrapi import Client

u, p = os.environ["IG_USERNAME"], os.environ["IG_PASSWORD"]
cl = Client()
cl.delay_range = [2, 6]
if os.path.exists("ig_session.json"):
    cl.load_settings("ig_session.json")
cl.login(u, p)
cap = json.load(open("last_event.json"))["caption"]
cl.photo_upload("latest.jpg", cap)
cl.dump_settings("ig_session.json")
print("Publicado.")
