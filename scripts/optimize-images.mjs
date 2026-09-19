// Compresses the raw Commons photos into small WebP files used by the site.
// Input:  scripts/.raw/<id>.jpg   (downloaded by scripts/fetch-photos.mjs)
// Output: public/images/<id>-rail.webp  (tall crop for the side photo rails)
//         public/images/<id>-wide.webp  (1400px wide, hero and destination cards)
//         public/images/<id>-sm.webp    (720px wide, phones)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const RAW = 'scripts/.raw';
const OUT = 'public/images';
fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(RAW).filter((f) => f.endsWith('.jpg'));
let before = 0;
let after = 0;

for (const file of files) {
  const id = path.basename(file, '.jpg');
  const src = path.join(RAW, file);
  before += fs.statSync(src).size;

  const jobs = [
    { name: `${id}-rail.webp`, pipeline: sharp(src).rotate().resize(640, 1100, { fit: 'cover', position: 'attention' }) },
    { name: `${id}-wide.webp`, pipeline: sharp(src).rotate().resize({ width: 1400, withoutEnlargement: true }) },
    { name: `${id}-sm.webp`, pipeline: sharp(src).rotate().resize({ width: 720, withoutEnlargement: true }) },
  ];

  for (const job of jobs) {
    const dest = path.join(OUT, job.name);
    await job.pipeline.webp({ quality: 66, effort: 6 }).toFile(dest);
    after += fs.statSync(dest).size;
  }
  console.log(`compressed ${id}`);
}

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(`raw photos: ${mb(before)} MB -> optimized total (3 sizes each): ${mb(after)} MB`);
