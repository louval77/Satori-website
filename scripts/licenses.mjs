// Writes public/third-party-licenses.txt with the licence of every library and font
// that ships to visitors. Run after changing dependencies: node scripts/licenses.mjs
import fs from 'node:fs';
import path from 'node:path';

const PACKAGES = [
  'react',
  'react-dom',
  'scheduler',
  'motion',
  'framer-motion',
  'motion-dom',
  'motion-utils',
  'lucide-react',
  'flag-icons',
  'tailwindcss',
  '@fontsource-variable/bricolage-grotesque',
  '@fontsource-variable/manrope',
];

const out = ['Third-party software and fonts used by SATORI Personal Admission Route', '='.repeat(72), ''];
for (const name of PACKAGES) {
  const dir = path.join('node_modules', name);
  if (!fs.existsSync(dir)) continue;
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  const licenseFile = fs.readdirSync(dir).find((f) => /^(licen[cs]e|copying)(\.(md|txt))?$/i.test(f));
  out.push(`${name} ${pkg.version} (${pkg.license ?? 'see below'})`, '-'.repeat(72));
  out.push(licenseFile ? fs.readFileSync(path.join(dir, licenseFile), 'utf8').trim() : `Licence: ${pkg.license}`, '', '');
}
fs.writeFileSync('public/third-party-licenses.txt', out.join('\n'));
console.log('public/third-party-licenses.txt written');
