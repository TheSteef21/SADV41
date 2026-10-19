#!/bin/bash
cd "$HOME/sadv41" || exit 1
echo "🗿 [SADV41 - Diagnóstico y Telemetría]"
echo "----------------------------------------"
echo "📂 Archivos de sesión y registros:"
ls -lh ig_session.json posted_events.json loop.log 2>/dev/null
echo ""
echo "⚙️ Proceso Python/Servidor en ejecución:"
ps aux | grep python | grep -v grep
echo ""
echo "📄 Últimas 10 líneas de loop.log:"
tail -n 10 loop.log 2>/dev/null
echo "----------------------------------------"
