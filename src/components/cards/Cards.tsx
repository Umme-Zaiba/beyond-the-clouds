import { Link } from 'react-router-dom';
import { Bookmark, Check } from 'lucide-react';
import { Landscape } from '../motion/Landscape';
import { WeaponArt } from './WeaponArt';
import { REALMS } from '../../data/realms';
import { AFFINITIES } from '../../data/forge';
import { useProgress } from '../../state/ProgressContext';
import type { ArchiveEntry, Realm } from '../../types';

export function RealmCard({ realm }: { realm: Realm }) {
  const { progress } = useProgress();
  const visited = progress.realms.includes(realm.id);
  const gathered = realm.materials.filter((m) => progress.materials.includes(m)).length;
  return (
    <Link to={`/realms/${realm.id}`} className="realm-card" data-mood={realm.mood}>
      <Landscape palette={realm.palette} seed={realm.seed} features={realm.features} className="realm-card__art" />
      <div className="realm-card__body">
        <span className="realm-card__native" aria-hidden="true">
          {realm.native}
        </span>
        <h3>{realm.name}</h3>
        <p>{realm.tagline}</p>
        <span className="realm-card__meta">
          {visited ? (
            <>
              <Check size={14} /> Visited
            </>
          ) : (
            'Undiscovered'
          )}
          <span aria-hidden="true"> · </span>
          {gathered}/{realm.materials.length} materials
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
      {entry.kind === 'artifact' && (
        <WeaponArt shape={entry.shape} affinity={entry.affinity} glow={0.9} className="entry-card__art" />
      )}
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
