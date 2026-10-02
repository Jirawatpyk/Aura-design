/* Builds @aura/react from the TypeScript sources: dist/esm (per file, 'use client'), dist/cjs (one file),
 * dist/aura.bundle.js (IIFE → window.Aura, for the design-system artifact and <script> use) and dist/index.d.ts
 * (generated from the sources by tsc, bundled into one file). Types are checked by `npm run typecheck`, not here. */
import { build } from 'esbuild';
import type { BuildOptions, Format, Plugin } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
const entries = fs.readdirSync(src).filter((f) => /\.tsx?$/.test(f) && f !== 'types.ts' && f !== 'server.ts').map((f) => path.join(src, f));
const banner = { js: "'use client';" };
const external = ['react', 'react-dom', 'react/jsx-runtime'];
/* Classic JSX (React.createElement): every module already imports React, and the window.Aura bundle needs no jsx-runtime global. */
const jsx: BuildOptions = { tsconfig: path.join(root, 'tsconfig.src.json'), jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' };

/* 5.9: modules with no hooks or context — the icons and their renderer, the class helpers, the locale packs — are
 * emitted without 'use client'. The /icons and /locales entries point at these same files, so an icon or a language
 * used by both the app and AURA is bundled once, and a Server Component importing them renders them on the server. */
const SHARED = ['icons.ts', 'iconSvg.tsx', 'classes.ts', 'strings.th.ts', 'strings.sv.ts'];
await build({ entryPoints: entries.filter((f) => SHARED.indexOf(path.basename(f)) < 0), outdir: path.join(dist, 'esm'), format: 'esm', target: 'es2019', banner, logLevel: 'error', ...jsx });
await build({ entryPoints: entries.filter((f) => SHARED.indexOf(path.basename(f)) >= 0), outdir: path.join(dist, 'esm'), format: 'esm', target: 'es2019', logLevel: 'error', ...jsx });
for (const f of SHARED) {
  const code = fs.readFileSync(path.join(dist, 'esm', f.replace(/\.tsx?$/, '.js')), 'utf8');
  const deps = Array.from(code.matchAll(/from "\.\/([^"]+)\.js"/g), (m) => m[1] + '');
  const bad = deps.filter((d) => !SHARED.some((s) => s.replace(/\.tsx?$/, '') === d));
  if (bad.length) throw new Error(f + ' (no use client) imports a client module: ' + bad.join(', '));
}
await build({ entryPoints: [path.join(src, 'index.ts')], outfile: path.join(dist, 'cjs/index.cjs'), bundle: true, format: 'cjs', platform: 'neutral', target: 'es2019', external, banner, logLevel: 'error', ...jsx });
/* @jirawatpyk/aura-react/server (4.17): the pure helpers bundled on their own, with no 'use client', so Server
 * Components can call them. 5.8: plus the hook-free display components (display.tsx, Icon.tsx) — React stays
 * external; the build fails if any other component module (hooks, context) sneaks in. */
const SERVER_TSX = ['display.tsx', 'Icon.tsx', 'iconSvg.tsx', 'Container.tsx'];
for (const [format, file] of [['esm', 'index.js'], ['cjs', 'index.cjs']] as [Format, string][]) {
  const r = await build({ entryPoints: [path.join(src, 'server.ts')], outfile: path.join(dist, 'server', file), bundle: true, format, platform: 'neutral', target: 'es2019', external, logLevel: 'error', metafile: true, ...jsx });
  const inputs = Object.keys(r.metafile!.inputs);
  const bad = inputs.filter((f) => /node_modules/.test(f) || (/\.tsx$/.test(f) && SERVER_TSX.indexOf(path.basename(f)) < 0));
  if (bad.length) throw new Error('server entry pulls in a stateful module: ' + bad.join(', '));
}

/* @jirawatpyk/aura-react/icons (5.9): one component per icon with no 'use client' (no hooks), so Server Components can
 * render them and a bundler keeps only the icons imported (each is a pure call). ESM is dist/esm/icons.js (above,
 * shared with the components); CommonJS gets one bundle. */
for (const [format, file] of [['cjs', 'index.cjs']] as [Format, string][]) {
  const r = await build({ entryPoints: [path.join(src, 'icons.ts')], outfile: path.join(dist, 'icons', file), bundle: true, format, platform: 'neutral', target: 'es2019', external, logLevel: 'error', metafile: true, ...jsx });
  const bad = Object.keys(r.metafile!.inputs).filter((f) => !/(icons\.ts|iconSvg\.tsx|classes\.ts)$/.test(f));
  if (bad.length) throw new Error('icons entry pulls in more than the icons: ' + bad.join(', '));
}

/* @jirawatpyk/aura-react/locales/th and /sv (5.9): each language's strings on their own, for AuraProvider `strings`.
 * ESM is dist/esm/strings.<l>.js; CommonJS gets one file each. */
for (const l of ['th', 'sv']) {
  for (const [format, file] of [['cjs', l + '.cjs']] as [Format, string][])
    await build({ entryPoints: [path.join(src, 'strings.' + l + '.ts')], outfile: path.join(dist, 'locales', file), bundle: true, format, platform: 'neutral', target: 'es2019', logLevel: 'error' });
}

/* IIFE: react / react-dom come from window globals. */
const globals: Plugin = {
  name: 'globals',
  setup(b) {
    b.onResolve({ filter: /^react(-dom)?$/ }, (a) => ({ path: a.path, namespace: 'g' }));
    b.onLoad({ filter: /.*/, namespace: 'g' }, (a) => ({ contents: `module.exports = window.${a.path === 'react' ? 'React' : 'ReactDOM'};`, loader: 'js' }));
  },
};
const iife = await build({ entryPoints: [path.join(src, 'index.ts')], bundle: true, format: 'iife', globalName: 'Aura', target: 'es2019', plugins: [globals], write: false, logLevel: 'error', ...jsx });
let code = iife.outputFiles![0]!.text;
if (/<\/script/i.test(code)) throw new Error('bundle contains </script');
/* Components listed in the design-system header: every PascalCase export except internals. */
const names = (fs.readFileSync(path.join(src, 'index.ts'), 'utf8').match(/export \{([^}]+)\}/g) || [])
  .flatMap((l) => l.replace(/export \{|\}/g, '').split(',').map((s) => s.trim().split(/\s+as\s+/).pop() || ''))
  .filter((n) => /^[A-Z][a-z]/.test(n) && n !== 'ICONS' && n !== 'Field' && n !== 'AuraProvider' && n !== 'ThemeStyle');
