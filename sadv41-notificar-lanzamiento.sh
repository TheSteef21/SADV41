#!/usr/bin/env bash
set -euo pipefail

echo "📢 [SADV41] Difundiendo nuevo lanzamiento: Sinceridad a Disposición Vívida..."

# 1. Actualizar metadatos y registros locales
git pull origin main || true

# 2. Registrar el commit del lanzamiento en todos los módulos activos
git add Artist.html Artist/img/ index.html SISMOS/
git commit -m "feat(music): notificacion global album Sinceridad a Disposicion Vivida (UPC: 5187937)" || echo "ℹ️ Sin cambios pendientes de commit."

# 3. Empujar hacia el repositorio remoto de GitHub Pages
git push origin main

echo "✅ ¡Notificación de lanzamiento propagada con éxito a todo el ecosistema SADV41!"
echo "🌐 Verifica tu portal en: https://thesteef21.github.io/SADV41/Artist.html"
