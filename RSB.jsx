async function validarEnlaceConLaMesa(urlIngresada) {
    const webhookUrl = "https://hook.us2.make.com/zjb9v8wrh7iy9fyh4a7m4d2jv4bniwus";
    
    // Verificación preliminar de formato de URL
    try {
        const urlObj = new URL(urlIngresada);
        if (urlObj.hostname.length < 4 || !urlObj.hostname.includes('.')) {
            console.log("🔴 [Mesa v2.1] Rebotado: Dominio demasiado corto o inválido.");
            return false;
        }
    } catch (e) {
        console.log("🔴 [Mesa v2.1] Rebotado: Cadena no es una URL válida.");
        return false;
    }

    try {
        console.log("🔍 [Mesa v2.1] Consultando radar vía Make...");
        const response = await fetch(`${webhookUrl}?url=${encodeURIComponent(urlIngresada)}`);
        
        if (!response.ok) {
            console.log("⚠️ [Mesa v2.1] Error en la respuesta del Webhook.");
            return false;
        }

        const data = await response.json();
        
        // Confirmación de indexación en Brave Search
        if (data.web && data.web.results && data.web.results.length > 0) {
            console.log("🟢 [Mesa v2.1] Dominio verificado en la red real.");
            return true;
        } else {
            console.log("🔴 [Mesa v2.1] Rebotado al pozo: Enlace no indexado o sin presencia.");
            return false;
        }
    } catch (error) {
        console.error("❌ [Mesa v2.1] Fallo de conexión:", error);
        return false;
    }
}
