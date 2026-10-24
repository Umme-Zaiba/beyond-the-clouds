import { useMemo } from 'react';
import { makeScalePuzzle, memorySequence } from '../../lib/game';
import { MemoryGame } from './MemoryGame';
import { QuizGame } from './QuizGame';
import { ScaleGame } from './ScaleGame';
import { SteadyGame } from './SteadyGame';
import type { GameResult, GameSpec } from './types';

/** Builds the puzzle for a spec once, then hands it to the right game. */
export function GameHost({ spec, onDone }: { spec: GameSpec; onDone: (r: GameResult) => void }) {
  const sequence = useMemo(() => (spec.kind === 'memory' ? memorySequence(spec.seed, spec.length) : []), [spec]);
  const puzzle = useMemo(() => (spec.kind === 'scale' ? makeScalePuzzle(spec.seed, spec.weights) : null), [spec]);

  if (spec.kind === 'memory') return <MemoryGame sequence={sequence} noun={spec.noun} onDone={onDone} />;
  if (spec.kind === 'quiz') return <QuizGame questions={spec.questions} onDone={onDone} />;
  if (spec.kind === 'steady') return <SteadyGame hits={spec.hits} arc={spec.arc} speed={spec.speed} onDone={onDone} />;
  return puzzle ? <ScaleGame puzzle={puzzle} goods={spec.goods} onDone={onDone} /> : null;
}
