#!/usr/bin/env python3
import os
import sys
import getpass

try:
    from instagrapi import Client
except ImportError:
    print("❌ [ERROR] La librería 'instagrapi' no está instalada. Ejecuta: pip install instagrapi")
    sys.exit(1)

def main():
    print("🔐 [ACCESO SEGURO A INSTAGRAM]")
    print("--------------------------------------------------")
    
    default_user = "sismosyterremotos"
    user_input = input(f"👤 Introduce tu usuario de Instagram [{default_user}]: ").strip()
    username = user_input if user_input else default_user

    password = getpass.getpass(f"🔑 Introduce la contraseña para @{username} (no se verá al escribir): ").strip()
    if not password:
        print("❌ La contraseña no puede estar vacía.")
        sys.exit(1)

    cl = Client()
    cl.set_user_agent("Instagram 315.0.0.35.109 Android (31/12; 480dpi; 1080x2400; Xiaomi; M2101K6G; sweet; qcom; es_US; 354665256)")

    print(f"\n🔄 Conectando con Instagram para @{username}...")

    try:
        cl.login(username, password)
        print("✅ Autenticación exitosa.")

        session_1 = "sismosyterremotos_session.json"
        session_2 = "ig_session.json"

        cl.dump_settings(session_1)
        cl.dump_settings(session_2)

        print(f"💾 Sesión guardada de forma segura en:\n   • {session_1}\n   • {session_2}")
        print("\n🚀 ¡Listo para operar sin volver a pedir credenciales!")

    except Exception as e:
        print(f"\n❌ Error durante el inicio de sesión: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
