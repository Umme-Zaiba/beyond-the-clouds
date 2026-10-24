import { Link } from 'react-router-dom';
import { Bookmark, Lock } from 'lucide-react';
import { Landscape } from '../motion/Landscape';
import { WeaponArt } from './WeaponArt';
import { REALMS } from '../../data/realms';
import { AFFINITIES } from '../../data/forge';
import { isRealmUnlocked, realmStars } from '../../lib/game';
import { realmPalette, sceneFeatures } from '../../lib/time';
import { StarsRow } from '../../features/play/StarsRow';
import { useProgress } from '../../state/ProgressContext';
import { useTime } from '../../state/TimeContext';
import type { ArchiveEntry, Realm } from '../../types';

export function RealmCard({ realm }: { realm: Realm }) {
  const { progress } = useProgress();
  const { time } = useTime();
  const open = isRealmUnlocked(progress, realm);
  const stars = realmStars(progress, realm);
  return (
    <Link to={`/realms/${realm.id}`} className={`realm-card${open ? '' : ' is-locked'}`}>
      <Landscape palette={realmPalette(realm, time)} seed={realm.seed} features={sceneFeatures(realm.features, time)} className="realm-card__art" />
      <div className="realm-card__body">
        <span className="realm-card__native" aria-hidden="true">
          {realm.native}
        </span>
        <h3>{realm.name}</h3>
        <p>{realm.tagline}</p>
        <span className="realm-card__meta">
          {open ? (
            <>
              <StarsRow stars={Math.min(3, Math.floor(stars / 3))} size={14} animate={false} />
              <span>{stars} of 9 stars</span>
            </>
          ) : (
            <>
              <Lock size={13} /> Earn {realm.entryStars} stars in the realm before
            </>
          )}
        </span>
      </div>
    </Link>
  );
}

export function EntryCard({ entry }: { entry: ArchiveEntry }) {
  const { progress } = useProgress();
  const seen = progress.entries.includes(entry.id);
  const marked = progress.bookmarks.includes(entry.id);
  const realm = REALMS[entry.realm];
  return (
    <Link to={`/archive/${entry.id}`} className="entry-card">
      <div className="entry-card__top">
        <span className="tag tag--original">Original</span>
        {entry.kind === 'artifact' ? <span className="tag">Artifact</span> : <span className="tag">Character</span>}
        {marked && <Bookmark size={15} className="entry-card__mark" aria-label="Bookmarked" />}
      </div>
      {entry.kind === 'artifact' && <WeaponArt shape={entry.shape} affinity={entry.affinity} glow={0.9} className="entry-card__art" />}
      {entry.kind === 'character' && (
        <div className="entry-card__sigil" style={{ background: `linear-gradient(160deg, ${realm.palette.mid}, ${realm.palette.near})` }} aria-hidden="true">
          <span>{entry.name.split(' ').slice(-1)[0].charAt(0)}</span>
        </div>
      )}
      <h3>{entry.name}</h3>
      <p className="entry-card__title">{entry.title}</p>
      <p className="entry-card__blurb">{entry.blurb}</p>
      <p className="entry-card__foot">
        {realm.name}
        {entry.kind === 'artifact' && <> · {AFFINITIES[entry.affinity].name}</>}
        {!seen && <span className="entry-card__new"> · New</span>}
      </p>
    </Link>
  );
}
