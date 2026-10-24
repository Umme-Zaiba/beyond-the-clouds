import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { SealButton } from '../../components/motion/Seal';
import { sfx } from '../../lib/audio';
import type { QuizQuestion } from '../../types';
import type { GameResult } from './types';

/** Questions about the road you travelled. Each correct answer is a star. */
export function QuizGame({ questions, onDone }: { questions: QuizQuestion[]; onDone: (r: GameResult) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const q = questions[i];
  const answered = picked !== null;

  const pick = (n: number) => {
    if (answered) return;
    setPicked(n);
    if (n === q.answer) {
      setCorrect((c) => c + 1);
      sfx.touch();
    } else sfx.miss();
  };

  const next = () => {
    if (i + 1 < questions.length) {
      setI(i + 1);
      setPicked(null);
      return;
    }
    const stars = Math.min(3, correct);
    onDone({ stars, note: `${correct} of ${questions.length} correct.${stars === 0 ? ' Walk the road again and read closely.' : ''}` });
  };

  return (
    <div className="game quiz">
      <p className="quiz__count">
        Question {i + 1} of {questions.length}
      </p>
      <h2 className="quiz__q">{q.q}</h2>
      <div className="quiz__options" role="group" aria-label="Answers">
        {q.options.map((o, n) => {
          const state = !answered ? '' : n === q.answer ? ' is-right' : n === picked ? ' is-wrong' : ' is-dim';
          return (
            <button key={o} type="button" className={`quiz__option${state}`} onClick={() => pick(n)} disabled={answered} aria-pressed={picked === n}>
              <span>{o}</span>
              {answered && n === q.answer && <Check size={18} aria-label="Correct" />}
              {answered && n === picked && n !== q.answer && <X size={18} aria-label="Not quite" />}
            </button>
          );
        })}
      </div>
      <p className="game__message" aria-live="polite">
        {answered ? q.why : 'Choose the best answer.'}
      </p>
      <div className="game__bar">
        <span className="game__lives">Correct so far: {correct}</span>
        {answered && <SealButton onClick={next}>{i + 1 < questions.length ? 'Next question' : 'Finish'}</SealButton>}
      </div>
    </div>
  );
}
