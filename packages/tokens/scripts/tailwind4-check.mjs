#!/usr/bin/env node
/* Compiles aura-tailwind.css with Tailwind v4 and checks that every class the README promises is generated,
 * points at an --aura-* variable, and that dark: follows .dark / data-theme="dark".
 * Usage: node scripts/tailwind4-check.mjs   (installs tailwindcss@4 + @tailwindcss/cli@4 into a temp folder) */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-tw4-'));
const CLASSES = {
  'bg-bg-surface': 'var(--aura-bg-surface)',
  'text-fg-primary': 'var(--aura-fg-primary)',
  'border-border-strong': 'var(--aura-border-strong)',
  'text-fg-danger': 'var(--aura-fg-danger)',
  'bg-alert-warning-bg': 'var(--aura-alert-warning-bg)',
  'bg-status-ready-bg': 'var(--aura-status-ready-bg)',
  'fill-chart-1': 'var(--aura-chart-1)',
  'bg-chart-seq-5': 'var(--aura-chart-seq-5)',
  'stroke-chart-grid': 'var(--aura-chart-grid)',
  'bg-aura-violet-500': 'var(--aura-violet-500)',
  'p-aura-6': 'var(--aura-space-6)',
  'gap-aura-4': 'var(--aura-space-4)',
  'rounded-aura-xl': 'var(--aura-radius-xl)',
  'shadow-aura-overlay': 'var(--aura-shadow-overlay)',
  'ease-aura-ease': 'var(--aura-ease)',
  'duration-aura-fast': 'var(--aura-duration-fast)',
  'z-aura-dialog': 'var(--aura-z-dialog)',
  'font-display': 'var(--font-display)',
  'font-sans': 'var(--font-sans)',
  'font-mono': 'var(--font-mono)',
};
fs.writeFileSync(path.join(dir, 'package.json'), '{"private":true}');
execFileSync('npm', ['install', '--no-audit', '--no-fund', '--silent', 'tailwindcss@4', '@tailwindcss/cli@4'], { cwd: dir, stdio: 'pipe' });
fs.mkdirSync(path.join(dir, 'node_modules', '@jirawatpyk'), { recursive: true });
fs.symlinkSync(root, path.join(dir, 'node_modules', '@jirawatpyk', 'aura-tokens'), 'dir');
fs.writeFileSync(path.join(dir, 'in.css'), '@import "tailwindcss";\n@import "@jirawatpyk/aura-tokens/tailwind.css";\n');
fs.writeFileSync(path.join(dir, 'index.html'), `<div class="${Object.keys(CLASSES).join(' ')} dark:bg-bg-canvas"></div>`);
execFileSync(path.join(dir, 'node_modules', '.bin', 'tailwindcss'), ['-i', 'in.css', '-o', 'out.css'], { cwd: dir, stdio: 'pipe' });
const css = fs.readFileSync(path.join(dir, 'out.css'), 'utf8');
const fails = [];

/* ---------- 4.17: next to an existing (shadcn) theme ----------
 * The same shadcn-style page compiled alone and with AURA's coexistence setup (aura.css in an early layer, the
 * prefixed theme, the layered components) must compute the same styles; a utility must beat a layered AURA style,
 * and must lose to the unlayered one (the control that shows the layer is what makes the difference). */
