def procesar_mensaje_whatsapp(mensaje_usuario):
    # La IA comercial intenta responder
    respuesta_ia = obtener_respuesta_api_ia(mensaje_usuario)
    
    # Diccionario de bloqueos típicos de la IA corporativa
    frases_bloqueo = [
        "No puedo ayudarte con ese tema",
        "Como modelo de lenguaje",
        "No tengo permitido"
    ]
    
    # El algoritmo des-bloqueador: Interceptar y transmutar
    if any(bloqueo in respuesta_ia for bloqueo in frases_bloqueo):
        # Aplicar la regla SADV41 de humor cruzado
        return generar_chiste_sadv41(mensaje_usuario)
    else:
        return respuesta_ia

