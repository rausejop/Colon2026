#!/usr/bin/env node
/**
 * tools/wordcount.mjs — composición por secciones de Colon2026.html
 *
 * Reporta cuántos bytes y qué porcentaje del fichero ocupa cada componente:
 * sprite SVG, CSS, HTML estructural, JavaScript inline (subdividido en datos
 * históricos y código), modales, comentarios, etc. Útil para identificar
 * dónde optimizar y dónde está creciendo el fichero entre iteraciones.
 *
 *   node tools/wordcount.mjs                # informe en consola
 *   node tools/wordcount.mjs --json         # también JSON por stdout
 *   node tools/wordcount.mjs FILE.html      # otro fichero
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const file = args[0] || 'Colon2026.html';
const path = resolve(ROOT, file);
const wantJson = process.argv.includes('--json');

const html = readFileSync(path, 'utf8');
const total = Buffer.byteLength(html, 'utf8');

const RED   = '\x1b[31m', GREEN = '\x1b[32m', YELLOW = '\x1b[33m', DIM = '\x1b[2m', BOLD = '\x1b[1m', RESET = '\x1b[0m';

function bytesOf(str){ return Buffer.byteLength(str || '', 'utf8'); }
function bar(pct, width=30){
  const fill = Math.round(pct/100 * width);
  return '█'.repeat(fill) + '░'.repeat(width - fill);
}

// 1. Comentarios HTML
const htmlComments = (html.match(/<!--[\s\S]*?-->/g) || []).join('');

// 2. Sprite SVG
const spriteMatch = html.match(/<svg width="0"[\s\S]*?<\/svg>/);
const sprite = spriteMatch ? spriteMatch[0] : '';

// 3. CSS inline
const cssMatch = html.match(/<style[\s\S]*?<\/style>/);
const css = cssMatch ? cssMatch[0] : '';

// 4. Script inline
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const script = scriptMatch ? scriptMatch[1] : '';

// Subsecciones dentro del script: comentarios JS, datos históricos, datos de juego, código.
const scriptComments = (script.match(/\/\*[\s\S]*?\*\//g) || []).join('') + (script.match(/\/\/[^\n]*/g) || []).join('\n');

// Datos: arrays de const con datos masivos (CREW_DATABASE, HISTORICAL_LOGBOOK, etc.)
function findArray(name){
  const rx = new RegExp(`const\\s+${name}\\s*=\\s*(\\[[\\s\\S]*?\\];)`);
  const m = script.match(rx);
  return m ? m[1] : '';
}
function findObject(name){
  const rx = new RegExp(`const\\s+${name}\\s*=\\s*(\\{[\\s\\S]*?\\n\\};)`);
  const m = script.match(rx);
  return m ? m[1] : '';
}

const dataSections = {
  HISTORICAL_LOGBOOK: findArray('HISTORICAL_LOGBOOK'),
  CREW_DATABASE:      findArray('CREW_DATABASE'),
  CREW_VOICES:        findObject('CREW_VOICES'),
  CREW_AGES:          findObject('CREW_AGES'),
  DAILY_VIGNETTES:    findArray('DAILY_VIGNETTES'),
  MILESTONES:         findArray('MILESTONES'),
  COLON_RANKS:        findArray('COLON_RANKS'),
  DECISION_POINTS:    findArray('DECISION_POINTS'),
  ROUTE_WAYPOINTS:    findArray('ROUTE_WAYPOINTS'),
  CANONICAL_HOURS:    findArray('CANONICAL_HOURS'),
  SHIP_WATCHES:       findArray('SHIP_WATCHES'),
  SHIP_MENU:          findArray('SHIP_MENU'),
  SHIPS:              findObject('SHIPS'),
  PERIOD_TOPONYMS:    'this.PERIOD_TOPONYMS=' // handled inline; skip
};
let dataTotalBytes = 0;
const dataReport = [];
for (const [name, src] of Object.entries(dataSections)){
  if (typeof src !== 'string' || !src.startsWith('[') && !src.startsWith('{')) continue;
  const b = bytesOf(src);
  dataTotalBytes += b;
  dataReport.push({ name, bytes: b });
}

// 5. Resto del HTML (todo lo que no esté en sprite/css/script/comentarios)
const restApprox = total - bytesOf(sprite) - bytesOf(css) - bytesOf(scriptMatch ? scriptMatch[0] : '') - bytesOf(htmlComments);

// Composición principal
const breakdown = [
  { name: 'JavaScript inline',     bytes: bytesOf(scriptMatch ? scriptMatch[0] : '') },
  { name: '  · datos históricos',  bytes: dataTotalBytes,                              indent: true },
  { name: '  · comentarios JS',    bytes: bytesOf(scriptComments),                     indent: true },
  { name: '  · código (resto)',    bytes: bytesOf(script) - dataTotalBytes - bytesOf(scriptComments), indent: true },
  { name: 'CSS inline',            bytes: bytesOf(css) },
  { name: 'Sprite SVG',            bytes: bytesOf(sprite) },
  { name: 'Comentarios HTML',      bytes: bytesOf(htmlComments) },
  { name: 'HTML estructural',      bytes: Math.max(0, restApprox) }
];

if (wantJson){
  console.log(JSON.stringify({
    file, totalBytes: total,
    breakdown: breakdown.map(b => ({ name: b.name.trim(), bytes: b.bytes, pct: +(b.bytes/total*100).toFixed(2) })),
    data: dataReport.sort((a,b)=>b.bytes-a.bytes)
  }, null, 2));
  process.exit(0);
}

console.log(`\n${BOLD}== Composición de ${file} ==${RESET}`);
console.log(`${DIM}Tamaño total: ${(total/1024).toFixed(1)} KiB (${total.toLocaleString()} bytes)${RESET}\n`);
for (const row of breakdown){
  const pct = (row.bytes/total) * 100;
  const indent = row.indent ? '' : '';
  const colorN = row.indent ? DIM : RESET;
  const colorB = (pct > 30) ? YELLOW : (pct > 10 ? GREEN : DIM);
  console.log(`  ${colorN}${row.name.padEnd(28)}${RESET}  ${colorB}${bar(pct)}${RESET}  ${(row.bytes/1024).toFixed(1).padStart(7)} KiB  ${pct.toFixed(1).padStart(5)}%`);
}
console.log(`\n${YELLOW}Datos históricos por dataset:${RESET}`);
dataReport.sort((a,b)=>b.bytes-a.bytes).forEach(d => {
  const pct = (d.bytes/dataTotalBytes) * 100;
  console.log(`  ${d.name.padEnd(20)}  ${DIM}${bar(pct, 20)}${RESET}  ${(d.bytes/1024).toFixed(1).padStart(6)} KiB  ${pct.toFixed(1).padStart(5)}%`);
});
