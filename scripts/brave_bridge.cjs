#!/usr/bin/env node
const http = require("http");
const crypto = require("crypto");
const { URL } = require("url");

const HOST = "127.0.0.1";
const PORT = 3000;
const ADV41_TOKEN = (process.env.ADV41_TOKEN || "").trim();
const BRAVE_API_KEY = (process.env.BRAVE_API_KEY || "").trim();

if (ADV41_TOKEN.length < 32) {
  console.error("[SADV41-FATAL] ADV41_TOKEN debe tener ≥ 32 caracteres");
  process.exit(1);
}
if (!BRAVE_API_KEY) {
  console.error("[SADV41-FATAL] Falta BRAVE_API_KEY");
  process.exit(1);
}

const EXPECTED_HASH = crypto.createHash("sha256").update(ADV41_TOKEN).digest();

function isAuthorized(provided) {
  if (typeof provided !== "string" || provided.length < 32) return false;
  const hash = crypto.createHash("sha256").update(provided).digest();
  return crypto.timingSafeEqual(hash, EXPECTED_HASH);
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || "";
  if (origin === "https://thesteef21.github.io" || origin.startsWith("http://127.0.0.1") || origin.startsWith("http://localhost")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-ADV41-Token");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const parsed = new URL(req.url, `http://\( {HOST}: \){PORT}`);
  if (req.method !== "GET" || parsed.pathname !== "/api/brave-context") {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }

  if (!isAuthorized(req.headers["x-adv41-token"] || "")) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "ADV41_TOKEN inválido" }));
  }

  const q = (parsed.searchParams.get("q") || "").trim().slice(0, 300);
  if (!q) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Parámetro q requerido" }));
  }

  try {
    const upstream = new URL("https://api.search.brave.com/res/v1/llm/context");
    upstream.searchParams.set("q", q);
    const braveRes = await fetch(upstream, {
      headers: { "Accept": "application/json", "X-Subscription-Token": BRAVE_API_KEY }
    });
    const body = await braveRes.text();
    res.writeHead(braveRes.status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(body);
  } catch (e) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Error Brave API" }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[\( {new Date().toISOString()}] Nodo Brave activo en http:// \){HOST}:${PORT}/api/brave-context`);
});
