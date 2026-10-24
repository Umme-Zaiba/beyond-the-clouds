import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { Landscape } from '../../components/motion/Landscape';
import { Mist } from '../../components/motion/Mist';
import { Petals } from '../../components/motion/Petals';
import { SealButton, SealLink } from '../../components/motion/Seal';
import { WeaponArt } from '../../components/cards/WeaponArt';
import { CHAPTERS } from '../../data/story';
import { mulberry32 } from '../../lib/landscape';
import { useFinePointer, useReducedMotion } from '../../lib/hooks';
import { BASE_PALETTES, isDark } from '../../lib/time';
import { useTime } from '../../state/TimeContext';
import { ArchScene, CourtScene, CrescentScene, GateScene, IsleScene, WhaleScene } from './scenes';

const N = CHAPTERS.length;
const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Where the flying sword is at progress p, in stage pixels, and which way it points. */
function swordAt(p: number, w: number, h: number, swordH: number) {
  const portrait = w < h;
  const pos = (q: number) => {
    // the sword swings to the side opposite each chapter's text card, and settles at the centre
    const swing = 0.3 * Math.cos(q * Math.PI * 6) * (1 - smooth(0.78, 1, q));
    // the gate stands a little right of centre, so the sword lands in front of it
    const x = w * (0.5 + (portrait ? 0.7 : 1) * swing + (portrait ? 0 : 0.11) * smooth(0.78, 1, q));
    // on a phone the text sits in a sheet over the lower half, so the sword flies above it
    const yPath = h * ((portrait ? 0.5 : 0.8) - (portrait ? 0.2 : 0.34) * q - 0.05 * Math.sin(q * Math.PI * 6));
    const planted = h * (portrait ? 0.5 : 0.8) - 0.47 * swordH;
    return { x, y: yPath + (planted - yPath) * smooth(0.86, 1, q) };
  };
  const a = pos(p);
  const b = pos(Math.min(1, p + 0.004));
  const c = pos(Math.max(0, p - 0.004));
  const flight = (Math.atan2(b.x - c.x, -(b.y - c.y)) * 180) / Math.PI;
  const angle = flight * (1 - smooth(0.86, 0.98, p)) + 180 * smooth(0.86, 0.98, p);
  return { ...a, angle: p < 0.005 ? 0 : angle };
}

/**
 * The scroll-first journey. A tall page pins one stage to the screen; scrolling carries a flying
 * sword through seven scenes while the sky, the weather and the scene art change around it.
 */
