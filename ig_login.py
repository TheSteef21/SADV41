import os, getpass
from instagrapi import Client
from instagrapi.exceptions import TwoFactorRequired

u = os.getenv("IG_USERNAME") or input("Usuario: ").strip()
p = os.getenv("IG_PASSWORD") or getpass.getpass("Contraseña: ")
cl = Client()
cl.delay_range = [2, 6]
try:
    cl.login(u, p)
except TwoFactorRequired:
    cl.login(u, p, verification_code=input("Código 2FA: ").strip())
cl.dump_settings("ig_session.json")
print("Sesión guardada para:", u)
