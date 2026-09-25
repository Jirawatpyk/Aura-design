/* Switch the whole workspace to another React major for testing: `node scripts/use-react.mts 19 && npm install`.
 * Rewrites the react / react-dom / @types devDependencies in every workspace package.json (CI only — never commit the result). */
import fs from 'node:fs';
const major = process.argv[2];
if (!/^\d+$/.test(major || '')) { console.error('usage: node scripts/use-react.mts <major>'); process.exit(1); }
const files = ['package.json', 'packages/react/package.json', 'packages/tokens/package.json', 'apps/storybook/package.json'];
const names = { react: `^${major}`, 'react-dom': `^${major}`, '@types/react': `^${major}`, '@types/react-dom': `^${major}` };
for (const f of files) {
  const pkg = JSON.parse(fs.readFileSync(f, 'utf8'));
  let changed = false;
  for (const field of ['dependencies', 'devDependencies']) {
    for (const [n, range] of Object.entries(names)) if (pkg[field] && pkg[field][n]) { pkg[field][n] = range; changed = true; }
  }
  if (f === 'package.json') { pkg.overrides = { ...(pkg.overrides || {}), ...names }; changed = true; }  /* one copy for every dependency, too */
  if (changed) { fs.writeFileSync(f, JSON.stringify(pkg, null, 2) + '\n'); console.log(`${f}: react ${major}`); }
}
/* The lockfile pins the old major; drop it so `npm install` resolves the new one. */
fs.rmSync('package-lock.json', { force: true });
