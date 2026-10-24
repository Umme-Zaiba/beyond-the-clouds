import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ArtifactStage } from '../../components/cards/ArtifactStage';
import { Landscape } from '../../components/motion/Landscape';
import { SealButton } from '../../components/motion/JadeSeal';
import { ARCHIVE_BY_ID } from '../../data/archive';
import { REALMS } from '../../data/realms';
import { AFFINITIES } from '../../data/forge';
import { useProgress } from '../../state/ProgressContext';

const SPOILER = ['No spoilers', 'Mild spoilers', 'Deep secrets'];

export function EntryPage() {
  const { id } = useParams();
  const entry = id ? ARCHIVE_BY_ID[id] : undefined;
  const { progress, discoverEntry, toggleBookmark } = useProgress();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setShown(false);
    if (entry) discoverEntry(entry.id);
  }, [entry, discoverEntry]);

  if (!entry) return <Navigate to="/archive" replace />;

  const realm = REALMS[entry.realm];
  const marked = progress.bookmarks.includes(entry.id);
  const related =
    entry.kind === 'character'
      ? entry.relations
      : entry.bearer
        ? [{ id: entry.bearer, kind: 'Bearer' }]
        : [];

  return (
    <article className="entry" data-mood={realm.mood}>
      <div className="entry__banner">
        <Landscape palette={realm.palette} seed={realm.seed} features={{ stars: realm.features.stars }} />
        <Link to={`/realms/${realm.id}`} className="entry__realm">
          {realm.native} · {realm.name}
        </Link>
      </div>

      <div className="entry__wrap">
        <aside className="entry__side">
          {entry.kind === 'artifact' ? (
            <ArtifactStage shape={entry.shape} affinity={entry.affinity} title={entry.name} className="entry__art" />
          ) : (
            <div className="entry__sigil" style={{ background: `linear-gradient(160deg, ${realm.palette.mid}, ${realm.palette.near})` }} aria-hidden="true">
              {entry.name.split(' ').slice(-1)[0].charAt(0)}
            </div>
          )}
        </aside>

        <div className="entry__main">
          <div className="tags">
            <span className="tag tag--original">Original lore</span>
            <span className="tag">{entry.kind === 'artifact' ? 'Artifact' : 'Character'}</span>
            <span className="tag">{SPOILER[entry.spoiler]}</span>
            {entry.kind === 'artifact' && <span className="tag">{AFFINITIES[entry.affinity].name}</span>}
          </div>
          <h1>{entry.name}</h1>
          <p className="entry__title">{entry.title}</p>
          <p className="lede">{entry.blurb}</p>
          {entry.story.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <div className="secret">
            <button className="secret__toggle" onClick={() => setShown((s) => !s)} aria-expanded={shown}>
              {shown ? <EyeOff size={16} /> : <Eye size={16} />} {shown ? 'Hide the secret' : 'Unveil a secret'}
            </button>
            <AnimatePresence initial={false}>
              {shown && (
                <motion.p
                  className="secret__text"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {entry.secret}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="entry__actions">
            <SealButton variant={marked ? 'ghost' : 'primary'} onClick={() => toggleBookmark(entry.id)} aria-pressed={marked}>
              {marked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />} {marked ? 'Bookmarked' : 'Bookmark'}
            </SealButton>
            <Link to="/archive" className="linkish">
              Back to the archive
            </Link>
          </div>

          {related.length > 0 && (
            <section className="related" aria-label="Connections">
              <h2>Connections</h2>
              <ul>
                {related.map((r) => {
                  const other = ARCHIVE_BY_ID[r.id];
                  if (!other) return null;
                  return (
                    <li key={r.id}>
                      <Link to={`/archive/${r.id}`}>
                        <span className="related__kind">{r.kind}</span>
                        <span className="related__name">{other.name}</span>
                        <span className="related__title">{other.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
