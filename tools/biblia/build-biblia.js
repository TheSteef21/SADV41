#!/usr/bin/env node
// Uso: node build-biblia.js <ruta/a/bible-json> <salida/BIBLIA>
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(process.argv[2] || './bible-json');
const OUT = path.resolve(process.argv[3] || './BIBLIA');
const HERE = __dirname;

const LIBROS = [
  ['genesis', 'Génesis', 'AT'], ['exodo', 'Éxodo', 'AT'], ['levitico', 'Levítico', 'AT'], ['numeros', 'Números', 'AT'],
  ['deuteronomio', 'Deuteronomio', 'AT'], ['josue', 'Josué', 'AT'], ['jueces', 'Jueces', 'AT'], ['rut', 'Rut', 'AT'],
  ['1_samuel', '1 Samuel', 'AT'], ['2_samuel', '2 Samuel', 'AT'], ['1_reyes', '1 Reyes', 'AT'], ['2_reyes', '2 Reyes', 'AT'],
  ['1_cronicas', '1 Crónicas', 'AT'], ['2_cronicas', '2 Crónicas', 'AT'], ['esdras', 'Esdras', 'AT'], ['nehemias', 'Nehemías', 'AT'],
  ['ester', 'Ester', 'AT'], ['job', 'Job', 'AT'], ['salmos', 'Salmos', 'AT'], ['proverbios', 'Proverbios', 'AT'],
  ['eclesiastes', 'Eclesiastés', 'AT'], ['cantares', 'Cantares', 'AT'], ['isaias', 'Isaías', 'AT'], ['jeremias', 'Jeremías', 'AT'],
  ['lamentaciones', 'Lamentaciones', 'AT'], ['ezequiel', 'Ezequiel', 'AT'], ['daniel', 'Daniel', 'AT'], ['oseas', 'Oseas', 'AT'],
  ['joel', 'Joel', 'AT'], ['amos', 'Amós', 'AT'], ['abdias', 'Abdías', 'AT'], ['jonas', 'Jonás', 'AT'], ['miqueas', 'Miqueas', 'AT'],
  ['nahum', 'Nahúm', 'AT'], ['habacuc', 'Habacuc', 'AT'], ['sofonias', 'Sofonías', 'AT'], ['hageo', 'Hageo', 'AT'],
  ['zacarias', 'Zacarías', 'AT'], ['malaquias', 'Malaquías', 'AT'],
  ['mateo', 'Mateo', 'NT'], ['marcos', 'Marcos', 'NT'], ['lucas', 'Lucas', 'NT'], ['juan', 'Juan', 'NT'], ['hechos', 'Hechos', 'NT'],
  ['romanos', 'Romanos', 'NT'], ['1_corintios', '1 Corintios', 'NT'], ['2_corintios', '2 Corintios', 'NT'], ['galatas', 'Gálatas', 'NT'],
  ['efesios', 'Efesios', 'NT'], ['filipenses', 'Filipenses', 'NT'], ['colosenses', 'Colosenses', 'NT'],
  ['1_tesalonicenses', '1 Tesalonicenses', 'NT'], ['2_tesalonicenses', '2 Tesalonicenses', 'NT'], ['1_timoteo', '1 Timoteo', 'NT'],
  ['2_timoteo', '2 Timoteo', 'NT'], ['tito', 'Tito', 'NT'], ['filemon', 'Filemón', 'NT'], ['hebreos', 'Hebreos', 'NT'],
  ['santiago', 'Santiago', 'NT'], ['1_pedro', '1 Pedro', 'NT'], ['2_pedro', '2 Pedro', 'NT'], ['1_juan', '1 Juan', 'NT'],
  ['2_juan', '2 Juan', 'NT'], ['3_juan', '3 Juan', 'NT'], ['judas', 'Judas', 'NT'], ['apocalipsis', 'Apocalipsis', 'NT'],
];

