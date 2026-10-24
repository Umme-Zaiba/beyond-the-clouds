import { useEffect, useRef, useState } from 'react';
import { sfx } from '../../lib/audio';
import { starsForMoves, type ScalePuzzle } from '../../lib/game';
import type { GameResult } from './types';

interface Props {
  puzzle: ScalePuzzle;
  /** what is being weighed, for the prompt */
  goods?: string;
  onDone: (r: GameResult) => void;
}

/**
 * Balance the scale. The goods weigh a known amount; choose weights for the other pan until
 * the beam is level. Each weight you add is a move, and fewer moves earn more stars.
 */
export function ScaleGame({ puzzle, goods = 'the goods', onDone }: Props) {
  const [chosen, setChosen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);
  const done = useRef(false);
  const sum = chosen.reduce((n, i) => n + puzzle.weights[i], 0);
  const diff = puzzle.target - sum; // positive: goods still heavier

  useEffect(() => {
    if (sum === puzzle.target && chosen.length > 0 && !done.current) {
      done.current = true;
      setFinished(true);
      onDone({ stars: starsForMoves(moves, puzzle.best), note: `Balanced in ${moves} ${moves === 1 ? 'move' : 'moves'}. The fewest possible was ${puzzle.best}.` });
    }
  }, [sum, chosen.length, moves, puzzle, onDone]);

  const toggle = (i: number) => {
    if (finished) return;
    sfx.touch();
    if (chosen.includes(i)) setChosen(chosen.filter((c) => c !== i));
    else {
      setChosen([...chosen, i]);
      setMoves(moves + 1);
    }
  };

  const tilt = Math.max(-14, Math.min(14, diff * 2.2));
  const message = finished
    ? 'The beam is level.'
    : diff > 0
      ? `${goods} still weigh${goods.endsWith('s') ? '' : 's'} ${diff} more.`
      : diff < 0
        ? `Your pan is ${-diff} too heavy. Take a weight off.`
        : 'Choose weights for the right-hand pan.';

  return (
    <div className="game scale">
      <p className="game__message" aria-live="polite">
        Balance <strong>{goods}</strong> ({puzzle.target}) using as few weights as you can. {message}
      </p>
      <svg className="scale__svg" viewBox="0 0 320 200" role="img" aria-label={`A balance scale. ${goods} weigh ${puzzle.target}; your pan holds ${sum}.`}>
        <path d="M160 190 L160 54" stroke="#e7c47a" strokeWidth="6" strokeLinecap="round" />
        <path d="M136 192 L184 192" stroke="#e7c47a" strokeWidth="8" strokeLinecap="round" />
        <g className="scale__beam" style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '160px 54px' }}>
          <path d="M40 54 L280 54" stroke="#ffe6b0" strokeWidth="6" strokeLinecap="round" />
          {/* left pan: the goods */}
          <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '40px 54px' }} className="scale__pan">
            <path d="M40 54 L8 120 M40 54 L72 120" stroke="#e7c47a" strokeWidth="1.6" />
            <path d="M0 120 Q40 150 80 120Z" fill="#dcae4f" />
            <circle cx="40" cy="106" r="15" className="scale__goods" />
            <text x="40" y="111" textAnchor="middle" className="scale__num">{puzzle.target}</text>
          </g>
          {/* right pan: your weights */}
          <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '280px 54px' }} className="scale__pan">
            <path d="M280 54 L248 120 M280 54 L312 120" stroke="#e7c47a" strokeWidth="1.6" />
            <path d="M240 120 Q280 150 320 120Z" fill="#dcae4f" />
            <text x="280" y="172" textAnchor="middle" className="scale__sum">{sum}</text>
          </g>
        </g>
        <circle cx="160" cy="54" r="8" fill="#fff0c4" stroke="#8a6a2c" strokeWidth="2" />
        {finished && <circle cx="160" cy="54" r="22" className="scale__level" />}
      </svg>
      <div className="scale__weights" role="group" aria-label="Weights">
        {puzzle.weights.map((w, i) => (
          <button
            key={i}
            type="button"
            className={`weight${chosen.includes(i) ? ' is-on' : ''}`}
            onClick={() => toggle(i)}
            aria-pressed={chosen.includes(i)}
            aria-label={`Weight ${w}`}
            disabled={finished}
          >
            {w}
          </button>
        ))}
      </div>
      <div className="game__bar">
        <span className="game__lives">Moves: {moves}</span>
        {chosen.length > 0 && !finished && (
          <button className="linkish" onClick={() => setChosen([])}>
            Clear the pan
          </button>
        )}
      </div>
    </div>
  );
}
