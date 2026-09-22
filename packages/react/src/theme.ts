/* aura-lint: allow-colours — this file generates colours; its zinc values mirror the aura-zinc-* primitives. */
/* createTheme — a brand layer over AURA's tokens for one project.
 * Give it the project's brand colour (and optionally a signal colour); it builds a 50–900 scale in OKLCH
 * (same hue and chroma family, AURA's lightness steps), maps it onto the semantic tokens that carry the
 * brand (links, focus ring, selection, info, progress, creative shadow, mesh…), then nudges any colour that
 * misses its WCAG target until it passes. Status (ready/blocked), success, warning and danger stay AURA's:
 * they are meanings, not brand. No React needed — works in Node (CLI) and the browser. */

import type { Theme, ThemeCheck, ThemeOptions } from './types.js';

/* ---------- colour maths (sRGB ⇄ OKLab/OKLCH) ---------- */
function hexToRgb(hex: string): number[] {
  let h = String(hex).trim().replace('#', '');
  if (h.length === 3)
    h = h
      .split('')
      .map(function (c) {
        return c + c;
      })
      .join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error('createTheme: "' + hex + '" is not a #rgb or #rrggbb colour');
  return [0, 2, 4].map(function (i) {
    return parseInt(h.slice(i, i + 2), 16) / 255;
  });
}
function rgbToHex(rgb: number[]): string {
  return (
    '#' +
    rgb
      .map(function (v) {
        const n = Math.round(Math.min(1, Math.max(0, v)) * 255);
        return (n < 16 ? '0' : '') + n.toString(16);
      })
      .join('')
  );
}
function lin(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function delin(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}
function rgbToOklch(rgb: number[]): [number, number, number] {
  const r = lin(rgb[0]),
    g = lin(rgb[1]),
    b = lin(rgb[2]);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.sqrt(A * A + B * B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360];
}
function oklchToRgbRaw(L: number, C: number, H: number): number[] {
  const a = C * Math.cos((H * Math.PI) / 180),
    b = C * Math.sin((H * Math.PI) / 180);
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(delin);
}
function inGamut(rgb: number[]): boolean {
  return rgb.every(function (v) {
    return v >= -0.0005 && v <= 1.0005;
  });
}
/* Keep hue and lightness, reduce chroma until the colour fits sRGB. */
function oklchToHex(L: number, C: number, H: number): string {
  let lo = 0,
    hi = C,
    rgb = oklchToRgbRaw(L, C, H);
  if (inGamut(rgb)) return rgbToHex(rgb);
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToRgbRaw(L, mid, H))) lo = mid;
    else hi = mid;
  }
  return rgbToHex(oklchToRgbRaw(L, lo, H));
}
function luminance(hex: string): number {
  const c = hexToRgb(hex).map(lin);
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
/** WCAG contrast ratio of two #hex colours. */
export function contrast(a: string, b: string): number {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
function mix(a: string, b: string, t: number): string {
  const x = hexToRgb(a),
    y = hexToRgb(b);
  return rgbToHex(
    x.map(function (v, i) {
      return v + (y[i] - v) * t;
    }),
  );
}

/* AURA's lightness steps (from the violet and lime scales), and relative chroma. */
type ScaleStep = keyof Theme['brand'];
const STEPS: Record<ScaleStep, [number, number]> = {
  50: [0.975, 0.18],
  100: [0.945, 0.3],
  200: [0.895, 0.5],
  300: [0.81, 0.72],
  400: [0.715, 0.9],
  500: [0.635, 1],
  600: [0.555, 1],
  700: [0.49, 0.95],
  800: [0.43, 0.85],
  900: [0.38, 0.72],
};
/** A 50–900 scale around one colour: same hue, AURA's lightness steps, chroma kept in gamut. */
export function scale(hex: string): Theme['brand'] {
  const o = rgbToOklch(hexToRgb(hex)),
    C = Math.max(o[1], 0.02),
    out = {} as Theme['brand'];
  (Object.keys(STEPS) as unknown as ScaleStep[]).forEach(function (k) {
    out[k] = oklchToHex(STEPS[k][0], ((C * STEPS[k][1]) / 0.95) * (o[1] < 0.03 ? 0.4 : 1), o[2]);
  });
  return out;
}
/* Darken (dir -1) or lighten (+1) in OKLCH until the ratio against every ground reaches the target. */
function fit(hex: string, grounds: string[], target: number, dir: number): string {
  let o = rgbToOklch(hexToRgb(hex)),
    L = o[0],
    c = hex;
  for (let i = 0; i < 80; i++) {
    if (
      grounds.every(function (g) {
        return contrast(c, g) >= target;
      })
    )
      return c;
    L = Math.min(1, Math.max(0, L + dir * 0.01));
    c = oklchToHex(L, o[1], o[2]);
  }
  return c;
}

const ZINC = { 0: '#ffffff', 50: '#fafafa', 100: '#f4f4f5', 800: '#27272a', 900: '#18181b', 950: '#09090b' };
const INK = '#18181b';

/**
 * createTheme({ brand, signal?, primary?: 'ink' | 'brand', name? })
 * → { name, brand: {50…900}, signal: {50…900}|null, light: {token: #hex}, dark: {…}, checks: [{pair, ratio, target, pass}], ok, css(selector?) }
 */
export function createTheme(opts: ThemeOptions): Theme {
  const o = (opts || {}) as ThemeOptions;
  if (!o.brand) throw new Error('createTheme: pass { brand: "#rrggbb" }');
  const b = scale(o.brand),
    s = o.signal ? scale(o.signal) : null;
  const lightGrounds = [ZINC[0], ZINC[50]],
    darkGrounds = [ZINC[900], ZINC[950]];
  const L: Record<string, string> = {},
    D: Record<string, string> = {};

  L['fg-accent'] = fit(b[700], lightGrounds, 4.5, -1);
  L['accent-violet'] = L['fg-accent'];
  L['focus-ring'] = fit(b[700], lightGrounds.concat([b[50]]), 3, -1);
  L['bg-selected'] = b[50];
  L['status-progress-bg'] = b[100];
  L['status-progress-fg'] = fit(b[800], [b[100]], 4.5, -1);
  L['alert-info-bg'] = b[50];
  L['alert-info-fg'] = fit(b[800], [b[50]], 4.5, -1);
  L['alert-info-border'] = b[200];
  L['mesh-from'] = b[400];

  D['fg-accent'] = fit(b[300], darkGrounds, 4.5, 1);
  D['accent-violet'] = fit(b[400], darkGrounds, 3, 1);
  D['focus-ring'] = fit(b[400], darkGrounds, 3, 1);
  D['bg-selected'] = mix(ZINC[900], b[500], 0.16);
  D['alert-info-bg'] = D['bg-selected'];
  D['alert-info-fg'] = fit(b[300], [D['alert-info-bg']], 4.5, 1);
  D['alert-info-border'] = mix(ZINC[900], b[400], 0.4);
  D['status-progress-bg'] = b[100];
  D['status-progress-fg'] = L['status-progress-fg'];

  if (s) {
    L['accent-dot'] = s[200];
    L['accent-lime'] = s[200];
    L['mesh-to'] = s[200];
    D['accent-dot'] = s[200];
    D['accent-lime'] = s[200];
    D['mesh-to'] = s[200];
  }
  const shadowLight = INK,
    shadowDark = D['accent-violet'];
  if (o.primary === 'brand') {
    L['button-primary-bg'] = fit(b[600], [ZINC[0]], 4.5, -1);
    L['button-primary-fg'] = ZINC[0];
    L['button-primary-bg-hover'] = fit(b[700], [ZINC[0]], 4.5, -1);
    D['button-primary-bg'] = fit(b[400], [ZINC[900]], 4.5, 1);
    D['button-primary-fg'] = ZINC[900];
    D['button-primary-bg-hover'] = fit(b[300], [ZINC[900]], 4.5, 1);
  }
  L['shadow-creative'] = '4px 4px 0px ' + shadowLight;
  L['shadow-creative-hover'] = '6px 6px 0px ' + shadowLight;
  L['card-shadow-creative'] = '8px 8px 0px ' + shadowLight;
  D['shadow-creative'] = '4px 4px 0px ' + shadowDark;
  D['shadow-creative-hover'] = '6px 6px 0px ' + shadowDark;
  D['card-shadow-creative'] = '8px 8px 0px ' + shadowDark;

  const checks: ThemeCheck[] = [];
  function check(
    theme: ThemeCheck['theme'],
    fg: string,
    bg: string,
    target: number,
    fgHex: string,
    bgHex: string,
  ): void {
    const r = contrast(fgHex, bgHex);
    checks.push({
      theme: theme,
      pair: fg + ' on ' + bg,
      ratio: Math.round(r * 100) / 100,
      target: target,
      pass: r >= target - 0.005,
    });
  }
  [
    ['bg-surface', ZINC[0]],
    ['bg-canvas', ZINC[50]],
    ['bg-selected', L['bg-selected']],
  ].forEach(function (g) {
    check('light', 'fg-accent', g[0], 4.5, L['fg-accent'], g[1]);
    check('light', 'focus-ring', g[0], 3, L['focus-ring'], g[1]);
  });
  [
    ['bg-surface', ZINC[900]],
    ['bg-canvas', ZINC[950]],
    ['bg-selected', D['bg-selected']],
  ].forEach(function (g) {
    check('dark', 'fg-accent', g[0], 4.5, D['fg-accent'], g[1]);
    check('dark', 'focus-ring', g[0], 3, D['focus-ring'], g[1]);
  });
  check('light', 'fg-primary', 'bg-selected', 4.5, INK, L['bg-selected']);
  check('dark', 'fg-primary', 'bg-selected', 4.5, '#ffffff', D['bg-selected']);
  check('light', 'status-progress-fg', 'status-progress-bg', 4.5, L['status-progress-fg'], L['status-progress-bg']);
  check('light', 'alert-info-fg', 'alert-info-bg', 4.5, L['alert-info-fg'], L['alert-info-bg']);
  check('dark', 'alert-info-fg', 'alert-info-bg', 4.5, D['alert-info-fg'], D['alert-info-bg']);
  if (o.primary === 'brand') {
    check('light', 'button-primary-fg', 'button-primary-bg', 4.5, L['button-primary-fg'], L['button-primary-bg']);
    check(
      'light',
      'button-primary-fg',
      'button-primary-bg-hover',
      4.5,
      L['button-primary-fg'],
      L['button-primary-bg-hover'],
    );
    check('dark', 'button-primary-fg', 'button-primary-bg', 4.5, D['button-primary-fg'], D['button-primary-bg']);
    check(
      'dark',
      'button-primary-fg',
      'button-primary-bg-hover',
      4.5,
      D['button-primary-fg'],
      D['button-primary-bg-hover'],
    );
  }
  if (s) check('light', 'ink', 'accent-lime (signal)', 4.5, INK, s[200]);

  function css(selector?: string): string {
    const light = selector ? selector : ':root, [data-theme="light"]';
    const dark = selector
      ? selector + '.dark, .dark ' + selector + ', ' + selector + '[data-theme="dark"], [data-theme="dark"] ' + selector
      : '.dark, [data-theme="dark"]';
    /* data-theme="system" follows the OS: the same dark values inside prefers-color-scheme. */
    const system = selector
      ? '[data-theme="system"] ' + selector + ', ' + selector + '[data-theme="system"]'
      : '[data-theme="system"]';
    function block(sel: string, m: Record<string, string>): string {
      return (
        sel +
        ' {\n' +
        Object.keys(m)
          .map(function (k) {
            return '  --aura-' + k + ': ' + m[k] + ';';
          })
          .join('\n') +
        '\n}'
      );
    }
    return (
      '/* AURA theme' +
      (o.name ? ' "' + o.name + '"' : '') +
      ': brand ' +
      o.brand +
      (o.signal ? ', signal ' + o.signal : '') +
      (o.primary === 'brand' ? ', brand primary buttons' : '') +
      '. Load after aura.css. Generated by createTheme. */\n' +
      block(light, L) +
      '\n' +
      block(dark, D) +
      '\n@media (prefers-color-scheme: dark) {\n' +
      block(system, D) +
      '\n}\n'
    );
  }
  return {
    name: o.name || null,
    brand: b,
    signal: s,
    light: L,
    dark: D,
    checks: checks,
    ok: checks.every(function (c) {
      return c.pass;
    }),
    css: css,
  };
}
