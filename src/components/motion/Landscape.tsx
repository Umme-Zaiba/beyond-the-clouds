import { useId, useMemo, type CSSProperties, type ReactNode } from 'react';
import { ridgePath } from '../../lib/landscape';
import type { Palette } from '../../types';

interface Props {
  palette: Palette;
  seed: number;
  className?: string;
  /** floating pavilion islands, for sky realms */
  islands?: boolean;
  /** ember sparks for the dark realm */
  embers?: boolean;
  children?: ReactNode;
}

const depth = (d: number): CSSProperties => ({ ['--depth' as string]: d });

/** Layered SVG ink-wash landscape. Layers drift by depth when an ancestor sets --px/--py/--scroll. */
export function Landscape({ palette, seed, className = '', islands = false, embers = false, children }: Props) {
  const uid = useId().replace(/:/g, '');
  const paths = useMemo(
    () => ({
      far: ridgePath({ seed, base: 560, height: 320, spires: 7, sharpness: 0.7 }),
      mid: ridgePath({ seed: seed + 7, base: 660, height: 260, spires: 6, sharpness: 0.9 }),
      near: ridgePath({ seed: seed + 19, base: 790, height: 190, spires: 5, sharpness: 1.2 }),
    }),
    [seed],
  );

  return (
    <div className={`landscape ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="landscape__svg">
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.skyTop} />
            <stop offset="1" stopColor={palette.skyBottom} />
          </linearGradient>
          <radialGradient id={`${uid}-glow`}>
            <stop offset="0" stopColor={palette.glow} stopOpacity="0.95" />
            <stop offset="0.35" stopColor={palette.glow} stopOpacity="0.35" />
            <stop offset="1" stopColor={palette.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.mist} stopOpacity="0" />
            <stop offset="1" stopColor={palette.mist} stopOpacity="0.85" />
          </linearGradient>
          <filter id={`${uid}-blur`}>
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        <rect width="1600" height="900" fill={`url(#${uid}-sky)`} />

        <g className="ls-layer" style={depth(0.1)}>
          <circle cx="1120" cy="250" r="420" fill={`url(#${uid}-glow)`} />
          <circle cx="1120" cy="250" r="62" fill={palette.glow} opacity="0.9" />
        </g>

        <g className="ls-layer" style={depth(0.25)}>
          <path d={paths.far} fill={palette.far} />
          <rect x="-240" y="500" width="2080" height="400" fill={`url(#${uid}-fade)`} />
        </g>

        {islands && (
          <g className="ls-layer" style={depth(0.4)}>
            <Island x={340} y={330} scale={1} palette={palette} delay="0s" />
            <Island x={1260} y={430} scale={0.7} palette={palette} delay="-3s" />
            <Island x={780} y={250} scale={0.45} palette={palette} delay="-6s" />
          </g>
        )}

        <g className="ls-layer" style={depth(0.55)}>
          <path d={paths.mid} fill={palette.mid} />
          <rect x="-240" y="600" width="2080" height="300" fill={`url(#${uid}-fade)`} />
        </g>

        <g className="ls-layer ls-layer--mist" style={depth(0.7)}>
          <ellipse className="ls-cloud ls-cloud--a" cx="420" cy="740" rx="520" ry="46" fill={palette.mist} opacity="0.65" filter={`url(#${uid}-blur)`} />
          <ellipse className="ls-cloud ls-cloud--b" cx="1180" cy="780" rx="620" ry="52" fill={palette.mist} opacity="0.55" filter={`url(#${uid}-blur)`} />
        </g>

        <g className="ls-layer" style={depth(0.85)}>
          <path d={paths.near} fill={palette.near} />
        </g>

        <g className="ls-layer ls-layer--mist" style={depth(1.1)}>
          <ellipse className="ls-cloud ls-cloud--c" cx="800" cy="880" rx="900" ry="70" fill={palette.mist} opacity="0.8" filter={`url(#${uid}-blur)`} />
        </g>

        {embers &&
          Array.from({ length: 22 }, (_, i) => (
            <circle
              key={i}
              className="ls-ember"
              cx={120 + ((i * 197) % 1400)}
              cy={820}
              r={1.5 + (i % 3)}
              fill={palette.glow}
              style={{ animationDelay: `${-(i * 0.9)}s`, animationDuration: `${7 + (i % 5)}s` }}
            />
          ))}
      </svg>
      {children}
    </div>
  );
}

function Island({ x, y, scale, palette, delay }: { x: number; y: number; scale: number; palette: Palette; delay: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="ls-island" style={{ animationDelay: delay }}>
        <path d="M-120 0 Q-100 -14 -60 -14 L60 -14 Q100 -14 120 0 Q100 50 40 90 Q10 120 0 150 Q-10 120 -40 90 Q-100 50 -120 0Z" fill={palette.mid} />
        <path d="M-120 0 Q-100 -14 -60 -14 L60 -14 Q100 -14 120 0 Q60 10 0 10 Q-60 10 -120 0Z" fill={palette.near} opacity="0.6" />
        {/* pavilion */}
        <g fill={palette.near}>
          <rect x="-26" y="-58" width="52" height="44" opacity="0.95" />
          <path d="M-46 -56 L0 -92 L46 -56 Q0 -66 -46 -56Z" />
          <rect x="-4" y="-104" width="8" height="14" />
        </g>
      </g>
    </g>
  );
}
