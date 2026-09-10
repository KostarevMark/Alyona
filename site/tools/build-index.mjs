// Builds the final site/index.html from site/index.raw.html:
//  - removes all inline <style> and <script> blocks (content now lives in css/js files)
//  - adds <link>/<script src> references to the extracted files
//  - inserts the revived manifesto text next to the conductor portrait
//  - fixes the mismatched .car-rtag badges (content-verified mapping, see plan doc)
//  - fixes one remaining hardcoded old-palette color in inline SVG markup
import fs from 'node:fs';
import path from 'node:path';

const SITE_ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(SITE_ROOT, 'index.raw.html');
const OUT = path.join(SITE_ROOT, 'index.html');

// 1-indexed [start,end] inclusive line ranges to delete (all <style>/<script> blocks
// whose content has been extracted verbatim into css/styles.css and js/*.js).
const DELETE_RANGES = [
  [193, 68524],   // main <style>
  [68572, 68587], // v28-client-fixes
  [68588, 68603], // v29-portrait-position
  [68604, 68649], // v32-final-fixes
  [68650, 68663], // v33-contact-fixes
  [68664, 68734], // <style>
  [86425, 97623], // main <script> (kept parts moved to core/wagon-state.js, core/photo-carousel.js note: photoStates/changePhoto is a SEPARATE block below, reveal.js, effects.js; dropped: dead dots-carousel, dead PF_SLIDES presentation)
  [97911, 97931], // photoStates/changePhoto -> core/photo-carousel.js
  [97933, 97949], // wagon-height-sync -> core/wagon-state.js
  [97950, 98038], // hero restructure + wagonNav drag -> js/layout.js (drag part dropped)
  [98039, 98073], // v28-mobile-controls -> nav-controller.js
  [98074, 98084], // v36-contact-toggle -> js/contact.js
  [98116, 98507], // ue-panel -> js/visual-editor.js
  [98510, 98531], // V52 -> nav-controller.js
  [98534, 98591], // V53 drag + inline-style neutralizer -> nav-controller.js / visual-editor.js
  [98593, 98614], // V56 crop hack -> js/layout.js
  [98615, 98660], // <style> (mobile compat CSS) -> css/styles.css
  [98661, 98677], // old no-PointerEvent touch fallback -> DELETED (dead code)
  [98678, 98684], // <style>
  [98685, 98729], // v59-ios-direct-controller -> DELETED (bug: suppressed canonical handlers)
];

const html = fs.readFileSync(SRC, 'utf8');
const lines = html.split('\n');

const toDelete = new Set();
for (const [s, e] of DELETE_RANGES) {
  for (let i = s; i <= e; i++) toDelete.add(i); // 1-indexed
}

let kept = [];
for (let i = 0; i < lines.length; i++) {
  const lineNo = i + 1;
  if (!toDelete.has(lineNo)) kept.push(lines[i]);
}
let out = kept.join('\n');

// --- head: stylesheet link ---
out = out.replace(
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5">',
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5">\n<link rel="stylesheet" href="css/styles.css">'
);

// --- body: script tags before </body> ---
const scriptTags = [
  'js/core/wagon-state.js',
  'js/core/photo-carousel.js',
  'js/reveal.js',
  'js/effects.js',
  'js/layout.js',
  'js/nav-controller.js',
  'js/visual-editor.js',
  'js/contact.js',
].map(src => `<script src="${src}"></script>`).join('\n');
out = out.replace('</body>', scriptTags + '\n</body>');

// --- revive the manifesto next to the conductor portrait ---
const manifestoHtml =
  '<blockquote class="conductor-quote">' +
  '«Мне кажется, каждый креатор — это начальник поезда, который делает путешествие своих «пассажиров» незабываемым. ' +
  'Мой поезд прицеплял самые разные вагоны. В каждом я создавала особый мир и уют. ' +
  'Приглашаю вас в мой поезд-портфолио. Счастливого пути!»' +
  '</blockquote><p class="conductor-sig">— Алёна Лаптева</p>';
const conductorMarker = '<figure class="conductor-portrait" id="conductorPortrait"><img src="assets/images/hero/conductor-portrait.webp" alt="Алёна Лаптева в образе проводника" width="2160" height="3840" decoding="async" id="conductorPortraitImage" draggable="false"></figure>';
if (!out.includes(conductorMarker)) throw new Error('conductor portrait marker not found — check extraction output');
out = out.replace(conductorMarker, conductorMarker + manifestoHtml);

// --- fix mismatched car-rtag badges (content-verified against each wagon's own case description) ---
const badgeFixes = [
  ['<span class="car-rtag">Корпоратив · Нью-Йорк</span>', '<span class="car-rtag">Новогоднее мероприятие · Кино</span>'], // wagon 2 "Кинопленка чудес"
  ['<span class="car-rtag">Профессиональный праздник</span>', '<span class="car-rtag">Тестовое задание · Юбилей 25 лет</span>'], // wagon 3 "Бани Лаптевой"
  ['<span class="car-rtag">Новогоднее мероприятие · Кино</span>', '<span class="car-rtag">Профессиональный праздник</span>'], // wagon 4 "День водителя"
  ['<span class="car-rtag">Командный дух · Спорт</span>', '<span class="car-rtag">Корпоратив · Нью-Йорк</span>'], // wagon 5 "5th Avenue"
  ['<span class="car-rtag">Александр &amp; Валерия</span>', '<span class="car-rtag">Командный дух · Спорт</span>'], // wagon 6 "Спартакиада"
  ['<span class="car-rtag">Дарья &amp; Андрей · Путешествие</span>', '<span class="car-rtag">Дарья &amp; Андрей</span>'], // wagon 7 "Лаборатория любви"
  ['<span class="car-rtag">Спецпроект · ADG Group</span>', '<span class="car-rtag">Александр &amp; Валерия</span>'], // wagon 8 "Как в кино!"
];
// Apply via placeholder tokens first so the fixes don't cascade into each other
// (several old values equal other rows' new values).
badgeFixes.forEach(([oldTag], i) => {
  if (out.includes(oldTag)) {
    out = out.replace(oldTag, `__BADGE_PLACEHOLDER_${i}__`);
  } else {
    throw new Error('badge not found: ' + oldTag);
  }
});
badgeFixes.forEach(([, newTag], i) => {
  out = out.replace(`__BADGE_PLACEHOLDER_${i}__`, newTag);
});
// wagon 1 "Крыша «Дача»" had no badge at all — add one right after its car-num span.
const wagon1Marker = '<span class="car-num">01</span>';
if (!out.includes(wagon1Marker)) throw new Error('wagon 1 car-num marker not found');
out = out.replace(wagon1Marker, wagon1Marker + '<span class="car-rtag">Спецпроект · ADG Group</span>');

// --- remaining hardcoded old-gold in the hero-scroll inline SVG ---
out = out.replaceAll('stroke="#d4a843"', 'stroke="#D9A15F"');

fs.writeFileSync(OUT, out);
console.log('Wrote', OUT, `(${(out.length / 1024 / 1024).toFixed(2)} MB)`);
