const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.SADV41_TOKEN || null;

const ALLOWED_ORIGINS = [
  'https://thesteef21.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'null'
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error('Origen no permitido: ' + origin));
  }
}));
app.use(express.json({ limit: '10kb' }));

const agentState = {
  status: 'SADV41 Backend Activo',
  agente: 'Binance Wallet',
  estado: 'Esperando instrucciones',
  wallet: null,
  lastCommand: null,
  startedAt: Date.now()
};
const uptimeSeconds = () => Math.floor((Date.now() - agentState.startedAt) / 1000);

function auth(req, res, next) {
  if (!TOKEN) return next();
  if (req.get('x-sadv41-token') === TOKEN) return next();
  return res.status(401).json({ ok: false, message: 'No autorizado' });
}

app.get('/', (req, res) => {
  res.json({
    status: agentState.status,
    agente: agentState.agente,
    estado: agentState.estado,
    uptimeSeconds: uptimeSeconds()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: uptimeSeconds() });
});

app.post('/command', auth, (req, res) => {
  const cmd = typeof req.body?.cmd === 'string' ? req.body.cmd.trim() : '';
  if (!cmd) return res.status(400).json({ ok: false, message: 'Falta el campo "cmd"' });

  agentState.lastCommand = cmd;
  console.log(`[SADV41] Comando recibido: ${cmd}`);

  if (cmd === 'status' || cmd === '/status') {
    return res.json({ ok: true, ...agentState, uptimeSeconds: uptimeSeconds() });
  }
  if (cmd === 'auto-trade') {
    return res.json({ ok: true, message: 'Modo auto-trade activado (simulado). Esperando firma soberana en dispositivo.' });
  }
  if (cmd === '/consultar_balance' || cmd === 'balance') {
    return res.json({ ok: true, message: 'Balance simulado: 0.00 BNB (conecta wallet real)' });
  }
  if (cmd.startsWith('/ejecutar_transaccion') || cmd.startsWith('tx ')) {
    return res.json({ ok: false, message: 'Modo soberano: requiere firma local en el dispositivo' });
  }
  if (cmd === 'map panama') {
    return res.json({ ok: true, message: 'Mapa táctico Azuero-Soná actualizado. Círculos ROJO (Pacífico) + AMARILLO (Azuero) activos.' });
  }
  return res.json({ ok: true, message: `Comando "${cmd}" recibido y procesado` });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(403).json({ ok: false, message: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SADV41 Backend corriendo en http://localhost:${PORT}`);
});
