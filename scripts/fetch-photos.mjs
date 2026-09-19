// Downloads the chosen Wikimedia Commons photos and records their license/author for the credits page.
// Run once: node scripts/fetch-photos.mjs   (then: npm run images)
import fs from 'node:fs';
const UA = 'SATORI-PersonalAdmissionRoute/1.0 (hackathon project; image credit lookup)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PHOTOS = [
  { id: 'cn-pku-boya-tower', dest: 'CN', title: 'File:Peking University tower.jpg', alt: 'Boya Pagoda rising above the trees on the Peking University campus in Beijing' },
  { id: 'cn-tsinghua-old-gate', dest: 'CN', title: 'File:Former gate of Tsinghua University 2.JPG', alt: 'The white Old Gate of Tsinghua University in Beijing on a rainy day' },
  { id: 'hk-hku-main-building', dest: 'HK', title: 'File:Main Building HKU 20100926 03.JPG', alt: 'The historic Main Building of the University of Hong Kong with its clock tower' },
  { id: 'hk-victoria-harbour', dest: 'HK', title: 'File:Victoria Harbour skyscrapers.jpg', alt: 'Hong Kong Island skyscrapers lit up at night across Victoria Harbour' },
  { id: 'kr-yonsei-underwood-hall', dest: 'KR', title: 'File:Underwood Hall Front.jpg', alt: 'Ivy-covered Underwood Hall at Yonsei University in Seoul behind a formal garden' },
  { id: 'kr-seoul-skyline', dest: 'KR', title: 'File:Seoul Skyline Night 2018.jpg', alt: 'Seoul skyline at night with Lotte World Tower reflected in the Han River' },
  { id: 'jp-kyoto-clock-tower', dest: 'JP', title: 'File:Kyoto University clocktower from north.JPG', alt: 'Kyoto University clock tower seen through cherry blossom branches' },
  { id: 'jp-waseda-okuma', dest: 'JP', title: 'File:Waseda University - Okuma Statue and Okuma Auditorium.JPG', alt: 'Okuma Auditorium clock tower and the Okuma statue at Waseda University in Tokyo' },
];
const u = new URL('https://commons.wikimedia.org/w/api.php');
Object.entries({ action: 'query', format: 'json', titles: PHOTOS.map((p) => p.title).join('|'), prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '2000' })
  .forEach(([k, v]) => u.searchParams.set(k, v));
const j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json();
const norm = Object.fromEntries((j.query.normalized ?? []).map((n) => [n.to, n.from]));
const info = {};
for (const p of Object.values(j.query.pages)) info[norm[p.title] ?? p.title] = p.imageinfo[0];
const clean = (s) => (s ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
fs.mkdirSync('scripts/.raw', { recursive: true });
const credits = [];
for (const p of PHOTOS) {
  const ii = info[p.title];
  const m = ii.extmetadata;
  const file = `scripts/.raw/${p.id}.jpg`;
  if (!fs.existsSync(file)) {
    const res = await fetch(ii.thumburl ?? ii.url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`${res.status} for ${p.title}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    await sleep(1500);
  }
  credits.push({
    id: p.id, destination: p.dest, alt: p.alt,
    title: p.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, ''),
    author: clean(m.Artist?.value) || 'Unknown',
    license: clean(m.LicenseShortName?.value),
    licenseUrl: m.LicenseUrl?.value?.replace(/^http:/, 'https:') ?? null,
    sourceUrl: ii.descriptionurl,
  });
  console.log(p.id, '|', credits.at(-1).license, '|', credits.at(-1).author);
}
fs.writeFileSync('src/data/photo-credits.json', JSON.stringify(credits, null, 2) + '\n');
console.log('wrote src/data/photo-credits.json');
