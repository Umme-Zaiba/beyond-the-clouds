import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Image as ImageIcon, Lock, RotateCcw } from 'lucide-react';
import { WeaponArt } from '../../components/cards/WeaponArt';
import { ArtifactStage } from '../../components/cards/ArtifactStage';
import { Mist } from '../../components/motion/Mist';
import { SealButton } from '../../components/motion/JadeSeal';
import { WeaponCard } from './WeaponCard';
import { AFFINITIES, FORMS, MATERIAL_LIST, MATERIALS } from '../../data/forge';
import { REALMS } from '../../data/realms';
import { computeWeapon, TOTAL_WEAPONS, validateRecipe } from '../../lib/forge';
import { shareWeapon } from '../../lib/shareCard';
import { sfx } from '../../lib/audio';
import { useReducedMotion } from '../../lib/hooks';
import { useProgress } from '../../state/ProgressContext';
import type { Affinity, FormId, MaterialId, WeaponResult } from '../../types';

type Phase = 'idle' | 'forging' | 'done';

export function Forge() {
  const { progress, saveWeapon } = useProgress();
  const reduced = useReducedMotion();
  const [form, setForm] = useState<FormId | undefined>();
  const [mats, setMats] = useState<MaterialId[]>([]);
  const [affinity, setAffinity] = useState<Affinity | undefined>();
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<WeaponResult | null>(null);
  const [status, setStatus] = useState('');
  const timer = useRef<number>();
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (phase === 'done') resultRef.current?.focus();
  }, [phase]);

  const problem = validateRecipe({ form, materials: mats, affinity }, progress.materials);
  const alreadySaved = !!result && progress.forged.some((f) => f.id === result.id);

  const toggleMat = (id: MaterialId) =>
    setMats((cur) => (cur.includes(id) ? cur.filter((m) => m !== id) : cur.length >= 2 ? [cur[1], id] : [...cur, id]));

  const forge = () => {
    if (problem || !form || !affinity) return;
    const weapon = computeWeapon({ form, affinity, materials: [mats[0], mats[1]] });
    setResult(weapon);
    setStatus('');
    setPhase('forging');
    if (reduced) {
      sfx.strike();
    } else {
      [0, 850, 1700].forEach((ms) => window.setTimeout(sfx.strike, ms));
    }
    timer.current = window.setTimeout(
      () => {
        setPhase('done');
        sfx.reveal();
      },
      reduced ? 250 : 2600,
    );
  };

  const reforge = () => {
    window.clearTimeout(timer.current);
    setPhase('idle');
    setResult(null);
    setStatus('');
  };

  const resetAll = () => {
    reforge();
    setForm(undefined);
    setMats([]);
    setAffinity(undefined);
  };

  const save = () => {
    if (!result) return;
    const isNew = saveWeapon({ form: result.form.id, affinity: result.affinity.id, materials: [result.materials[0].id, result.materials[1].id] });
    setStatus(isNew ? 'Added to your collection.' : 'Already in your collection.');
  };

  const share = async () => {
    if (!result) return;
    setStatus('Preparing your card…');
    try {
      const how = await shareWeapon(result);
      setStatus(how === 'downloaded' ? 'Card saved as an image.' : 'Shared.');
    } catch {
      setStatus('Could not create the card on this device.');
    }
  };

  // Live preview of what the current selection would make, shown dim until it is forged.
  const preview = useMemo(
    () => (form ? { shape: form, affinity: affinity ?? 'wind' } : null),
    [form, affinity],
  );
  const tint = affinity ?? 'wind';

  return (
    <div className="forge">
      <Mist color="232,160,100" className="forge__mist" count={22} />
      <header className="page-head page-head--center">
        <p className="eyebrow">Create</p>
        <h1>The Divine Forge</h1>
        <p className="lede">
          Choose the ingredients of your destiny. The same choices always forge the same weapon, so every one of the {TOTAL_WEAPONS} is
          something you can plan for.
        </p>
      </header>

      <div className="forge__layout">
        <div className="forge__panel">
          <fieldset className="field" disabled={phase !== 'idle'}>
            <legend>Weapon form</legend>
            <div className="choices choices--3">
              {Object.values(FORMS).map((f) => (
                <label key={f.id} className={`choice${form === f.id ? ' is-on' : ''}`}>
                  <input type="radio" name="form" value={f.id} aria-label={f.name} checked={form === f.id} onChange={() => setForm(f.id)} />
                  <WeaponArt shape={f.id} affinity={tint} glow={form === f.id ? 1 : 0.3} className="choice__art" />
                  <span className="choice__name">{f.name}</span>
                  <span className="choice__hint">{f.blurb}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field" disabled={phase !== 'idle'}>
            <legend>
              Forging materials <span className="field__count">{mats.length}/2</span>
            </legend>
            <div className="choices choices--3">
              {MATERIAL_LIST.map((m) => {
                const have = progress.materials.includes(m.id);
                const on = mats.includes(m.id);
                return (
                  <label key={m.id} className={`choice choice--mat${on ? ' is-on' : ''}${have ? '' : ' is-locked'}`}>
                    <input type="checkbox" aria-label={have ? m.name : `${m.name} (locked)`} checked={on} disabled={!have} onChange={() => toggleMat(m.id)} />
                    <span
                      className="choice__gem"
                      style={{ background: `linear-gradient(150deg, ${AFFINITIES[m.affinity].colors[0]}, ${AFFINITIES[m.affinity].colors[1]})`, opacity: have ? 1 : 0.35 }}
                      aria-hidden="true"
                    />
                    <span className="choice__name">
                      {m.name} {!have && <Lock size={12} aria-label="Locked" />}
                    </span>
                    <span className="choice__hint">
                      {have ? (
                        AFFINITIES[m.affinity].name
                      ) : (
                        <Link to={`/realms/${m.realm}`}>Gather in {REALMS[m.realm].name}</Link>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="field" disabled={phase !== 'idle'}>
            <legend>Elemental affinity</legend>
            <div className="choices choices--3">
              {Object.values(AFFINITIES).map((a) => (
                <label key={a.id} className={`choice choice--aff${affinity === a.id ? ' is-on' : ''}`}>
                  <input type="radio" name="affinity" value={a.id} aria-label={a.name} checked={affinity === a.id} onChange={() => setAffinity(a.id)} />
                  <span className="choice__gem" style={{ background: `linear-gradient(150deg, ${a.colors[0]}, ${a.colors[1]})` }} aria-hidden="true" />
                  <span className="choice__name">{a.name}</span>
                  <span className="choice__hint">{a.blurb}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="forge__stage" data-phase={phase} data-affinity={tint}>
          <div className="anvil">
            <div className="anvil__glow" />
            <AnimatePresence mode="wait">
              {phase === 'done' && result ? (
                <motion.div
                  key="done"
                  ref={resultRef}
                  tabIndex={-1}
                  className="reveal"
                  initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  aria-live="polite"
                >
                  <WeaponCard weapon={result}>
                    <ul className="notes">
                      {result.notes.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                    <div className="reveal__actions">
                      <SealButton glyph={alreadySaved ? undefined : '宝'} onClick={save} disabled={alreadySaved}>
                        {alreadySaved ? (
                          <>
                            <Check size={15} /> In collection
                          </>
                        ) : (
                          'Save to collection'
                        )}
                      </SealButton>
                      <SealButton variant="ghost" onClick={share}>
                        <ImageIcon size={15} /> Share card
                      </SealButton>
                      <button className="linkish" onClick={reforge}>
                        <RotateCcw size={14} /> Reforge
                      </button>
                    </div>
                    <p className="status" role="status">
                      {status}
                    </p>
                  </WeaponCard>
                </motion.div>
              ) : (
                <motion.div key="stage" className="stage-art" initial={false} exit={{ opacity: 0 }}>
                  <p className="stage-art__title">{phase === 'forging' ? 'Forging…' : 'The Unawakened Artifact'}</p>
                  {preview ? (
                    <ArtifactStage shape={preview.shape} affinity={preview.affinity} glow={phase === 'forging' ? 1 : 0.4} className="stage-art__weapon" />
                  ) : (
                    <div className="stage-art__empty">Choose a form to see its shape.</div>
                  )}
                  {phase === 'forging' && (
                    <div className="sparks" aria-hidden="true">
                      {Array.from({ length: 18 }, (_, i) => (
                        <i key={i} style={{ left: `${10 + ((i * 53) % 80)}%`, animationDelay: `${(i % 6) * 0.18}s` }} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {phase !== 'done' && (
            <div className="forge__cta">
              <SealButton glyph="锻" onClick={forge} disabled={!!problem || phase === 'forging'} aria-describedby="forge-hint">
                {phase === 'forging' ? 'Forging…' : 'Forge artifact'}
              </SealButton>
              <p id="forge-hint" className="forge__hint">
                {problem ?? `${MATERIALS[mats[0]]?.name} + ${MATERIALS[mats[1]]?.name} · ${FORMS[form!].name} · ${AFFINITIES[affinity!].name}`}
              </p>
              {(form || mats.length > 0 || affinity) && phase === 'idle' && (
                <button className="linkish" onClick={resetAll}>
                  <RotateCcw size={14} /> Reset choices
                </button>
              )}
            </div>
          )}
          {phase === 'done' && (
            <button className="linkish forge__again" onClick={resetAll}>
              <RotateCcw size={14} /> Start over
            </button>
          )}
          <p className="forge__note">Prototype rules: stats, grades and combinations are original game design, not canon from any drama.</p>
        </div>
      </div>
    </div>
  );
}
