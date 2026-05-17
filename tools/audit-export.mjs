#!/usr/bin/env node
/**
 * tools/audit-export.mjs — extrae el array LENSES de LensAudit.html y lo
 * vuelca a CSV (UTF-8 con BOM para compatibilidad con Excel ES) y opcionalmente
 * a JSON. Útil para análisis externo, pivot tables y comparación entre
 * iteraciones del juego.
 *
 *   node tools/audit-export.mjs              # genera audit-export.csv
 *   node tools/audit-export.mjs --json       # también audit-export.json
 *   node tools/audit-export.mjs --out=foo    # cambia el nombre base
 *   node tools/audit-export.mjs --stdout     # imprime el CSV por stdout
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');
const SRC       = resolve(ROOT, 'LensAudit.html');

const args = new Map();
process.argv.slice(2).forEach(a => {
  if (a.startsWith('--')) {
    const eq = a.indexOf('=');
    if (eq > 0) args.set(a.slice(2, eq), a.slice(eq + 1));
    else        args.set(a.slice(2), true);
  }
});

const RED = '\x1b[31m', GREEN = '\x1b[32m', YELLOW = '\x1b[33m', DIM = '\x1b[2m', RESET = '\x1b[0m';
const log = (msg) => console.error(msg);    // logs por stderr, así --stdout deja el CSV limpio en stdout

// Lee y parsea
const html = readFileSync(SRC, 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/);
if (!script) { log(`${RED}No se encontró bloque <script> en ${SRC}${RESET}`); process.exit(1); }
const arr = script[1].match(/const\s+LENSES\s*=\s*(\[[\s\S]*?\];)/);
if (!arr) { log(`${RED}No se encontró el array LENSES en LensAudit.html${RESET}`); process.exit(1); }

let LENSES;
try {
  // eslint-disable-next-line no-new-func
  LENSES = Function(`return ${arr[1].replace(/;\s*$/, '')}`)();
} catch (e) {
  log(`${RED}Error al evaluar LENSES: ${e.message}${RESET}`);
  process.exit(1);
}
log(`${DIM}Leídas ${LENSES.length} lentes${RESET}`);

// Limpia HTML inline (negritas, itálicas, entidades) para que el CSV quede legible
function plainText(s) {
  return String(s || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(b|i|em|strong|code|span|div|p|sup|sub)[^>]*>/gi, '')
    .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Genera CSV (RFC 4180): cabecera + filas; comillas escapadas duplicando.
function csvCell(v) {
  const s = String(v == null ? '' : v);
  if (/[",\n;]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}
function csvRow(arr) { return arr.map(csvCell).join(';'); }   // ';' para Excel ES

const headers = ['n', 'nombre_es', 'nombre_en', 'categoria', 'puntuacion', 'descripcion', 'cumplimiento_en_juego', 'mejoras_para_100'];
const lines = [csvRow(headers)];
LENSES.forEach(l => {
  lines.push(csvRow([
    l.n,
    plainText(l.es),
    plainText(l.en),
    plainText(l.cat),
    l.score,
    plainText(l.desc),
    plainText(l.game),
    plainText(l.improv)
  ]));
});

// Resumen estadístico al final
const avg = (LENSES.reduce((s, l) => s + l.score, 0) / LENSES.length).toFixed(2);
const hi  = LENSES.filter(l => l.score >= 80).length;
const lo  = LENSES.filter(l => l.score <= 40).length;
lines.push('');
lines.push(csvRow(['RESUMEN', '', '', '', '', '', '', '']));
lines.push(csvRow(['Lentes auditadas',  LENSES.length,    '', '', '', '', '', '']));
lines.push(csvRow(['Puntuación media',  avg + ' %',       '', '', '', '', '', '']));
lines.push(csvRow(['Lentes >= 80 %',    hi,               '', '', '', '', '', '']));
lines.push(csvRow(['Lentes <= 40 %',    lo,               '', '', '', '', '', '']));

const csv = '﻿' + lines.join('\r\n');   // BOM UTF-8 para Excel

const outBase = args.get('out') || 'audit-export';
if (args.has('stdout')) {
  process.stdout.write(csv);
} else {
  const csvPath = resolve(ROOT, outBase + '.csv');
  writeFileSync(csvPath, csv, 'utf8');
  log(`${GREEN}OK${RESET} ${csvPath} (${(csv.length / 1024).toFixed(1)} KiB)`);

  if (args.has('json')) {
    const jsonPath = resolve(ROOT, outBase + '.json');
    const payload  = {
      generatedAt: new Date().toISOString(),
      source: 'LensAudit.html',
      summary: { count: LENSES.length, average: Number(avg), strong: hi, weak: lo },
      lenses: LENSES.map(l => ({
        n: l.n,
        es: l.es, en: l.en,
        cat: l.cat,
        score: l.score,
        desc: plainText(l.desc),
        game: plainText(l.game),
        improv: plainText(l.improv)
      }))
    };
    writeFileSync(jsonPath, JSON.stringify(payload, null, 2), 'utf8');
    log(`${GREEN}OK${RESET} ${jsonPath}`);
  }
}

log(`${DIM}media ${avg} % · ${hi} >=80 · ${lo} <=40${RESET}`);
