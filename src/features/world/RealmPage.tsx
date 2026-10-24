import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Check, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { Landscape } from '../../components/motion/Landscape';
import { Mist } from '../../components/motion/Mist';
import { Petals } from '../../components/motion/Petals';
import { SealButton, SealLink } from '../../components/motion/JadeSeal';
import { EntryCard } from '../../components/cards/Cards';
import { GatherTrial } from './GatherTrial';
import { REALMS, REALM_LIST } from '../../data/realms';
import { ARCHIVE_BY_ID } from '../../data/archive';
import { AFFINITIES, MATERIALS } from '../../data/forge';
import { useParallax, useReducedMotion } from '../../lib/hooks';
import { useProgress } from '../../state/ProgressContext';
import type { MaterialId, RealmId } from '../../types';

export function RealmPage() {
  const { id } = useParams();
  const realm = id && id in REALMS ? REALMS[id as RealmId] : null;
  const { progress, discoverRealm, gatherMaterial } = useProgress();
  const reduced = useReducedMotion();
  const sceneRef = useParallax<HTMLDivElement>(!reduced);
  const [trial, setTrial] = useState<MaterialId | null>(null);

  useEffect(() => {
    if (realm) discoverRealm(realm.id);
  }, [realm, discoverRealm]);

  if (!realm) return <Navigate to="/realms" replace />;

  const entries = [...realm.characters, ...realm.artifacts].map((e) => ARCHIVE_BY_ID[e]).filter(Boolean);
  const next = REALM_LIST[(REALM_LIST.findIndex((r) => r.id === realm.id) + 1) % REALM_LIST.length];

  return (
    <article className="realm" data-mood={realm.mood}>
      <div className="realm__scene" ref={sceneRef}>
        <Landscape palette={realm.palette} seed={realm.seed} features={realm.features} />
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

        <section className="realm__gather" aria-label="Gathering sites">
          <p className="eyebrow">Spiritual trials</p>
          <h2>Gathering sites</h2>
          <p className="lede">Each material is earned in a short trial. Bring what you gather to the Forge.</p>
          <ul className="gather-list">
            {realm.materials.map((mid) => {
              const m = MATERIALS[mid];
              const have = progress.materials.includes(mid);
              const open = trial === mid;
              return (
                <li key={mid} className={`gather${have ? ' is-have' : ''}`}>
                  <div className="gather__row">
                    <span className="gather__gem" style={{ background: `linear-gradient(150deg, ${AFFINITIES[m.affinity].colors[0]}, ${AFFINITIES[m.affinity].colors[1]})` }} aria-hidden="true" />
                    <div className="gather__info">
                      <h3>
                        {m.name} <span className="tag">{AFFINITIES[m.affinity].name}</span>
                      </h3>
                      <p>{m.blurb}</p>
                    </div>
                    {have ? (
                      <span className="gather__state">
                        <Check size={16} /> Gathered
                      </span>
                    ) : (
                      <SealButton variant="ghost" onClick={() => setTrial(open ? null : mid)} aria-expanded={open}>
                        {open ? 'Close' : 'Begin trial'}
                      </SealButton>
                    )}
                  </div>
                  {open && !have && (
                    <GatherTrial
                      material={m}
                      onCancel={() => setTrial(null)}
                      onSuccess={() => {
                        gatherMaterial(mid);
                        setTrial(null);
                      }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
          {!realm.materials.every((m) => progress.materials.includes(m)) && (
            <p className="note">
              <Lock size={14} /> Materials you have not gathered stay locked in the Forge.
            </p>
          )}
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
          <SealLink to={`/realms/${next.id}`} variant="ghost">
            Next: {next.name}
          </SealLink>
          <Link to="/realms" className="linkish">
            Back to the map
          </Link>
        </div>
      </div>
    </article>
  );
}
