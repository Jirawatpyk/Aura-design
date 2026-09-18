// eslint-plugin-aura.js — AURA 4.1
// Flags hard-coded colours in JS/TS: hex (#rgb, #rgba, #rrggbb, #rrggbbaa), rgb()/hsl() literals,
// and Tailwind arbitrary colour classes like bg-[#18181b]. Use semantic tokens instead.
const HEX = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/i;
const FN = /\b(?:rgba?|hsla?)\(\s*\d/i;
const TW = /\b(?:bg|text|border|ring|fill|stroke|from|to|via|shadow)-\[(?:#|rgb|hsl)/i;

function check(context, node, value) {
  if (typeof value !== 'string') return;
  const hit = (TW.exec(value) || HEX.exec(value) || FN.exec(value) || [])[0];
  if (hit) {
    context.report({
      node,
      message: `Hard-coded colour "${hit}". Use a semantic token (bg-bg-surface, text-fg-primary, var(--aura-…)) instead.`,
    });
  }
}

module.exports = {
  rules: {
    'no-hardcoded-color': {
      meta: { type: 'problem', docs: { description: 'ห้ามใช้สี hardcode ให้ใช้ token — use AURA semantic tokens, never raw colours' } },
      create(context) {
        return {
          Literal(node) { check(context, node, node.value); },
          TemplateElement(node) { check(context, node, node.value && node.value.raw); },
        };
      },
    },
  },
  configs: {
    recommended: { plugins: ['aura'], rules: { 'aura/no-hardcoded-color': 'error' } },
  },
};
