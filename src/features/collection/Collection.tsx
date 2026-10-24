import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import { WeaponCard } from '../forge/WeaponCard';
import { EntryCard } from '../../components/cards/Cards';
import { SealButton, SealLink } from '../../components/motion/Seal';
import { ARCHIVE, ARCHIVE_BY_ID } from '../../data/archive';
import { AFFINITIES, MATERIAL_LIST } from '../../data/forge';
import { REALMS, MAX_STARS } from '../../data/realms';
import { ownedMaterials, rankFor, totalStars, dailyStreak, todayKey } from '../../lib/game';
import { computeWeapon, TOTAL_WEAPONS } from '../../lib/forge';
import { shareWeapon } from '../../lib/shareCard';
import { useProgress } from '../../state/ProgressContext';

export function Collection() {
  const { progress, reset } = useProgress();
  const [note, setNote] = useState('');
  const [confirm, setConfirm] = useState(false);

  const stars = totalStars(progress);
  const rank = rankFor(stars);
  const owned = ownedMaterials(progress);
  const streak = dailyStreak(progress.daily, todayKey());
  const weapons = progress.forged.map((f) => computeWeapon(f.recipe));
  const marked = progress.bookmarks.map((b) => ARCHIVE_BY_ID[b]).filter(Boolean);
  const empty = weapons.length === 0 && marked.length === 0 && stars === 0 && progress.entries.length === 0;

  return (
    <div>
      <header className="page-head">
        <p className="eyebrow">Collect</p>
        <h1>{rank.title}</h1>
        <p className="lede">
          {rank.next ? `${rank.next.need} more ${rank.next.need === 1 ? 'star' : 'stars'} to become a ${rank.next.title}. ` : 'You have reached the highest rank. '}
          Saved in this browser, so it will still be here when you come back. {streak > 0 ? `Daily streak: ${streak}.` : ''}
        </p>
      </header>

      <section className="progress" aria-label="Progress">
        <div className="progress__cell">
          <strong>{stars}/{MAX_STARS}</strong>
          <span>Stars earned</span>
        </div>
        <div className="progress__cell">
          <strong>{owned.length}/{MATERIAL_LIST.length}</strong>
          <span>Materials gathered</span>
        </div>
        <div className="progress__cell">
          <strong>{progress.entries.length}/{ARCHIVE.length}</strong>
          <span>Archive opened</span>
        </div>
        <div className="progress__cell">
          <strong>{weapons.length}/{TOTAL_WEAPONS}</strong>
          <span>Weapons forged</span>
        </div>
      </section>

      {empty && (
        <div className="empty">
          <p>Nothing here yet. Your trials begin in the first realm.</p>
          <SealLink to="/realms/cloudsea" glyph="界">
            Begin the trials
          </SealLink>
        </div>
      )}

      <section aria-label="Materials">
        <h2>Materials</h2>
        <ul className="mat-row">
          {MATERIAL_LIST.map((m) => {
            const have = owned.includes(m.id);
            return (
              <li key={m.id} className={have ? 'is-have' : 'is-locked'}>
                <span className="gather__gem" style={{ background: `linear-gradient(150deg, ${AFFINITIES[m.affinity].colors[0]}, ${AFFINITIES[m.affinity].colors[1]})`, opacity: have ? 1 : 0.3 }} aria-hidden="true" />
                <span>
                  <strong>{m.name}</strong>
                  <small>{have ? AFFINITIES[m.affinity].name : <Link to={`/realms/${m.realm}`}>{m.unlockStars} stars in {REALMS[m.realm].name}</Link>}</small>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label="Forged weapons">
        <h2>Forged weapons</h2>
        {weapons.length === 0 ? (
          <div className="empty empty--inline">
            <p>You have not saved a weapon yet.</p>
            <SealLink to="/forge" glyph="锻" variant="ghost">
              Visit the Forge
            </SealLink>
          </div>
        ) : (
          <div className="grid grid--2">
            {weapons.map((w) => (
              <WeaponCard key={w.id} weapon={w} compact>
                <div className="reveal__actions">
                  <SealButton
                    variant="ghost"
                    onClick={async () => {
                      setNote('Preparing your card…');
                      try {
                        setNote((await shareWeapon(w)) === 'downloaded' ? 'Card saved as an image.' : 'Shared.');
                      } catch {
                        setNote('Could not create the card on this device.');
                      }
                    }}
                  >
                    <ImageIcon size={15} /> Share card
                  </SealButton>
                </div>
              </WeaponCard>
            ))}
          </div>
        )}
        <p className="status" role="status">
          {note}
        </p>
      </section>

      <section aria-label="Bookmarks">
        <h2>Bookmarked lore</h2>
        {marked.length === 0 ? (
          <div className="empty empty--inline">
            <p>Bookmark a character or artifact and it will wait for you here.</p>
            <SealLink to="/archive" glyph="宝" variant="ghost">
              Open the archive
            </SealLink>
          </div>
        ) : (
          <div className="grid grid--3">
            {marked.map((e) => (
              <EntryCard key={e.id} entry={e} />
            ))}
          </div>
        )}
      </section>

      <section className="danger">
        {confirm ? (
          <>
            <p>This clears your progress, materials and forged weapons from this browser.</p>
            <SealButton
              variant="ghost"
              onClick={() => {
                reset();
                setConfirm(false);
              }}
            >
              <Trash2 size={15} /> Yes, start over
            </SealButton>
            <button className="linkish" onClick={() => setConfirm(false)}>
              Keep my progress
            </button>
          </>
        ) : (
          <button className="linkish" onClick={() => setConfirm(true)}>
            <Trash2 size={14} /> Reset all progress
          </button>
        )}
      </section>
    </div>
  );
}
