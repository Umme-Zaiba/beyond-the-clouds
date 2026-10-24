import { useId } from 'react';

const GLYPHS = ['云', '仙', '界', '器', '封', '宝', '海', '玉', '焰', '渊', '谷', '锻'];

/** A glowing runic circle: concentric rings, tick marks and a ring of characters. Rotates slowly. */
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
          <circle r="188" strokeWidth="1.2" opacity="0.85" />
          <circle r="150" strokeWidth="1" opacity="0.8" />
          {GLYPHS.map((g, i) => (
            <text
              key={g}
              x="0"
              y="-163"
              transform={`rotate(${i * 30})`}
              textAnchor="middle"
              fill={accent}
              stroke="none"
              fontFamily="'Noto Serif SC', serif"
              fontSize="22"
              opacity="0.95"
            >
              {g}
            </text>
          ))}
        </g>
        <g className="rune-ring__inner">
          <circle r="118" strokeWidth="1" strokeDasharray="14 6" opacity="0.8" />
          <polygon points="0,-118 102,59 -102,59" strokeWidth="1" opacity="0.65" />
          <polygon points="0,118 102,-59 -102,-59" strokeWidth="1" opacity="0.65" />
          <circle r="64" strokeWidth="1.2" opacity="0.9" />
        </g>
      </g>
    </svg>
  );
}
