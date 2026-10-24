import { useId } from 'react';

const GLYPHS = ['云', '仙', '界', '器', '封', '宝', '海', '玉', '焰', '渊', '谷', '锻'];

/** The eight trigrams, each as three lines: 1 is solid, 0 is broken. Read from the outer line inward. */
const TRIGRAMS = ['111', '110', '101', '100', '011', '010', '001', '000'];

/**
 * A glowing seal circle in the Daoist manner: a graduated outer ring, a ring of characters,
 * the eight trigrams and a lotus at the centre. Turns slowly. No stars or polygons.
 */
export function RuneRing({ color = '#8ee9ff', accent = '#e7c47a', className = '' }: { color?: string; accent?: string; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const ticks = Array.from({ length: 72 }, (_, i) => i);
  return (
    <svg viewBox="-250 -250 500 500" className={`rune-ring ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-bg`}>
          <stop offset="0" stopColor={color} stopOpacity="0.22" />
          <stop offset="0.7" stopColor={color} stopOpacity="0.08" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle r="248" fill={`url(#${uid}-bg)`} />
      <g filter={`url(#${uid}-glow)`} fill="none" stroke={color}>
        <g className="rune-ring__outer">
          <circle r="232" strokeWidth="1.4" opacity="0.9" />
          <circle r="222" strokeWidth="0.8" strokeDasharray="3 7" opacity="0.7" />
          {ticks.map((i) => (
            <line key={i} x1="0" y1="-232" x2="0" y2={i % 6 === 0 ? -214 : -222} transform={`rotate(${i * 5})`} strokeWidth={i % 6 === 0 ? 1.6 : 0.8} opacity="0.85" />
          ))}
        </g>
        <g className="rune-ring__mid">
          <circle r="196" strokeWidth="1.2" opacity="0.85" />
          <circle r="150" strokeWidth="1" opacity="0.8" />
          {GLYPHS.map((g, i) => (
            <text key={g} x="0" y="-163" transform={`rotate(${i * 30})`} textAnchor="middle" fill={accent} stroke="none" fontFamily="'Noto Serif SC', serif" fontSize="22" opacity="0.95">
              {g}
            </text>
          ))}
        </g>
        <g className="rune-ring__inner">
          <circle r="126" strokeWidth="1" strokeDasharray="14 6" opacity="0.75" />
          {TRIGRAMS.map((t, i) => (
            <g key={t} transform={`rotate(${i * 45}) translate(0 -104)`} stroke={accent} strokeWidth="3" strokeLinecap="round" opacity="0.95">
              {t.split('').map((bit, row) =>
                bit === '1' ? (
                  <line key={row} x1="-14" y1={row * 8 - 8} x2="14" y2={row * 8 - 8} />
                ) : (
                  <g key={row}>
                    <line x1="-14" y1={row * 8 - 8} x2="-3.5" y2={row * 8 - 8} />
                    <line x1="3.5" y1={row * 8 - 8} x2="14" y2={row * 8 - 8} />
                  </g>
                ),
              )}
            </g>
          ))}
          <circle r="78" strokeWidth="1" opacity="0.8" />
          {/* a lotus: eight rounded petals */}
          {Array.from({ length: 8 }, (_, k) => (
            <ellipse key={k} cx="0" cy="-40" rx="13" ry="30" transform={`rotate(${k * 45})`} strokeWidth="1.2" opacity="0.9" />
          ))}
          <circle r="14" strokeWidth="1.2" opacity="0.9" />
        </g>
      </g>
    </svg>
  );
}
