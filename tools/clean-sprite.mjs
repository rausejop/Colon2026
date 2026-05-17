#!/usr/bin/env node
/**
 * tools/clean-sprite.mjs — limpia iconos SVG huérfanos en Colon2026.html
 *
 * Busca todos los `<symbol id="i-X">…</symbol>` del sprite y compara con las
 * referencias `<use href="#i-X"/>` que aparecen en el resto del fichero (HTML
 * + JavaScript inline, ignorando comentarios). Los `<symbol>` no referenciados
 * son eliminados.
 *
 * Por defecto opera en modo `--dry-run`: muestra qué se eliminaría sin tocar
 * el fichero. Para aplicar los cambios:
 *
 *   node tools/clean-sprite.mjs --apply
 *
 * Salida: nº de símbolos eliminados y ahorro en bytes. Hace una copia de
 * seguridad `Colon2026.html.bak` antes de escribir si se aplica.
 */
import { readFileSync, writeFileSync, statSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');
const TARGET    = resolve(ROOT, 'Colon2026.html');
const APPLY     = process.argv.includes('--apply');

const RED   = '\x1b[31m', GREEN = '\x1b[32m', YELLOW = '\x1b[33m', DIM = '\x1b[2m', RESET = '\x1b[0m';

console.log(`\n${YELLOW}== clean-sprite ==${RESET}  ${APPLY ? GREEN+'modo APPLY' : DIM+'modo dry-run'}${RESET}  (${TARGET})`);

const html = readFileSync(TARGET, 'utf8');
const sizeBefore = statSync(TARGET).size;

// 1. Encontrar todos los <symbol id="i-X">
//    Usamos regex multilínea con lazy match; los símbolos son single-line en este proyecto.
const symRx = /<symbol\s+id="i-([a-z0-9_-]+)"[^>]*>[\s\S]*?<\/symbol>\s*\n?/gi;
const symbols = [];
let m;
while ((m = symRx.exec(html)) !== null){
  symbols.push({ id: m[1], full: m[0], idx: m.index });
}
console.log(`  ${DIM}símbolos detectados: ${symbols.length}${RESET}`);

// 2. Encontrar usos de <use href="#i-X"/> (ignorando comentarios HTML)
const codeOnly = html.replace(/<!--[\s\S]*?-->/g, '');
const usedSet  = new Set([...codeOnly.matchAll(/<use\s+href="#i-([a-z0-9_-]+)"/gi)].map(x => x[1]));
console.log(`  ${DIM}iconos referenciados:    ${usedSet.size}${RESET}`);

// 3. Determinar huérfanos (NO referenciados)
const orphans = symbols.filter(s => !usedSet.has(s.id));
if (!orphans.length){
  console.log(`  ${GREEN}OK${RESET} no hay iconos huérfanos`);
  process.exit(0);
}

let removedBytes = 0;
orphans.forEach(o => { removedBytes += o.full.length; });
console.log(`  ${YELLOW}huérfanos: ${orphans.length} (${removedBytes} bytes, ${(removedBytes/1024).toFixed(1)} KiB)${RESET}`);
orphans.forEach(o => console.log(`     - i-${o.id}`));

if (!APPLY){
  console.log(`\n  ${DIM}--dry-run: no se ha modificado el fichero. Re-ejecuta con --apply para limpiar.${RESET}`);
  process.exit(0);
}

// 4. Eliminar (sustituye cada símbolo huérfano por cadena vacía)
let cleaned = html;
// Importante: reemplazar el bloque exacto (todo el match incluyendo el salto de línea posterior).
// Reemplazamos en orden inverso de índice para que los offsets posteriores no cambien.
orphans.sort((a,b) => b.idx - a.idx).forEach(o => {
  cleaned = cleaned.slice(0, o.idx) + cleaned.slice(o.idx + o.full.length);
});

// 5. Verificación: el JS inline aún parsea
const scriptMatch = cleaned.match(/<script>([\s\S]*)<\/script>/);
if (scriptMatch){
  try { new Function(scriptMatch[1]); }
  catch (e){
    console.error(`\n  ${RED}ERROR${RESET} el JS no parsea tras la limpieza: ${e.message}`);
    console.error(`  El fichero NO se ha modificado.`);
    process.exit(1);
  }
}

// 6. Backup y escritura
copyFileSync(TARGET, TARGET + '.bak');
writeFileSync(TARGET, cleaned, 'utf8');
const sizeAfter = statSync(TARGET).size;
console.log(`\n  ${GREEN}OK${RESET} eliminados ${orphans.length} símbolos. Tamaño ${(sizeBefore/1024).toFixed(1)} KiB -> ${(sizeAfter/1024).toFixed(1)} KiB (-${((sizeBefore-sizeAfter)/1024).toFixed(2)} KiB)`);
console.log(`  ${DIM}backup en ${TARGET}.bak${RESET}`);
