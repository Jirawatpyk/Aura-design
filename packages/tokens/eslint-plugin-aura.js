// @ts-check
// eslint-plugin-aura.js — AURA 5.2
// Flags hard-coded colours in JS/TS: hex (#rgb, #rgba, #rrggbb, #rrggbbaa), colour functions (rgb/hsl/hwb/lab/lch/
// oklab/oklch/color-mix), CSS named colours in a style value, Tailwind palette classes (bg-red-500, text-white) and
// arbitrary colour classes (bg-[#18181b]). Use semantic tokens instead.
//
// Flat config (ESLint 9):   import aura from '@jirawatpyk/aura-tokens/eslint-plugin';
//                           export default [aura.configs.recommended];
// Legacy .eslintrc:         plugins: ['aura'] needs the package installed as eslint-plugin-aura, so use the
//                           flat config, or aura.configs['recommended-legacy'] with a local plugin loader.
const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const UTIL =
  'bg|text|border(?:-[trblxy])?|ring|ring-offset|outline|fill|stroke|from|to|via|shadow|decoration|divide|placeholder|caret|accent';
/* "#fff" but not "#add-user" or "#section_2": a hex is not followed by a word character or a hyphen. */
const HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/i;
/* A colour function with a literal colour in it: a hex, or three numbers (rgb(1 2 3), oklch(.7 .1 200)), or an open
 * call a template literal continues (`rgb(${r}, …)`). Token-based ones pass: rgb(var(--brand-rgb) / .5),
 * color-mix(in srgb, var(--aura-accent) 20%, transparent). var() and url() are removed before any check. */
const FN_CALL = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(([^()]*)(\)|$)/gi;
/** @param {string} v */
function fnHit(v) {
  FN_CALL.lastIndex = 0;
  let m;
  while ((m = FN_CALL.exec(v))) {
    const args = m[1];
    if (!m[2] || /#[0-9a-f]{3}/i.test(args) || (args.match(/-?\d*\.?\d+/g) || []).length >= 3) return m[0];
  }
  return null;
}
const stripRefs = (/** @type {string} */ v) => v.replace(/var\([^()]*(?:\([^()]*\)[^()]*)*\)/g, ' ').replace(/url\([^)]*\)/g, ' ');
const TW_ARB = new RegExp('(?:^|[\\s:"\'`])(?:' + UTIL + ')-\\[(?:#|rgb|hsl|oklch|color)', 'i');
const TW_PAL = new RegExp(
  '(?:^|[\\s:"\'`!])(?:' + UTIL + ')-(?:(?:' + PALETTE + ')-\\d{2,3}|white|black)(?:\\/\\d+)?(?![\\w-])',
);
const NAMED =
  'white|black|red|green|blue|yellow|orange|purple|pink|gray|grey|silver|maroon|navy|teal|olive|lime|aqua|fuchsia|brown|gold|indigo|violet|crimson|coral|salmon|tomato|khaki|beige|ivory|lavender|turquoise|tan|plum|orchid';
/* A whole value that is a named colour ('white'), or one after a colour property ("color: red", "background:#…"). */
const NAMED_WHOLE = new RegExp('^\\s*(?:' + NAMED + ')\\s*$', 'i');
/* Lower-case CSS only ("color: white"), so UI text like "Color: Red" isn't a declaration; the name stands alone
 * (not --aura-white or white-space). */
const NAMED_DECL = new RegExp(
  '(?:^|[;{\\s])(?:color|background(?:-color)?|border(?:-[a-z]+)?-color|border|fill|stroke|outline(?:-color)?)\\s*:\\s*[^;]*(?<![\\w-])(?:' +
    NAMED +
    ')(?![\\w-])',
);
/* Properties whose values are colours when written as an object key (style={{ color: 'white' }}). */
const COLOUR_KEY =
  /^(?:color|background|backgroundColor|borderColor|border(?:Top|Right|Bottom|Left)Color|fill|stroke|outlineColor|caretColor|accentColor|textDecorationColor)$/;
