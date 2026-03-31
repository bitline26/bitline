import sharp from 'sharp';
import { readFileSync } from 'fs';
import path from 'path';

const svg = readFileSync(path.join('C:', 'Users', 'user', 'Desktop', 'bitline', 'src', 'assets', 'logo-horizontal.svg'));
await sharp(Buffer.from(svg), { density: 300 })
  .png()
  .toFile(path.join('C:', 'Users', 'user', 'Desktop', 'bitline-logo.png'));

console.log('완료');
