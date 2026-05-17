#!/usr/bin/env node
/**
 * tools/check.mjs — verificador de calidad de Colón 1492
 *
 * Comprueba sobre Colon2026.html y LensAudit.html:
 *   - El script inline parsea como JavaScript válido.
 *   - No contienen emojis (rangos Unicode pictográficos típicos).
 *   - Tamaño del fichero y nº de líneas (informativo).
 *   - Que las referencias a iconos del sprite SVG existen.
 *   - Que cada MILESTONES.id es único, y los rangos COLON_RANKS crecen.
 *
 * Uso: node tools/check.mjs [fichero1.html fichero2.html ...]
 * Por defecto comprueba Colon2026.html y LensAudit.html.
 *
 * Salida: 0 si todo OK, 1 si algo falla.
 */
import { readFileSync, statSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const files = process.argv.slice(2);
if (!files.length) {
  files.push('Colon2026.html', 'LensAudit.html');
}

const RX_EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F900}-\u{1F9FF}]/gu;
const RX_SCRIPT = /<script>([\s\S]*?)<\/script>/g;

// Códigos ANSI básicos
const RED   = '\x1b[31m', GREEN = '\x1b[32m', YELLOW = '\x1b[33m', DIM = '\x1b[2m', RESET = '\x1b[0m';
const ok    = msg => console.log(`  ${GREEN}OK${RESET}    ${msg}`);
const fail  = msg => console.log(`  ${RED}FAIL${RESET}  ${msg}`);
const warn  = msg => console.log(`  ${YELLOW}WARN${RESET}  ${msg}`);
const info  = msg => console.log(`  ${DIM}info  ${msg}${RESET}`);

let totalFail = 0;
let totalWarn = 0;

function checkFile(relPath) {
  const abs = resolve(ROOT, relPath);
  console.log(`\n${YELLOW}== ${relPath} ==${RESET}`);

  let html;
  try {
    html = readFileSync(abs, 'utf8');
  } catch (e) {
    fail(`no se pudo leer: ${e.message}`);
    totalFail++;
    return;
  }

  // Tamaño
  const stat = statSync(abs);
  const lines = html.split('\n').length;
  info(`tamaño: ${(stat.size / 1024).toFixed(1)} KiB · ${lines.toLocaleString()} líneas`);

  // Emojis
  const emojis = [...new Set(html.match(RX_EMOJI) || [])];
  if (emojis.length) {
    fail(`${emojis.length} emoji distinto(s) presente(s): ${emojis.join(' ')}`);
    // Detalla líneas
    html.split('\n').forEach((line, i) => {
      if (RX_EMOJI.test(line)) {
        console.log(`        ${DIM}${(i + 1).toString().padStart(5)}: ${line.trim().slice(0, 120)}${RESET}`);
      }
      RX_EMOJI.lastIndex = 0;
    });
    totalFail++;
  } else {
    ok('sin emojis (constraint estética cumplida)');
  }

  // Parse JS inline
  const scripts = [...html.matchAll(RX_SCRIPT)].map(m => m[1]);
  if (!scripts.length) {
    warn('sin <script>…</script> inline (esperado si es un sub-fichero)');
    totalWarn++;
  } else {
    let bytesParsed = 0;
    let allOk = true;
    scripts.forEach((src, i) => {
      bytesParsed += src.length;
      try {
        // eslint-disable-next-line no-new-func
        new Function(src);
      } catch (e) {
        fail(`script #${i + 1} no parsea: ${e.message}`);
        totalFail++;
        allOk = false;
      }
    });
    if (allOk) ok(`${scripts.length} bloque(s) <script> parsean (${(bytesParsed / 1024).toFixed(1)} KiB de JS)`);
  }

  // Referencias a iconos del sprite SVG (<use href="#i-NAME">) — ignora comentarios HTML
  const codeOnly = html.replace(/<!--[\s\S]*?-->/g, '');
  const useRefs   = [...new Set([...codeOnly.matchAll(/<use\s+href="#i-([a-z0-9_-]+)"/gi)].map(m => m[1]))];
  const symbolIds = [...new Set([...codeOnly.matchAll(/<symbol\s+id="i-([a-z0-9_-]+)"/gi)].map(m => m[1]))];
  if (useRefs.length) {
    const missing = useRefs.filter(r => !symbolIds.includes(r));
    if (missing.length) {
      fail(`<use> hace referencia a iconos no definidos: ${missing.join(', ')}`);
      totalFail++;
    } else {
      ok(`${useRefs.length} icono(s) referenciado(s), todos definidos en el sprite`);
    }
    const unused = symbolIds.filter(s => !useRefs.includes(s));
    if (unused.length) info(`iconos definidos pero no usados: ${unused.join(', ')}`);
  }

  // MILESTONES.id únicos (sólo en Colon2026)
  if (/const\s+MILESTONES\s*=\s*\[/.test(html)) {
    const ids = [...html.matchAll(/\{\s*id:\s*"([a-z0-9-]+)"\s*,\s*date:\s*"\d{4}-\d{2}-\d{2}"/gi)].map(m => m[1]);
    const dupes = ids.filter((v, i, a) => a.indexOf(v) !== i);
    if (dupes.length) { fail(`MILESTONES con id duplicado: ${[...new Set(dupes)].join(', ')}`); totalFail++; }
    else if (ids.length) ok(`MILESTONES con ${ids.length} hito(s), ids únicos`);
  }

  // COLON_RANKS estrictamente creciente
  const rmatch = html.match(/const\s+COLON_RANKS\s*=\s*\[(\s*\{[^]*?\})\s*\];/);
  if (rmatch) {
    try {
      const arr = Function('return [' + rmatch[1] + ']')();
      let prev = -1, ascending = true;
      for (const r of arr) {
        if (r.min <= prev) { ascending = false; break; }
        prev = r.min;
      }
      if (ascending) ok(`COLON_RANKS con ${arr.length} rangos, umbrales crecientes`);
      else { fail('COLON_RANKS no es estrictamente creciente'); totalFail++; }
    } catch (e) {
      warn(`no se pudo parsear COLON_RANKS: ${e.message}`);
      totalWarn++;
    }
  }

  // Auditoría: la rejilla de lentes tiene 100 entradas
  const ln = (html.match(/n:\s*\d+\s*,\s*es:/g) || []).length;
  if (ln > 0) {
    if (ln === 100) ok(`auditoría con 100 lentes (canónico Schell)`);
    else { warn(`auditoría con ${ln} lentes (se esperaban 100)`); totalWarn++; }
  }
}

console.log(`\n${YELLOW}Verificador de calidad — Colón 1492${RESET}`);
files.forEach(checkFile);

console.log('');
if (totalFail === 0 && totalWarn === 0) {
  console.log(`${GREEN}=== Todo correcto ===${RESET}`);
  process.exit(0);
} else {
  console.log(`${totalFail ? RED : YELLOW}=== ${totalFail} fallo(s), ${totalWarn} aviso(s) ===${RESET}`);
  process.exit(totalFail ? 1 : 0);
}