/* JSX attributes that hold ids and URLs, never colours ("#add-user", "#fff" as an anchor). */
const NOT_COLOUR_ATTR =
  /^(?:href|to|id|htmlFor|for|src|action|formAction|xlinkHref|xlink:href|aria-[a-z]+|data-[\w-]+|name|key)$/;

/**
 * @param {unknown} raw
 * @param {boolean} colourKey
 */
function hitIn(raw, colourKey) {
  if (typeof raw !== 'string') return null;
  const value = stripRefs(raw);
  const m = TW_ARB.exec(value) || TW_PAL.exec(value) || HEX.exec(value) || NAMED_DECL.exec(value);
  if (m) return m[0].trim();
  const f = fnHit(value);
  if (f) return f;
  if (colourKey && NAMED_WHOLE.test(value)) return value.trim();
  return null;
}
/** An ESTree / JSX AST node, loosely (the plugin runs on whatever parser the project uses). @typedef {any} Node */
/** @param {Node} node */
function skip(node) {
  let p = node.parent;
  if (!p) return false;
  /* href={'#add'}, href={x ? '#a' : '#b'}, href={`#fff`}: look through the expression to the attribute. */
  while (
    p.parent &&
    (p.type === 'JSXExpressionContainer' ||
      p.type === 'ConditionalExpression' ||
      p.type === 'LogicalExpression' ||
      p.type === 'TemplateLiteral' ||
      p.type === 'BinaryExpression')
  )
    p = p.parent;
  if (p.type === 'JSXAttribute' && p.name) {
    const n = p.name.type === 'JSXNamespacedName' ? p.name.namespace.name + ':' + p.name.name.name : p.name.name;
    if (NOT_COLOUR_ATTR.test(n)) return true;
  }
  if (p.type === 'ImportDeclaration' || p.type === 'ExportNamedDeclaration' || p.type === 'ExportAllDeclaration')
    return true;
  return false;
}
/** @param {Node} node */
function colourKeyOf(node) {
  const p = node.parent;
  if (p && p.type === 'Property' && p.value === node && p.key) return COLOUR_KEY.test(p.key.name || p.key.value || '');
  return false;
}
/**
 * @param {{ report(d: { node: Node, message: string }): void }} context
 * @param {Node} node
 * @param {string} hit
 */
function report(context, node, hit) {
  context.report({
    node,
    message: `Hard-coded colour "${hit}". Use a semantic token (bg-bg-surface, text-fg-primary, var(--aura-…)) instead.`,
  });
}

const plugin = {
  meta: { name: 'eslint-plugin-aura', version: '5.2.0' },
  rules: {
    'no-hardcoded-color': {
      meta: {
        type: 'problem',
        docs: { description: 'ห้ามใช้สี hardcode ให้ใช้ token — use AURA semantic tokens, never raw colours' },
        schema: [],
      },
      create(/** @type {any} */ context) {
        return {
          Literal(/** @type {Node} */ node) {
            if (skip(node)) return;
            const hit = hitIn(node.value, colourKeyOf(node));
            if (hit) report(context, node, hit);
          },
          TemplateElement(/** @type {Node} */ node) {
            if (skip(node)) return;
            const hit = hitIn(node.value && node.value.raw, false);
            if (hit) report(context, node, hit);
          },
        };
      },
    },
  },
  /** @type {Record<string, { plugins: unknown, rules: Record<string, string> }>} */
  configs: {},
};
/* Flat config (ESLint 9, the default): the plugin object itself, not a name. */
plugin.configs.recommended = { plugins: { aura: plugin }, rules: { 'aura/no-hardcoded-color': 'error' } };
plugin.configs['recommended-legacy'] = { plugins: ['aura'], rules: { 'aura/no-hardcoded-color': 'error' } };
module.exports = plugin;
