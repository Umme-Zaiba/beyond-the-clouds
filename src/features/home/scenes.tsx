import { useId, useMemo, type CSSProperties, type ReactNode } from 'react';
import { mulberry32 } from '../../lib/landscape';

/**
 * Hand-built scenes for the scroll journey. Each one is a full-frame SVG with no sky of its own,
 * so they float over a shared sky that changes with the time of day. Colours that should follow
 * the hour come from CSS variables set on the stage (--cloud, --glow, --glow2, --ink).
 */


/** Keeps a scene's subject clear of the text card: shifted aside on wide screens (baked into each scene)
 *  and re-centred, raised and scaled on phones, where the card is a sheet over the lower half. */
function Focus({ back = 0, up = 0, zoom = 1, ox = 800, oy = 450, children }: { back?: number; up?: number; zoom?: number; ox?: number; oy?: number; children: ReactNode }) {
  return (
    <g className="focus" style={{ ['--bx' as string]: `${back}px`, ['--by' as string]: `${up}px`, ['--z' as string]: zoom, ['--ox' as string]: `${ox}px`, ['--oy' as string]: `${oy}px` } as CSSProperties}>
      {children}
    </g>
  );
}

const d = (depth: number): CSSProperties => ({ ['--d' as string]: depth });
const VIEW = '0 0 1600 900';

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}-b20`} x="-30%" y="-60%" width="160%" height="220%">
        <feGaussianBlur stdDeviation="20" />
      </filter>
      <filter id={`${id}-b8`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="8" />
      </filter>
      <filter id={`${id}-b3`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
  );
}

function CloudBank({ id, y, opacity = 0.8, depth }: { id: string; y: number; opacity?: number; depth: number }) {
  return (
    <g className="sc-layer" style={d(depth)}>
      <ellipse cx="320" cy={y} rx="520" ry="58" className="c-cloud" opacity={opacity} filter={`url(#${id}-b20)`} />
      <ellipse cx="1000" cy={y + 30} rx="640" ry="64" className="c-cloud" opacity={opacity} filter={`url(#${id}-b20)`} />
      <ellipse cx="1500" cy={y - 10} rx="420" ry="50" className="c-cloud" opacity={opacity * 0.9} filter={`url(#${id}-b20)`} />
    </g>
  );
}

/* ─────────────── I · the whale of white mist ─────────────── */

