/* Token adoption: semantic-token uses vs hard-coded hex colours in a source folder.
 * Usage: node scripts/telemetry.mts [folder]   (default: stories) — writes telemetry-report.json */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface Usage {
  tokenUse: number;
  hardcode: number;
  adoption: string;
}
function scanUsage(dir: string): Usage {
  let tokenUse = 0,
    hardcode = 0;
  function walk(d: string): void {
    if (!fs.existsSync(d)) return;
    for (const f of fs.readdirSync(d)) {
      const full = path.join(d, f);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(tsx|ts|jsx|js)$/.test(f)) continue;
      const c = fs.readFileSync(full, 'utf8');
      tokenUse += (c.match(/bg-surface|fg-primary|border-default|aura-/g) || []).length;
      hardcode += (c.match(/#[0-9a-f]{6}/g) || []).length;
    }
  }
  walk(dir);
  const total = tokenUse + hardcode;
  return { tokenUse, hardcode, adoption: total ? ((tokenUse / total) * 100).toFixed(1) : '100' };
}
const here = path.dirname(fileURLToPath(import.meta.url));
const result = scanUsage(path.resolve(here, '..', process.argv[2] || 'stories'));
console.log(`Adoption: ${result.adoption}% (token:${result.tokenUse} hardcode:${result.hardcode})`);
fs.writeFileSync('telemetry-report.json', JSON.stringify({ ...result, timestamp: new Date().toISOString() }, null, 2));
