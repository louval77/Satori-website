// Searches Wikimedia Commons for freely licensed photos and prints license metadata.
// Usage: node scripts/find-photos.mjs "search terms" [limit]
const UA = 'SATORI-PersonalAdmissionRoute/1.0 (hackathon project; image credit lookup)';
const q = process.argv[2];
const limit = Number(process.argv[3] || 8);
const url = new URL('https://commons.wikimedia.org/w/api.php');
Object.entries({
  action: 'query', format: 'json', generator: 'search', gsrnamespace: '6', gsrlimit: String(limit),
  gsrsearch: `${q} filetype:bitmap`, prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '1600',
}).forEach(([k, v]) => url.searchParams.set(k, v));
const res = await fetch(url, { headers: { 'User-Agent': UA } });
const data = await res.json();
const pages = Object.values(data.query?.pages ?? {}).sort((a, b) => a.index - b.index);
for (const p of pages) {
  const ii = p.imageinfo?.[0]; if (!ii) continue;
  const m = ii.extmetadata ?? {};
  const strip = (s) => (s ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 70);
  console.log(`${p.title} | ${ii.width}x${ii.height} | ${strip(m.LicenseShortName?.value)} | by ${strip(m.Artist?.value)}`);
}
