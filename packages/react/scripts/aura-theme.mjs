#!/usr/bin/env node
/* aura-theme — write a project theme CSS file from a brand colour.
 *   npx aura-theme --brand "#0ea5e9" [--signal "#facc15"] [--primary brand] [--name acme] [--selector .tenant-acme] [--out src/aura-theme.css]
 * Prints every contrast check; exits 1 if any fails. */
import fs from 'node:fs';
import { createTheme } from '../dist/esm/theme.js';

const USAGE = 'Usage: aura-theme --brand "#0ea5e9" [--signal "#facc15"] [--primary ink|brand] [--name acme] [--selector .tenant] [--out theme.css]';
const KNOWN = ['brand', 'signal', 'primary', 'name', 'selector', 'out', 'help'];
function fail(msg) {
  console.error('aura-theme: ' + msg + '\n' + USAGE);
  process.exit(2);
}
/* --key value and --key=value (5.2); a value-taking option with no value is an error, not `true`. */
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) fail('unexpected "' + a + '"');
  const eq = a.indexOf('=');
  const k = eq > 0 ? a.slice(2, eq) : a.slice(2);
  if (KNOWN.indexOf(k) < 0) fail('unknown option --' + k);
  if (k === 'help') { args.help = true; continue; }
  const v = eq > 0 ? a.slice(eq + 1) : process.argv[i + 1] !== undefined && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : undefined;
  if (v === undefined || v === '') fail('--' + k + ' needs a value');
  args[k] = v;
}
if (args.help) {
  console.log(USAGE);
  process.exit(0);
}
if (!args.brand) fail('--brand is required');
for (const k of ['brand', 'signal']) {
  if (args[k] !== undefined && /^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(args[k])) args[k] = '#' + args[k]; /* a shell ate the # */
  if (args[k] !== undefined && !/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(args[k])) fail('--' + k + ' must be a #rgb or #rrggbb colour (got "' + args[k] + '"; quote it in the shell: --' + k + ' "#0ea5e9")');
}
if (args.primary !== undefined && args.primary !== 'ink' && args.primary !== 'brand') fail('--primary is ink or brand');
let t, css;
try {
  t = createTheme({ brand: args.brand, signal: args.signal, primary: args.primary, name: args.name });
  css = t.css(args.selector);
} catch (e) {
  fail(e.message);
}
if (args.out) fs.writeFileSync(args.out, css); else process.stdout.write(css);
const log = args.out ? console.log : console.error;
log(`\nContrast checks (${t.checks.filter((c) => c.pass).length}/${t.checks.length} pass):`);
for (const c of t.checks) log(`  ${c.pass ? 'ok  ' : 'FAIL'} ${c.theme.padEnd(5)} ${c.pair.padEnd(44)} ${c.ratio.toFixed(2)} (≥ ${c.target})`);
if (args.out) log(`\nWrote ${args.out}. Import it after aura.css.`);
process.exit(t.ok ? 0 : 1);
