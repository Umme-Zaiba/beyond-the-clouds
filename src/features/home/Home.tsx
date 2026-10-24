import { SealLink } from '../../components/motion/Seal';
import { ArtifactStage } from '../../components/cards/ArtifactStage';
import { RealmCard, EntryCard } from '../../components/cards/Cards';
import { CHARACTERS } from '../../data/archive';
import { REALM_LIST, MAX_STARS } from '../../data/realms';
import { TOTAL_WEAPONS } from '../../lib/forge';
import { dailyStreak, rankFor, todayKey, totalStars } from '../../lib/game';
import { useProgress } from '../../state/ProgressContext';
import { Ascent } from './Ascent';

export function Home() {
  const { progress } = useProgress();
  const stars = totalStars(progress);
  const rank = rankFor(stars);
  const streak = dailyStreak(progress.daily, todayKey());

  const steps = [
    { glyph: '游', title: 'Ascend', text: 'Scroll through the clouds and read the road. Every detail is fair game later.', stat: 'Seven scenes' },
    { glyph: '试', title: 'Trial', text: 'Memory, steady breath, spirit-stone scales and lore questions. Up to three stars each.', stat: `${stars} of ${MAX_STARS} stars` },
    { glyph: '锻', title: 'Forge', text: 'Spend what you earn on materials, then forge a sword, spear or fan.', stat: `${progress.forged.length} of ${TOTAL_WEAPONS} weapons` },
    { glyph: '日', title: 'Return', text: 'A new daily challenge each morning, with a result you can share.', stat: streak > 0 ? `${streak}-day streak` : 'Start a streak' },
  ];

  return (
    <>
      <Ascent />

      <section id="realms" className="section">
        <header className="section__head">
          <p className="eyebrow">The trials</p>
          <h2>Three realms, one forge</h2>
          <p className="lede">
            You are a <strong>{rank.title}</strong>
            {stars > 0 ? ` with ${stars} stars` : ''}. Pass the trials to open each realm and to win the materials you will need at the forge.
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
            <p className="eyebrow">Create</p>
            <h2 id="forge-h">The Divine Forge</h2>
            <p className="lede">
              Choose a form, two materials and an element. The result is never random: the same choices always forge the same weapon, so every one of the {TOTAL_WEAPONS} is
              something you can plan for, chase and share.
            </p>
            <SealLink to="/forge" glyph="锻">
              Visit the forge
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
          <p className="eyebrow">Discover</p>
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
          <p className="eyebrow">How it plays</p>
          <h2>Read, trial, forge, return</h2>
          <p className="lede">No account needed. Progress is saved in this browser, and the sky follows your local time.</p>
        </header>
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.title} className="step">
              <span className="step__glyph" aria-hidden="true">
                {s.glyph}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <p className="step__progress">{s.stat}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
