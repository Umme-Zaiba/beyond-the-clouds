import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import { Landscape } from '../../components/motion/Landscape';
import { SealButton } from '../../components/motion/Seal';
import { Mist } from '../../components/motion/Mist';
import { MATERIALS } from '../../data/forge';
import { LEVEL_BY_ID, REALM_LIST } from '../../data/realms';
import { sfx } from '../../lib/audio';
import { isLevelUnlocked, isRealmUnlocked, ownedMaterials } from '../../lib/game';
import { useReducedMotion } from '../../lib/hooks';
import { realmPalette, sceneFeatures } from '../../lib/time';
import { useProgress } from '../../state/ProgressContext';
import { useTime } from '../../state/TimeContext';
import { GameHost } from './GameHost';
import { StarsRow } from './StarsRow';
import type { GameResult, GameSpec } from './types';

const VIRTUE_LINES: Record<string, string> = {
  cloudsea: 'The honest keeper writes down what he sees, and crosses out what he got wrong.',
  jade: 'The valley remembers kindness for years, and it forgets nothing else.',
  ember: 'You are what you can make, so make it well.',
};

type Stage = 'intro' | 'play' | 'result';

function hashId(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function LevelPage() {
  const { levelId } = useParams();
  const entry = levelId ? LEVEL_BY_ID[levelId] : undefined;
  const { progress, recordLevel } = useProgress();
  const { time } = useTime();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>('intro');
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const [gains, setGains] = useState<{ materials: string[]; nextRealm: string | null }>({ materials: [], nextRealm: null });

  const spec = useMemo<GameSpec | null>(() => {
    if (!entry) return null;
    const { level } = entry;
    if (level.kind === 'memory') return { kind: 'memory', seed: hashId(level.id) + attempt, length: level.length ?? 4, noun: 'seals' };
    if (level.kind === 'steady') return { kind: 'steady', hits: level.hits ?? 1, arc: level.arc ?? 60, speed: level.speed ?? 2.4 };
    if (level.kind === 'quiz') return { kind: 'quiz', questions: level.quiz ?? [] };
    return { kind: 'scale', seed: (level.seed ?? 1) + attempt * 101, weights: level.weights ?? 5, goods: 'the spirit stone' };
  }, [entry, attempt]);

  if (!entry || !spec) return <Navigate to="/realms" replace />;
  const { realm, level, index } = entry;
  if (!isLevelUnlocked(progress, realm, index)) return <Navigate to={`/realms/${realm.id}`} replace />;

  const nextInRealm = realm.levels[index + 1];
  const nextRealm = REALM_LIST[REALM_LIST.findIndex((l) => l.id === realm.id) + 1];
  const nextTarget = nextInRealm ? `/play/${nextInRealm.id}` : nextRealm ? `/realms/${nextRealm.id}` : '/collection';
  const nextLabel = nextInRealm ? `Next: ${nextInRealm.title}` : nextRealm ? `On to ${nextRealm.name}` : 'See your collection';

  const finish = (r: GameResult) => {
    setResult(r);
    if (r.stars > 0) {
      recordLevel(level.id, r.stars);
      const after = { ...progress, levels: { ...progress.levels, [level.id]: Math.max(progress.levels[level.id] ?? 0, r.stars) } };
      const had = ownedMaterials(progress);
      const gained = ownedMaterials(after).filter((m) => !had.includes(m));
      const opened = REALM_LIST.find((l) => !isRealmUnlocked(progress, l) && isRealmUnlocked(after, l));
      setGains({ materials: gained.map((m) => MATERIALS[m].name), nextRealm: opened ? opened.name : null });
      sfx.clear();
    }
    window.setTimeout(() => setStage('result'), reduced ? 100 : 700);
  };

  const retry = () => {
    setResult(null);
    setAttempt((a) => a + 1);
    setStage('play');
  };

  return (
    <div className="play" data-realm={realm.id}>
      <div className="play__scene">
        <Landscape palette={realmPalette(realm, time)} seed={realm.seed} features={sceneFeatures(realm.features, time)} />
        <Mist color="200,210,255" className="play__mist" count={14} />
      </div>
      <div className="play__panel">
        <Link to={`/realms/${realm.id}`} className="linkish play__back">
          <ChevronLeft size={16} /> {realm.name}
        </Link>
        <p className="eyebrow">
          Trial {index + 1} of {realm.levels.length}
        </p>
        <h1>{level.title}</h1>

        {stage === 'intro' && (
          <motion.div initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="lede">{level.brief}</p>
            <p className="note">Best so far: {progress.levels[level.id] ? `${progress.levels[level.id]} of 3 stars` : 'not yet played'}</p>
            <SealButton glyph="剑" onClick={() => setStage('play')}>
              Begin
            </SealButton>
          </motion.div>
        )}

        {stage === 'play' && <GameHost key={attempt} spec={spec} onDone={finish} />}

        {stage === 'result' && result && (
          <motion.div className="result" initial={reduced ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <StarsRow stars={result.stars} size={56} />
            <h2>{result.stars === 0 ? 'Not this time' : result.stars === 3 ? 'Flawless' : 'Trial passed'}</h2>
            <p className="lede">{result.note}</p>
            {result.stars > 0 && <p className="result__virtue">{VIRTUE_LINES[realm.id]}</p>}
            {gains.materials.length > 0 && (
              <p className="result__gain">
                New material for the forge: <strong>{gains.materials.join(', ')}</strong>
              </p>
            )}
            {gains.nextRealm && (
              <p className="result__gain">
                A new realm opens: <strong>{gains.nextRealm}</strong>
              </p>
            )}
            <div className="result__actions">
              {result.stars > 0 && (
                <SealButton glyph="云" onClick={() => navigate(nextTarget)}>
                  {nextLabel}
                </SealButton>
              )}
              <SealButton variant={result.stars > 0 ? 'ghost' : 'primary'} onClick={retry}>
                <RotateCcw size={15} /> {result.stars === 3 ? 'Play again' : result.stars === 0 ? 'Try again' : 'Improve your stars'}
              </SealButton>
              <Link to={`/realms/${realm.id}`} className="linkish">
                Back to the realm
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
