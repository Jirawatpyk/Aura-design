/* After a build, copy the window.Aura bundle, its CSS and types into packages/tokens/components
 * (the tokens package keeps shipping them for <script>-tag use) — one source, no hand copies. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.resolve(root, '../tokens/components');
if (!fs.existsSync(out)) process.exit(0);
fs.copyFileSync(path.join(root, 'dist/aura.bundle.js'), path.join(out, 'aura.bundle.js'));
fs.copyFileSync(path.join(root, 'styles/components.css'), path.join(out, 'aura.components.css'));
fs.copyFileSync(path.join(root, 'dist/index.d.ts'), path.join(out, 'index.d.ts'));
console.log('synced bundle, CSS and types into packages/tokens/components');
