#!/usr/bin/env node
/**
 * tools/lens-diff.mjs — comparativa de puntuaciones del audit entre iteraciones.
 *
 *   node tools/lens-diff.mjs snapshot                   guarda el estado actual del audit en
 *                                                       tools/snapshots/audit-YYYY-MM-DDTHH-MM-SS.json
 *   node tools/lens-diff.mjs diff                       compara los dos snapshots más recientes
 *   node tools/lens-diff.mjs diff <antes> <despues>     compara dos snapshots por nombre
 *   node tools/lens-diff.mjs list                       lista los snapshots guardados
 *
 * El snapshot extrae el array LENSES de LensAudit.html en formato compacto
 * (sólo n, es, score) — suficiente para comparar evolución sin guardar prosa.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');
const SRC       = resolve(ROOT, 'LensAudit.html');
const SNAP_DIR  = resolve(__dirname, 'snapshots');

const RED = '\x1b[31m', GREEN = '\x1b[32m', YELLOW = '\x1b[33m', DIM = '\x1b[2m', RESET = '\x1b[0m', BOLD = '\x1b[1m';

function loadLenses() {
  const html = readFileSync(SRC, 'utf8');
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) throw new Error('No <script> en LensAudit.html');
  const arrMatch = scriptMatch[1].match(/const\s+LENSES\s*=\s*(\[[\s\S]*?\];)/);
  if (!arrMatch)   throw new Error('No se encontró el array LENSES');
  // eslint-disable-next-line no-new-func
  return Function(`return ${arrMatch[1].replace(/;\s*$/, '')}`)();
}

function snapshotName(d = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  return `audit-${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}-${pad(d.getUTCMinutes())}-${pad(d.getUTCSeconds())}.json`;
}

function listSnapshots() {
  if (!existsSync(SNAP_DIR)) return [];
  return readdirSync(SNAP_DIR)
    .filter(f => f.startsWith('audit-') && f.endsWith('.json'))
    .sort();
}

function cmdSnapshot() {
  if (!existsSync(SNAP_DIR)) mkdirSync(SNAP_DIR, { recursive: true });
  const lenses = loadLenses();
  const avg = (lenses.reduce((s, l) => s + l.score, 0) / lenses.length);
  const out = {
    when: new Date().toISOString(),
    source: 'LensAudit.html',
    summary: {
      count: lenses.length,
      average: Number(avg.toFixed(2)),
      strong: lenses.filter(l => l.score >= 80).length,
      weak:   lenses.filter(l => l.score <= 40).length
    },
    lenses: lenses.map(l => ({ n: l.n, es: l.es, score: l.score }))
  };
  const name = snapshotName();
  const path = resolve(SNAP_DIR, name);
  writeFileSync(path, JSON.stringify(out, null, 2), 'utf8');
  console.log(`${GREEN}OK${RESET} snapshot guardado: ${BOLD}${name}${RESET}`);
  console.log(`   ${DIM}${lenses.length} lentes · media ${avg.toFixed(2)} % · ${out.summary.strong} >=80 · ${out.summary.weak} <=40${RESET}`);
}

function cmdList() {
  const snaps = listSnapshots();
  if (!snaps.length) { console.log(`${DIM}(sin snapshots todavía)${RESET}`); return; }
  console.log(`${YELLOW}Snapshots disponibles (${snaps.length}):${RESET}`);
  snaps.forEach(s => {
    const data = JSON.parse(readFileSync(resolve(SNAP_DIR, s), 'utf8'));
    console.log(`  ${s}   ${DIM}media ${data.summary.average} %  ${data.summary.strong}/${data.summary.weak}${RESET}`);
  });
}

function cmdDiff(beforeName, afterName) {
  const snaps = listSnapshots();
  if (snaps.length < 2 && (!beforeName || !afterName)) {
    console.error(`${RED}Necesitas al menos dos snapshots. Tienes: ${snaps.length}${RESET}`);
    process.exit(1);
  }
  beforeName = beforeName || snaps[snaps.length - 2];
  afterName  = afterName  || snaps[snaps.length - 1];
  const before = JSON.parse(readFileSync(resolve(SNAP_DIR, beforeName), 'utf8'));
  const after  = JSON.parse(readFileSync(resolve(SNAP_DIR, afterName),  'utf8'));
  const beforeMap = Object.fromEntries(before.lenses.map(l => [l.n, l]));
  const afterMap  = Object.fromEntries(after.lenses.map(l => [l.n, l]));

  console.log(`\n${YELLOW}== Diff ==${RESET}`);
  console.log(`  ${DIM}antes:    ${beforeName}  (media ${before.summary.average} %)${RESET}`);
  console.log(`  ${DIM}después:  ${afterName}   (media ${after.summary.average} %)${RESET}\n`);

  const allNs = new Set([...Object.keys(beforeMap), ...Object.keys(afterMap)].map(Number));
  const sorted = [...allNs].sort((a, b) => a - b);
  let up = 0, down = 0, same = 0;
  for (const n of sorted) {
    const b = beforeMap[n];
    const a = afterMap[n];
    if (!b) { console.log(`  ${GREEN}+${RESET} #${n.toString().padStart(3)} ${a.es} — nuevo (${a.score})`); up++; continue; }
    if (!a) { console.log(`  ${RED}-${RESET} #${n.toString().padStart(3)} ${b.es} — eliminado`);             down++; continue; }
    const delta = a.score - b.score;
    if (delta > 0) {
      console.log(`  ${GREEN}+${delta.toString().padStart(2)}${RESET} #${n.toString().padStart(3)} ${a.es.padEnd(36)} ${b.score} -> ${BOLD}${a.score}${RESET}`);
      up++;
    } else if (delta < 0) {
      console.log(`  ${RED}${delta.toString().padStart(3)}${RESET} #${n.toString().padStart(3)} ${a.es.padEnd(36)} ${b.score} -> ${BOLD}${a.score}${RESET}`);
      down++;
    } else {
      same++;
    }
  }
  const dAvg = (after.summary.average - before.summary.average).toFixed(2);
  const dStr = (after.summary.strong  - before.summary.strong);
  const dWeak= (after.summary.weak    - before.summary.weak);
  console.log(`\n${YELLOW}== Resumen ==${RESET}`);
  console.log(`  ${GREEN}+${up}${RESET} suben · ${RED}${down}${RESET} bajan · ${DIM}${same} sin cambios${RESET}`);
  console.log(`  media:   ${before.summary.average} % -> ${BOLD}${after.summary.average} %${RESET}  (${dAvg >= 0 ? '+' : ''}${dAvg})`);
  console.log(`  >= 80 %: ${before.summary.strong}      -> ${BOLD}${after.summary.strong}${RESET}      (${dStr  >= 0 ? '+' : ''}${dStr})`);
  console.log(`  <= 40 %: ${before.summary.weak}        -> ${BOLD}${after.summary.weak}${RESET}        (${dWeak >= 0 ? '+' : ''}${dWeak})`);
}

const cmd = process.argv[2] || 'help';
switch (cmd) {
  case 'snapshot': cmdSnapshot(); break;
  case 'list':     cmdList();     break;
  case 'diff':     cmdDiff(process.argv[3], process.argv[4]); break;
  default:
    console.log(`Uso:
  node tools/lens-diff.mjs ${BOLD}snapshot${RESET}                 guardar el estado actual
  node tools/lens-diff.mjs ${BOLD}list${RESET}                     listar snapshots
  node tools/lens-diff.mjs ${BOLD}diff${RESET}                     comparar los 2 últimos
  node tools/lens-diff.mjs ${BOLD}diff${RESET} <antes> <después>   comparar 2 nombrados
`);
}
