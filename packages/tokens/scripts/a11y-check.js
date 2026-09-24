#!/usr/bin/env node
/* AURA contrast check — resolves tokens.json and tests every documented text/ground pair in BOTH themes.
 * Text needs 4.5:1, control edges and focus rings 3:1 (WCAG 2.1 AA). Writes a11y-report.json; exits 1 on any failure. */
const fs = require('fs');
const path = require('path');
const TOKENS = path.join(__dirname, '..', 'tokens.json');
const T = JSON.parse(fs.readFileSync(TOKENS, 'utf8'));

function resolve(value, theme, depth = 0) {
  if (depth > 16) throw new Error('alias loop at ' + value);
  const m = /^\{(primitive|semantic|component)\.([a-z0-9-]+)(?:\.([a-z0-9]+))?\}$/.exec(String(value).trim());
  if (!m) return String(value).trim();
  const [, tier, a, b] = m;
  if (tier === 'primitive') { const p = T.primitive[a]; return b ? p[b] : p; }
  const v = T[tier][theme][a];
  if (v === undefined) throw new Error(`missing ${tier}.${a} (${theme})`);
  return resolve(v, theme, depth + 1);
}
const tok = (name, theme) => resolve(T.semantic[theme][name] ?? T.component[theme][name], theme);

function rgb(c, ground) {
  let m = /^#([0-9a-f]{6})$/i.exec(c);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  m = /^#([0-9a-f]{3})$/i.exec(c);
  if (m) return m[1].split('').map((x) => parseInt(x + x, 16));
  m = /^rgba?\(([^)]+)\)$/i.exec(c);
  if (m) {
    const [r, g, b, a = 1] = m[1].split(',').map(Number);
    if (a >= 1 || !ground) return [r, g, b];
    const G = rgb(ground);
    return [r, g, b].map((v, i) => Math.round(a * v + (1 - a) * G[i]));
  }
  throw new Error('unsupported colour ' + c);
}
const lum = (c) => rgb(c).map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
function ratio(fg, bg) {
  const B = '#' + rgb(bg).map((v) => v.toString(16).padStart(2, '0')).join('');
  const F = '#' + rgb(fg, B).map((v) => v.toString(16).padStart(2, '0')).join('');
  const a = lum(F), b = lum(B);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const TEXT = 4.5, UI = 3;
const grounds = ['bg-surface', 'bg-canvas', 'bg-surface-hover'];
const pairs = [];
for (const fg of ['fg-primary', 'fg-secondary', 'fg-tertiary', 'fg-accent', 'fg-danger', 'fg-positive']) for (const bg of grounds) pairs.push([fg, bg, TEXT]);
pairs.push(['fg-primary', 'bg-selected', TEXT], ['fg-secondary', 'bg-selected', TEXT]);
pairs.push(['fg-inverted', 'bg-surface-strong', TEXT], ['fg-inverted', 'bg-inverted', TEXT]);
pairs.push(['button-primary-fg', 'button-primary-bg', TEXT], ['button-primary-fg', 'button-primary-bg-hover', TEXT]);
for (const t of ['neutral', 'progress', 'ready', 'blocked']) pairs.push([`status-${t}-fg`, `status-${t}-bg`, TEXT]);
for (const t of ['info', 'success', 'warning', 'danger']) pairs.push([`alert-${t}-fg`, `alert-${t}-bg`, TEXT], ['fg-primary', `alert-${t}-bg`, TEXT]);
pairs.push(['on-texture', 'mesh-from', TEXT], ['on-texture', 'mesh-to', TEXT]);
for (const bg of ['bg-surface', 'bg-canvas', 'bg-input', 'bg-selected']) pairs.push(['border-control', bg, UI]);
for (const bg of ['bg-surface', 'bg-canvas', 'bg-surface-hover', 'bg-selected']) pairs.push(['focus-ring', bg, UI]);
pairs.push(['border-danger', 'bg-input', UI]);
for (const bg of ['bg-surface', 'bg-canvas']) pairs.push(['button-secondary-border', bg, UI]);
pairs.push(['button-danger-fg', 'button-danger-bg', TEXT], ['button-danger-fg', 'button-danger-bg-hover', TEXT]);
for (const bg of ['bg-surface', 'bg-canvas', 'alert-danger-bg']) pairs.push(['fg-danger', bg, TEXT]);
for (const bg of ['bg-surface', 'bg-canvas']) pairs.push(['border-danger', bg, UI], ['button-danger-bg', bg, UI]);
/* Chart marks (WCAG 1.4.11) and axis labels. Neighbouring categorical colours must also differ in lightness
 * (NEIGHBOUR:1) so a series next to another stays distinct without hue (deuteranopia, greyscale print). */
const NEIGHBOUR = 1.8;
for (const bg of ['bg-surface', 'bg-canvas']) {
  for (let i = 1; i <= 8; i++) pairs.push([`chart-${i}`, bg, UI]);
  for (let i = 1; i <= 5; i++) pairs.push([`chart-seq-${i}`, bg, UI]);
  pairs.push(['chart-axis', bg, TEXT]);
}
for (let i = 1; i < 8; i++) pairs.push([`chart-${i}`, `chart-${i + 1}`, NEIGHBOUR]);

const results = [], fails = [];
for (const theme of ['light', 'dark']) for (const [fg, bg, min] of pairs) {
  const r = ratio(tok(fg, theme), tok(bg, theme));
  const row = { theme, fg, bg, ratio: +r.toFixed(2), min, pass: r >= min };
  results.push(row);
  if (!row.pass) fails.push(`${theme}: ${fg} on ${bg} = ${row.ratio}:1 (needs ${min}:1)`);
}
fs.writeFileSync(path.join(process.cwd(), 'a11y-report.json'), JSON.stringify({ version: T.version, checked: results.length, fails, results }, null, 2));
if (fails.length) { console.error(`A11y FAIL — ${fails.length} of ${results.length} pairs:\n  ` + fails.join('\n  ')); process.exit(1); }
console.log(`A11y contrast OK — ${results.length} pairs pass in light and dark (AURA ${T.version}).`);