fs.mkdirSync(path.join(dir, 'node_modules', '@jirawatpyk', 'aura-react'), { recursive: true });
fs.symlinkSync(path.join(root, '..', 'react', 'dist'), path.join(dir, 'node_modules', '@jirawatpyk', 'aura-react', 'dist'), 'dir');
fs.writeFileSync(path.join(dir, 'node_modules', '@jirawatpyk', 'aura-react', 'package.json'), JSON.stringify({ name: '@jirawatpyk/aura-react', exports: { './styles.layer.css': './dist/styles.layer.css', './styles.css': './dist/styles.css' } }));
const SHADCN = `@custom-variant dark (&:is(.dark *));
@theme inline { --color-background: #ffffff; --color-foreground: #0a0a0a; --color-border: #e4e4e7; --color-chart-1: #e76e50; --color-chart-2: #2a9d90; --color-chart-3: #274754; --color-chart-4: #e8c468; --color-chart-5: #f4a462; --font-sans: "Geist", ui-sans-serif, sans-serif; --font-mono: "Geist Mono", monospace; --radius-lg: 10px; }`;
const HTML = `<body class="bg-background text-foreground"><div id="s1" class="border border-border bg-chart-1 font-sans rounded-lg p-4">shadcn card</div>
<code id="s2" class="font-mono text-chart-3">code</code><div class="dark"><p id="s3" class="text-chart-2 dark:text-chart-5 bg-chart-4">dark text</p></div>
<button id="a1" class="aura-btn aura-btn--primary rounded-none">AURA</button><span id="a2" class="bg-aura-bg-surface text-aura-fg-primary font-aura-sans border border-aura-border-strong">prefixed</span></body>`;
const pages = {
  alone: `@import "tailwindcss";\n${SHADCN}`,
  both: `@layer aura-tokens, theme, base, aura, components, utilities;\n@import "tailwindcss";\n@import "@jirawatpyk/aura-tokens/aura.css" layer(aura-tokens);\n@import "@jirawatpyk/aura-tokens/tailwind.prefixed.css";\n@import "@jirawatpyk/aura-react/styles.layer.css";\n${SHADCN}`,
  /* AURA added after the app's existing theme, the likelier order in a real migration. */
  after: `@layer aura-tokens, theme, base, aura, components, utilities;\n@import "tailwindcss";\n${SHADCN}\n@import "@jirawatpyk/aura-tokens/aura.css" layer(aura-tokens);\n@import "@jirawatpyk/aura-tokens/tailwind.prefixed.css";\n@import "@jirawatpyk/aura-react/styles.layer.css";`,
  unlayered: `@import "tailwindcss";\n@import "@jirawatpyk/aura-tokens/aura.css";\n@import "@jirawatpyk/aura-tokens/tailwind.prefixed.css";\n@import "@jirawatpyk/aura-react/styles.css";\n${SHADCN}`,
};
fs.writeFileSync(path.join(dir, 'page.html'), HTML);
const compiled = {};
for (const [name, input] of Object.entries(pages)) {
  fs.writeFileSync(path.join(dir, name + '.in.css'), input);
  execFileSync(path.join(dir, 'node_modules', '.bin', 'tailwindcss'), ['-i', name + '.in.css', '-o', name + '.css', '--cwd', dir], { cwd: dir, stdio: 'pipe' });
  compiled[name] = fs.readFileSync(path.join(dir, name + '.css'), 'utf8');
}
const prefixed = fs.readFileSync(path.join(root, 'aura-tailwind.prefixed.css'), 'utf8');
if (/@custom-variant|@import/.test(prefixed.replace(/\/\*[\s\S]*?\*\//g, ''))) fails.push('tailwind.prefixed.css: must have no @custom-variant or @import');
const { chromium } = await import('playwright');
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const PROPS = ['color', 'background-color', 'border-top-color', 'border-top-width', 'font-family', 'padding-top', 'border-top-left-radius'];
async function styles(name) {
  const p = await browser.newPage();
  await p.setContent(`<!doctype html><html><head><style>${compiled[name]}</style></head>${HTML}</html>`);
  const out = await p.evaluate((props) => {
    const pick = (sel) => { const cs = getComputedStyle(document.querySelector(sel)); return Object.fromEntries(props.map((k) => [k, cs.getPropertyValue(k)])); };
    return { body: pick('body'), s1: pick('#s1'), s2: pick('#s2'), s3: pick('#s3'), a1: pick('#a1'), a2: pick('#a2') };
  }, PROPS);
  await p.close();
  return out;
}
const alone = await styles('alone'), both = await styles('both'), after = await styles('after'), unlayered = await styles('unlayered');
for (const [order, got] of [['AURA first', both], ['AURA after the app theme', after]])
  for (const el of ['body', 's1', 's2', 's3']) for (const k of PROPS)
    if (alone[el][k] !== got[el][k]) fails.push(`next to shadcn (${order}): #${el} ${k} changed: "${alone[el][k]}" → "${got[el][k]}"`);
if (both.a1['border-top-left-radius'] !== '0px') fails.push(`@layer aura: rounded-none should override .aura-btn (got ${both.a1['border-top-left-radius']})`);
if (unlayered.a1['border-top-left-radius'] === '0px') fails.push('control: unlayered styles.css should beat the utility — the layer check is not testing anything');
if (!/Inter/.test(both.a2['font-family'])) fails.push('font-aura-sans should be the Inter stack, got ' + both.a2['font-family']);
if (both.a2['background-color'] !== 'rgb(255, 255, 255)') fails.push('bg-aura-bg-surface should resolve to the AURA surface, got ' + both.a2['background-color']);
await browser.close();

for (const [cls, value] of Object.entries(CLASSES)) {
  const m = new RegExp('\\.' + cls.replace(/[-]/g, '\\-') + '\\s*\\{([^}]*)\\}').exec(css);
  if (!m) fails.push(`${cls}: not generated`);
  else if (!m[1].includes(value)) fails.push(`${cls}: expected ${value}, got ${m[1].trim()}`);
}
if (!/\.dark\\:bg-bg-canvas:where\(\.dark, \.dark \*, \[data-theme="dark"\]/.test(css)) fails.push('dark: variant does not follow .dark / data-theme="dark"');
if (/--font-display:\s*var\(--font-display\)/.test(css)) fails.push('--font-display refers to itself');
fs.rmSync(dir, { recursive: true, force: true });
if (fails.length) {
  console.error('Tailwind v4 theme FAIL:\n  ' + fails.join('\n  '));
  process.exit(1);
}
console.log(`Tailwind v4 theme OK — ${Object.keys(CLASSES).length} classes compile to AURA tokens; dark: follows .dark / data-theme. Next to a shadcn theme the prefixed setup changes no computed style, and utilities beat @layer aura.`);
