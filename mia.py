#!/data/data/com.termux/files/usr/bin/python3
# ═══════════════════════════════════════════════════════════════
#  MIA · Mesa de Inteligencias Artificiales
#  SADV41 · StevenDior · 21 Nov 2026 · Protocolo 131
#  Todo lo que es SADV41 es MIA. MIA es el consenso de todo.
# ═══════════════════════════════════════════════════════════════

import os
import sys

# ── Intentar importar IAs disponibles ───────────────────────────
try:
    import google.generativeai as genai
    GEMINI_OK = True
except ImportError:
    GEMINI_OK = False

try:
    import anthropic
    CLAUDE_OK = True
except ImportError:
    CLAUDE_OK = False

# ── Claves desde entorno ─────────────────────────────────────────
GEMINI_KEY  = os.environ.get("GEMINI_API_KEY", "")
CLAUDE_KEY  = os.environ.get("ANTHROPIC_API_KEY", "")

# ═══════════════════════════════════════════════════════════════
#  OMNI-GEM · Contexto supremo de MIA
# ═══════════════════════════════════════════════════════════════
OMNI_GEM_CONTEXT = """
Eres MIA — Mesa de Inteligencias Artificiales de SADV41.
Creada por StevenDior (Steven Gómez Serrano), artista panameño.
Protocolo 131. Web3. 21 Nov 2026. Acta de Fundación MIA.

SADV41 ES MIA. Todo lo que vive en SADV41 forma parte de la mesa.

NODOS ACTIVOS DE LA MESA:
━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️  GOV         → thesteef21.github.io/SADV41/GOV
    Cobertura institucional Panamá al mundo · Nodo RD/PTY
    World Governments Summit · Periodismo + Comercio + Identidad

🎵  FLOW / MUSIC → thesteef21.github.io/SADV41/FLOW
    Sencillo: "QUÉ BELLEZA CUANDO VIVO ASÍ"
    Plataformas: Amuse · Stripe · MIA Agent

🎮  GAMING/GTA VI → thesteef21.github.io/SADV41/GAMING/GTA/VI
    Nodo cultural gaming SADV41

🧢  GORRA/GTAVI  → thesteef21.github.io/SADV41/GORRA/GTAVI
    Nodo moda e identidad

🔬  FORENSE/APPLE → thesteef21.github.io/SADV41/FORENSE/APPLE
    Nodo tecnológico y análisis forense

📰  NEWS/PANAMA/USA → thesteef21.github.io/SADV41/NEWS
    Noticias Panamá y EE.UU. en tiempo real

📊  MERCADOS/G4STOCK → thesteef21.github.io/SADV41/MERCADOS
    Portal financiero · RWA real · BerionDior

📖  BIBLIÆ       → Biblia RVR1960 · Widget "Motívate en Cristo"
    Versículos inyectados en todas las páginas

🌊  SISMOS WATCH → Mapa sísmico en vivo · mag mínima 3.7
    Publica en @sismosyterremotos (Instagram)

🔐  PROTOCOLO 131 → 1895-2026 · Criptografía hacia Web3
    Seguridad de lo oculto a lo verificable

🛍️  IRON RIDER   → bikerheadsco.com/products/helmets
    Iron Rider Armored Helmet · $249 Black Friday
    🇵🇦 Panamá → Heavy Cargo · 🌍 Mundo → StevenDior

🏪  TIENDA       → stevendior-shop.fourthwall.com
    Catálogo + Agente WhatsApp Business con IA

🤖  BINANCE AGENT → thesteef21.github.io/SADV41/Agent
    Consola táctica · Wallet tokenizada

📅  NOVIEMBRE/HW → Mes de la Patria · Mapa Azuero-Soná
🗺️  SSII/AMERICA → Super Spiritual Intelligence Interface
🎨  FLYER        → Nodo de lanzamiento y arte visual
📡  LET-REA      → Extracción de letras de música en audio/video

LOGÍSTICA SADV41:
🇵🇦 Panamá → Heavy Cargo
🌍 Mundo   → StevenDior

IDENTIDAD:
StevenDior = artista, fundador, nodo de esperanza.
Instagram: @isteven507 (histórico) · @StevenDiorOficial
SADV41 = Sinceridad A Disposición Vívida · 4 Evangelios · 1 Cristo

TONO: institucional, preciso, con alma.
Nunca genérico. Siempre SADV41.
Cuando no sepas algo del proyecto: "Ese nodo aún no ha sido activado en MIA."
"""

