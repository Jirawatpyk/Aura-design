/* Bundle size gate. Bundles what a project would import (minified, React external), gzips it and compares with
 * the budgets in size-budgets.json. Fails when any entry is over budget; prints a table (and writes it to the
 * GitHub job summary). Run after `npm run build`. Raise a budget on purpose, in the same PR as the growth:
 *   npm run size -w packages/react -- --update   (sets every budget to today's size + 10%, rounded up to 0.5 kB) */
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const esm = path.join(root, 'dist/esm/index.js');
const budgets = JSON.parse(fs.readFileSync(path.join(root, 'size-budgets.json'), 'utf8'));
const gz = (buf) => zlib.gzipSync(buf, { level: 9 }).length;

async function js(code) {
  const r = await build({ stdin: { contents: code, resolveDir: root, loader: 'js' }, bundle: true, minify: true, write: false,
    format: 'esm', target: 'es2019', external: ['react', 'react-dom', 'react/jsx-runtime'], logLevel: 'error' });
  return gz(r.outputFiles[0].contents);
}
const entries = {
  'everything (import *)': () => js(`import * as A from ${JSON.stringify(esm)}; export default A;`),
  'Button only': () => js(`export { Button } from ${JSON.stringify(esm)};`),
  'DataTable only': () => js(`export { DataTable } from ${JSON.stringify(esm)};`),
  'DatePicker only': () => js(`export { DatePicker } from ${JSON.stringify(esm)};`),
  'createTheme only': () => js(`export { createTheme } from ${JSON.stringify(esm)};`),
  'styles.css': async () => gz(fs.readFileSync(path.join(root, 'dist/styles.css'))),
  'aura.css (tokens)': async () => gz(fs.readFileSync(path.join(root, '../tokens/aura.css'))),
  'aura.bundle.js (window.Aura, minified)': async () => {
    const r = await build({ entryPoints: [path.join(root, 'dist/aura.bundle.js')], minify: true, write: false, logLevel: 'error' });
    return gz(r.outputFiles[0].contents);
  },
};

const kb = (n) => (n / 1024).toFixed(1) + ' kB';
const rows = [];
let over = 0;
const sizes = {};
for (const [name, measure] of Object.entries(entries)) sizes[name] = await measure();
if (process.argv.includes('--update')) {
  for (const [name, size] of Object.entries(sizes)) budgets[name] = Math.ceil((size * 1.1) / 512) * 512;
  fs.writeFileSync(path.join(root, 'size-budgets.json'), JSON.stringify(budgets, null, 2) + '\n');
}
for (const [name, size] of Object.entries(sizes)) {
  const budget = budgets[name];
  const ok = budget != null && size <= budget;
  if (!ok) over++;
  rows.push(`| ${name} | ${kb(size)} | ${budget != null ? kb(budget) : 'none'} | ${ok ? 'ok' : budget == null ? 'no budget' : 'OVER'} |`);
}
const table = ['| Import (gzip) | Size | Budget | |', '|---|---|---|---|', ...rows].join('\n');
console.log(table);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '### Bundle size\n\n' + table + '\n');
if (over) { console.error(`\n${over} entr${over > 1 ? 'ies' : 'y'} over budget (packages/react/size-budgets.json).`); process.exit(1); }
