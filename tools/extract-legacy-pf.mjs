import fs from 'node:fs';
import path from 'node:path';

const html = fs.readFileSync('index.raw.html', 'utf8');
const re = /\{\s*src:\s*'data:image\/([a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)',\s*cap:\s*'([^']*)'/g;
const outDir = 'assets/images/legacy-presentation';
fs.mkdirSync(outDir, { recursive: true });
const manifest = [];
let m, i = 0;
while ((m = re.exec(html))) {
  i++;
  const buf = Buffer.from(m[2], 'base64');
  const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
  const outFile = path.join(outDir, `slide-${String(i).padStart(2, '0')}.${ext}`);
  fs.writeFileSync(outFile, buf);
  manifest.push({ file: outFile, caption: m[3] });
}
fs.writeFileSync(path.join(outDir, 'captions.json'), JSON.stringify(manifest, null, 2));
console.log('Extracted', i, 'legacy slides');