export function WhaleScene() {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="scene__svg" viewBox={VIEW} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Defs id={id} />
      <defs>
        <linearGradient id={`${id}-whale`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="0.6" stopColor="#ffe0ec" stopOpacity="0.88" />
          <stop offset="1" stopColor="#ffbfd6" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <CloudBank id={id} y={690} depth={0.4} />
      <Focus back={370} zoom={0.55} ox={460} oy={330}>
      <g className="sc-layer sc-whale" style={d(1.2)}>
        <g transform="translate(90 170) scale(1.12)">
          <path
            d="M0 150 C 40 44, 230 8, 410 70 C 480 96, 530 136, 585 112 C 610 100, 626 70, 650 38 C 660 92, 646 132, 608 152 C 592 162, 580 170, 566 174 C 606 184, 634 204, 660 236 C 604 232, 554 212, 510 194 C 440 238, 300 268, 172 232 C 92 210, 20 190, 0 150 Z"
            fill={`url(#${id}-whale)`}
            filter={`url(#${id}-b3)`}
          />
          <path d="M0 150 C 40 44, 230 8, 410 70 C 480 96, 530 136, 585 112 C 610 100, 626 70, 650 38" fill="none" className="s-glow" strokeWidth="3" opacity="0.8" />
          <path d="M252 208 C 280 256, 322 282, 350 298 C 324 256, 308 230, 304 200 Z" fill={`url(#${id}-whale)`} opacity="0.9" />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M${70 + k * 8} ${176 + k * 12} C 200 ${220 + k * 12}, 380 ${220 + k * 12}, ${510 - k * 12} ${180 + k * 8}`} fill="none" stroke="#ffffff" strokeWidth="2" opacity={0.35 - k * 0.06} />
          ))}
          <circle cx="98" cy="122" r="5.5" className="c-ink" />
          <circle cx="96" cy="120" r="1.8" fill="#fff" />
          <ellipse cx="300" cy="150" rx="260" ry="70" className="c-cloud" opacity="0.35" filter={`url(#${id}-b20)`} />
        </g>
      </g>
      </Focus>
      <CloudBank id={id} y={790} depth={0.9} opacity={0.95} />
    </svg>
  );
}

/* ─────────────── II · the isle of the red maple ─────────────── */

export function IsleScene() {
  const id = useId().replace(/:/g, '');
  const leaves = useMemo(() => {
    const r = mulberry32(31);
    const reds = ['#c8261f', '#e0432a', '#f06a2e', '#d1352b', '#ff8a3c', '#b81f2b'];
    return Array.from({ length: 34 }, () => {
      const a = r() * Math.PI * 2;
      const rad = Math.sqrt(r()) * 210;
      return { x: Math.cos(a) * rad * 1.2, y: Math.sin(a) * rad * 0.8, r: 38 + r() * 46, c: reds[Math.floor(r() * reds.length)], o: 0.78 + r() * 0.2 };
    });
  }, []);
  return (
    <svg className="scene__svg" viewBox={VIEW} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Defs id={id} />
      <defs>
        <linearGradient id={`${id}-rock`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a6a66" />
          <stop offset="1" stopColor="#3a3040" />
        </linearGradient>
        <linearGradient id={`${id}-grass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8d98a" />
          <stop offset="1" stopColor="#7aa56a" />
        </linearGradient>
      </defs>
      <CloudBank id={id} y={760} depth={0.5} />
      <Focus back={-210} up={-170} zoom={0.7} ox={1010} oy={560}>
      <g className="sc-layer sc-bob" style={d(1)}>
        <g transform="translate(1010 560)">
          {/* hanging roots */}
          {[-210, -130, -60, 10, 90, 170].map((x, i) => (
            <path key={x} d={`M${x} 40 q-14 70 0 ${120 + (i % 3) * 36} q16 ${60} 0 ${90 + (i % 2) * 40}`} fill="none" stroke="#5a4538" strokeWidth="5" opacity="0.8" strokeLinecap="round" />
          ))}
          <path d="M-320 0 C -270 -34 -130 -44 0 -40 C 130 -44 270 -34 320 0 C 300 70 220 130 130 180 C 90 210 40 270 0 340 C -40 270 -90 210 -130 180 C -220 130 -300 70 -320 0 Z" fill={`url(#${id}-rock)`} />
          <path d="M-320 0 C -270 -34 -130 -44 0 -40 C 130 -44 270 -34 320 0 C 200 18 -200 18 -320 0 Z" fill={`url(#${id}-grass)`} />
          {/* the maple */}
          <g transform="translate(-70 -30)">
            <ellipse cx="0" cy="-330" rx="300" ry="230" fill="#ff7a3c" opacity="0.28" filter={`url(#${id}-b20)`} />
            <path d="M-26 0 C -22 -90 -74 -170 -56 -250 C -50 -300 -20 -330 -6 -392 L 14 -392 C -8 -330 -22 -290 -16 -250 C -8 -180 36 -110 38 0 Z" fill="#5a3a2c" />
            <path d="M-8 -240 C -90 -270 -150 -300 -190 -350 M0 -260 C 60 -300 130 -310 190 -350 M-4 -180 C -80 -190 -140 -170 -180 -200" fill="none" stroke="#5a3a2c" strokeWidth="11" strokeLinecap="round" />
            <g transform="translate(0 -360)">
              {leaves.map((l, i) => (
                <circle key={i} cx={l.x} cy={l.y} r={l.r} fill={l.c} opacity={l.o} />
              ))}
              {leaves.slice(0, 16).map((l, i) => (
                <circle key={`h${i}`} cx={l.x - 10} cy={l.y - 14} r={l.r * 0.42} fill="#ffb066" opacity="0.5" />
              ))}
            </g>
          </g>
          {/* a small pavilion */}
          <g transform="translate(170 -40)">
            <rect x="-34" y="-58" width="68" height="58" fill="#e9dcc8" />
            <rect x="-9" y="-40" width="18" height="40" fill="#6a4a3a" />
            <path d="M-64 -56 Q 0 -78 64 -56 L 46 -80 Q 0 -112 -46 -80 Z" fill="#7a3b34" />
            <path d="M-64 -56 q-14 -4 -20 -14 M64 -56 q14 -4 20 -14" fill="none" stroke="#7a3b34" strokeWidth="5" strokeLinecap="round" />
            <circle cx="0" cy="-28" r="26" className="c-glow" opacity="0.4" filter={`url(#${id}-b8)`} />
          </g>
        </g>
      </g>
      </Focus>
      <CloudBank id={id} y={830} depth={1.1} opacity={0.95} />
    </svg>
  );
}

/* ─────────────── III · the crescent that does not set ─────────────── */

export function CrescentScene() {
  const id = useId().replace(/:/g, '');
  const flowers = useMemo(
    () =>
      [112, 138, 164, 190, 216, 242].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return { x: 905 + Math.cos(a) * 262, y: 380 + Math.sin(a) * 262, rot: deg + 90, s: 0.8 + (i % 3) * 0.18 };
      }),
    [],
  );
  return (
    <svg className="scene__svg" viewBox={VIEW} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Defs id={id} />
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" className="stop-glow" stopOpacity="0.85" />
          <stop offset="0.45" className="stop-glow" stopOpacity="0.25" />
          <stop offset="1" className="stop-glow" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-moon`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf0" />
          <stop offset="1" stopColor="#f2dca8" />
        </linearGradient>
        <linearGradient id={`${id}-petal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9a0e8" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect width="1600" height="900" fill="#fff" />
          <circle cx="905" cy="380" r="262" fill="#000" />
        </mask>
      </defs>
 <Focus back={260} zoom={0.8} ox={540} oy={410}>
      <g transform="translate(-260 0)">
      <g className="sc-layer" style={d(0.3)}>
        <circle cx="800" cy="410" r="470" fill={`url(#${id}-halo)`} />
      </g>
      <g className="sc-layer sc-bob" style={d(0.8)}>
        <circle cx="800" cy="410" r="300" fill={`url(#${id}-moon)`} mask={`url(#${id}-mask)`} />
        {/* faint craters, drawn only on the lit horn */}
        <circle cx="610" cy="330" r="16" fill="#e8d3a0" opacity="0.4" mask={`url(#${id}-mask)`} />
        <circle cx="560" cy="470" r="24" fill="#e8d3a0" opacity="0.35" mask={`url(#${id}-mask)`} />
        <path d="M905 118 A262 262 0 0 0 905 642" fill="none" stroke="#e7c47a" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" opacity="0.9" />
        {flowers.map((f, i) => (
          <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.rot}) scale(${f.s})`}>
            <path d="M0 0 C -30 20 -50 50 -70 70 C -40 60 -16 40 0 0 Z" fill="#6aa86a" opacity="0.85" />
            {[0, 1, 2, 3, 4].map((k) => (
              <ellipse key={k} cx="0" cy="-26" rx="13" ry="34" transform={`rotate(${(k - 2) * 28})`} fill={`url(#${id}-petal)`} stroke="#b88ad8" strokeWidth="1" />
            ))}
            <circle r="7" fill="#f0c860" />
          </g>
        ))}
      </g>
      </g>
      </Focus>
      <g className="sc-layer" style={d(1.2)}>
        {Array.from({ length: 22 }, (_, i) => (
          <circle key={i} cx={(i * 211) % 1600} cy={120 + ((i * 137) % 560)} r={1.4 + (i % 3)} className="c-glow" opacity="0.8" />
        ))}
      </g>
      <CloudBank id={id} y={800} depth={1.1} opacity={0.95} />
    </svg>
  );
}

