#!/usr/bin/env python3
# ==============================================================================
# SADV41 // INSTAGRAM AUTHENTICATOR - ig_login.py
# ==============================================================================

import os
import json
from instagrapi import Client

SESSION_FILE = os.path.expanduser("~/sadv41/ig_session.json")

def login():
    cl = Client()
    
    # Si existe una sesión previa, intenta reutilizarla
    if os.path.exists(SESSION_FILE):
        print("[IG] Cargando sesión existente desde ig_session.json...")
        cl.load_settings(SESSION_FILE)
        try:
            cl.get_timeline_feed()
            print("✓ Sesión válida y lista para operar.")
            return cl
        except Exception:
            print("⚠️ Sesión expirada. Se requiere inicio de sesión fresco.")

    print("=== AUTENTICACIÓN INSTAGRAM SADV41 ===")
    username = input("Usuario de Instagram: ").strip()
    password = input("Contraseña de Instagram: ").strip()

    try:
        print("[IG] Conectando con servidores de Instagram...")
        cl.login(username, password)
        cl.dump_settings(SESSION_FILE)
        print(f"✓ Inicio de sesión exitoso. Sesión guardada en {SESSION_FILE}")
        return cl
    except Exception as e:
        print(f"❌ Error al iniciar sesión: {e}")
        return None

if __name__ == "__main__":
    login()
