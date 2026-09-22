#!/usr/bin/env node
/* Run by the Release workflow's Version Packages PR (npm run version-packages), after `changeset version`:
 * copies the new version to the files Changesets doesn't know about, regenerates what carries it, and puts
 * the new release notes at the top of the root CHANGELOG.md. */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const write = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 2) + '\n');
const V = read('packages/react/package.json').version;
const tokensV = read('packages/tokens/package.json').version;
if (V !== tokensV) throw new Error(`aura-react is ${V} but aura-tokens is ${tokensV}; they are released together`);

/* Root only: apps/storybook is a workspace package, and the Changesets action reads a CHANGELOG.md for every
 * workspace package whose version changed — the private Storybook has none, so its version stays put. */
for (const f of ['package.json']) {
  const o = read(f);
  o.version = V;
  write(f, o);
}
const T = read('packages/tokens/tokens.json');
T.version = V;
write('packages/tokens/tokens.json', T);

/* Release notes: the section Changesets just wrote in packages/react/CHANGELOG.md → root CHANGELOG.md. */
const pkgLog = fs.readFileSync('packages/react/CHANGELOG.md', 'utf8');
const m = pkgLog.match(new RegExp('^## ' + V.replace(/\./g, '\\.') + '\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))', 'm'));
const root = fs.readFileSync('CHANGELOG.md', 'utf8');
if (m && !root.includes('\n## ' + V + ' ')) {
  const body = m[1].replace(/^### (Major|Minor|Patch) Changes/gm, (_, k) => '### ' + k + ' changes').trim();
  const date = new Date().toISOString().slice(0, 10);
  fs.writeFileSync('CHANGELOG.md', root.replace(/^# Changelog\n/, `# Changelog\n\n## ${V} — ${date}\n\n${body}\n`));
}

execSync('npm run build -w packages/tokens && npm run a11y -w packages/tokens && npm install --package-lock-only --ignore-scripts', {
  stdio: 'inherit',
});
console.log('Versioned to ' + V);