const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: 'Aura', components: names.map((name) => ({ name })) })} */\n`;
code = header + code.replace(/^var Aura = /m, 'window.Aura = ').replace(/^"use strict";\n/, '');
fs.writeFileSync(path.join(dist, 'aura.bundle.js'), code);
fs.copyFileSync(path.join(root, 'styles/components.css'), path.join(dist, 'styles.css'));
/* The same styles inside `@layer aura` (4.17): a Tailwind utility on an AURA component then wins without !important.
 * Order it with `@layer theme, base, aura, components, utilities;`. */
/* Inside a cascade layer !important reverses layer order and beats every utility and inline style (4.18). */
if (/!important/.test(fs.readFileSync(path.join(root, 'styles/components.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')))
  throw new Error('styles/components.css contains !important — it would beat every utility in styles.layer.css');
fs.writeFileSync(
  path.join(dist, 'styles.layer.css'),
  "/* AURA components in a cascade layer. Declare the order first: @layer theme, base, aura, components, utilities; */\n@layer aura {\n" +
    fs.readFileSync(path.join(root, 'styles/components.css'), 'utf8') +
    '\n}\n',
);
/* One declaration file for the whole package, generated from the sources (no hand-written .d.ts to drift). */
const dtsBin = createRequire(import.meta.url).resolve('dts-bundle-generator/dist/bin/dts-bundle-generator.js');
execFileSync(process.execPath, [dtsBin, '--silent', '--no-banner', '--project', path.join(root, 'tsconfig.build.json'), '-o', path.join(dist, 'index.d.ts'), path.join(src, 'index.ts')], { stdio: 'inherit' });
execFileSync(process.execPath, [dtsBin, '--silent', '--no-banner', '--project', path.join(root, 'tsconfig.build.json'), '-o', path.join(dist, 'server/index.d.ts'), path.join(src, 'server.ts')], { stdio: 'inherit' });
execFileSync(process.execPath, [dtsBin, '--silent', '--no-banner', '--project', path.join(root, 'tsconfig.build.json'), '-o', path.join(dist, 'icons/index.d.ts'), path.join(src, 'icons.ts')], { stdio: 'inherit' });
/* 5.1.1: CommonJS consumers get .d.cts copies. Under "type": "module" TypeScript reads index.d.ts as ESM, so
 * `require()` from a .cts file (module node16) failed with TS1471 although the runtime require worked. */
fs.copyFileSync(path.join(dist, 'index.d.ts'), path.join(dist, 'index.d.cts'));
fs.copyFileSync(path.join(dist, 'server/index.d.ts'), path.join(dist, 'server/index.d.cts'));
fs.copyFileSync(path.join(dist, 'icons/index.d.ts'), path.join(dist, 'icons/index.d.cts'));
for (const l of ['th', 'sv']) {
  execFileSync(process.execPath, [dtsBin, '--silent', '--no-banner', '--project', path.join(root, 'tsconfig.build.json'), '-o', path.join(dist, 'locales', l + '.d.ts'), path.join(src, 'strings.' + l + '.ts')], { stdio: 'inherit' });
  fs.copyFileSync(path.join(dist, 'locales', l + '.d.ts'), path.join(dist, 'locales', l + '.d.cts'));
}
console.log(`@aura/react built: ${entries.length} ESM modules, CJS, IIFE (${(code.length / 1024).toFixed(0)} KB, ${names.length} components).`);
