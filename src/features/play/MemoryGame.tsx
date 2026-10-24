import { useCallback, useEffect, useRef, useState } from 'react';
import { SealButton } from '../../components/motion/Seal';
import { blossomPath } from '../../components/motion/Blossom';
import { sfx } from '../../lib/audio';
import { starsForMistakes } from '../../lib/game';
import type { GameResult } from './types';

/** Eight stars arranged as a small constellation, in percent of the sky panel. */
const SPOTS: Array<[number, number]> = [
  [10, 62],
  [24, 30],
  [40, 54],
  [53, 20],
  [66, 48],
  [79, 24],
  [90, 60],
  [50, 82],
];

const MAX_MISTAKES = 3;
type Phase = 'ready' | 'show' | 'input' | 'done';

interface Props {
  sequence: number[];
  /** the word for what lights up, e.g. "stars" or "lanterns" */
  noun?: string;
  onDone: (r: GameResult) => void;
}

/** Watch the sequence light up, then touch the same points in the same order. */
export function MemoryGame({ sequence, noun = 'seals', onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [lit, setLit] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [replays, setReplays] = useState(2);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const play = useCallback(() => {
    clearTimers();
    setPhase('show');
    setStep(0);
    sequence.forEach((star, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setLit(star);
          sfx.touch();
        }, 500 + i * 850),
        window.setTimeout(() => setLit(null), 500 + i * 850 + 560),
      );
    });
    timers.current.push(window.setTimeout(() => setPhase('input'), 500 + sequence.length * 850 + 100));
  }, [sequence]);

  const tapStar = (i: number) => {
    if (phase !== 'input') return;
    if (i === sequence[step]) {
      setLit(i);
      sfx.touch();
      window.setTimeout(() => setLit(null), 260);
      if (step + 1 === sequence.length) {
        setPhase('done');
        onDone({ stars: starsForMistakes(mistakes, MAX_MISTAKES), note: mistakes === 0 ? 'Not one wrong seal.' : `${mistakes} wrong ${mistakes === 1 ? 'touch' : 'touches'}.` });
      } else setStep(step + 1);
    } else {
      sfx.miss();
      setWrong(i);
      window.setTimeout(() => setWrong(null), 380);
      const m = mistakes + 1;
      setMistakes(m);
      if (m > MAX_MISTAKES) {
        setPhase('done');
        onDone({ stars: 0, note: 'The pattern slipped away. Try again.' });
      }
    }
  };

  const message =
    phase === 'ready'
      ? `Watch the ${noun} glow. Then touch them in the same order.`
      : phase === 'show'
        ? 'Watch carefully…'
        : phase === 'input'
          ? `Your turn: touch the ${noun} in order (${step} of ${sequence.length}).`
          : '';

  return (
    <div className="game memory">
      <p className="game__message" aria-live="polite">
        {message}
      </p>
      <div className="memory__sky" role="group" aria-label={`Sky with ${SPOTS.length} ${noun}`}>
        <svg className="memory__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {SPOTS.slice(1).map(([x, y], i) => (
            <line key={i} x1={SPOTS[i][0]} y1={SPOTS[i][1]} x2={x} y2={y} />
          ))}
        </svg>
        {SPOTS.map(([x, y], i) => (
          <button
            key={i}
            type="button"
            className={`memory__star${lit === i ? ' is-lit' : ''}${wrong === i ? ' is-wrong' : ''}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            onClick={() => tapStar(i)}
            disabled={phase !== 'input'}
            aria-label={`${noun.slice(0, -1)} ${i + 1}`}
          >
            <svg viewBox="-14 -14 28 28" aria-hidden="true">
              <path d={blossomPath(12)} />
              <circle r="2.4" />
            </svg>
          </button>
        ))}
      </div>
      <div className="game__bar">
        <div className="pips" aria-hidden="true">
          {sequence.map((_, i) => (
            <span key={i} className={`pip${i < step || phase === 'done' && mistakes <= MAX_MISTAKES ? ' is-done' : ''}${i === step && phase === 'input' ? ' is-now' : ''}`} />
          ))}
        </div>
        <span className="game__lives">
          Slips left: {Math.max(0, MAX_MISTAKES + 1 - mistakes)}
        </span>
        {phase === 'ready' && <SealButton onClick={play}>Begin</SealButton>}
        {phase === 'input' && replays > 0 && (
          <button className="linkish" onClick={() => { setReplays(replays - 1); play(); }}>
            Watch again ({replays})
          </button>
        )}
      </div>
    </div>
  );
}
