#!/usr/bin/env node
/* Runs eslint-plugin-aura under ESLint 9 (flat config, the plugin's documented setup) on a fixture: every "bad" line
 * must be flagged and no "good" line. Also lint-tokens.js on the same fixture as CSS and JS.
 * Usage: node scripts/eslint-check.mjs   (installs eslint@9 into a temp folder) */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-eslint-'));
fs.writeFileSync(path.join(dir, 'package.json'), '{"private":true,"type":"module"}');
execFileSync('npm', ['install', '--no-audit', '--no-fund', '--silent', 'eslint@9'], { cwd: dir, stdio: 'pipe' });
fs.writeFileSync(
  path.join(dir, 'eslint.config.js'),
  `import aura from ${JSON.stringify(path.join(root, 'eslint-plugin-aura.js'))};
export default [{ files: ['**/*.jsx'], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } }, aura.configs.recommended];`,
);
const BAD = [
  "'#fff'",
  "'#18181b80'",
  "'rgb(1, 2, 3)'",
  "'rgb(.5 .5 .5)'",
  "'oklch(0.7 0.1 200)'",
  "'color-mix(in srgb, #000, #fff)'",
  '`rgb(${r}, 0, 0)`',
  "'p-4 bg-red-500'",
  "'text-white'",
  "'border-slate-200/50'",
  "'bg-[#18181b]'",
  "'color: white'",
  "'background:black'",
];
const GOOD = [
  "'bg-bg-surface text-fg-primary'",
  "'bg-aura-lime-200'",
  "'white-space: nowrap'",
  "'The red team'",
  "'var(--aura-fg-primary)'",
  "'Go to #add-user'",
  "'bg-[var(--aura-accent)]'",
  "'background: var(--aura-accent-violet);'",
  "'color-mix(in srgb, var(--aura-accent) 20%, transparent)'",
  "'rgb(var(--brand-rgb) / .5)'",
  "'Color: Red'",
  "'inherit'",
  "'currentColor'",
];
const lines = ['const r = 1;'];
BAD.forEach((b, i) => lines.push(`export const b${i} = ${b};`));
GOOD.forEach((g, i) => lines.push(`export const g${i} = ${g};`));
lines.push('export const S = () => <div style={{ color: \'white\' }} className="text-black" />;');
lines.push('export const L = () => <a href="#add" id="fff">x<a href={\'#fed\'} /><a href={r ? \'#abc\' : \'#bad\'} /><a href={`#fff`} /></a>;');
fs.writeFileSync(path.join(dir, 't.jsx'), lines.join('\n') + '\n');
const r = spawnSync(path.join(dir, 'node_modules', '.bin', 'eslint'), ['--format', 'json', 't.jsx'], {
  cwd: dir,
  encoding: 'utf8',
});
const fails = [];
let report;
try {
  report = JSON.parse(r.stdout);
} catch (e) {
  fails.push('ESLint did not run with the recommended flat config: ' + (r.stderr || r.stdout).slice(0, 400));
}
if (report) {
  const hit = new Set(report[0].messages.map((m) => m.line));
  BAD.forEach((b, i) => {
    if (!hit.has(i + 2)) fails.push('not flagged: ' + b);
  });
  GOOD.forEach((g, i) => {
    if (hit.has(BAD.length + i + 2)) fails.push('flagged but fine: ' + g);
  });
  const s = BAD.length + GOOD.length + 2;
  if (report[0].messages.filter((m) => m.line === s).length !== 2)
    fails.push("JSX style={{ color: 'white' }} and text-black: expected 2 reports");
  if (hit.has(s + 1)) fails.push('an href / id anchor was flagged as a colour');
}
/* lint-tokens.js on CSS and an .mjs file */
fs.mkdirSync(path.join(dir, 'lt'));
fs.writeFileSync(
  path.join(dir, 'lt', 'a.css'),
  '.a { color: white; }\n.b { white-space: nowrap; }\n.c { border-color: oklch(0.5 0.1 20); }\n.d { color: var(--aura-white); background: url(white.png); fill: color-mix(in srgb, var(--aura-accent) 20%, transparent); }\n',
);
fs.writeFileSync(path.join(dir, 'lt', 'b.mjs'), "export const a = 'bg-red-500', h = '#add-user';\n");
const lt = spawnSync(process.execPath, [path.join(root, 'scripts', 'lint-tokens.js'), path.join(dir, 'lt')], {
  encoding: 'utf8',
});
const out = lt.stderr + lt.stdout;
for (const want of ['a.css:1', 'a.css:3', 'b.mjs:1']) if (!out.includes(want)) fails.push('lint-tokens missed ' + want);
if (out.includes('a.css:2')) fails.push('lint-tokens flagged white-space');
if (out.includes('a.css:4')) fails.push('lint-tokens flagged var() / url() / a token colour-mix');
if (/#add/.test(out)) fails.push('lint-tokens flagged #add-user');
fs.rmSync(dir, { recursive: true, force: true });
if (fails.length) {
  console.error('ESLint plugin FAIL:\n  ' + fails.join('\n  '));
  process.exit(1);
}
console.log(
  `ESLint plugin OK — ESLint 9 flat config; ${BAD.length} hard-coded colours flagged, ${GOOD.length} token uses and anchors left alone; lint-tokens agrees on CSS and .mjs.`,
);
