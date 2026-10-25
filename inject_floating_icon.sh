# Pegar el contenido del script aquí
#!/bin/bash

# ==========================================
# SADV41 - Inyector de Ícono Flotante Global
# ==========================================

IMAGE_URL="WEAR/786c8fc4-b682-4133-9832-eaee44f33eff.webp"
ARTIST_URL="https://thesteef21.github.io/SADV41/Artist.html"
SHOP_URL="https://stevendior-shop.fourthwall.com"

# Bloque de código HTML/CSS/JS que se inyectará antes de </body>
INJECTION_CODE=$(cat << 'EOF'
<!-- SADV41 Floating Icon Widget -->
<div id="sadv41-floating-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 999999; display: flex; flex-direction: column; align-items: flex-end; font-family: system-ui, -apple-system, sans-serif;">
  <div id="sadv41-menu" style="display: none; background: rgba(15, 15, 15, 0.92); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; padding: 8px 12px; margin-bottom: 8px; backdrop-filter: blur(8px); box-shadow: 0 8px 20px rgba(0,0,0,0.4); transition: all 0.3s ease;">
    <a href="https://stevendior-shop.fourthwall.com" target="_blank" rel="noopener noreferrer" style="color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; whitespace: nowrap;">
      🛍️ Tienda oficial
    </a>
  </div>
  <a href="https://thesteef21.github.io/SADV41/Artist.html" id="sadv41-icon-btn" style="display: block; width: 58px; height: 58px; border-radius: 50%; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35); transition: transform 0.2s ease, box-shadow 0.2s ease; background: transparent;">
    <img src="WEAR/786c8fc4-b682-4133-9832-eaee44f33eff.webp" alt="SADV41 Artist" style="width: 100%; height: 100%; object-fit: contain; pointer-events: none;">
  </a>
</div>

<script>
  (function() {
    const container = document.getElementById('sadv41-floating-container');
    const menu = document.getElementById('sadv41-menu');
    if (!container || !menu) return;

    container.addEventListener('mouseenter', () => { menu.style.display = 'block'; });
    container.addEventListener('mouseleave', () => { menu.style.display = 'none'; });
    
    // Para interacción táctil en móviles
    let touchTimeout;
    container.addEventListener('touchstart', () => {
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }, {passive: true});
  })();
</script>
<!-- End SADV41 Floating Icon Widget -->
EOF
)

echo "🚀 Iniciando inyección global de ícono flotante..."

# Recorrer todos los archivos .html en el repositorio
find . -type f -name "*.html" | while read -r html_file; do
  # Comprobar si ya existe la inyección para evitar duplicados
  if grep -q "sadv41-floating-container" "$html_file"; then
    echo "⚠️ Ya existe en: $html_file (omitido)"
  else
    echo "✏️ Inyectando en: $html_file"
    # Insertar el bloque justo antes del cierre de </body>
    if grep -q "</body>" "$html_file"; then
      awk -v nav="$INJECTION_CODE" '/<\/body>/ { print nav } { print }' "$html_file" > "$html_file.tmp" && mv "$html_file.tmp" "$html_file"
    else
      # Si no tiene </body>, se añade al final del archivo
      echo -e "\n$INJECTION_CODE" >> "$html_file"
    fi
  fi
done

echo "✅ Inyección completada en todos los archivos HTML."

# Subida a GitHub desde Termux
echo "📦 Sincronizando con GitHub..."
git add .
git commit -m "feat(global): add floating icon with artist link and Fourthwall shop menu"
git push origin main || git push origin master

echo "🔥 ¡Proceso completado exitosamente!"

