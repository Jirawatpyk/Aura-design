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
console.log(`Tailwind v4 theme OK — ${Object.keys(CLASSES).length} classes compile to AURA tokens; dark: follows .dark / data-theme.`);
