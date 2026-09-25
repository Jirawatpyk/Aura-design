/* Types for eslint-plugin-aura.js (5.2): import aura from '@jirawatpyk/aura-tokens/eslint-plugin';
 * export default [aura.configs.recommended]; */
declare const plugin: {
  meta: { name: string; version: string };
  rules: Record<string, unknown>;
  configs: {
    recommended: { plugins: Record<string, unknown>; rules: Record<string, 'error' | 'warn' | 'off'> };
    'recommended-legacy': { plugins: string[]; rules: Record<string, 'error' | 'warn' | 'off'> };
  };
};
export = plugin;
