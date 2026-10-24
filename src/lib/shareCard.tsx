import { renderToStaticMarkup } from 'react-dom/server';
import { WeaponArt } from '../components/cards/WeaponArt';
import { RuneRing } from '../components/motion/RuneRing';
import { STAT_LABELS } from '../data/forge';
import { mulberry32 } from './landscape';
import type { StatKey, WeaponResult } from '../types';

const W = 1080;
const H = 1350;
const STATS: StatKey[] = ['might', 'grace', 'resonance', 'spirit'];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function loadSvg(markup: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  });
}

/** Draws a shareable 1080x1350 card for a forged weapon. */
export async function renderShareCard(weapon: WeaponResult): Promise<Blob> {
  try {
    await Promise.all([document.fonts.load('600 80px "Cormorant Garamond"'), document.fonts.load('500 28px "Inter"')]);
  } catch {
    /* fall back to system serif/sans */
  }

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');

  const [c1, c2] = weapon.affinity.colors;
  const rand = mulberry32(hash(weapon.id));

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#10181a');
  bg.addColorStop(0.6, '#1b2626');
  bg.addColorStop(1, '#0c1213');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const aura = ctx.createRadialGradient(W / 2, 560, 20, W / 2, 560, 620);
  aura.addColorStop(0, `${c2}66`);
  aura.addColorStop(1, `${c2}00`);
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 90; i++) {
    ctx.globalAlpha = 0.15 + rand() * 0.5;
    ctx.fillStyle = rand() < 0.5 ? c1 : '#f2eee5';
    ctx.beginPath();
    ctx.arc(rand() * W, rand() * 960, 0.8 + rand() * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = 'rgba(182,154,97,0.7)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, W - 72, H - 72);
  ctx.strokeStyle = 'rgba(182,154,97,0.3)';
  ctx.strokeRect(52, 52, W - 104, H - 104);

  const ring = await loadSvg(
    renderToStaticMarkup(<RuneRing color={c2} accent={c1} />).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" '),
  );
  ctx.globalAlpha = 0.85;
  ctx.drawImage(ring, W / 2 - 450, 540 - 450, 900, 900);
  ctx.globalAlpha = 1;

  const art = await loadSvg(
    renderToStaticMarkup(
      <WeaponArt shape={weapon.form.id} affinity={weapon.affinity.id} glow={1} runes={weapon.rarity.runes} />,
    ).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="380" height="798" '),
  );
  ctx.drawImage(art, W / 2 - 190, 140, 380, 798);

  ctx.textAlign = 'center';
  ctx.fillStyle = weapon.rarity.color;
  ctx.font = '600 26px Inter, system-ui, sans-serif';
  ctx.fillText(`${weapon.rarity.name.toUpperCase()}  ·  ${weapon.affinity.name.toUpperCase()}`, W / 2, 112);

  ctx.fillStyle = '#f2eee5';
  ctx.font = '600 76px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(weapon.name, W / 2, 1076);
  ctx.fillStyle = c1;
  ctx.font = 'italic 500 38px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(weapon.title, W / 2, 1126);

  ctx.textAlign = 'left';
  ctx.font = '500 21px Inter, system-ui, sans-serif';
  const colW = 210;
  STATS.forEach((k, i) => {
    const x = 120 + i * colW;
    ctx.fillStyle = 'rgba(242,238,229,0.7)';
    ctx.fillText(`${STAT_LABELS[k]}  ${weapon.stats[k]}`, x, 1180);
    ctx.fillStyle = 'rgba(242,238,229,0.14)';
    ctx.fillRect(x, 1194, colW - 20, 8);
    ctx.fillStyle = c2;
    ctx.fillRect(x, 1194, Math.min(1, weapon.stats[k] / 18) * (colW - 20), 8);
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(242,238,229,0.55)';
  ctx.font = '500 22px Inter, system-ui, sans-serif';
  ctx.fillText(`Forged from ${weapon.materials[0].name} & ${weapon.materials[1].name}`, W / 2, 1256);
  ctx.fillStyle = '#b69a61';
  ctx.font = '600 22px Inter, system-ui, sans-serif';
  ctx.fillText('BEYOND THE CLOUDS', W / 2, 1296);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode image'))), 'image/png'));
}

export async function shareWeapon(weapon: WeaponResult): Promise<'shared' | 'downloaded'> {
  const blob = await renderShareCard(weapon);
  const file = new File([blob], `${weapon.id.replace(/[:+]/g, '-')}.png`, { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: `${weapon.name} ${weapon.title}`, text: 'I forged this in Beyond the Clouds.' });
      return 'shared';
    } catch (e) {
      if ((e as DOMException).name === 'AbortError') return 'shared';
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return 'downloaded';
}
