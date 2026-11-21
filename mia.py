#!/data/data/com.termux/files/usr/bin/python3
import os
GEMINI_KEY = os.environ.get("GEMINI_API_KEY","")
print("MIA · Mesa de Inteligencias Artificiales")
print("SADV41 · StevenDior · 21 Nov 2026")
print("Nodos: GOV·GAMING·GORRA·FORENSE·NEWS·MERCADOS")
print("       BIBLIA·SISMOS·FLOW·IRON RIDER·BINANCE")
print("Logistica: Heavy Cargo PTY · StevenDior Mundo")
print("Protocolo 131 · OMNI-GEM activo")
print("Escribe tu consulta (ctrl+c para salir):")
while True:
    q = input("Steven → ")
    if q.lower() in ("salir","exit"): break
    print(f"MIA procesando: {q}")
