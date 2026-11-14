#!/bin/bash
REPO="$HOME/sadv41"
WIDGET_TAG='<script src="https://thesteef21.github.io/SADV41/lib/seismic-widget.js" defer></script>'

echo "[SADV41] Iniciando inyección masiva del Widget Sísmico..."

find "$REPO" -type f -name "*.html" | while read -r html_file; do
  # Verificar si ya contiene el widget
  if ! grep -q "seismic-widget.js" "$html_file"; then
    # Insertar script justo antes de </body>
    sed -i "s|</body>|  $WIDGET_TAG\n</body>|g" "$html_file"
    echo "✔ Inyectado en: $html_file"
  else
    echo "➜ Ya actualizado: $html_file"
  fi
done

echo "[SADV41] Inyección completada. Realizando commit y push..."
cd "$REPO"
git add .
git commit -m "TSEC Global: inyección automática de widget sísmico en todos los módulos HTML"
git push origin main
