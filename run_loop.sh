#!/bin/bash
PROJECT_DIR="$HOME/sadv41"
LOG_FILE="loop.log"
INTERVAL=300

cd "$PROJECT_DIR" || exit 1

echo "🗿 [SADV41 - Ejecución de Bucle de Monitoreo]"

if [ ! -f "ig_session.json" ]; then
    echo "⚠️ No existe ig_session.json. Ejecuta primero 'python post_72h_sismos.py' para autenticarte."
    exit 1
fi

PREV_PID=$(pgrep -f "python.*post_72h_sismos.py")
if [ -n "$PREV_PID" ]; then
    echo "🛑 Deteniendo instancia previa (PID: $PREV_PID)..."
    kill -9 $PREV_PID 2>/dev/null
fi

echo "🚀 Iniciando bucle cada ${INTERVAL}s..."
nohup bash -c "
while true; do
    echo \"=== \$(date '+%Y-%m-%d %H:%M:%S') Executing post_72h_sismos.py ===\" >> $LOG_FILE
    python post_72h_sismos.py >> $LOG_FILE 2>&1
    sleep $INTERVAL
done
" > /dev/null 2>&1 &

echo "✅ Bucle ejecutándose en segundo plano. Logs: tail -f $LOG_FILE"
