import { useId } from 'react';
import { AFFINITIES } from '../../data/forge';
import type { Affinity } from '../../types';

export type Shape = 'sword' | 'spear' | 'fan' | 'lantern' | 'seal';

interface Props {
  shape: Shape;
  affinity: Affinity;
  /** 0 = dim silhouette, 1 = fully lit */
  glow?: number;
  /** extra rune marks along the weapon, tied to rarity */
  runes?: number;
  className?: string;
  title?: string;
}

/** Hand-drawn weapons and relics, all on one 200x420 canvas so they swap in place. */
export function WeaponArt({ shape, affinity, glow = 1, runes = 0, className = '', title }: Props) {
  const uid = useId().replace(/:/g, '');
  const [c1, c2] = AFFINITIES[affinity].colors;
  const metal = `url(#${uid}-metal)`;
  const lit = `url(#${uid}-lit)`;

  return (
    <svg
      viewBox="0 0 200 420"
      className={`weapon-art ${className}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ ['--glow' as string]: glow }}
    >
      <defs>
        <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5f7ba3" />
          <stop offset="0.5" stopColor="#f4fbff" />
          <stop offset="1" stopColor="#5a73a0" />
        </linearGradient>
        <linearGradient id={`${uid}-lit`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <radialGradient id={`${uid}-aura`}>
          <stop offset="0" stopColor={c2} stopOpacity="0.55" />
          <stop offset="1" stopColor={c2} stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-soft`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <ellipse cx="100" cy="210" rx="96" ry="190" fill={`url(#${uid}-aura)`} opacity={glow} className="weapon-art__aura" />

      <g className="weapon-art__body" opacity={0.35 + glow * 0.65}>
        {shape === 'sword' && (
          <>
            <path d="M100 4 L108 52 L106 272 L100 286 L94 272 L92 52Z" fill={metal} />
            <path d="M100 30 L100 270" stroke={lit} strokeWidth="3" opacity={0.4 + glow * 0.6} />
            <path d="M100 4 L108 52 L100 48 L92 52Z" fill="#fff" opacity="0.6" />
            <path d="M58 286 Q100 270 142 286 L136 298 Q100 288 64 298Z" fill="#e7c47a" />
            <rect x="94" y="296" width="12" height="62" rx="5" fill="#2b3232" />
            <path d="M94 308 L106 316 M94 322 L106 330 M94 336 L106 344" stroke="#e7c47a" strokeWidth="2" />
            <circle cx="100" cy="366" r="9" fill="#e7c47a" />
            <path d="M100 374 Q92 392 98 410 M100 374 Q108 394 102 414" stroke={lit} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        )}
        {shape === 'spear' && (
          <>
            <rect x="97" y="96" width="6" height="320" rx="3" fill="#2b3232" />
            <path d="M100 8 Q122 52 116 98 L100 112 L84 98 Q78 52 100 8Z" fill={metal} />
            <path d="M100 22 L100 100" stroke={lit} strokeWidth="3" opacity={0.4 + glow * 0.6} />
            <path d="M84 112 L100 124 L116 112 L112 132 L100 138 L88 132Z" fill="#e7c47a" />
            <path d="M100 138 Q82 168 90 214 M100 138 Q118 170 110 216" stroke={lit} strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="93" y="236" width="14" height="6" rx="3" fill="#e7c47a" />
            <rect x="93" y="330" width="14" height="6" rx="3" fill="#e7c47a" />
          </>
        )}
        {shape === 'fan' && (
          <>
            {(() => {
              // A folded-open fan: ribs and silk panel share one pivot, sized to fit the 200-wide frame.
              const px = 100;
              const py = 310;
              const L = 200;
              const spread = 33;
              const pt = (deg: number, r: number) => {
                const a = (deg * Math.PI) / 180;
                return [px + Math.sin(a) * r, py - Math.cos(a) * r] as const;
              };
              const [lx, ly] = pt(-spread, L - 12);
              const [rx, ry] = pt(spread, L - 12);
              const ribs = Array.from({ length: 8 }, (_, i) => -spread + (i * spread * 2) / 7);
              return (
                <>
                  <path d={`M${px} ${py} L${lx} ${ly} A${L - 12} ${L - 12} 0 0 1 ${rx} ${ry}Z`} fill={metal} opacity="0.6" />
                  <path d={`M${px} ${py} L${lx} ${ly} A${L - 12} ${L - 12} 0 0 1 ${rx} ${ry}Z`} fill={lit} opacity={0.2 + glow * 0.45} />
                  {ribs.map((d, i) => {
                    const [x, y] = pt(d, L);
                    return <line key={i} x1={px} y1={py} x2={x} y2={y} stroke="#e7c47a" strokeWidth="2.4" strokeLinecap="round" />;
                  })}
                  <path d={`M${lx} ${ly} A${L - 12} ${L - 12} 0 0 1 ${rx} ${ry}`} fill="none" stroke="#e7c47a" strokeWidth="1.6" opacity="0.8" />
                  <rect x="94" y="304" width="12" height="86" rx="6" fill="#2b3232" />
                  <circle cx="100" cy="308" r="7" fill="#e7c47a" />
                  <path d="M100 390 Q92 404 98 418" stroke={lit} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </>
              );
            })()}
          </>
        )}
        {shape === 'lantern' && (
          <>
            <path d="M100 60 L100 110" stroke="#2b3232" strokeWidth="3" />
            <path d="M62 120 Q100 98 138 120 L128 134 L72 134Z" fill="#e7c47a" />
            <path d="M72 134 Q54 210 76 276 L124 276 Q146 210 128 134Z" fill={lit} opacity="0.5" />
            <path d="M72 134 Q54 210 76 276 L124 276 Q146 210 128 134Z" fill="none" stroke="#2b3232" strokeWidth="2.5" />
            <ellipse cx="100" cy="206" rx="14" ry="28" fill="#fff" opacity={0.3 + glow * 0.6} filter={`url(#${uid}-soft)`} />
            <rect x="74" y="276" width="52" height="12" rx="4" fill="#e7c47a" />
            <path d="M100 288 Q92 312 98 340 M100 288 Q108 316 102 344" stroke={lit} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        )}
        {shape === 'seal' && (
          <>
            <rect x="52" y="168" width="96" height="96" rx="12" fill="#2b2326" />
            <rect x="60" y="176" width="80" height="80" rx="8" fill="none" stroke="#e7c47a" strokeWidth="2" />
            <path d="M80 200 L120 200 M100 200 L100 240 M82 224 L118 224" stroke={lit} strokeWidth="4" strokeLinecap="round" opacity={0.5 + glow * 0.5} />
            <path d="M76 168 Q76 120 100 108 Q124 120 124 168Z" fill="#3a2e30" />
            <circle cx="100" cy="100" r="12" fill="#e7c47a" />
            <path d="M100 112 L100 126" stroke="#e7c47a" strokeWidth="3" />
          </>
        )}
      </g>

      {glow > 0.5 && shape !== 'seal' && (
        <g className="weapon-art__wisps" fill="none" stroke={c1} strokeLinecap="round" filter={`url(#${uid}-soft)`} opacity={0.35 + glow * 0.4}>
          <path d="M40 330 C 10 270, 60 230, 30 170 S 60 80, 36 30" strokeWidth="3" />
          <path d="M160 340 C 192 280, 144 236, 172 176 S 144 90, 166 40" strokeWidth="3" />
          <path d="M70 380 C 40 330, 90 300, 64 250" strokeWidth="2" />
        </g>
      )}

      {runes > 0 && (
        <g className="weapon-art__runes" fill={c1} opacity={glow}>
          {Array.from({ length: runes }, (_, i) => (
            <path key={i} d={`M${24 + i * 4} ${130 + i * 46} l6 -8 l6 8 l-6 8z`} />
          ))}
          {Array.from({ length: runes }, (_, i) => (
            <path key={`b${i}`} d={`M${164 - i * 4} ${130 + i * 46} l6 -8 l6 8 l-6 8z`} />
          ))}
        </g>
      )}
    </svg>
  );
}
