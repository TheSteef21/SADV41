#!/usr/bin/env node
/**
 * SADV41 // Protocolo Bachazo (Bashea) — Puente Local Brave Search LLM Context
 * Aislamiento estricto en 127.0.0.1:3000 + validación ADV41_TOKEN en tiempo constante.
 */
const http = require("http");
const crypto = require("crypto");
const { URL } = require("url");

const HOST = "127.0.0.1";
const PORT = 3000;
const ADV41_TOKEN = (process.env.ADV41_TOKEN || "").trim();
const BRAVE_API_KEY = (process.env.BRAVE_API_KEY || "").trim();

if (ADV41_TOKEN.length < 32) {
  console.error("[SADV41-FATAL] ADV41_TOKEN debe tener al menos 32 caracteres.");
  process.exit(1);
}
if (!BRAVE_API_KEY) {
  console.error("[SADV41-FATAL] Define BRAVE_API_KEY antes de iniciar el puente.");
  process.exit(1);
}

const EXPECTED_HASH = crypto.createHash("sha256").update(ADV41_TOKEN).digest();

function safeLog(msg) {
  const clean = String(msg).replace(/[\r\n\t\x00-\x1f\x7f]/g, " ");
  console.log(`[${new Date().toISOString()}] ${clean}`);
}

function isAuthorized(provided) {
  if (typeof provided !== "string" || provided.length < 32) return false;
  const hash = crypto.createHash("sha256").update(provided).digest();
  return crypto.timingSafeEqual(hash, EXPECTED_HASH);
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || "";
  if (
    origin === "https://thesteef21.github.io" ||
    origin.startsWith("http://127.0.0.1") ||
    origin.startsWith("http://localhost")
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-ADV41-Token");
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${HOST}:${PORT}`);

  if (req.method !== "GET" || parsedUrl.pathname !== "/api/brave-context") {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }

  const clientToken = req.headers["x-adv41-token"] || "";
  if (!isAuthorized(clientToken)) {
    safeLog("Intento no autorizado bloqueado.");
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "ADV41_TOKEN inválido" }));
  }

  const rawQuery = (parsedUrl.searchParams.get("q") || "").trim();
  const cleanQuery = rawQuery.replace(/[\x00-\x1f\x7f]/g, " ").slice(0, 300);
  if (!cleanQuery) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Parámetro q requerido" }));
  }

  try {
    const upstream = new URL("https://api.search.brave.com/res/v1/llm/context");
    upstream.searchParams.set("q", cleanQuery);

    const braveRes = await fetch(upstream.toString(), {
      headers: {
        "Accept": "application/json",
        "X-Subscription-Token": BRAVE_API_KEY
      }
    });

    const bodyText = await braveRes.text();
    safeLog(`Consulta Brave LLM Context (${braveRes.status}): ${cleanQuery}`);

    res.writeHead(braveRes.status, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(bodyText);
  } catch (err) {
    safeLog(`Error de conexión Brave: ${err.message}`);
    res.writeHead(502, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Error consultando Brave Search API" }));
  }
});

server.listen(PORT, HOST, () => {
  safeLog(`Nodo Brave LLM Context activo en http://${HOST}:${PORT}/api/brave-context`);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    safeLog(`Señal ${sig} recibida. Cerrando nodo limpiamente...`);
    server.close(() => process.exit(0));
  });
}
