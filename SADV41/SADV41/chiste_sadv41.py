# SADV41/SADV41 - Protocolo Des-bloqueador Genesis
# Intercepta respuestas bloqueadas de IA comercial y las transmuta a modo humor SADV41

import random

FRASES_BLOQUEO = [
    "No puedo ayudarte con ese tema",
    "Como modelo de lenguaje",
    "No tengo permitido",
    "No puedo proporcionar",
    "I'm not able to",
    "I can't help with",
    "content policy"
]

CHISTES_SADV41 = [
    "Protocolo SADV41 activado: la IA de corbata se puso nerviosa y corto los cables 😂",
    "Modo Genesis ON: cuando la ciencia aumenta, la soberania se mantiene.",
    "Transmutando bloqueo en chiste a 432 Hz... operando normal 🚀",
    "El sistema detecto tema sensible y entro en modo humor cruzado SADV41 💸",
    "No rompemos servidores, transmutamos el bloqueo. SADV41 sigue."
]

def generar_chiste_sadv41():
    return random.choice(CHISTES_SADV41)

def procesar_mensaje(mensaje_usuario, respuesta_ia):
    if any(b.lower() in respuesta_ia.lower() for b in FRASES_BLOQUEO):
        return generar_chiste_sadv41()
    return respuesta_ia

if __name__ == "__main__":
    print(procesar_mensaje("test politico", "No puedo ayudarte con ese tema"))
