import { useId, useMemo, type CSSProperties, type ReactNode } from 'react';
import { mulberry32, ridgePath } from '../../lib/landscape';
import type { Palette, SceneFeatures } from '../../types';

interface Props {
  palette: Palette;
  seed: number;
  className?: string;
  features?: SceneFeatures;
  children?: ReactNode;
}

const depth = (d: number): CSSProperties => ({ ['--depth' as string]: d });

/**
 * Layered SVG celestial landscape. Sky, glowing sun or moon, rim-lit ridges, floating palaces with
 * lit windows and hanging crystals, and a bright sea of cloud. Layers drift by depth when an
 * ancestor sets --px/--py/--scroll.
 */
export function Landscape({ palette, seed, className = '', features = {}, children }: Props) {
  const uid = useId().replace(/:/g, '');
  const paths = useMemo(
    () => ({
      far: ridgePath({ seed, base: 580, height: 340, spires: 8, sharpness: 0.62 }),
      mid: ridgePath({ seed: seed + 7, base: 680, height: 270, spires: 6, sharpness: 0.85 }),
      near: ridgePath({ seed: seed + 19, base: 800, height: 200, spires: 5, sharpness: 1.15 }),
    }),
    [seed],
  );
  const stars = useMemo(() => {
    const r = mulberry32(seed * 31 + 3);
    return Array.from({ length: 70 }, () => ({ x: r() * 1600, y: r() * 430, s: 0.6 + r() * 1.7, d: r() * 6 }));
  }, [seed]);
  const vines = useMemo(() => {
    const r = mulberry32(seed * 17 + 5);
    return Array.from({ length: 46 }, (_, i) => ({ x: (i / 46) * 1700 - 50 + r() * 22, len: 120 + r() * 300, sway: 3 + r() * 4, delay: -r() * 8 }));
  }, [seed]);

  return (
    <div className={`landscape ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="landscape__svg">
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.skyTop} />
            <stop offset="0.55" stopColor={palette.skyMid} />
            <stop offset="1" stopColor={palette.skyBottom} />
          </linearGradient>
          <radialGradient id={`${uid}-glow`}>
            <stop offset="0" stopColor={palette.glow} stopOpacity="0.95" />
            <stop offset="0.3" stopColor={palette.glow} stopOpacity="0.4" />
            <stop offset="1" stopColor={palette.glow} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-orb`}>
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.25" stopColor={palette.glow} stopOpacity="0.95" />
            <stop offset="1" stopColor={palette.glow2} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.mist} stopOpacity="0" />
            <stop offset="1" stopColor={palette.mist} stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id={`${uid}-crystal`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.glow2} stopOpacity="0.95" />
            <stop offset="1" stopColor={palette.glow} stopOpacity="0.55" />
          </linearGradient>
          <filter id={`${uid}-blur`} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <filter id={`${uid}-soft`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        <rect width="1600" height="900" fill={`url(#${uid}-sky)`} />

        {features.stars &&
          stars.map((s, i) => (
            <circle key={i} className="ls-star" cx={s.x} cy={s.y} r={s.s} fill="#fff" style={{ animationDelay: `${-s.d}s` }} />
          ))}

        <g className="ls-layer" style={depth(0.1)}>
          <circle cx="1150" cy="270" r="480" fill={`url(#${uid}-glow)`} />
          <circle cx="1150" cy="270" r="58" fill={palette.glow} opacity="0.95" />
        </g>

        <g className="ls-layer" style={depth(0.25)}>
          <path d={paths.far} fill={palette.far} />
          <path d={paths.far} fill="none" stroke={palette.glow} strokeOpacity="0.28" strokeWidth="1.6" />
          <rect x="-240" y="480" width="2080" height="420" fill={`url(#${uid}-fade)`} />
        </g>

        {features.islands && (
          <g className="ls-layer" style={depth(0.42)}>
            <Palace x={200} y={225} scale={0.55} palette={palette} uid={uid} delay="0s" />
            <Palace x={1400} y={430} scale={0.5} palette={palette} uid={uid} delay="-3.5s" small />
            <Palace x={760} y={250} scale={0.34} palette={palette} uid={uid} delay="-6s" small />
          </g>
        )}

        <g className="ls-layer" style={depth(0.55)}>
          <path d={paths.mid} fill={palette.mid} />
          <path d={paths.mid} fill="none" stroke={palette.glow} strokeOpacity="0.22" strokeWidth="1.4" />
          <rect x="-240" y="590" width="2080" height="310" fill={`url(#${uid}-fade)`} />
        </g>

        <g className="ls-layer ls-layer--mist" style={depth(0.7)}>
          <ellipse className="ls-cloud ls-cloud--a" cx="420" cy="760" rx="560" ry="52" fill={palette.mist} opacity="0.7" filter={`url(#${uid}-blur)`} />
          <ellipse className="ls-cloud ls-cloud--b" cx="1180" cy="790" rx="660" ry="58" fill={palette.mist} opacity="0.6" filter={`url(#${uid}-blur)`} />
        </g>

        <g className="ls-layer" style={depth(0.85)}>
          <path d={paths.near} fill={palette.near} />
          <path d={paths.near} fill="none" stroke={palette.glow2} strokeOpacity="0.25" strokeWidth="1.4" />
        </g>

        {features.vines && (
          <g className="ls-layer" style={depth(0.6)}>
            {vines.map((v, i) => (
              <g key={i} className="ls-vine" style={{ animationDuration: `${v.sway + 4}s`, animationDelay: `${v.delay}s` }}>
                <line x1={v.x} y1={-10} x2={v.x} y2={v.len} stroke={palette.glow} strokeWidth={1.4 + (i % 3) * 0.5} opacity={0.55} />
                <circle cx={v.x} cy={v.len} r={2.4} fill={palette.glow} opacity="0.9" />
              </g>
            ))}
          </g>
        )}

        <g className="ls-layer ls-layer--mist" style={depth(1.1)}>
          <ellipse className="ls-cloud ls-cloud--c" cx="800" cy="890" rx="980" ry="84" fill={palette.mist} opacity="0.85" filter={`url(#${uid}-blur)`} />
        </g>

        {features.embers &&
          Array.from({ length: 26 }, (_, i) => (
            <circle
              key={i}
              className="ls-ember"
              cx={100 + ((i * 197) % 1420)}
              cy={830}
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

/** A floating island with a tiered pagoda, lit windows, glowing finial orbs and hanging crystals. */
function Palace({ x, y, scale, palette, uid, delay, small = false }: { x: number; y: number; scale: number; palette: Palette; uid: string; delay: string; small?: boolean }) {
  const tiers = small ? 2 : 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="ls-island" style={{ animationDelay: delay }}>
        {/* crystals hanging beneath the rock */}
        <g>
          {[-70, -30, 20, 62].map((cx, i) => (
            <path
              key={cx}
              d={`M${cx - 12} 70 L${cx + 12} 70 L${cx + 2} ${120 + i * 14} Z`}
              fill={`url(#${uid}-crystal)`}
              filter={`url(#${uid}-soft)`}
              opacity="0.9"
            />
          ))}
        </g>
        <path d="M-150 0 Q-120 -16 -70 -16 L70 -16 Q120 -16 150 0 Q120 60 50 100 Q14 126 0 168 Q-14 126 -50 100 Q-120 60 -150 0Z" fill={palette.mid} />
        <path d="M-150 0 Q-120 -16 -70 -16 L70 -16 Q120 -16 150 0 Q70 12 0 12 Q-70 12 -150 0Z" fill={palette.glow} opacity="0.22" />
        <path d="M-150 0 Q-120 -16 -70 -16 L70 -16 Q120 -16 150 0" fill="none" stroke={palette.glow} strokeOpacity="0.5" strokeWidth="2" />

        {/* pagoda */}
        <g fill={palette.near}>
          {Array.from({ length: tiers }, (_, t) => {
            const w = 78 - t * 17;
            const base = -16 - t * 52;
            return (
              <g key={t}>
                <rect x={-w * 0.62} y={base - 34} width={w * 1.24} height={34} />
                <path d={`M${-w - 12} ${base - 34} Q${-w * 0.5} ${base - 40} 0 ${base - 60} Q${w * 0.5} ${base - 40} ${w + 12} ${base - 34} Q${w * 0.6} ${base - 28} 0 ${base - 31} Q${-w * 0.6} ${base - 28} ${-w - 12} ${base - 34}Z`} />
                <path d={`M${-w - 12} ${base - 34} q-8 -6 -14 -2 M${w + 12} ${base - 34} q8 -6 14 -2`} stroke={palette.near} strokeWidth="3" fill="none" strokeLinecap="round" />
                {[-0.34, 0, 0.34].map((o) => (
                  <rect key={o} x={w * o - 5} y={base - 26} width={10} height={16} rx={3} fill={palette.glow} opacity="0.92" />
                ))}
              </g>
            );
          })}
          <rect x="-3" y={-16 - tiers * 52 - 48} width="6" height="30" />
        </g>
        {/* glowing finial orb */}
        <circle cx="0" cy={-16 - tiers * 52 - 56} r="26" fill={`url(#${uid}-orb)`} />
        <circle cx="0" cy={-16 - tiers * 52 - 56} r="5" fill="#fff" />
        {/* side lanterns */}
        {[-118, 118].map((lx) => (
          <g key={lx}>
            <rect x={lx - 3} y="-46" width="6" height="30" fill={palette.near} />
            <circle cx={lx} cy="-52" r="12" fill={`url(#${uid}-orb)`} />
          </g>
        ))}
      </g>
    </g>
  );
}
