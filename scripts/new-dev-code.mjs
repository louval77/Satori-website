// Creates a new developer access code and replaces the old one.
// Run: node scripts/new-dev-code.mjs   then publish again (push to GitHub).
// The new code is written to DEVELOPER-ACCESS.txt (private, never uploaded).
import crypto from 'node:crypto';
import fs from 'node:fs';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 letters: no 0/O or 1/I mix-ups
const group = () => Array.from(crypto.randomBytes(4), (b) => ALPHABET[b % 32]).join('');
const code = `SATORI-${group()}-${group()}-${group()}-${group()}`;
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.createHash('sha256').update(`${salt}:${code}`).digest('hex');

let config = fs.readFileSync('src/config.ts', 'utf8');
config = config.replace(/salt: '[0-9a-f]+'/, `salt: '${salt}'`).replace(/sha256: '[0-9a-f]+'/, `sha256: '${hash}'`);
fs.writeFileSync('src/config.ts', config);
fs.writeFileSync('.dev-access.json', JSON.stringify({ code, salt, hash }, null, 2));

const note = fs.existsSync('DEVELOPER-ACCESS.txt') ? fs.readFileSync('DEVELOPER-ACCESS.txt', 'utf8') : 'Code:  \r\n';
fs.writeFileSync('DEVELOPER-ACCESS.txt', note.replace(/Code: {2}\S*/, `Code:  ${code}`));

console.log('New developer code saved in DEVELOPER-ACCESS.txt. Publish the site again to activate it.');
