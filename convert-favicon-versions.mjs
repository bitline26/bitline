import sharp from 'sharp';
import path from 'path';

const desktop = path.join('C:', 'Users', 'user', 'Desktop');

// 올화이트 — 모든 요소 흰색, 투명 배경
const whiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 40" fill="none">
  <path d="M 4 30 C 10 30 12 22 18 18 C 24 14 26 20 32 14 C 36 10 38 8 42 6"
    stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" fill="none"/>
  <circle cx="42" cy="6" r="3" fill="#ffffff" opacity="0.9"/>
  <circle cx="42" cy="6" r="5.5" fill="#ffffff" opacity="0.2"/>
  <text x="54" y="27"
    font-family="'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif"
    font-size="18" font-weight="700" letter-spacing="-1" fill="#ffffff">비트라인</text>
  <path d="M 54 31 Q 97 34 142 31"
    stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.6"/>
</svg>`;

// 올블랙 — 모든 요소 검정, 투명 배경
const blackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 40" fill="none">
  <path d="M 4 30 C 10 30 12 22 18 18 C 24 14 26 20 32 14 C 36 10 38 8 42 6"
    stroke="#000000" stroke-width="2.4" stroke-linecap="round" fill="none"/>
  <circle cx="42" cy="6" r="3" fill="#000000" opacity="0.9"/>
  <circle cx="42" cy="6" r="5.5" fill="#000000" opacity="0.2"/>
  <text x="54" y="27"
    font-family="'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif"
    font-size="18" font-weight="700" letter-spacing="-1" fill="#000000">비트라인</text>
  <path d="M 54 31 Q 97 34 142 31"
    stroke="#000000" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.6"/>
</svg>`;

await sharp(Buffer.from(whiteSvg), { density: 300 })
  .resize(512, 122).png().toFile(path.join(desktop, 'bitline-logo-white.png'));

await sharp(Buffer.from(blackSvg), { density: 300 })
  .resize(512, 122).png().toFile(path.join(desktop, 'bitline-logo-black.png'));

console.log('완료');
