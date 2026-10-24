import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SealButton } from '../../components/motion/JadeSeal';
import { useReducedMotion } from '../../lib/hooks';
import type { Material } from '../../types';

interface Props {
  material: Material;
  onSuccess: () => void;
  onCancel: () => void;
}

const R = 70;
const TAU = Math.PI * 2;

type Phase = 'ready' | 'running' | 'fail' | 'win';

/**
 * Spiritual trial: a spark circles the ring of your qi. Press once, while it crosses the jade arc,
 * to draw the material out. Keyboard: Space or Enter. Reduced motion slows the spark and widens the arc.
 */
export function GatherTrial({ material, onSuccess, onCancel }: Props) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('ready');
  const [fails, setFails] = useState(0);
  const sparkRef = useRef<SVGCircleElement>(null);
  const angle = useRef(0);
  const target = useRef({ start: 0, width: 1 });
  const raf = useRef(0);
  const width = (reduced || fails >= 3 ? 100 : 62) * (Math.PI / 180);
  const speed = reduced ? 1.1 : 2.6 + Math.min(fails, 2) * 0.15;

  const begin = useCallback(() => {
    target.current = { start: Math.random() * TAU, width };
    angle.current = Math.random() * TAU;
    setPhase('running');
  }, [width]);

  useEffect(() => {
    if (phase !== 'running') return;
    let last = performance.now();
    const loop = (now: number) => {
      angle.current = (angle.current + ((now - last) / 1000) * speed) % TAU;
      last = now;
      sparkRef.current?.setAttribute('transform', `rotate(${(angle.current * 180) / Math.PI} 100 100)`);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, speed]);

  const strike = useCallback(() => {
    if (phase === 'ready' || phase === 'fail') return begin();
    if (phase !== 'running') return;
    cancelAnimationFrame(raf.current);
    const { start, width: w } = target.current;
    const rel = (angle.current - start + TAU) % TAU;
    if (rel <= w) {
      setPhase('win');
    } else {
      setFails((f) => f + 1);
      setPhase('fail');
    }
  }, [phase, begin]);

  // Position the arc and spark in the same coordinate system: angle 0 points up.
  const arcPath = (start: number, w: number) => {
    const p = (a: number) => `${100 + R * Math.sin(a)} ${100 - R * Math.cos(a)}`;
    return `M${p(start)} A${R} ${R} 0 ${w > Math.PI ? 1 : 0} 1 ${p(start + w)}`;
  };

  const showArc = phase === 'running' || phase === 'fail' || phase === 'win';

  return (
    <div className="trial" role="group" aria-label={`Trial: gather ${material.name}`}>
      <p className="trial__title">
        Trial of {material.site}
      </p>
      <p className="trial__text" aria-live="polite">
        {phase === 'ready' && `Steady your qi, then press when the spark crosses the jade arc to draw out ${material.name}.`}
        {phase === 'running' && 'Wait for it… press as the spark enters the arc.'}
        {phase === 'fail' && (fails >= 3 ? 'The qi scatters. The arc widens to help you.' : 'The qi scatters. Breathe, and try again.')}
        {phase === 'win' && `${material.name} gathered. ${material.blurb}`}
      </p>

      <button
        type="button"
        className="trial__ring"
        onClick={strike}
        disabled={phase === 'win'}
        aria-label={phase === 'ready' ? 'Begin trial' : 'Strike now'}
      >
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r={R} className="trial__track" />
          {showArc && (
            <motion.path
              d={arcPath(target.current.start, target.current.width)}
              className="trial__arc"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}
          <g ref={sparkRef}>
            <circle cx="100" cy={100 - R} r="7" className="trial__spark" />
          </g>
          <text x="100" y="108" textAnchor="middle" className="trial__center">
            {phase === 'win' ? '✓' : '云'}
          </text>
        </svg>
      </button>

      <div className="trial__actions">
        {phase === 'win' ? (
          <SealButton glyph="宝" onClick={onSuccess}>
            Take the {material.name}
          </SealButton>
        ) : (
          <>
            <SealButton variant="primary" onClick={strike}>
              {phase === 'ready' ? 'Begin' : phase === 'fail' ? 'Try again' : 'Strike'}
            </SealButton>
            <button className="linkish" onClick={onCancel}>
              Leave the site
            </button>
          </>
        )}
      </div>
    </div>
  );
}
