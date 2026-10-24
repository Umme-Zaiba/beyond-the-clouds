import { Link, Navigate, useParams } from 'react-router-dom';
import { Check, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { Landscape } from '../../components/motion/Landscape';
import { Mist } from '../../components/motion/Mist';
import { Petals } from '../../components/motion/Petals';
import { SealLink } from '../../components/motion/Seal';
import { EntryCard } from '../../components/cards/Cards';
import { StarsRow } from '../play/StarsRow';
import { REALMS, REALM_LIST } from '../../data/realms';
import { ARCHIVE_BY_ID } from '../../data/archive';
import { AFFINITIES, MATERIALS } from '../../data/forge';
import { isLevelUnlocked, isRealmUnlocked, levelStars, ownedMaterials, realmStars } from '../../lib/game';
import { useParallax, useReducedMotion } from '../../lib/hooks';
import { realmPalette, sceneFeatures } from '../../lib/time';
import { useProgress } from '../../state/ProgressContext';
import { useTime } from '../../state/TimeContext';
import type { GameKind, RealmId } from '../../types';

const KIND_NAME: Record<GameKind, string> = { memory: 'Memory', steady: 'Steady breath', scale: 'Spirit-stone scale', quiz: 'Lore trial' };

export function RealmPage() {
  const { id } = useParams();
  const realm = id && id in REALMS ? REALMS[id as RealmId] : null;
  const { progress } = useProgress();
  const { time } = useTime();
  const reduced = useReducedMotion();
  const sceneRef = useParallax<HTMLDivElement>(!reduced);

  if (!realm) return <Navigate to="/realms" replace />;

  const open = isRealmUnlocked(progress, realm);
  const stars = realmStars(progress, realm);
  const owned = ownedMaterials(progress);
  const previous = REALM_LIST[REALM_LIST.findIndex((r) => r.id === realm.id) - 1];
  const entries = [...realm.characters, ...realm.artifacts].map((e) => ARCHIVE_BY_ID[e]).filter(Boolean);
  const features = sceneFeatures(realm.features, time);

  return (
    <article className="realm" data-realm={realm.id}>
      <div className="realm__scene" ref={sceneRef}>
        <Landscape palette={realmPalette(realm, time)} seed={realm.seed} features={features} />
        <Mist color={realm.id === 'ember' ? '255,154,107' : realm.id === 'jade' ? '143,166,255' : '255,225,236'} className="realm__mist" />
        {realm.features.petals && <Petals className="realm__petals" count={26} />}
        <div className="realm__title">
          <p className="realm__native" aria-hidden="true">
            {realm.native}
          </p>
          <motion.h1 initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}>
            {realm.name}
          </motion.h1>
          <p className="realm__tagline">{realm.tagline}</p>
        </div>
      </div>

      <div className="realm__body">
        <section className="realm__lore" aria-label="Lore">
          <p className="eyebrow">Lore · original</p>
          {realm.lore.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <section aria-label="Trials">
          <p className="eyebrow">The trials</p>
          <h2>Three trials</h2>
          {!open && (
            <p className="note">
              <Lock size={14} /> Earn {realm.entryStars} stars in {previous?.name} to enter.{' '}
              {previous && (
                <Link to={`/realms/${previous.id}`} className="linkish">
                  Go there
                </Link>
              )}
            </p>
          )}
          <ol className="levels">
            {realm.levels.map((lv, i) => {
              const unlocked = isLevelUnlocked(progress, realm, i);
              const s = levelStars(progress, lv.id);
              const body = (
                <>
                  <span className="level__num" aria-hidden="true">
                    {unlocked ? i + 1 : <Lock size={16} />}
                  </span>
                  <span className="level__info">
                    <strong>{lv.title}</strong>
                    <small>
                      {KIND_NAME[lv.kind]} · {lv.brief}
                    </small>
                  </span>
                  <StarsRow stars={s} size={22} animate={false} />
                </>
              );
              return (
                <li key={lv.id}>
                  {unlocked ? (
                    <Link to={`/play/${lv.id}`} className="level">
                      {body}
                    </Link>
                  ) : (
                    <div className="level is-locked" aria-disabled="true">
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="note">{stars} of 9 stars earned here.</p>
        </section>

        <section className="realm__gather" aria-label="Materials">
          <p className="eyebrow">Materials</p>
          <h2>Earned by stars</h2>
          <ul className="gather-list">
            {realm.materials.map((mid) => {
              const m = MATERIALS[mid];
              const have = owned.includes(mid);
              return (
                <li key={mid} className={`gather${have ? ' is-have' : ''}`}>
                  <div className="gather__row">
                    <span className="gather__gem" style={{ background: `linear-gradient(150deg, ${AFFINITIES[m.affinity].colors[0]}, ${AFFINITIES[m.affinity].colors[1]})`, opacity: have ? 1 : 0.4 }} aria-hidden="true" />
                    <div className="gather__info">
                      <h3>
                        {m.name} <span className="tag">{AFFINITIES[m.affinity].name}</span>
                      </h3>
                      <p>{m.blurb}</p>
                    </div>
                    <span className="gather__state">
                      {have ? (
                        <>
                          <Check size={16} /> {m.starter ? 'Yours from the start' : 'Earned'}
                        </>
                      ) : (
                        <>
                          <Lock size={14} /> {m.unlockStars} stars here
                        </>
                      )}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-label="Connected discoveries">
          <p className="eyebrow">Connected discoveries</p>
          <h2>Who and what is here</h2>
          <div className="grid grid--3">
            {entries.map((e) => (
              <EntryCard key={e.id} entry={e} />
            ))}
          </div>
        </section>

        <div className="realm__nav">
          <SealLink to="/forge" glyph="锻">
            Take it to the Forge
          </SealLink>
          <Link to="/realms" className="linkish">
            Back to the map
          </Link>
        </div>
      </div>
    </article>
  );
}
