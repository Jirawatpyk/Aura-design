/* Builds every example page two ways: <name>/dist/index.html (self-contained, React bundled) and
 * <name>/dist/card.js (uses window.React / window.Aura, for the design-system card).
 *   node examples/build.ts            all examples
 *   node examples/build.ts settings   one */
import { build } from 'esbuild';
import type { BuildOptions, Plugin } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const pkg = path.resolve(here, '..');
const tokens = process.env.AURA_CSS || path.resolve(pkg, '../tokens/aura.css');
const fonts = '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&family=Noto+Sans+Thai:wght@400;500;600&display=swap">';
const only = process.argv[2];
/* The colour-scheme head script, as projects get it (dist is built by `preexamples`). */
const { colorSchemeScript } = await import(new URL('../dist/esm/colorScheme.js', import.meta.url).href);
const schemeScript = '<script>' + colorSchemeScript() + '</script>';
const names = fs.readdirSync(here).filter((n) => fs.existsSync(path.join(here, n, 'main.tsx')) && (!only || n === only));
const alias: Plugin = { name: 'alias', setup(b) { b.onResolve({ filter: /^@aura\/react$/ }, () => ({ path: path.join(pkg, 'src/index.ts') })); } };
const GLOBALS: Record<string, string> = { react: 'React', 'react-dom': 'ReactDOM', 'react-dom/client': 'ReactDOM', '@aura/react': 'Aura' };
const globals: Plugin = { name: 'globals', setup(b) {
  b.onResolve({ filter: /^(react|react-dom|react-dom\/client|@aura\/react)$/ }, (a) => ({ path: a.path, namespace: 'g' }));
  b.onLoad({ filter: /.*/, namespace: 'g' }, (a) => ({ loader: 'js', contents: 'module.exports = window.' + GLOBALS[a.path] + ';' }));
} };
for (const name of names) {
  const dir = path.join(here, name);
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
  const common: BuildOptions = { entryPoints: [path.join(dir, 'main.tsx')], bundle: true, jsx: 'transform', target: 'es2019', write: false, logLevel: 'error', nodePaths: [path.join(pkg, 'node_modules')] };
  const page = await build({ ...common, format: 'iife', minify: true, plugins: [alias], define: { 'process.env.NODE_ENV': '"production"' } });
  const pageCss = fs.readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
  const css = fs.readFileSync(tokens, 'utf8') + fs.readFileSync(path.join(pkg, 'styles/components.css'), 'utf8') + pageCss;
  const js = page.outputFiles![0]!.text.replace(/<\/script/gi, '<\\/script');
  fs.mkdirSync(path.join(dir, 'dist'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'dist/index.html'), `<!doctype html><html lang="${meta.lang || 'th'}" data-theme="system"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${meta.title}</title>${schemeScript}${fonts}<style>${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`);
  const card = await build({ ...common, format: 'iife', plugins: [globals], define: { 'process.env.NODE_ENV': '"production"' } });
  const cardJs = card.outputFiles![0]!.text;
  if (/<\/script/i.test(cardJs)) throw new Error(name + ': card.js contains </script');
  fs.writeFileSync(path.join(dir, 'dist/card.js'), cardJs);
  console.log(`${name}: dist/index.html ${(fs.statSync(path.join(dir, 'dist/index.html')).size / 1024).toFixed(0)} KB, card.js ${(cardJs.length / 1024).toFixed(0)} KB`);
}
