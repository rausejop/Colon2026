#!/usr/bin/env node
/**
 * tools/preflight.mjs — verificación previa al commit / release.
 *
 * Encadena tres checks en una sola pasada:
 *   1. check.mjs   — sin emojis, JS parsea, sprite SVG coherente, MILESTONES/COLON_RANKS.
 *   2. lens-diff   — la media del audit no debe regresar respecto al último snapshot.
 *   3. wordcount   — el fichero no debe crecer > +5 % respecto al último preflight.
 *
 * Estado guardado en tools/snapshots/preflight-state.json. Toma un nuevo snapshot
 * del audit automáticamente al final si todo está verde (para que el siguiente
 * preflight tenga base).
 *
 *   node tools/preflight.mjs                # ejecuta y guarda snapshot si verde
 *   node tools/preflight.mjs --no-snapshot  # ejecuta sin actualizar el state
 *
 * Sale con código 0 si todo verde, 1 si hay regresión.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');
const SNAP_DIR  = resolve(__dirname, 'snapshots');
const STATE     = resolve(SNAP_DIR, 'preflight-state.json');

const RED = '\x1b[31m', GREEN = '\x1b[32m', YELLOW = '\x1b[33m', DIM = '\x1b[2m', BOLD = '\x1b[1m', RESET = '\x1b[0m';
const noSnapshot = process.argv.includes('--no-snapshot');

let errors = 0, warnings = 0;
const ok    = msg => console.log(`  ${GREEN}OK${RESET}    ${msg}`);
const fail  = msg => { console.log(`  ${RED}FAIL${RESET}  ${msg}`); errors++; };
const warn  = msg => { console.log(`  ${YELLOW}WARN${RESET}  ${msg}`); warnings++; };
const info  = msg => console.log(`  ${DIM}info  ${msg}${RESET}`);

console.log(`\n${BOLD}== PREFLIGHT ==${RESET}  ${DIM}${new Date().toISOString()}${RESET}\n`);

// 1. Lectura de los ficheros principales
function readSafe(p){ try { return readFileSync(resolve(ROOT, p), 'utf8'); } catch(e){ fail(`no se puede leer ${p}: ${e.message}`); return null; } }
const game  = readSafe('Colon2026.html');
const audit = readSafe('LensAudit.html');
if (!game || !audit){ console.log(`\n${RED}=== ROTO: falta algún fichero ===${RESET}`); process.exit(1); }

// 2. Emojis
const RX_EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F900}-\u{1F9FF}]/gu;
function checkEmojis(name, html){
  const e = [...new Set(html.match(RX_EMOJI) || [])];
  if (e.length) fail(`${name} contiene ${e.length} emoji distinto(s): ${e.join(' ')}`);
  else         ok(`${name} sin emojis`);
}
console.log(`${BOLD}1) Emojis${RESET}`);
checkEmojis('Colon2026.html', game);
checkEmojis('LensAudit.html', audit);

// 3. JS parse
console.log(`\n${BOLD}2) Parse JavaScript${RESET}`);
function checkParse(name, html){
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  let bytes = 0;
  for (const s of scripts){
    bytes += s.length;
    try { new Function(s); }
    catch (e){ fail(`${name}: JS no parsea — ${e.message}`); return; }
  }
  ok(`${name}: ${scripts.length} bloque(s) <script> parsean (${(bytes/1024).toFixed(1)} KiB)`);
}
checkParse('Colon2026.html', game);
checkParse('LensAudit.html', audit);

// 4. Sprite SVG coherente (sólo en juego)
console.log(`\n${BOLD}3) Sprite SVG${RESET}`);
const codeOnly = game.replace(/<!--[\s\S]*?-->/g, '');
const useRefs   = [...new Set([...codeOnly.matchAll(/<use\s+href="#i-([a-z0-9_-]+)"/gi)].map(m => m[1]))];
const symbolIds = [...new Set([...codeOnly.matchAll(/<symbol\s+id="i-([a-z0-9_-]+)"/gi)].map(m => m[1]))];
const missing = useRefs.filter(r => !symbolIds.includes(r));
const unused  = symbolIds.filter(s => !useRefs.includes(s));
if (missing.length) fail(`iconos referenciados pero no definidos: ${missing.join(', ')}`);
else                ok(`${useRefs.length} icono(s) referenciado(s), todos en el sprite`);
if (unused.length) info(`${unused.length} icono(s) huérfanos (limpia con tools/clean-sprite.mjs --apply): ${unused.join(', ')}`);

// 5. MILESTONES / COLON_RANKS
console.log(`\n${BOLD}4) Datos canónicos${RESET}`);
{
  const ids = [...game.matchAll(/\{\s*id:\s*"([a-z0-9-]+)"\s*,\s*date:\s*"\d{4}-\d{2}-\d{2}"/gi)].map(m => m[1]);
  const dupes = ids.filter((v, i, a) => a.indexOf(v) !== i);
  if (dupes.length) fail(`MILESTONES con id duplicado: ${[...new Set(dupes)].join(', ')}`);
  else if (ids.length) ok(`MILESTONES con ${ids.length} hito(s), ids únicos`);
}
{
  const arrM = game.match(/const\s+COLON_RANKS\s*=\s*\[(\s*\{[^]*?\})\s*\];/);
  if (arrM){
    try {
      const arr = Function('return [' + arrM[1] + ']')();
      let prev = -Infinity, asc = true;
      for (const r of arr){ if (r.min <= prev){ asc = false; break; } prev = r.min; }
      asc ? ok(`COLON_RANKS con ${arr.length} rangos crecientes`)
          : fail('COLON_RANKS no estrictamente creciente');
    } catch(e){ warn(`no se pudo parsear COLON_RANKS: ${e.message}`); }
  }
}
{
  const ln = (audit.match(/n:\s*\d+\s*,\s*es:/g) || []).length;
  if (ln === 100) ok('LensAudit con 100 lentes (canónico Schell)');
  else if (ln > 0) warn(`LensAudit con ${ln} lentes (se esperaban 100)`);
}

// 6. Regresión del audit
console.log(`\n${BOLD}5) Regresión del audit${RESET}`);
function extractLenses(html){
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) return null;
  const arr = scriptMatch[1].match(/const\s+LENSES\s*=\s*(\[[\s\S]*?\];)/);
  if (!arr) return null;
  try { return Function(`return ${arr[1].replace(/;\s*$/, '')}`)(); }
  catch(e){ return null; }
}
const lenses = extractLenses(audit);
let currentAvg = null;
if (lenses){
  currentAvg = lenses.reduce((s,l)=>s+l.score,0) / lenses.length;
  info(`media actual del audit: ${currentAvg.toFixed(2)} % · ${lenses.filter(l=>l.score>=80).length} >=80% · ${lenses.filter(l=>l.score<=40).length} <=40%`);
} else {
  warn('no se pudo extraer el array LENSES del audit');
}

let prevState = null;
if (existsSync(STATE)){
  try { prevState = JSON.parse(readFileSync(STATE, 'utf8')); } catch(e){ warn(`state previo ilegible: ${e.message}`); }
}
if (prevState && currentAvg != null){
  const delta = currentAvg - prevState.avg;
  if (delta < -0.01){
    fail(`regresión del audit: ${prevState.avg.toFixed(2)} % -> ${currentAvg.toFixed(2)} % (${delta.toFixed(2)})`);
  } else if (delta > 0){
    ok(`audit mejora: ${prevState.avg.toFixed(2)} % -> ${BOLD}${currentAvg.toFixed(2)} %${RESET}${GREEN} (+${delta.toFixed(2)})`);
  } else {
    info(`audit estable en ${currentAvg.toFixed(2)} %`);
  }
} else if (currentAvg != null){
  info(`primer preflight: no hay estado previo`);
}

// 7. Tamaño del fichero
console.log(`\n${BOLD}6) Tamaño${RESET}`);
const sizeGame = statSync(resolve(ROOT, 'Colon2026.html')).size;
info(`Colon2026.html: ${(sizeGame/1024).toFixed(1)} KiB`);
if (prevState && prevState.sizeGame){
  const pct = (sizeGame / prevState.sizeGame - 1) * 100;
  if (pct > 5) warn(`crecimiento > 5%: ${prevState.sizeGame} -> ${sizeGame} bytes (+${pct.toFixed(1)}%)`);
  else        info(`crecimiento: ${(pct>=0?'+':'')}${pct.toFixed(1)}%`);
}

// 8. Guardar estado si está verde
console.log('');
if (errors === 0){
  console.log(`${GREEN}=== TODO VERDE — ${warnings} aviso(s) ===${RESET}`);
  if (!noSnapshot && currentAvg != null){
    if (!existsSync(SNAP_DIR)) mkdirSync(SNAP_DIR, { recursive:true });
    const state = { when: new Date().toISOString(), avg: currentAvg, sizeGame };
    writeFileSync(STATE, JSON.stringify(state, null, 2), 'utf8');
    console.log(`${DIM}snapshot del estado guardado en tools/snapshots/preflight-state.json${RESET}`);
  }
  process.exit(0);
} else {
  console.log(`${RED}=== ROJO: ${errors} fallo(s), ${warnings} aviso(s) ===${RESET}`);
  process.exit(1);
}
