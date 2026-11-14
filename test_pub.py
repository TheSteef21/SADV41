from instagrapi import Client
import os
import getpass

print("=== 🗿 PRUEBA DE PUBLICACIÓN DIRECTA INSTAGRAM ===")
usuario = input("👤 Ingresa tu usuario o correo de Instagram: ").strip()
password = getpass.getpass("🔑 Ingresa tu contraseña (no se verá al teclear): ").strip()
sesion = f"{usuario}_session.json"
imagen = "latest.jpg"

bot = Client()

print("\n🔄 Autenticando con Instagram...")
if os.path.exists(sesion):
    print("📂 Encontrada sesión guardada localmente...")
    bot.load_settings(sesion)
    
try:
    bot.login(usuario, password)
    bot.dump_settings(sesion)
    print("✅ Inicio de sesión exitoso y sesión guardada.")
except Exception as e:
    print(f"❌ Falló el inicio de sesión: {e}")
    exit(1)

print(f"\n📸 Subiendo afiche {imagen}...")
if os.path.exists(imagen):
    try:
        media = bot.photo_upload(
            imagen, 
            "⚠️ PRUEBA DE SISTEMA SADV41.\nProtocolos de enlace activos y monitor de zona en línea. #TSEC #Panama"
        )
        print(f"\n✅ ¡Publicación de prueba exitosa! \n🌐 Enlace: https://instagram.com/p/{media.code}/")
    except Exception as e:
         print(f"❌ Falló la subida de la foto: {e}")
else:
    print(f"❌ Error: No se encontró la imagen {imagen} en la carpeta actual.")