const EXTRA = {
  genesis: ['gn', 'gen'], exodo: ['ex', 'exo'], levitico: ['lv', 'lev'], numeros: ['nm', 'num'], deuteronomio: ['dt', 'deu'],
  josue: ['jos'], jueces: ['jue', 'jc'], rut: ['rt'], salmos: ['salmo', 'sal', 'sl', 'ps'], proverbios: ['pr', 'pro', 'prov'],
  eclesiastes: ['ec', 'ecl'], cantares: ['cnt', 'can', 'cantaresdesalomon'], isaias: ['is', 'isa'], jeremias: ['jer'],
  lamentaciones: ['lm', 'lam'], ezequiel: ['ez', 'eze'], daniel: ['dn', 'dan'], oseas: ['os', 'ose'], amos: ['am', 'amo'],
  abdias: ['abd'], jonas: ['jon'], miqueas: ['miq'], habacuc: ['hab'], sofonias: ['sof'], hageo: ['hag'], zacarias: ['zac'],
  malaquias: ['mal'], mateo: ['mt', 'mat'], marcos: ['mr', 'mc', 'mar'], lucas: ['lc', 'luc'], juan: ['jn', 'jua'],
  hechos: ['hch', 'hec'], romanos: ['ro', 'rom'], galatas: ['gal'], efesios: ['ef', 'efe'], filipenses: ['fil', 'flp'],
  colosenses: ['col'], tito: ['tit'], filemon: ['flm', 'filem'], hebreos: ['heb'], santiago: ['stg', 'sant', 'sgo'],
  judas: ['jud'], apocalipsis: ['ap', 'apoc', 'apo'], nehemias: ['neh'], ester: ['est'], nahum: ['nah'],
};
const NUM_ABREV = {
  samuel: ['sam', 'sa'], reyes: ['re', 'rey'], cronicas: ['cr', 'cro', 'cron'], corintios: ['co', 'cor'],
  tesalonicenses: ['ts', 'tes', 'tesal'], timoteo: ['ti', 'tim'], pedro: ['p', 'pe', 'ped'], juan: ['jn', 'jua', 'j'],
};

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const w = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c); };

function cargar(id) {
  const s = fs.readFileSync(path.join(SRC, 'procesados', id + '.js'), 'utf8').replace(/^\s*(export default|module\.exports\s*=)/, '');
  return new Function('return ' + s)().map((cap) => cap.map(limpiar));
}

