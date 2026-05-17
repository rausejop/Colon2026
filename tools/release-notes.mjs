#!/usr/bin/env node
/**
 * tools/release-notes.mjs — genera CHANGELOG.md desde los snapshots del audit.
 *
 * Compara los dos snapshots más recientes (o dos dados por nombre) y produce
 * un Markdown listo para README, release notes o un PR. Estilo: histórico
 * en español, sin emojis.
 *
 *   node tools/release-notes.mjs                # último vs anterior, escribe CHANGELOG.md
 *   node tools/release-notes.mjs --stdout       # imprime por stdout
 *   node tools/release-notes.mjs <antes> <despues>
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');
const SNAP_DIR  = resolve(__dirname, 'snapshots');

const RED = '\x1b[31m', GREEN = '\x1b[32m', DIM = '\x1b[2m', RESET = '\x1b[0m';

const args = process.argv.slice(2);
const stdoutOnly = args.includes('--stdout');
const namedArgs  = args.filter(a => !a.startsWith('--'));

if (!existsSync(SNAP_DIR)){
  console.error(`${RED}No hay snapshots en ${SNAP_DIR}. Ejecuta primero tools/lens-diff.mjs snapshot.${RESET}`);
  process.exit(1);
}
const snaps = readdirSync(SNAP_DIR).filter(f => f.startsWith('audit-') && f.endsWith('.json')).sort();
if (snaps.length < 2 && namedArgs.length < 2){
  console.error(`${RED}Hace falta al menos dos snapshots. Hay ${snaps.length}.${RESET}`);
  process.exit(1);
}
const beforeName = namedArgs[0] || snaps[snaps.length - 2];
const afterName  = namedArgs[1] || snaps[snaps.length - 1];
const before = JSON.parse(readFileSync(resolve(SNAP_DIR, beforeName), 'utf8'));
const after  = JSON.parse(readFileSync(resolve(SNAP_DIR, afterName),  'utf8'));

const beforeMap = Object.fromEntries(before.lenses.map(l => [l.n, l]));
const afterMap  = Object.fromEntries(after.lenses.map(l => [l.n, l]));

const ups = [], downs = [], news = [];
for (const a of after.lenses){
  const b = beforeMap[a.n];
  if (!b){ news.push(a); continue; }
  if (a.score > b.score) ups.push({ ...a, prev: b.score, delta: a.score - b.score });
  else if (a.score < b.score) downs.push({ ...a, prev: b.score, delta: a.score - b.score });
}
ups.sort((a,b) => b.delta - a.delta);
downs.sort((a,b) => a.delta - b.delta);

function fmtDate(s){
  const d = new Date(s);
  return d.toISOString().slice(0, 10);
}

const lines = [];
lines.push(`# CHANGELOG — Colón 1492 · iteración del audit`);
lines.push('');
lines.push(`> Generado automáticamente por \`tools/release-notes.mjs\`. Compara el audit de **${fmtDate(before.when)}** con el de **${fmtDate(after.when)}**.`);
lines.push('');
lines.push(`## Resumen`);
lines.push('');
const dAvg  = (after.summary.average - before.summary.average).toFixed(2);
const dStr  = after.summary.strong  - before.summary.strong;
const dWeak = after.summary.weak    - before.summary.weak;
lines.push(`| | Antes | Después | Δ |`);
lines.push(`|---|---:|---:|---:|`);
lines.push(`| Puntuación media | ${before.summary.average.toFixed(2)} % | **${after.summary.average.toFixed(2)} %** | ${dAvg >= 0 ? '+' : ''}${dAvg} |`);
lines.push(`| Lentes ≥ 80 % | ${before.summary.strong} | **${after.summary.strong}** | ${dStr >= 0 ? '+' : ''}${dStr} |`);
lines.push(`| Lentes ≤ 40 % | ${before.summary.weak}  | **${after.summary.weak}**  | ${dWeak >= 0 ? '+' : ''}${dWeak} |`);
lines.push('');

if (ups.length){
  lines.push(`## Lentes que mejoran`);
  lines.push('');
  for (const u of ups){
    lines.push(`- **#${u.n} · ${u.es}** — \`${u.prev} → ${u.score}\` (${u.delta > 0 ? '+' : ''}${u.delta})`);
  }
  lines.push('');
}

if (downs.length){
  lines.push(`## Lentes que retroceden`);
  lines.push('');
  for (const d of downs){
    lines.push(`- **#${d.n} · ${d.es}** — \`${d.prev} → ${d.score}\` (${d.delta})`);
  }
  lines.push('');
} else if (ups.length){
  lines.push(`*Sin regresiones.*`);
  lines.push('');
}

if (news.length){
  lines.push(`## Lentes añadidas`);
  for (const n of news) lines.push(`- **#${n.n} · ${n.es}** — ${n.score}`);
  lines.push('');
}

lines.push(`---`);
lines.push(`*Diferencia automática de las puntuaciones del array \`LENSES\` en \`LensAudit.html\`. Las prosas (descripción, cumplimiento, mejoras) no se comparan — para inspección manual abrir el HTML de auditoría.*`);

const out = lines.join('\n');

if (stdoutOnly){
  process.stdout.write(out);
} else {
  const path = resolve(ROOT, 'CHANGELOG.md');
  writeFileSync(path, out, 'utf8');
  console.log(`${GREEN}OK${RESET} CHANGELOG.md escrito (${(out.length/1024).toFixed(1)} KiB)`);
  console.log(`${DIM}comparando ${beforeName}  →  ${afterName}${RESET}`);
  console.log(`${DIM}+${ups.length} suben · ${downs.length} bajan · media ${before.summary.average.toFixed(2)} → ${after.summary.average.toFixed(2)} (${dAvg >= 0 ? '+' : ''}${dAvg})${RESET}`);
}
