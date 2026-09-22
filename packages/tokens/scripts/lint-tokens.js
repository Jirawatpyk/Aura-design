#!/usr/bin/env node
/* Token lint — fails when source files hard-code colours instead of AURA tokens, or (CSS) motion:
 * a transition/animation must take its duration and easing from --aura-duration-* / --aura-ease / --aura-spring
 * (`linear` is allowed: it's for spinners and progress, not a feel).
 * Usage: node scripts/lint-tokens.js [dir]   (default: ./src) */
const fs = require('fs');
const path = require('path');
const dir = path.resolve(process.argv[2] || path.join(process.cwd(), 'src'));
const ALLOW = /(aura\.css|aura\.components\.css|aura\.bundle\.js|tokens\.json|tailwind\.tokens\.cjs|figma-variables\.csv)$/;
const EXT = /\.(tsx?|jsx?|css|scss|mdx)$/;
const COLOUR = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b|\b(?:rgba?|hsla?)\(\s*\d|\b(?:bg|text|border|ring|fill|stroke)-\[(?:#|rgb|hsl)/gi;
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
      const m = line.match(COLOUR);
      if (m) violations.push(`${path.relative(process.cwd(), full)}:${i + 1}  ${m.join(', ')}`);
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
