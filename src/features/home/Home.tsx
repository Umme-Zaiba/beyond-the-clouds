import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { Landscape } from '../../components/motion/Landscape';
import { Mist } from '../../components/motion/Mist';
import { Petals } from '../../components/motion/Petals';
import { ArtifactStage } from '../../components/cards/ArtifactStage';
import { SealLink } from '../../components/motion/JadeSeal';
import { RealmCard, EntryCard } from '../../components/cards/Cards';
import { REALM_LIST } from '../../data/realms';
import { ARCHIVE, CHARACTERS } from '../../data/archive';
import { TOTAL_WEAPONS } from '../../lib/forge';
import { useFinePointer, useParallax, useReducedMotion } from '../../lib/hooks';
import { useProgress } from '../../state/ProgressContext';
import type { Palette } from '../../types';

const HERO_PALETTE: Palette = {
  skyTop: '#070a28',
  skyMid: '#3a3190',
  skyBottom: '#f0a8c8',
  far: '#5560b8',
  mid: '#3a4194',
  near: '#1c2160',
  glow: '#ffe9b8',
  glow2: '#9fe6ff',
  mist: '#ffe4ef',
};

const TITLE = ['Beyond', 'the', 'Clouds'];

export function Home() {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const heroRef = useParallax<HTMLElement>(!reduced);
  const { progress } = useProgress();

  const steps = [
    { glyph: '界', title: 'Explore', text: 'Wander three realms and read what they remember.', done: progress.realms.length, of: REALM_LIST.length },
    { glyph: '宝', title: 'Discover', text: 'Open characters and artifacts, and follow their secrets.', done: progress.entries.length, of: ARCHIVE.length },
    { glyph: '锻', title: 'Create', text: 'Combine materials, form and element into a weapon.', done: progress.forged.length, of: TOTAL_WEAPONS },
    { glyph: '云', title: 'Collect', text: 'Keep every discovery and share your best forging.', done: progress.bookmarks.length, of: null },
  ];

  return (
    <>
      <section className="hero" ref={heroRef}>
        <Landscape palette={HERO_PALETTE} seed={5} features={{ stars: true, islands: true }} className="hero__scene" />
        <Mist color="255,214,236" className="hero__mist" />
        <Petals className="hero__petals" count={30} />
        <div className="hero__artifact" aria-hidden="true">
          <ArtifactStage shape="sword" affinity="wind" className="hero__stage" />
        </div>
        <div className="hero__content">
          <motion.p
            className="eyebrow"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            An interactive world of immortals, hidden destinies and divine artifacts
          </motion.p>
          <h1 className="hero__title" aria-label="Beyond the Clouds">
            {TITLE.map((word, i) => (
              <motion.span
                key={word}
                className="hero__word"
                aria-hidden="true"
                initial={reduced ? false : { opacity: 0, y: 40, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.7 + i * 0.22, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.div
            className="hero__actions"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <SealLink to="/realms" glyph="云">
              Enter the Celestial Realm
            </SealLink>
            <p className="hero__hint">{fine ? 'Move your cursor. It is a sword.' : 'Drag a finger across the screen. Your qi leaves a trail.'}</p>
          </motion.div>
        </div>
        <a className="hero__scroll" href="#realms" aria-label="Scroll to the realms">
          <ArrowDown size={18} />
        </a>
      </section>

      <section id="realms" className="section">
        <header className="section__head">
          <p className="eyebrow">01 · Explore</p>
          <h2>Three realms, one forge</h2>
          <p className="lede">
            Each realm holds lore, people to meet, and a spirit material you can only earn by passing its trial. Bring them to the Forge.
          </p>
        </header>
        <div className="grid grid--3">
          {REALM_LIST.map((r) => (
            <RealmCard key={r.id} realm={r} />
          ))}
        </div>
      </section>

      <section className="section section--forge" aria-labelledby="forge-h">
        <div className="forge-teaser">
          <div className="forge-teaser__copy">
            <p className="eyebrow">02 · Create</p>
            <h2 id="forge-h">The Divine Forge</h2>
            <p className="lede">
              Choose a form, two materials and an element. The result is never random: the same choices always forge the same weapon, so
              every one of the {TOTAL_WEAPONS} is something you can plan for, chase and share.
            </p>
            <SealLink to="/forge" glyph="锻">
              Forge a weapon
            </SealLink>
          </div>
          <div className="forge-teaser__art" aria-hidden="true">
            <ArtifactStage shape="spear" affinity="flame" />
            <ArtifactStage shape="sword" affinity="wind" />
            <ArtifactStage shape="fan" affinity="ice" />
          </div>
        </div>
      </section>

      <section className="section">
        <header className="section__head">
          <p className="eyebrow">03 · Discover</p>
          <h2>The Immortal Archive</h2>
          <p className="lede">Original characters and artifacts, each tied to a realm, each with a secret you can unveil.</p>
        </header>
        <div className="grid grid--3">
          {CHARACTERS.slice(0, 3).map((c) => (
            <EntryCard key={c.id} entry={c} />
          ))}
        </div>
        <div className="section__cta">
          <SealLink to="/archive" variant="ghost" glyph="宝">
            Open the archive
          </SealLink>
        </div>
      </section>

      <section className="section section--tight">
        <header className="section__head">
          <p className="eyebrow">04 · Collect</p>
          <h2>Everything you find, kept</h2>
          <p className="lede">No account needed. Progress is saved in this browser.</p>
        </header>
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.title} className="step">
              <span className="step__glyph" aria-hidden="true">
                {s.glyph}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <p className="step__progress">{s.of ? `${s.done} / ${s.of}` : `${s.done} bookmarked`}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
