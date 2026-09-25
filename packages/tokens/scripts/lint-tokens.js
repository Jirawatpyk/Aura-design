#!/usr/bin/env node
/* Token lint — fails when source files hard-code colours instead of AURA tokens, or (CSS) motion:
 * a transition/animation must take its duration and easing from --aura-duration-* / --aura-ease / --aura-spring
 * (`linear` is allowed: it's for spinners and progress, not a feel).
 * Usage: node scripts/lint-tokens.js [dir]   (default: ./src) */
const fs = require('fs');
const path = require('path');
const dir = path.resolve(process.argv[2] || path.join(process.cwd(), 'src'));
const ALLOW = /(aura\.css|aura\.components\.css|aura\.bundle\.js|tokens\.json|tailwind\.tokens\.cjs|figma-variables\.csv)$/;
const EXT = /\.(tsx?|jsx?|mjs|cjs|mts|cts|css|scss|mdx|vue|svelte|astro|html)$/;
/* 5.2: the same patterns as eslint-plugin-aura — a hex not followed by a word character or hyphen ("#add-user" is an
 * anchor), every colour function, Tailwind palette and arbitrary colour classes. */
const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const UTIL = 'bg|text|border(?:-[trblxy])?|ring|ring-offset|outline|fill|stroke|from|to|via|shadow|decoration|divide|placeholder|caret|accent';
const COLOUR = new RegExp(
  '#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\\w-])' +
    '|(?:^|[\\s:"\'`!])(?:' + UTIL + ')-\\[(?:#|rgb|hsl|oklch|color)' +
    '|(?:^|[\\s:"\'`!])(?:' + UTIL + ')-(?:(?:' + PALETTE + ')-\\d{2,3}|white|black)(?:\\/\\d+)?(?![\\w-])',
  'gi',
);
/* CSS only: a named colour as a colour property's value ("color: white"). System colours (CanvasText, Highlight) for
 * forced-colors mode are allowed. */
const NAMED = 'white|black|red|green|blue|yellow|orange|purple|pink|gray|grey|silver|maroon|navy|teal|olive|lime|aqua|fuchsia|brown|gold|indigo|violet';
const CSS_NAMED = new RegExp('(?:^|[;{\\s])(?:color|background(?:-color)?|border(?:-[a-z]+)?-color|fill|stroke|outline-color)\\s*:\\s*[^;]*(?<![\\w-])(?:' + NAMED + ')(?![\\w-])');
/* Colour functions count only with a literal colour inside (a hex or three numbers), as in eslint-plugin-aura. */
const FN_CALL = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(([^()]*)(\)|$)/gi;
function fnHit(v) {
  FN_CALL.lastIndex = 0;
  let m;
  while ((m = FN_CALL.exec(v))) if (!m[2] || /#[0-9a-f]{3}/i.test(m[1]) || (m[1].match(/-?\d*\.?\d+/g) || []).length >= 3) return m[0];
  return null;
}
const stripRefs = (v) => v.replace(/var\([^()]*(?:\([^()]*\)[^()]*)*\)/g, ' ').replace(/url\([^)]*\)/g, ' ');
const MOTION_PROP = /\b(?:transition|animation)(?:-duration|-timing-function|-delay)?\s*:/i;
const MOTION_RAW = /(?:^|[\s,:(])(?:\d*\.?\d+m?s)\b|cubic-bezier\(|\bease(?:-in-out|-in|-out)?\b/gi;
const violations = [];
function scan(d) {
  if (!fs.existsSync(d)) return;
  for (const f of fs.readdirSync(d)) {
    const full = path.join(d, f);
    if (f === 'node_modules' || f.startsWith('.')) continue;
    if (fs.statSync(full).isDirectory()) { scan(full); continue; }
    if (!EXT.test(f) || ALLOW.test(f)) continue;
    const text = fs.readFileSync(full, 'utf8');
    /* A file that must hold raw colours (the theme generator) says so, with a reason, in its first lines. */
    if (/aura-lint:\s*allow-colours/.test(text.slice(0, 600))) continue;
    text.split('\n').forEach((line, i) => {
      const plain = stripRefs(line);
      const m = plain.match(COLOUR) || (fnHit(plain) ? [fnHit(plain)] : null);
      if (m) violations.push(`${path.relative(process.cwd(), full)}:${i + 1}  ${m.map((s) => s.trim().replace(/^[:"'`!]/, '')).join(', ')}`);
      if (/\.s?css$/.test(f) && !/^\s*--/.test(line)) {
        const n = CSS_NAMED.exec(stripRefs(line.replace(/\/\*.*?\*\//g, '')));
        if (n) violations.push(`${path.relative(process.cwd(), full)}:${i + 1}  named colour: ${n[0].trim()}`);
      }
      if (/\.s?css$/.test(f) && MOTION_PROP.test(line)) {
        const raw = line.replace(/var\([^)]*\)/g, '').match(MOTION_RAW);
        if (raw) violations.push(`${path.relative(process.cwd(), full)}:${i + 1}  motion ${raw.map((s) => s.trim()).join(', ')} — use --aura-duration-* / --aura-ease`);
      }
    });
  }
}
scan(dir);
if (violations.length) {
  console.error(`Token lint FAIL: ${violations.length} hard-coded colour(s) or motion value(s) — use tokens\n  ` + violations.join('\n  '));
  process.exit(1);
}
console.log(`Token lint OK — no hard-coded colours or motion in ${path.relative(process.cwd(), dir) || '.'}`);
