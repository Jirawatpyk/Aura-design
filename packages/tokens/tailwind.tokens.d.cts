/* Types for tailwind.tokens.cjs (5.2): the token maps a Tailwind v3 config spreads into theme.extend.
 *   import aura from '@jirawatpyk/aura-tokens/tailwind';   // or require()
 *   theme: { extend: { colors: aura.colors, spacing: aura.spacing, … } } */
type AuraColorMap = { [key: string]: string | AuraColorMap };
declare const aura: {
  colors: AuraColorMap;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  boxShadow: Record<string, string>;
  transitionTimingFunction: Record<string, string>;
  transitionDuration: Record<string, string>;
  screens: Record<string, string>;
  zIndex: Record<string, string>;
  fontFamily: Record<string, string[]>;
};
export = aura;
