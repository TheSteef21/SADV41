#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_DIR = process.env.REPO || path.resolve(__dirname);
const BIB_DIR = path.join(REPO_DIR, 'BIBLIA');
const JSON_INPUT = process.argv[2] || path.join(BIB_DIR, 'data', 'rv1909.json');

if (!fs.existsSync(JSON_INPUT)) {
  console.error(`❌ No se encontró el archivo JSON de origen en: ${JSON_INPUT}`);
  process.exit(1);
}

console.log(`📖 Cargando JSON desde: ${JSON_INPUT}`);
const rawData = JSON.parse(fs.readFileSync(JSON_INPUT, 'utf8'));

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/^1\s+/, "1_")
    .replace(/^2\s+/, "2_")
    .replace(/^3\s+/, "3_")
    .replace(/\s+/g, "_");
}

const libros = Array.isArray(rawData) ? rawData : (rawData.libros || Object.keys(rawData).map(k => {
  return typeof rawData[k] === 'object' ? { id: k, ...rawData[k] } : { id: k, capitulos: rawData[k] };
}));

let totalCapitulos = 0;
let totalVersiculos = 0;
const indiceLibros = [];

libros.forEach((libro, lIndex) => {
  const nombreLibro = libro.nombre || libro.id || `Libro ${lIndex + 1}`;
  const libroId = libro.id ? slugify(libro.id) : slugify(nombreLibro);
  const capitulos = libro.capitulos || libro.chapters || [];
  
  const libroDir = path.join(BIB_DIR, libroId);
  fs.mkdirSync(libroDir, { recursive: true });

  indiceLibros.push({
    id: libroId,
    nombre: nombreLibro,
    capitulos: capitulos.length
  });

  const dataDir = path.join(BIB_DIR, 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(
    path.join(dataDir, `${libroId}.json`),
    JSON.stringify({ nombre: nombreLibro, capitulos: capitulos }, null, 2)
  );

  capitulos.forEach((versiculos, cIndex) => {
    const numCap = cIndex + 1;
    totalCapitulos++;
    totalVersiculos += versiculos.length;

    const prevCap = numCap > 1 ? `${numCap - 1}.html` : (lIndex > 0 ? `../${slugify(libros[lIndex - 1].nombre || libros[lIndex - 1].id)}/1.html` : null);
    const nextCap = numCap < capitulos.length ? `${numCap + 1}.html` : (lIndex < libros.length - 1 ? `../${slugify(libros[lIndex + 1].nombre || libros[lIndex + 1].id)}/1.html` : null);

    const versiculosHTML = versiculos.map((texto, vIndex) => {
      const numVers = vIndex + 1;
      const ref = `${nombreLibro} ${numCap}:${numVers}`;
      const limpio = texto.replace(/\n/g, '<br>');
      return `<p class="v" id="v${numVers}" data-ref="${ref}"><span class="n">${numVers}</span> ${limpio}</p>`;
    }).join('\n');

    const htmlContent = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${nombreLibro} ${numCap} - RV1909 | SADV41</title>
  <style>
    body{margin:0;background:#070A12;color:#E8ECF5;font:17px/1.7 system-ui,-apple-system,sans-serif}
    main{max-width:760px;margin:0 auto;padding:24px 18px 60px}
    a{color:#00E5FF;text-decoration:none}
    h1{color:#FFD700;font-size:24px;margin:12px 0}
    nav{display:flex;justify-content:space-between;gap:12px;margin:16px 0;padding:10px 0;border-bottom:1px solid rgba(0,229,255,0.2);font-size:14px}
    .v{margin:10px 0}
    .n{color:#D4AF37;font-weight:800;font-size:.8em;margin-right:6px;vertical-align:super}
  </style>
</head>
<body>
  <main>
    <nav>
      ${prevCap ? `<a href="${prevCap}">← Anterior</a>` : `<span></span>`}
      <a href="index.html">📜 ${nombreLibro}</a>
      ${nextCap ? `<a href="${nextCap}">Siguiente →</a>` : `<span></span>`}
    </nav>
    <h1>${nombreLibro} ${numCap}</h1>
    <div id="capitulo">
${versiculosHTML}
    </div>
  </main>
  <script src="../asistente-dia.js" defer></script>
</body>
</html>`;

    fs.writeFileSync(path.join(libroDir, `${numCap}.html`), htmlContent);
  });

  const linksCapitulos = capitulos.map((_, i) => `<a href="${i + 1}.html" style="display:inline-block;padding:8px 14px;margin:4px;background:#1e293b;border-radius:6px;color:#00e5ff">${i + 1}</a>`).join('');
  const libroIndexHTML = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${nombreLibro} - RV1909 | SADV41</title>
  <style>
    body{margin:0;background:#070A12;color:#E8ECF5;font:17px/1.7 system-ui,-apple-system,sans-serif}
    main{max-width:760px;margin:0 auto;padding:24px 18px 60px}
    a{color:#00E5FF;text-decoration:none}
    h1{color:#FFD700;font-size:26px}
  </style>
</head>
<body>
  <main>
    <p><a href="../index.html">← Volver al Índice General</a></p>
    <h1>${nombreLibro} (RV1909)</h1>
    <div style="margin-top:16px">${linksCapitulos}</div>
  </main>
  <script src="../asistente-dia.js" defer></script>
</body>
</html>`;

  fs.writeFileSync(path.join(libroDir, 'index.html'), libroIndexHTML);
});

fs.writeFileSync(
  path.join(BIB_DIR, 'data', 'libros.json'),
  JSON.stringify(indiceLibros, null, 2)
);

console.log(`✅ Proceso finalizado con éxito:`);
console.log(`   - Libros procesados: ${libros.length}`);
console.log(`   - Capítulos generados: ${totalCapitulos}`);
console.log(`   - Versículos totales: ${totalVersiculos}`);
