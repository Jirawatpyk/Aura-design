#!/usr/bin/env node
/* aura-theme — write a project theme CSS file from a brand colour.
 *   npx aura-theme --brand "#0ea5e9" [--signal "#facc15"] [--primary brand] [--name acme] [--selector .tenant-acme] [--out src/aura-theme.css]
 * Prints every contrast check; exits 1 if any fails. */
import fs from 'node:fs';
import { createTheme } from '../dist/esm/theme.js';

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith('--')) { const k = a.slice(2); const v = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : true; args[k] = v; }
}
if (!args.brand || args.help) {
  console.log('Usage: aura-theme --brand "#0ea5e9" [--signal "#facc15"] [--primary ink|brand] [--name acme] [--selector .tenant] [--out theme.css]');
  process.exit(args.help ? 0 : 1);
}
const t = createTheme({ brand: args.brand, signal: args.signal, primary: args.primary, name: args.name });
const css = t.css(args.selector);
if (args.out) fs.writeFileSync(args.out, css); else process.stdout.write(css);
const log = args.out ? console.log : console.error;
log(`\nContrast checks (${t.checks.filter((c) => c.pass).length}/${t.checks.length} pass):`);
for (const c of t.checks) log(`  ${c.pass ? 'ok  ' : 'FAIL'} ${c.theme.padEnd(5)} ${c.pair.padEnd(44)} ${c.ratio.toFixed(2)} (≥ ${c.target})`);
if (args.out) log(`\nWrote ${args.out}. Import it after aura.css.`);
process.exit(t.ok ? 0 : 1);