export function Ascent() {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const { time } = useTime();
  const pal = BASE_PALETTES[time];
  const dark = isDark(time);

  const outerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const swordRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const trailGlowRef = useRef<SVGPathElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);
  const blossomRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<SVGSVGElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const skipRef = useRef<HTMLAnchorElement>(null);

  const stars = useMemo(() => {
    const r = mulberry32(909);
    return Array.from({ length: 90 }, () => ({ x: r() * 100, y: r() * 80, s: 0.6 + r() * 1.6, d: r() * 6 }));
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;
    let w = stage.clientWidth;
    let h = stage.clientHeight;
    let target = 0;
    let cur = -1;
    let raf = 0;

    const measure = () => {
      w = stage.clientWidth;
      h = stage.clientHeight;
      const r = outer.getBoundingClientRect();
      const total = Math.max(1, r.height - window.innerHeight);
      target = clamp(-r.top / total);
    };

    const apply = (p: number) => {
      stage.style.setProperty('--p', p.toFixed(4));
      const swordH = Math.min(h * 0.34, 300);
      for (let i = 0; i < N; i++) {
        const local = (p - i / (N - 1)) * (N - 1);
        const a = Math.abs(local);
        const scene = sceneRefs.current[i];
        if (scene) {
          const so = clamp(1.55 - a * 1.7);
          scene.style.opacity = String(so);
          scene.style.visibility = so > 0.01 ? 'visible' : 'hidden';
          scene.style.setProperty('--l', clamp(local, -1.3, 1.3).toFixed(3));
        }
        const card = cardRefs.current[i];
        if (card) {
          const vis = clamp(1.7 - a * 2.8);
          card.style.opacity = String(vis);
          // hidden cards must not keep focusable buttons in the tab order
          card.style.visibility = vis > 0.02 ? 'visible' : 'hidden';
          card.style.transform = `translate3d(0, ${(local * 36).toFixed(1)}px, 0)`;
          card.style.pointerEvents = vis > 0.6 ? 'auto' : 'none';
        }
        const dot = dotRefs.current[i];
        if (dot) dot.dataset.active = a < 0.5 ? '1' : '0';
      }
      const isle = clamp(1.5 - Math.abs((p - 2 / (N - 1)) * (N - 1)) * 1.6);
      const arch = clamp(1.5 - Math.abs((p - 4 / (N - 1)) * (N - 1)) * 1.6);
      if (leavesRef.current) leavesRef.current.style.opacity = String(isle);
      if (blossomRef.current) blossomRef.current.style.opacity = String(arch);
      if (starsRef.current) starsRef.current.style.opacity = String(0.35 + p * 0.65);
      if (hintRef.current) hintRef.current.style.opacity = String(1 - smooth(0.01, 0.06, p));
      if (skipRef.current) {
        const v = smooth(0.03, 0.08, p);
        skipRef.current.style.opacity = String(v);
        skipRef.current.style.visibility = v > 0.02 ? 'visible' : 'hidden';
      }

      const s = swordAt(p, w, h, swordH);
      if (swordRef.current) {
        swordRef.current.style.height = `${swordH}px`;
        swordRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) rotate(${s.angle.toFixed(2)}deg)`;
      }
      if (trailRef.current) {
        const from = Math.max(0, p - 0.17);
        const steps = 60;
        let d = '';
        for (let k = 0; k <= steps; k++) {
          const q = from + (k / steps) * (p - from);
          const pt = swordAt(q, w, h, swordH);
          // the trail is drawn from the sword's hilt side, so offset it slightly behind the blade
          d += `${k ? 'L' : 'M'}${pt.x.toFixed(1)} ${(pt.y + swordH * 0.18).toFixed(1)}`;
        }
        trailRef.current.setAttribute('d', d);
        trailGlowRef.current?.setAttribute('d', d);
      }
    };

    const loop = () => {
      measure();
      cur = cur < 0 || reduced ? target : cur + (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.00015) cur = target;
      apply(cur);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    // only spend frames on the journey while it is on screen
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '120px 0px' });
    io.observe(outer);
    start();
    window.addEventListener('resize', measure);
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [reduced]);

  const goTo = (i: number) => {
    const outer = outerRef.current;
    if (!outer) return;
    const total = outer.offsetHeight - window.innerHeight;
    window.scrollTo({ top: outer.offsetTop + (i / (N - 1)) * total, behavior: reduced ? 'auto' : 'smooth' });
  };

  const vars = {
    '--sky-top': pal.skyTop,
    '--sky-mid': pal.skyMid,
    '--sky-bottom': pal.skyBottom,
    '--cloud': pal.mist,
    '--glow': pal.glow,
    '--glow2': pal.glow2,
    '--ink-art': dark ? '#14143a' : '#2b3550',
    '--card-bg': dark ? 'rgba(10, 14, 46, 0.62)' : 'rgba(255, 255, 255, 0.66)',
    '--card-fg': dark ? '#f4f1ff' : '#1d2630',
    '--card-muted': dark ? '#c4cbf0' : '#4a5566',
    '--hero-fg': dark ? '#ffffff' : '#1d2a3a',
  } as CSSProperties;

  const scenes = [null, <WhaleScene key="w" />, <IsleScene key="i" />, <CrescentScene key="c" />, <ArchScene key="a" />, <CourtScene key="co" />, <GateScene key="g" />];

  return (
    <section className="ascent" ref={outerRef} style={{ height: `${N * 112}vh` }} aria-label="The journey">
      <div className="ascent__stage" ref={stageRef} style={vars}>
        <div className="ascent__sky" />
        {(time === 'night' || time === 'evening') && (
          <svg className="ascent__stars" ref={starsRef} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {stars.map((s, i) => (
              <circle key={i} className="ls-star" cx={s.x} cy={s.y} r={s.s * 0.12} fill="#fff" style={{ animationDelay: `${-s.d}s` }} />
            ))}
          </svg>
        )}

        {/* scene 0: the foot of the ascent */}
        <div className="scene" ref={(el) => (sceneRefs.current[0] = el)}>
          <Landscape palette={pal} seed={5} sky={false} features={{ islands: true, stars: false }} className="scene__landscape" />
          <Mist color={dark ? '255,214,236' : '255,255,255'} className="scene__mist" count={20} />
        </div>
        {scenes.slice(1).map((sc, k) => (
          <div className="scene" key={k} ref={(el) => (sceneRefs.current[k + 1] = el)}>
            {sc}
          </div>
        ))}

        <div className="ascent__leaves" ref={leavesRef}>
          <Petals colors={['#d1352b', '#f06a2e', '#ff8a3c', '#b81f2b']} count={26} />
        </div>
        <div className="ascent__blossoms" ref={blossomRef}>
          <Petals colors={['#ffc2dc', '#ffe0ee', '#ffffff']} count={22} />
        </div>

        <svg className="ascent__trail" aria-hidden="true">
          <defs>
            <filter id="trail-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          <path ref={trailGlowRef} fill="none" className="ascent__trail-glow" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" filter="url(#trail-glow)" />
          <path ref={trailRef} fill="none" className="ascent__trail-line" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="ascent__sword" ref={swordRef} aria-hidden="true">
          <WeaponArt shape="sword" affinity={dark ? 'wind' : 'ice'} glow={1} runes={2} />
        </div>

        {/* chapter text */}
        <div className="ascent__cards">
          {CHAPTERS.map((c, i) => (
            <div key={c.id} className={`card card--${i % 2 ? 'right' : 'left'} card--${c.id}`} ref={(el) => (cardRefs.current[i] = el)}>
              {i === 0 ? (
                <>
                  <p className="eyebrow">An interactive world of swords, realms and clouds</p>
                  <h1 className="hero__title" aria-label="Beyond the Clouds">
                    <span className="hero__word">Beyond</span> <span className="hero__word">the</span> <span className="hero__word">Clouds</span>
                  </h1>
                  <p className="card__lede">{c.story[0]}</p>
                  <div className="hero__buttons">
                    <SealButton glyph="云" onClick={() => goTo(1)}>
                      Begin the ascent
                    </SealButton>
                    <SealLink to="/realms" variant="ghost">
                      Skip to the trials
                    </SealLink>
                  </div>
                  <p className="hero__hint" ref={hintRef}>
                    <ArrowDown size={16} className="hero__cue" aria-hidden="true" />
                    {fine ? 'Scroll to fly. Your cursor is a sword.' : 'Scroll to fly. Drag a finger to trail light.'}
                  </p>
                </>
              ) : (
                <>
                  <p className="eyebrow">{c.kicker}</p>
                  <h2>{c.title}</h2>
                  {c.story.map((p, k) => (
                    <p key={k}>{p}</p>
                  ))}
                  {c.id === 'gate' && (
                    <div className="hero__buttons">
                      <SealLink to="/realms" glyph="剑">
                        Enter the trials
                      </SealLink>
                      <SealLink to="/daily" variant="ghost">
                        Today&rsquo;s challenge
                      </SealLink>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="ascent__bar" aria-hidden="true">
          <i />
        </div>
        <nav className="ascent__rail" aria-label="Journey chapters">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} ref={(el) => (dotRefs.current[i] = el)} onClick={() => goTo(i)} aria-label={`Go to: ${c.title}`} title={c.title} />
          ))}
        </nav>
        <Link to="/realms" className="ascent__skip" ref={skipRef}>
          Skip to the trials
        </Link>
      </div>
    </section>
  );
}
