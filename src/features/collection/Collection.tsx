import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import { WeaponCard } from '../forge/WeaponCard';
import { EntryCard } from '../../components/cards/Cards';
import { SealButton, SealLink } from '../../components/motion/JadeSeal';
import { ARCHIVE, ARCHIVE_BY_ID } from '../../data/archive';
import { AFFINITIES, MATERIAL_LIST } from '../../data/forge';
import { REALMS, REALM_LIST } from '../../data/realms';
import { computeWeapon, TOTAL_WEAPONS } from '../../lib/forge';
import { shareWeapon } from '../../lib/shareCard';
import { useProgress } from '../../state/ProgressContext';

export function Collection() {
  const { progress, reset } = useProgress();
  const [note, setNote] = useState('');
  const [confirm, setConfirm] = useState(false);

  const weapons = progress.forged.map((f) => computeWeapon(f.recipe));
  const marked = progress.bookmarks.map((b) => ARCHIVE_BY_ID[b]).filter(Boolean);
  const empty = weapons.length === 0 && marked.length === 0 && progress.realms.length === 0 && progress.entries.length === 0;

  return (
    <div>
      <header className="page-head">
        <p className="eyebrow">Collect</p>
        <h1>Your Collection</h1>
        <p className="lede">Saved in this browser, so it will still be here when you come back. No account needed.</p>
      </header>

      <section className="progress" aria-label="Progress">
        <div className="progress__cell">
          <strong>{progress.realms.length}/{REALM_LIST.length}</strong>
          <span>Realms found</span>
        </div>
        <div className="progress__cell">
          <strong>{progress.materials.length}/{MATERIAL_LIST.length}</strong>
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
          <p>Nothing here yet. Your journey begins in the realms.</p>
          <SealLink to="/realms" glyph="界">
            Explore the realms
          </SealLink>
        </div>
      )}

      <section aria-label="Materials">
        <h2>Materials</h2>
        <ul className="mat-row">
          {MATERIAL_LIST.map((m) => {
            const have = progress.materials.includes(m.id);
            return (
              <li key={m.id} className={have ? 'is-have' : 'is-locked'}>
                <span className="gather__gem" style={{ background: `linear-gradient(150deg, ${AFFINITIES[m.affinity].colors[0]}, ${AFFINITIES[m.affinity].colors[1]})`, opacity: have ? 1 : 0.3 }} aria-hidden="true" />
                <span>
                  <strong>{m.name}</strong>
                  <small>{have ? AFFINITIES[m.affinity].name : <Link to={`/realms/${m.realm}`}>{REALMS[m.realm].name}</Link>}</small>
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
