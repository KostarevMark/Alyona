// One-off extraction script: pulls the 24 base64 <img> data URIs out of landing_v59.html,
// re-encodes them to WebP, writes them to assets/images/**, and rewrites src to relative paths.
// Not part of the site runtime — run once with `node tools/extract-images.mjs`.
//
// Exact inventory (verified by direct inspection of the source file):
//   idx0  hero decorative icon        (.v41-story-icon--portfolio)
//   idx1  about decorative icon       (.v41-story-icon--about)
//   idx2  conductor portrait          (#conductorPortraitImage)
//   idx3  locomotive nav thumbnail    (alt="Локомотив")
//   idx4  wagon-1 decorative icon     (.v41-story-icon--dacha)
//   idx5..23  19 wagon gallery photos (alt="<Title> — фотография N")

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const SOURCE_HTML = path.resolve(SITE_ROOT, '..', 'landing_v59.html');
const OUT_HTML = path.join(SITE_ROOT, 'index.raw.html');
const IMAGES_DIR = path.join(SITE_ROOT, 'assets', 'images');

const translitMap = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
function slugify(s) {
  return s
    .toLowerCase()
    .split('')
    .map(ch => translitMap[ch] !== undefined ? translitMap[ch] : ch)
    .join('')
    .replace(/[«»"'!]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function writeWebp(buffer, destFile) {
  await sharp(buffer).webp({ quality: 82 }).toFile(destFile);
}

async function main() {
  const html = fs.readFileSync(SOURCE_HTML, 'utf8');
  const $ = cheerio.load(html);

  const imgs = $('img[src^="data:image"]').toArray();
  console.log(`Found ${imgs.length} base64 <img> tags (expected 24).`);

  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  const manifest = [];

  for (const el of imgs) {
    const $img = $(el);
    const src = $img.attr('src');
    const alt = ($img.attr('alt') || '').trim();
    const m = /^data:image\/([a-zA-Z0-9.+-]+);base64,([\s\S]+)$/.exec(src);
    if (!m) { console.warn('Could not parse data URI for alt=', alt); continue; }
    const buffer = Buffer.from(m[2].trim(), 'base64');

    let destRelDir, baseName;
    const $storyIcon = $img.closest('.v41-story-icon');
    const $wagon = $img.closest('.wagon');

    if ($storyIcon.length) {
      const cls = ($storyIcon.attr('class') || '').split(/\s+/).find(c => c.startsWith('v41-story-icon--'));
      const variant = cls ? cls.replace('v41-story-icon--', '') : 'icon';
      destRelDir = 'misc/icons';
      baseName = `icon-${variant}`;
    } else if ($img.attr('id') === 'conductorPortraitImage') {
      destRelDir = 'hero';
      baseName = 'conductor-portrait';
    } else if (alt === 'Локомотив') {
      destRelDir = 'hero';
      baseName = 'loco-nav-thumb';
    } else if ($wagon.length) {
      const wagonIndex = $('.wagon').index($wagon);
      const title = $wagon.find('.wagon-title').first().text().trim() || `wagon-${wagonIndex}`;
      const slug = String(wagonIndex + 1).padStart(2, '0') + '-' + slugify(title);
      destRelDir = path.join('wagons', slug);
      const numMatch = /фотография\s+(\d+)/.exec(alt);
      const num = numMatch ? numMatch[1] : String(manifest.length + 1);
      baseName = `photo-${num}`;
    } else {
      destRelDir = 'misc';
      baseName = slugify(alt) || `image-${manifest.length + 1}`;
      console.warn('Unclassified image, alt=', alt);
    }

    const destDir = path.join(IMAGES_DIR, destRelDir);
    fs.mkdirSync(destDir, { recursive: true });
    const destFile = path.join(destDir, `${baseName}.webp`);
    const destRelPath = 'assets/images/' + path.join(destRelDir, `${baseName}.webp`).replace(/\\/g, '/');

    await writeWebp(buffer, destFile);
    $img.attr('src', destRelPath);
    const outBytes = fs.statSync(destFile).size;
    manifest.push({ alt, dest: destRelPath, originalBytes: buffer.length, webpBytes: outBytes });
  }

  fs.writeFileSync(OUT_HTML, $.html());
  fs.writeFileSync(path.join(SITE_ROOT, 'assets', 'manifest.json'), JSON.stringify(manifest, null, 2));

  const totalOrig = manifest.reduce((a, x) => a + (x.originalBytes || 0), 0);
  const totalOut = manifest.reduce((a, x) => a + (x.webpBytes || x.originalBytes || 0), 0);
  console.log(`Extracted ${manifest.length} images.`);
  console.log(`Original total: ${(totalOrig / 1024 / 1024).toFixed(2)} MB -> WebP total: ${(totalOut / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Wrote ${OUT_HTML}`);
  console.log(`Wrote manifest: assets/manifest.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
