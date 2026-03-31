import sharp from 'sharp';
import path from 'path';

const desktop = path.join('C:', 'Users', 'user', 'Desktop');

// 심볼만 정방향 SVG
const squareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">
  <g transform="translate(300, 300) scale(14)">
    <path
      d="M 4 30 C 10 30 12 22 18 18 C 24 14 26 20 32 14 C 36 10 38 8 42 6"
      stroke="url(#curveGrad)"
      stroke-width="2.4"
      stroke-linecap="round"
      fill="none"
    />
    <circle cx="42" cy="6" r="3" fill="#ef4444" opacity="0.9"/>
    <circle cx="42" cy="6" r="5.5" fill="#ef4444" opacity="0.2"/>
  </g>
  <defs>
    <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
  </defs>
</svg>`;

await sharp(Buffer.from(squareSvg), { density: 300 })
  .resize(1200, 1200)
  .png()
  .toFile(path.join(desktop, 'bitline-google-ads-logo.png'));

console.log('완료 — 1200x1200 정방향');
