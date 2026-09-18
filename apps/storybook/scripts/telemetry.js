
const fs=require('fs'), path=require('path'), glob=require('fs');
// วัด Adoption: % การใช้ semantic token vs hardcode
function scanUsage(dir){
  let tokenUse=0, hardcode=0;
  function walk(d){
    if(!fs.existsSync(d)) return;
    fs.readdirSync(d).forEach(f=>{
      const full=path.join(d,f);
      if(fs.statSync(full).isDirectory()) return walk(full);
      if(!/\.(tsx|ts|jsx|js)$/.test(f)) return;
      const c=fs.readFileSync(full,'utf8');
      tokenUse += (c.match(/bg-surface|fg-primary|border-default|aura-/g)||[]).length;
      hardcode += (c.match(/#[0-9a-f]{6}/g)||[]).length;
    });
  }
  walk(dir);
  const total=tokenUse+hardcode;
  const adoption = total? (tokenUse/total*100).toFixed(1):100;
  return {tokenUse, hardcode, adoption};
}
const result = scanUsage(path.join(__dirname,'../src'));
console.log(`Adoption: ${result.adoption}% (token:${result.tokenUse} hardcode:${result.hardcode})`);
fs.writeFileSync('telemetry-report.json', JSON.stringify({ ...result, timestamp: new Date().toISOString() }, null, 2));
