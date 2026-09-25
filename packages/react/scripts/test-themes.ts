/* Writes the brand themes the pilot tests check with axe (tests/themes/*.css). Fails if any theme misses AA. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTheme } from '../dist/esm/theme.js';
const dir = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'tests/themes');
fs.mkdirSync(dir, { recursive: true });
let bad = 0;
for (const [name, brand, primary] of [['sky', '#0ea5e9', 'brand'], ['yellow', '#facc15', 'brand'], ['rose', '#e11d48', 'ink'], ['emerald', '#059669', 'brand']]) {
  const t = createTheme({ brand, primary, name });
  fs.writeFileSync(path.join(dir, name + '.css'), t.css());
  if (!t.ok) { bad++; console.log(name, 'FAILS', t.checks.filter((c) => !c.pass)); }
}
console.log(`themes written to tests/themes (${bad ? bad + ' failing' : 'all pass AA'})`);
process.exit(bad ? 1 : 0);