/* ─────────────── IV · the arch of roses and silk ─────────────── */

export function ArchScene() {
  const id = useId().replace(/:/g, '');
  const blooms = useMemo(() => {
    const r = mulberry32(77);
    const cols = ['#ff8fb0', '#ffc2d4', '#fff0f5', '#ffb55c', '#ff6f9a', '#ffd9a0'];
    const out: Array<{ x: number; y: number; r: number; c: string }> = [];
    for (let i = 0; i < 90; i++) {
      const t = r();
      const a = Math.PI * t;
      const jitter = (r() - 0.5) * 70;
      out.push({ x: 800 - Math.cos(a) * (290 + jitter), y: 360 - Math.sin(a) * (290 + jitter) * 0.95, r: 9 + r() * 20, c: cols[Math.floor(r() * cols.length)] });
    }
    for (let i = 0; i < 46; i++) {
      const side = r() < 0.5 ? 505 : 1095;
      out.push({ x: side + (r() - 0.5) * 80, y: 360 + r() * 400, r: 8 + r() * 16, c: cols[Math.floor(r() * cols.length)] });
    }
    for (let i = 0; i < 60; i++) out.push({ x: 140 + r() * 1320, y: 760 + r() * 120, r: 8 + r() * 18, c: cols[Math.floor(r() * cols.length)] });
    return out;
  }, []);
  const leaves = useMemo(() => {
    const r = mulberry32(5);
    return Array.from({ length: 70 }, () => ({ x: 480 + r() * 640, y: 120 + r() * 640, rot: r() * 180, s: 0.7 + r() }));
  }, []);
  return (
    <svg className="scene__svg" viewBox={VIEW} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Defs id={id} />
      <defs>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a4a30" />
          <stop offset="0.5" stopColor="#c08458" />
          <stop offset="1" stopColor="#6a3e28" />
        </linearGradient>
        <linearGradient id={`${id}-silk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <g className="sc-layer" style={d(0.5)}>
        <ellipse cx="800" cy="860" rx="780" ry="90" fill="#7aa56a" opacity="0.85" />
      </g>
      <Focus back={-250} up={-80} zoom={0.78} ox={1050} oy={470}>
      <g transform="translate(250 0)">
      <g className="sc-layer" style={d(0.9)}>
        <path d="M505 790 L505 360 A295 295 0 0 1 1095 360 L1095 790" fill="none" stroke={`url(#${id}-wood)`} strokeWidth="38" strokeLinecap="round" />
        <path d="M505 790 L505 360 A295 295 0 0 1 1095 360 L1095 790" fill="none" stroke="#e0b088" strokeWidth="3" strokeLinecap="round" opacity="0.6" transform="translate(-6 0)" />
        {leaves.map((l, i) => (
          <ellipse key={i} cx={l.x} cy={l.y} rx="16" ry="7" transform={`rotate(${l.rot} ${l.x} ${l.y}) scale(${l.s})`} fill="#5f9a5a" opacity="0.8" />
        ))}
        {blooms.map((b, i) => (
          <g key={i}>
            <circle cx={b.x} cy={b.y} r={b.r} fill={b.c} opacity="0.95" />
            <circle cx={b.x - b.r * 0.2} cy={b.y - b.r * 0.2} r={b.r * 0.5} fill="#ffffff" opacity="0.35" />
          </g>
        ))}
      </g>
      <g className="sc-layer sc-sway" style={d(1.2)}>
        <path d="M650 150 C 560 360 760 520 620 800" fill="none" stroke={`url(#${id}-silk)`} strokeWidth="70" strokeLinecap="round" opacity="0.7" filter={`url(#${id}-b8)`} />
        <path d="M960 150 C 1060 380 880 540 1000 800" fill="none" stroke={`url(#${id}-silk)`} strokeWidth="62" strokeLinecap="round" opacity="0.65" filter={`url(#${id}-b8)`} />
        <path d="M800 190 C 760 380 840 520 790 740" fill="none" stroke={`url(#${id}-silk)`} strokeWidth="30" strokeLinecap="round" opacity="0.5" filter={`url(#${id}-b3)`} />
        <line x1="800" y1="300" x2="800" y2="420" stroke="#8a5a38" strokeWidth="3" />
        <circle cx="800" cy="470" r="64" className="c-glow" opacity="0.5" filter={`url(#${id}-b20)`} />
        <path d="M778 424 Q800 408 822 424 L830 480 Q800 512 770 480 Z" fill="#ffd27a" stroke="#a8742c" strokeWidth="3" />
        <circle cx="800" cy="462" r="13" className="c-glow" />
      </g>
      </g>
      </Focus>
    </svg>
  );
}

/* ─────────────── V · the golden court ─────────────── */

export function CourtScene() {
  const id = useId().replace(/:/g, '');
  const roof = (w: number, y: number, h: number) =>
    `M${-w - 26} ${y} Q${-w * 0.45} ${y - 10} 0 ${y - h} Q${w * 0.45} ${y - 10} ${w + 26} ${y} Q${w * 0.55} ${y + 12} 0 ${y + 4} Q${-w * 0.55} ${y + 12} ${-w - 26} ${y}Z`;
  return (
    <svg className="scene__svg" viewBox={VIEW} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Defs id={id} />
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#d99a3a" />
        </linearGradient>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4ecde" />
          <stop offset="1" stopColor="#b8a48e" />
        </linearGradient>
      </defs>
      <CloudBank id={id} y={730} depth={0.5} />
      <Focus back={240} up={-150} zoom={0.6} ox={560} oy={520}>
      <g className="sc-layer sc-bob" style={d(1)}>
        <g transform="translate(560 520)">
          <path d="M-420 0 L420 0 C 380 70 300 120 200 160 C 120 200 50 240 0 300 C -50 240 -120 200 -200 160 C -300 120 -380 70 -420 0 Z" fill={`url(#${id}-stone)`} />
          <path d="M-420 0 L420 0" stroke="#fff" strokeWidth="6" opacity="0.7" />
          {/* side halls */}
          {[-1, 1].map((sgn) => (
            <g key={sgn} transform={`translate(${sgn * 270} 0)`}>
              <rect x="-70" y="-90" width="140" height="90" fill="#f7efe0" />
              {[-40, 0, 40].map((x) => (
                <rect key={x} x={x - 7} y="-70" width="14" height="30" rx="7" className="c-glow" opacity="0.9" />
              ))}
              <path d={roof(90, -90, 70)} fill={`url(#${id}-gold)`} />
            </g>
          ))}
          {/* the great hall, three tiers */}
          {[0, 1, 2].map((t) => {
            const w = 170 - t * 38;
            const base = -t * 118;
            return (
              <g key={t}>
                <rect x={-w * 0.7} y={base - 100} width={w * 1.4} height="100" fill="#fbf4e6" />
                {[-0.4, -0.13, 0.13, 0.4].map((o) => (
                  <rect key={o} x={w * o - 8} y={base - 78} width="16" height="40" rx="8" className="c-glow" opacity="0.95" />
                ))}
                <path d={roof(w, base - 100, 74)} fill={`url(#${id}-gold)`} />
                <path d={roof(w, base - 100, 74)} fill="none" stroke="#a8702a" strokeWidth="2.5" opacity="0.6" />
              </g>
            );
          })}
          <rect x="-3" y="-420" width="6" height="60" fill="#c08a3a" />
          <circle cx="0" cy="-436" r="34" className="c-glow" opacity="0.9" filter={`url(#${id}-b8)`} />
          <circle cx="0" cy="-436" r="8" fill="#fff" />
          {/* a row of lanterns along the terrace */}
          {Array.from({ length: 11 }, (_, i) => (
            <g key={i}>
              <circle cx={-380 + i * 76} cy="-18" r="14" className="c-glow" opacity="0.7" filter={`url(#${id}-b3)`} />
              <circle cx={-380 + i * 76} cy="-18" r="6" fill="#fff4c8" />
            </g>
          ))}
        </g>
      </g>
      </Focus>
      <CloudBank id={id} y={820} depth={1.1} opacity={0.95} />
    </svg>
  );
}

/* ─────────────── VI · the trial gate ─────────────── */

export function GateScene() {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="scene__svg" viewBox={VIEW} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Defs id={id} />
      <defs>
        <linearGradient id={`${id}-lacquer`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8e2220" />
          <stop offset="0.5" stopColor="#d24a3c" />
          <stop offset="1" stopColor="#7c1c1e" />
        </linearGradient>
        <linearGradient id={`${id}-tile`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a6f86" />
          <stop offset="1" stopColor="#233c52" />
        </linearGradient>
      </defs>
      <CloudBank id={id} y={730} depth={0.4} />
      <Focus back={-180} up={-250} zoom={0.75} ox={980} oy={520}>
      <g className="sc-layer" style={d(0.8)}>
        <g transform="translate(980 0)">
          {/* steps */}
          <path d="M-330 840 L330 840 L260 800 L-260 800 Z M-270 800 L270 800 L210 764 L-210 764 Z" fill="#cfc2b0" opacity="0.9" />
          {/* pillars */}
          {[-250, 250].map((x) => (
            <g key={x}>
              <rect x={x - 22} y="300" width="44" height="470" fill={`url(#${id}-lacquer)`} />
              <rect x={x - 34} y="740" width="68" height="30" fill="#b8a48e" />
              <rect x={x - 28} y="300" width="56" height="14" fill="#e7c47a" />
            </g>
          ))}
          {/* crossbeams and roofs */}
          <rect x="-300" y="352" width="600" height="30" fill={`url(#${id}-lacquer)`} />
          <rect x="-300" y="352" width="600" height="6" fill="#e7c47a" />
          <path d="M-360 300 Q-120 252 0 226 Q120 252 360 300 L324 326 Q120 300 0 292 Q-120 300 -324 326 Z" fill={`url(#${id}-tile)`} />
          <path d="M-360 300 q-24 -2 -34 -22 M360 300 q24 -2 34 -22" fill="none" stroke="#233c52" strokeWidth="8" strokeLinecap="round" />
          <path d="M-210 256 Q-80 226 0 196 Q80 226 210 256 L186 282 Q80 262 0 254 Q-80 262 -186 282 Z" fill={`url(#${id}-tile)`} />
          <rect x="-58" y="298" width="116" height="48" rx="4" fill="#1f3040" stroke="#e7c47a" strokeWidth="3" />
          <text x="0" y="334" textAnchor="middle" fontFamily="'Noto Serif SC', serif" fontSize="34" fill="#f0cf8c">
            云
          </text>
          <circle cx="0" cy="560" r="150" className="c-glow" opacity="0.3" filter={`url(#${id}-b20)`} />
          {/* the doorway: a soft light */}
          <rect x="-190" y="386" width="380" height="380" fill="#fff6d8" opacity="0.14" />
        </g>
      </g>
      </Focus>
      <CloudBank id={id} y={830} depth={1.1} opacity={0.95} />
    </svg>
  );
}
