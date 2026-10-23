const express = require('express');
const { execFile } = require('child_process');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '10kb' }));

const AUTH_TOKEN = process.env.ADV41_TOKEN;
if (!AUTH_TOKEN || AUTH_TOKEN.length < 32) {
  console.error('❌ Error crítico: ADV41_TOKEN no definido o menor a 32 caracteres.');
  process.exit(1);
}
const EXPECTED_HASH = crypto.createHash('sha256').update(AUTH_TOKEN).digest();

const ALLOWED_COMMANDS = {
  'balance': ['wallet', 'balance', '--json'],
  'status':  ['wallet', 'status', '--json'],
  'address': ['wallet', 'address', '--json']
};

const limits = new Map();
const WINDOW = 60_000;
const MAX = 30;

app.post('/webhook/agent', (req, res) => {
  const ip = req.ip;
  const now = Date.now();
  const e = limits.get(ip) || { count: 0, start: now };
  if (now - e.start > WINDOW) { e.count = 1; e.start = now; } else e.count++;
  limits.set(ip, e);
  if (e.count > MAX) return res.status(429).json({ error: 'rate limited' });

  const ts = new Date().toISOString();
  const hdr = req.headers['authorization'] || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : '';
  
  const clientHash = crypto.createHash('sha256').update(token).digest();
  
  const rawAction = req.body && typeof req.body === 'object' ? req.body.action : '';
  const safeAction = String(rawAction || '').replace(/[\r\n]/g, '_');

  if (!crypto.timingSafeEqual(clientHash, EXPECTED_HASH)) {
    console.log(`[${ts}] 403 ip=${ip} action=${safeAction} reason=auth`);
    return res.status(403).json({ error: 'Acceso no autorizado' });
  }

  if (!ALLOWED_COMMANDS[safeAction]) {
    console.log(`[${ts}] 403 ip=${ip} action=${safeAction} reason=not_allowed`);
    return res.status(403).json({ error: 'Comando no permitido' });
  }

  console.log(`[${ts}] EXEC ip=${ip} action=${safeAction}`);

  execFile('baw', ALLOWED_COMMANDS[safeAction], { timeout: 5000 }, (error, stdout, stderr) => {
    if (error) {
      console.log(`[${ts}] 500 ip=${ip} action=${safeAction} reason=exec_error`);
      return res.status(500).json({ status: 'error', details: stderr || error.message });
    }
    try {
      const data = JSON.parse(stdout);
      return res.json({ status: 'success', response: data });
    } catch {
      return res.json({ status: 'success', response: stdout.trim() });
    }
  });
});

const server = app.listen(3000, '127.0.0.1', () => {
  console.log('🛸 ADV41 Secure Bridge en 127.0.0.1:3000 (solo lectura - hardened)');
});

function shutdown(s) { 
  console.log(`${s} -> cierre limpio`); 
  server.close(() => process.exit(0)); 
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