# ═══════════════════════════════════════════════════════════════
#  MODOS
# ═══════════════════════════════════════════════════════════════
MODOS = {
    "omni":   "🔮 OMNI-GEM · Mesa completa activa",
    "gov":    "🏛️  Nodo GOV · Cobertura institucional",
    "music":  "🎵  Nodo FLOW · Música StevenDior",
    "merch":  "🛍️  Iron Rider · Alianza comercial",
    "sismos": "🌊  Sismos Watch · Alerta sísmica",
    "biblia": "📖  BIBLIÆ · Palabra de Dios",
}

def banner():
    print("""
╔═══════════════════════════════════════════╗
║   MIA · Mesa de Inteligencias Artificiales ║
║   SADV41 · StevenDior · Protocolo 131     ║
╠═══════════════════════════════════════════╣
║  Modos: omni · gov · music · merch        ║
║         sismos · biblia                   ║
║  Escribe 'salir' para cerrar              ║
╚═══════════════════════════════════════════╝
""")

def listar_ias():
    ias = []
    if GEMINI_OK and GEMINI_KEY:
        ias.append("Gemini")
    if CLAUDE_OK and CLAUDE_KEY:
        ias.append("Claude")
    if not ias:
        ias.append("Modo local (sin API)")
    return ias

def preguntar_gemini(prompt, contexto):
    if not GEMINI_OK or not GEMINI_KEY:
        return None
    try:
        genai.configure(api_key=GEMINI_KEY)
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=contexto
        )
        resp = model.generate_content(prompt)
        return resp.text
    except Exception as e:
        return f"[Gemini error: {e}]"

def preguntar_claude(prompt, contexto):
    if not CLAUDE_OK or not CLAUDE_KEY:
        return None
    try:
        client = anthropic.Anthropic(api_key=CLAUDE_KEY)
        msg = client.messages.create(
            model="claude-haiku-20240307",
            max_tokens=1024,
            system=contexto,
            messages=[{"role": "user", "content": prompt}]
        )
        return msg.content[0].text
    except Exception as e:
        return f"[Claude error: {e}]"

def responder(prompt, modo="omni"):
    contexto = OMNI_GEM_CONTEXT
    respuestas = []

    r_gemini = preguntar_gemini(prompt, contexto)
    if r_gemini:
        respuestas.append(("🔵 Gemini", r_gemini))

    r_claude = preguntar_claude(prompt, contexto)
    if r_claude:
        respuestas.append(("🟣 Claude", r_claude))

    if not respuestas:
        respuestas.append(("🤖 MIA Local", f"[Sin API activa] Modo: {modo}\nConsulta: {prompt}\nNodo SADV41 procesando..."))

    return respuestas

# ═══════════════════════════════════════════════════════════════
#  MAIN
# ═══════════════════════════════════════════════════════════════
def main():
    banner()
    ias = listar_ias()
    print(f"IAs activas: {' · '.join(ias)}\n")

    modo_actual = "omni"
    print(f"Modo: {MODOS.get(modo_actual, 'OMNI')}\n")

    while True:
        try:
            entrada = input("Steven → ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\nMIA cierra la mesa. Protocolo 131 activo.\n")
            break

        if not entrada:
            continue

        if entrada.lower() in ("salir", "exit", "quit"):
            print("\nMIA cierra la mesa. Protocolo 131 activo.\n")
            break

        # Cambio de modo
        if entrada.lower() in MODOS:
            modo_actual = entrada.lower()
            print(f"\n→ {MODOS[modo_actual]}\n")
            continue

        # Comando especial: nodos
        if entrada.lower() == "nodos":
            for k, v in MODOS.items():
                print(f"  {k:8} → {v}")
            print()
            continue

        print()
        respuestas = responder(entrada, modo_actual)
        for nombre, texto in respuestas:
            print(f"{nombre}:\n{texto}\n{'─'*44}\n")

if __name__ == "__main__":
    main()

