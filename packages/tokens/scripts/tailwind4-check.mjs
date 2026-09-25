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
<button id="a1" class="aura-btn aura-btn--primary rounded-none">AURA</button><svg id="a3" class="aura-icon aura-combo__check text-chart-1"></svg><div hidden class="max-w-[200px]"></div><div id="a4" class="aura-combo__option"><svg id="a5" class="aura-icon aura-combo__check text-chart-1"></svg></div><span id="a2" class="bg-aura-bg-surface text-aura-fg-primary font-aura-sans border border-aura-border-strong">prefixed</span></body>`;
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
    return { body: pick('body'), s1: pick('#s1'), s2: pick('#s2'), s3: pick('#s3'), a1: pick('#a1'), a2: pick('#a2'), a5: pick('#a5') };
  }, PROPS);
  await p.close();
  return out;
}
/* 4.18: on a phone the sheet drops its max-width; a utility on it must still win (it lost to !important in 4.17). */
async function sheetWidth(name) {
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await p.setContent(`<!doctype html><html><head><style>${compiled[name]}</style></head><body><div id="d" class="aura-dialog aura-dialog--md max-w-[200px]">sheet</div></body></html>`);
  const w = await p.evaluate(() => getComputedStyle(document.getElementById('d')).maxWidth);
  await p.close();
  return w;
}
const sheet = await sheetWidth('both');
if (sheet !== '200px') fails.push(`a max-w utility should override the phone sheet inside @layer aura (got ${sheet})`);
const alone = await styles('alone'), both = await styles('both'), after = await styles('after'), unlayered = await styles('unlayered');
for (const [order, got] of [['AURA first', both], ['AURA after the app theme', after]])
  for (const el of ['body', 's1', 's2', 's3']) for (const k of PROPS)
    if (alone[el][k] !== got[el][k]) fails.push(`next to shadcn (${order}): #${el} ${k} changed: "${alone[el][k]}" → "${got[el][k]}"`);
if (both.a1['border-top-left-radius'] !== '0px') fails.push(`@layer aura: rounded-none should override .aura-btn (got ${both.a1['border-top-left-radius']})`);
if (unlayered.a1['border-top-left-radius'] === '0px') fails.push('control: unlayered styles.css should beat the utility — the layer check is not testing anything');
/* 4.18: nothing in the layer may use !important (it would beat utilities); a utility recolours the Combobox check. */
if (/!important/.test(fs.readFileSync(path.join(root, '..', 'react', 'dist', 'styles.layer.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''))) fails.push('styles.layer.css contains !important');
if (both.a5.color !== alone.s1['background-color']) fails.push(`text-chart-1 should recolour .aura-combo__check inside an option (got ${both.a5.color}, want ${alone.s1['background-color']})`);
if (!/Inter/.test(both.a2['font-family'])) fails.push('font-aura-sans should be the Inter stack, got ' + both.a2['font-family']);
if (both.a2['background-color'] !== 'rgb(255, 255, 255)') fails.push('bg-aura-bg-surface should resolve to the AURA surface, got ' + both.a2['background-color']);
await browser.close();

for (const [cls, value] of Object.entries(CLASSES)) {
  const m = new RegExp('\\.' + cls.replace(/[-]/g, '\\-') + '\\s*\\{([^}]*)\\}').exec(css);
  if (!m) fails.push(`${cls}: not generated`);
  else if (!m[1].includes(value)) fails.push(`${cls}: expected ${value}, got ${m[1].trim()}`);
}
/* dark: in a browser (5.2): .dark and data-theme="dark" turn it on; a light island inside dark (Surface) and a light page
 * don't; a dark island inside that light island does; data-theme="system" follows the OS with no script. */
{
  const p = await (await import('playwright')).chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const probe = async (scheme) => {
    const pg = await p.newPage({ colorScheme: scheme });
    await pg.setContent(`<!doctype html><html><head><style>${css}</style></head><body>
      <div class="dark"><i id="d1" class="dark:bg-bg-canvas"></i><div data-theme="light"><i id="d2" class="dark:bg-bg-canvas"></i></div></div>
      <div data-theme="dark"><i id="d3" class="dark:bg-bg-canvas"></i></div>
      <div data-theme="light"><i id="d4" class="dark:bg-bg-canvas"></i></div>
      <div data-theme="system"><i id="d5" class="dark:bg-bg-canvas"></i><div data-theme="light"><i id="d6" class="dark:bg-bg-canvas"></i></div></div>
      <div class="dark"><div data-theme="light"><div data-theme="dark"><i id="d7" class="dark:bg-bg-canvas"></i></div></div></div>
      <div data-theme="light"><div data-theme="dark"><div data-theme="light"><i id="d8" class="dark:bg-bg-canvas"></i></div></div></div></body></html>`);
    const ids = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'];
    const on = await pg.evaluate((ids) => Object.fromEntries(ids.map((id) => [id, getComputedStyle(document.getElementById(id)).backgroundColor !== 'rgba(0, 0, 0, 0)'])), ids);
    await pg.close();
    return on;
  };
  const want = {
    light: { d1: true, d2: false, d3: true, d4: false, d5: false, d6: false, d7: true, d8: false },
    dark: { d1: true, d2: false, d3: true, d4: false, d5: true, d6: false, d7: true, d8: false },
  };
  for (const scheme of ['light', 'dark']) {
    const got = await probe(scheme);
    for (const id of Object.keys(got)) if (got[id] !== want[scheme][id]) fails.push(`dark: variant (${scheme} OS): #${id} ${got[id] ? 'on' : 'off'}`);
  }
  await p.close();
}
if (/--font-display:\s*var\(--font-display\)/.test(css)) fails.push('--font-display refers to itself');
fs.rmSync(dir, { recursive: true, force: true });
if (fails.length) {
  console.error('Tailwind v4 theme FAIL:\n  ' + fails.join('\n  '));
  process.exit(1);
}
console.log(`Tailwind v4 theme OK — ${Object.keys(CLASSES).length} classes compile to AURA tokens; dark: follows .dark / data-theme. Next to a shadcn theme the prefixed setup changes no computed style, and utilities beat @layer aura.`);
