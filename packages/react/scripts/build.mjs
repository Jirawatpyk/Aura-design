/* Builds @aura/react from the TypeScript sources: dist/esm (per file, 'use client'), dist/cjs (one file),
 * dist/aura.bundle.js (IIFE → window.Aura, for the design-system artifact and <script> use) and dist/index.d.ts
 * (generated from the sources by tsc, bundled into one file). Types are checked by `npm run typecheck`, not here. */
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
const entries = fs.readdirSync(src).filter((f) => /\.tsx?$/.test(f) && f !== 'types.ts').map((f) => path.join(src, f));
const banner = { js: "'use client';" };
const external = ['react', 'react-dom', 'react/jsx-runtime'];
/* Classic JSX (React.createElement): every module already imports React, and the window.Aura bundle needs no jsx-runtime global. */
const jsx = { tsconfig: path.join(root, 'tsconfig.src.json'), jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' };

await build({ entryPoints: entries, outdir: path.join(dist, 'esm'), format: 'esm', target: 'es2019', banner, logLevel: 'error', ...jsx });
await build({ entryPoints: [path.join(src, 'index.ts')], outfile: path.join(dist, 'cjs/index.cjs'), bundle: true, format: 'cjs', platform: 'neutral', target: 'es2019', external, banner, logLevel: 'error', ...jsx });

/* IIFE: react / react-dom come from window globals. */
const globals = {
  name: 'globals',
  setup(b) {
    b.onResolve({ filter: /^react(-dom)?$/ }, (a) => ({ path: a.path, namespace: 'g' }));
    b.onLoad({ filter: /.*/, namespace: 'g' }, (a) => ({ contents: `module.exports = window.${a.path === 'react' ? 'React' : 'ReactDOM'};`, loader: 'js' }));
  },
};
const iife = await build({ entryPoints: [path.join(src, 'index.ts')], bundle: true, format: 'iife', globalName: 'Aura', target: 'es2019', plugins: [globals], write: false, logLevel: 'error', ...jsx });
let code = iife.outputFiles[0].text;
if (/<\/script/i.test(code)) throw new Error('bundle contains </script');
/* Components listed in the design-system header: every PascalCase export except internals. */
const names = (fs.readFileSync(path.join(src, 'index.ts'), 'utf8').match(/export \{([^}]+)\}/g) || [])
  .flatMap((l) => l.replace(/export \{|\}/g, '').split(',').map((s) => s.trim().split(/\s+as\s+/).pop()))
  .filter((n) => /^[A-Z][a-z]/.test(n) && n !== 'ICONS' && n !== 'Field' && n !== 'AuraProvider' && n !== 'ThemeStyle');
const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: 'Aura', components: names.map((name) => ({ name })) })} */\n`;
code = header + code.replace(/^var Aura = /m, 'window.Aura = ').replace(/^"use strict";\n/, '');
fs.writeFileSync(path.join(dist, 'aura.bundle.js'), code);
fs.copyFileSync(path.join(root, 'styles/components.css'), path.join(dist, 'styles.css'));
/* One declaration file for the whole package, generated from the sources (no hand-written .d.ts to drift). */
const dtsBin = createRequire(import.meta.url).resolve('dts-bundle-generator/dist/bin/dts-bundle-generator.js');
execFileSync(process.execPath, [dtsBin, '--silent', '--no-banner', '--project', path.join(root, 'tsconfig.build.json'), '-o', path.join(dist, 'index.d.ts'), path.join(src, 'index.ts')], { stdio: 'inherit' });
console.log(`@aura/react built: ${entries.length} ESM modules, CJS, IIFE (${(code.length / 1024).toFixed(0)} KB, ${names.length} components).`);
