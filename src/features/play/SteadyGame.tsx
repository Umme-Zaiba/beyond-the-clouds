import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SealButton } from '../../components/motion/Seal';
import { sfx } from '../../lib/audio';
import { starsForMistakes } from '../../lib/game';
import { useReducedMotion } from '../../lib/hooks';
import type { GameResult } from './types';

const R = 70;
const TAU = Math.PI * 2;
const MAX_MISSES = 2;

type Phase = 'ready' | 'running' | 'miss' | 'hit' | 'done';

interface Props {
  /** how many clean presses are needed */
  hits: number;
  /** width of the bright arc, in degrees */
  arc: number;
  speed: number;
  onDone: (r: GameResult) => void;
}

/**
 * A marker circles a ring. Press as it crosses the bright arc. Space and Enter work too.
 * Reduced motion slows the marker and widens the arc.
 */
export function SteadyGame({ hits, arc, speed, onDone }: Props) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('ready');
  const [got, setGot] = useState(0);
  const [misses, setMisses] = useState(0);
  const markerRef = useRef<SVGGElement>(null);
  const angle = useRef(0);
  const target = useRef({ start: 0, width: 1 });
  const raf = useRef(0);
  const width = ((reduced ? Math.max(arc, 100) : arc) * Math.PI) / 180;
  const rate = reduced ? 1.1 : speed;

  const begin = useCallback(() => {
    target.current = { start: Math.random() * TAU, width };
    angle.current = Math.random() * TAU;
    setPhase('running');
  }, [width]);

  useEffect(() => {
    if (phase !== 'running') return;
    let last = performance.now();
    const loop = (now: number) => {
      angle.current = (angle.current + ((now - last) / 1000) * rate) % TAU;
      last = now;
      markerRef.current?.setAttribute('transform', `rotate(${(angle.current * 180) / Math.PI} 100 100)`);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, rate]);

  const press = useCallback(() => {
    if (phase === 'ready' || phase === 'miss' || phase === 'hit') return begin();
    if (phase !== 'running') return;
    cancelAnimationFrame(raf.current);
    const { start, width: w } = target.current;
    const rel = (angle.current - start + TAU) % TAU;
    if (rel <= w) {
      sfx.touch();
      const n = got + 1;
      setGot(n);
      if (n >= hits) {
        setPhase('done');
        onDone({ stars: starsForMistakes(misses, MAX_MISSES), note: misses === 0 ? 'Every press was clean.' : `${misses} ${misses === 1 ? 'miss' : 'misses'} along the way.` });
      } else setPhase('hit');
    } else {
      sfx.miss();
      const m = misses + 1;
      setMisses(m);
      if (m > MAX_MISSES) {
        setPhase('done');
        onDone({ stars: 0, note: 'Too many misses. Breathe, and try again.' });
      } else setPhase('miss');
    }
  }, [phase, begin, got, hits, misses, onDone]);

  const arcPath = (start: number, w: number) => {
    const p = (a: number) => `${100 + R * Math.sin(a)} ${100 - R * Math.cos(a)}`;
    return `M${p(start)} A${R} ${R} 0 ${w > Math.PI ? 1 : 0} 1 ${p(start + w)}`;
  };
  const showArc = phase === 'running' || phase === 'miss' || phase === 'hit';

  const message =
    phase === 'ready'
      ? 'Steady your breathing. Press when the marker crosses the bright arc.'
      : phase === 'running'
        ? 'Wait for it… press as the marker enters the arc.'
        : phase === 'miss'
          ? 'Missed. Breathe, and go again.'
          : phase === 'hit'
            ? 'Clean. Once more.'
            : '';

  return (
    <div className="game steady">
      <p className="game__message" aria-live="polite">
        {message}
      </p>
      <button type="button" className="steady__ring" onClick={press} disabled={phase === 'done'} aria-label={phase === 'running' ? 'Press now' : 'Start'}>
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r={R} className="steady__track" />
          {showArc && (
            <motion.path
              key={`${got}-${misses}`}
              d={arcPath(target.current.start, target.current.width)}
              className="steady__arc"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}
          <g ref={markerRef}>
            <circle cx="100" cy={100 - R} r="7" className="steady__marker" />
          </g>
          <text x="100" y="108" textAnchor="middle" className="steady__center">
            {got}/{hits}
          </text>
        </svg>
      </button>
      <div className="game__bar">
        <span className="game__lives">Misses left: {Math.max(0, MAX_MISSES + 1 - misses)}</span>
        {phase !== 'running' && phase !== 'done' && <SealButton onClick={press}>{phase === 'ready' ? 'Begin' : 'Go'}</SealButton>}
        {phase === 'running' && <SealButton onClick={press}>Now</SealButton>}
      </div>
    </div>
  );
}
