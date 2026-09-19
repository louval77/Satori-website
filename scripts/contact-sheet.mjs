// Builds a labelled contact sheet of Commons candidates so photos can be compared visually.
// One API request for all titles, then polite, sequential thumbnail downloads.
import sharp from 'sharp';
const UA = 'SATORI-PersonalAdmissionRoute/1.0 (hackathon project; image credit lookup)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const [out, ...titles] = process.argv.slice(2);
const W = 360, H = 270;
const u = new URL('https://commons.wikimedia.org/w/api.php');
Object.entries({ action: 'query', format: 'json', titles: titles.join('|'), prop: 'imageinfo', iiprop: 'url', iiurlwidth: '480' }).forEach(([k, v]) => u.searchParams.set(k, v));
const j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json();
const norm = Object.fromEntries((j.query.normalized ?? []).map((n) => [n.to, n.from]));
const byTitle = {};
for (const p of Object.values(j.query.pages)) byTitle[norm[p.title] ?? p.title] = p.imageinfo?.[0]?.thumburl;
const tiles = [];
for (const [i, t] of titles.entries()) {
  const url = byTitle[t];
  if (!url) { console.log('missing', t); continue; }
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) { console.log('http', res.status, t); await sleep(3000); continue; }
  const img = await sharp(Buffer.from(await res.arrayBuffer())).resize(W, H, { fit: 'cover' }).toBuffer();
  const label = Buffer.from(`<svg width="${W}" height="28"><rect width="100%" height="100%" fill="black" opacity="0.7"/><text x="6" y="19" font-size="15" fill="white" font-family="Arial">${i + 1}</text></svg>`);
  tiles.push({ input: await sharp(img).composite([{ input: label, top: 0, left: 0 }]).toBuffer(), left: (i % 4) * W, top: Math.floor(i / 4) * H });
  await sleep(700);
}
const rows = Math.ceil(titles.length / 4);
await sharp({ create: { width: 4 * W, height: rows * H, channels: 3, background: '#222' } }).composite(tiles).jpeg({ quality: 80 }).toFile(out);
console.log('ok', out, tiles.length);
