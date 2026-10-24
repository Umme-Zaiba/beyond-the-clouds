// Renders public/og.png (1200x630) from the same scene components the site uses.
// Run with: npm run og
import { writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { renderToStaticMarkup } from 'react-dom/server';
import { Landscape } from '../src/components/motion/Landscape';
import { RuneRing } from '../src/components/motion/RuneRing';
import { WeaponArt } from '../src/components/cards/WeaponArt';
import type { Palette } from '../src/types';

const palette: Palette = {
  skyTop: '#070a28',
  skyMid: '#3a3190',
  skyBottom: '#f0a8c8',
  far: '#5560b8',
  mid: '#3a4194',
  near: '#1c2160',
  glow: '#ffe9b8',
  glow2: '#9fe6ff',
  mist: '#ffe4ef',
};

const pick = (html: string) => html.slice(html.indexOf('<svg'), html.lastIndexOf('</svg>') + 6);
const place = (svg: string, attrs: string) => svg.replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" ${attrs} `);

const scene = pick(renderToStaticMarkup(<Landscape palette={palette} seed={5} features={{ stars: true, islands: true }} />));
const ring = pick(renderToStaticMarkup(<RuneRing color="#9fe6ff" accent="#e7c47a" />));
const sword = pick(renderToStaticMarkup(<WeaponArt shape="sword" affinity="wind" glow={1} runes={3} />));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="t" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.2" stop-color="#ffffff"/><stop offset="0.6" stop-color="#d3ecff"/><stop offset="1" stop-color="#f1c9ff"/>
    </linearGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#050724" stop-opacity="0.78"/><stop offset="0.62" stop-color="#050724" stop-opacity="0"/>
    </linearGradient>
  </defs>
  ${place(scene, 'x="0" y="0" width="1200" height="630"')}
  <rect width="1200" height="630" fill="url(#shade)"/>
  ${place(ring, 'x="690" y="60" width="480" height="480"')}
  ${place(sword, 'x="813" y="95" width="234" height="450"')}
  <text x="72" y="196" font-family="Georgia, serif" font-size="20" letter-spacing="5" fill="#c4ecff">AN INTERACTIVE XIANXIA WORLD</text>
  <text x="68" y="318" font-family="Georgia, serif" font-size="112" fill="url(#t)">Beyond</text>
  <text x="68" y="424" font-family="Georgia, serif" font-size="112" fill="url(#t)">the Clouds</text>
  <text x="72" y="486" font-family="Georgia, serif" font-style="italic" font-size="30" fill="#f0cf8c">Ascend the clouds. Pass the trials. Forge a legend.</text>
  <rect x="72" y="520" width="240" height="46" rx="23" fill="#8f88ff"/>
  <text x="192" y="550" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="18" fill="#071022">Begin the Ascent</text>
</svg>`;

const png = new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: 'Georgia' } }).render().asPng();
writeFileSync(new URL('../public/og.png', import.meta.url), png);
console.log(`og.png written (${Math.round(png.length / 1024)} KB)`);