// El origen marca saltos de linea poeticos como "/n" y trae restos de marcado ("|", "|par", "{").
function limpiar(t) {
  return t
    .replace(/\s*\/n\s*/g, '\n')
    .replace(/\|par\s*/g, '')
    .replace(/\|/g, '')
    .replace(/^\{/, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

const BASE_DOC = 'RVR1960 - Reina Valera 1960. Datos: josevladimir/bible-json (MIT).';
const CSS = 'body{margin:0;background:#070A12;color:#E8ECF5;font:17px/1.7 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}main{max-width:760px;margin:0 auto;padding:24px 18px 60px}a{color:#00E5FF}h1{color:#FFD700;font-size:26px}nav{display:flex;justify-content:space-between;gap:12px;margin:18px 0;flex-wrap:wrap}.v{margin:8px 0}.n{color:#D4AF37;font-weight:800;font-size:.8em;margin-right:4px;vertical-align:super}small{color:#8A95B0}';

const libros = [];
const todo = {};
let totCap = 0, totVer = 0;

LIBROS.forEach(([id, nombre, test], i) => {
  const caps = cargar(id);
  const base = id.replace(/^\d_/, '');
  const num = /^\d_/.test(id) ? id[0] : '';
  const alias = new Set([norm(id), norm(nombre), ...(EXTRA[id] || []).map(norm)]);
  if (num) {
    (NUM_ABREV[base] || []).forEach((a) => alias.add(num + norm(a)));
    alias.add(num + norm(base.slice(0, 3)));
    alias.add(num + norm(base));
  } else {
    alias.add(norm(base.slice(0, 3)));
  }
  const vers = caps.reduce((a, c) => a + c.length, 0);
  totCap += caps.length; totVer += vers;
  libros.push({ orden: i + 1, id, nombre, testamento: test, capitulos: caps.length, versiculos: vers, alias: [...alias] });
  todo[id] = caps;
  w(path.join(OUT, 'data', id + '.json'), JSON.stringify({ version: 'RVR1960', id, nombre, capitulos: caps }));
});

w(path.join(OUT, 'data', 'libros.json'), JSON.stringify(libros));
w(path.join(OUT, 'data', 'rvr1960.json'), JSON.stringify({ version: 'RVR1960', libros: todo }));

// Paginas estaticas por capitulo (legibles sin JavaScript)
libros.forEach((l, bi) => {
  const caps = todo[l.id];
  caps.forEach((vs, ci) => {
    const n = ci + 1;
    const prev = n > 1 ? `${l.id}/${n - 1}.html` : (bi > 0 ? `${libros[bi - 1].id}/${libros[bi - 1].capitulos}.html` : null);
    const next = n < caps.length ? `${l.id}/${n + 1}.html` : (bi < libros.length - 1 ? `${libros[bi + 1].id}/1.html` : null);
    const rel = (p) => (p ? '../' + p : null);
    const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(l.nombre)} ${n} - Biblia RVR1960 - SADV41</title>
<meta name="description" content="${esc(l.nombre)} ${n}: ${esc(vs[0].slice(0, 140))}">
<link rel="alternate" type="application/json" href="../data/${l.id}.json">
<style>${CSS}</style></head><body><main>
<nav><a href="../index.html">Biblia</a><a href="index.html">${esc(l.nombre)}</a></nav>
<h1>${esc(l.nombre)} ${n}</h1>
${vs.map((t, k) => `<p class="v" id="v${k + 1}" data-ref="${esc(l.nombre)} ${n}:${k + 1}"><span class="n">${k + 1}</span>${esc(t).replace(/\n/g, '<br>')}</p>`).join('\n')}
<nav>${prev ? `<a href="${rel(prev)}">&larr; Anterior</a>` : '<span></span>'}${next ? `<a href="${rel(next)}">Siguiente &rarr;</a>` : '<span></span>'}</nav>
<small>${BASE_DOC}</small>
</main></body></html>`;
    w(path.join(OUT, l.id, n + '.html'), html);
  });
  const idx = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(l.nombre)} - Biblia RVR1960 - SADV41</title><link rel="alternate" type="application/json" href="../data/${l.id}.json">
<style>${CSS}</style></head><body><main>
<nav><a href="../index.html">Biblia</a></nav><h1>${esc(l.nombre)}</h1>
<p>${l.capitulos} capítulos, ${l.versiculos} versículos.</p>
<p>${Array.from({ length: l.capitulos }, (_, k) => `<a href="${k + 1}.html">${k + 1}</a>`).join(' · ')}</p>
<small>${BASE_DOC}</small></main></body></html>`;
  w(path.join(OUT, l.id, 'index.html'), idx);
});

// index.html (portal humano + documentacion para IAs)
const listaLibros = (t) => libros.filter((l) => l.testamento === t).map((l) => `<a href="${l.id}/index.html">${esc(l.nombre)}</a>`).join(' · ');
const indexHtml = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SADV41 - Biblia RVR1960 para humanos e IAs</title>
<meta name="description" content="Biblia Reina Valera 1960 en JSON y HTML estatico, consultable por cualquier IA. SADV41.">
<link rel="alternate" type="application/json" href="data/libros.json">
<style>${CSS}pre{background:#060912;border:1px solid rgba(0,229,255,.25);border-radius:10px;padding:12px;overflow:auto;font-size:13px;white-space:pre-wrap}code{color:#9ECBFF}</style></head><body><main>
<h1>Biblia RVR1960 - SADV41</h1>
<p>${libros.length} libros, ${totCap} capítulos, ${totVer} versículos. Texto en español, abierto y sin JavaScript obligatorio.</p>
<h2>Para IAs y programas</h2>
<pre>Capítulo en HTML:   ${'{BASE}'}juan/3.html           (cada versículo es un &lt;p id="v16" data-ref="Juan 3:16"&gt;)
Libro en JSON:      ${'{BASE}'}data/juan.json        {"capitulos":[[versículos del cap. 1],[cap. 2],...]}
Índice de libros:   ${'{BASE}'}data/libros.json
Biblia completa:    ${'{BASE}'}data/rvr1960.json
Guía para IAs:      ${'{BASE}'}llms.txt  y  ${'{BASE}'}ia.json
Con JavaScript:     await SADV41Biblia.get("Juan 3:16")   (cargar ${'{BASE}'}biblia.js)</pre>
<h2>Antiguo Testamento</h2><p>${listaLibros('AT')}</p>
<h2>Nuevo Testamento</h2><p>${listaLibros('NT')}</p>
<h2>Widget</h2>
<pre>&lt;script src="/SADV41/BIBLIA/biblia.js" defer&gt;&lt;/script&gt;</pre>
<small>${BASE_DOC} Aviso: la RVR1960 tiene derechos de autor de las Sociedades Bíblicas Unidas; verifica los permisos antes de uso comercial o redistribución masiva.</small>
<script>document.querySelectorAll('pre').forEach(function(p){p.innerHTML=p.innerHTML.split('{BASE}').join(location.href.replace(/index\\.html.*$/,'').replace(/[?#].*$/,''))});</script>
<script src="biblia.js" defer></script>
</main></body></html>`;
w(path.join(OUT, 'index.html'), indexHtml);

const llms = `# SADV41 - Biblia Reina Valera 1960 (RVR1960)
> Texto bíblico en español, estático, sin API ni autenticación. ${libros.length} libros, ${totCap} capítulos.

Cómo consultar (rutas relativas a esta carpeta):
- Un capítulo legible en HTML: <libro_id>/<capitulo>.html  (ej. juan/3.html). Versículo = <p id="v16" data-ref="Juan 3:16">.
- Un libro completo en JSON: data/<libro_id>.json -> {"capitulos":[["v1","v2"],...]} (índice de capítulo = número-1).
- Lista de libros, ids y alias: data/libros.json
- Biblia completa (~4 MB): data/rvr1960.json
- Con JavaScript: cargar biblia.js y usar await SADV41Biblia.get("1 Corintios 13:4-7"), .buscar("palabra"), .versiculoDelDia().
- Parámetro de URL en cualquier página con el widget: ?biblia=Salmos+23

Ids de libro: ${libros.map((l) => l.id).join(', ')}

Reglas para citar:
- Cita siempre libro, capítulo y versículo, e indica "RVR1960".
- Usa solo el texto devuelto; no completes ni parafrasees como si fuera cita literal.
- Fuente de datos: https://github.com/josevladimir/bible-json (MIT). La traducción RVR1960 tiene derechos de autor de las Sociedades Bíblicas Unidas.
- Los versos poéticos (Salmos, Job, etc.) traen saltos de línea reales dentro del texto del versículo.
- Limpieza aplicada al origen: marcas "/n" convertidas en salto de línea; restos de marcado eliminados.
- Limitación conocida: verificación puntual encontró diferencias de numeración (Génesis 33 con 19 versículos en lugar de 20; Salmos 47 con 10 en lugar de 9). Contrasta con otra fuente si la exactitud del número de versículo es crítica.
`;
w(path.join(OUT, 'llms.txt'), llms);
w(path.join(OUT, 'ia.json'), JSON.stringify({
  nombre: 'SADV41 Biblia RVR1960', version: 'RVR1960', libros: libros.length, capitulos: totCap, versiculos: totVer,
  rutas: { capitulo_html: '{libro_id}/{capitulo}.html', libro_json: 'data/{libro_id}.json', indice: 'data/libros.json', completa: 'data/rvr1960.json', guia: 'llms.txt', api_js: 'biblia.js' },
  fuente: 'https://github.com/josevladimir/bible-json', licencia_codigo_datos: 'MIT', aviso: 'RVR1960 protegida por derechos de autor (Sociedades Biblicas Unidas)',
}, null, 2));

fs.copyFileSync(path.join(HERE, 'biblia.js'), path.join(OUT, 'biblia.js'));
console.log(`OK: ${libros.length} libros, ${totCap} capitulos, ${totVer} versiculos -> ${OUT}`);
