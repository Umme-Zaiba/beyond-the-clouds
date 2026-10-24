import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { SealButton } from '../../components/motion/Seal';
import { sfx } from '../../lib/audio';
import { dailySpec, dailyStreak, todayKey } from '../../lib/game';
import { useProgress } from '../../state/ProgressContext';
import { GameHost } from '../play/GameHost';
import { StarsRow } from '../play/StarsRow';
import type { GameResult, GameSpec } from '../play/types';

const NAMES = { memory: 'Seal Memory', scale: 'Spirit-Stone Scale' } as const;

export function Daily() {
  const { progress, recordDaily } = useProgress();
  const date = todayKey();
  const spec = useMemo(() => dailySpec(date), [date]);
  const game: GameSpec = spec.kind === 'memory' ? { kind: 'memory', seed: spec.seed, length: spec.length, noun: 'seals' } : { kind: 'scale', seed: spec.seed, weights: spec.weights, goods: 'the day’s goods' };
  const best = progress.daily[date] ?? 0;
  const streak = dailyStreak(progress.daily, date);
  const [stage, setStage] = useState<'intro' | 'play' | 'result'>('intro');
  const [result, setResult] = useState<GameResult | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [copied, setCopied] = useState(false);

  const finish = (r: GameResult) => {
    setResult(r);
    if (r.stars > 0) {
      recordDaily(date, r.stars);
      sfx.clear();
    }
    window.setTimeout(() => setStage('result'), 600);
  };

  const shareText = (stars: number) =>
    `Beyond the Clouds · Daily ${date}\n${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} ${NAMES[spec.kind]}\nhttps://beyond-the-clouds.onrender.com/daily`;

  const copy = async (stars: number) => {
    try {
      await navigator.clipboard.writeText(shareText(stars));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked: the text is also shown on screen */
    }
  };

  return (
    <div className="daily">
      <header className="page-head">
        <p className="eyebrow">Daily challenge</p>
        <h1>{NAMES[spec.kind]}</h1>
        <p className="lede">
          One puzzle a day, the same for everyone, new each morning. {streak > 0 ? `You are on a ${streak}-day streak.` : 'Play today to start a streak.'}
        </p>
      </header>

      <section className="daily__card" aria-label="Today's challenge">
        <p className="note">
          {date} {best > 0 && <>· best today <StarsRow stars={best} size={18} animate={false} /></>}
        </p>

        {stage === 'intro' && (
          <div>
            <p className="lede">{spec.kind === 'memory' ? 'Six seal stones will glow. Remember the order and touch them back.' : 'Balance the scale using as few weights as you can.'}</p>
            <SealButton glyph="日" onClick={() => setStage('play')}>
              {best > 0 ? 'Play again' : 'Play today'}
            </SealButton>
          </div>
        )}

        {stage === 'play' && <GameHost key={attempt} spec={game} onDone={finish} />}

        {stage === 'result' && result && (
          <motion.div className="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <StarsRow stars={result.stars} size={52} />
            <h2>{result.stars === 0 ? 'Not today' : 'Done for today'}</h2>
            <p className="lede">{result.note}</p>
            {result.stars > 0 && (
              <>
                <pre className="daily__share">{shareText(result.stars)}</pre>
                <div className="result__actions">
                  <SealButton glyph="日" onClick={() => copy(result.stars)}>
                    {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy result</>}
                  </SealButton>
                  <SealButton variant="ghost" onClick={() => { setResult(null); setAttempt((a) => a + 1); setStage('play'); }}>
                    Try for more stars
                  </SealButton>
                </div>
              </>
            )}
            {result.stars === 0 && (
              <SealButton onClick={() => { setResult(null); setAttempt((a) => a + 1); setStage('play'); }}>Try again</SealButton>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
