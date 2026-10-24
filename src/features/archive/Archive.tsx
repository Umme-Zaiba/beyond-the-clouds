import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { EntryCard } from '../../components/cards/Cards';
import { ARCHIVE } from '../../data/archive';
import { REALM_LIST } from '../../data/realms';
import { useProgress } from '../../state/ProgressContext';
import type { RealmId } from '../../types';

type Kind = 'all' | 'character' | 'artifact';

export function Archive() {
  const { progress } = useProgress();
  const [kind, setKind] = useState<Kind>('all');
  const [realm, setRealm] = useState<RealmId | 'all'>('all');
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ARCHIVE.filter(
      (e) =>
        (kind === 'all' || e.kind === kind) &&
        (realm === 'all' || e.realm === realm) &&
        (!needle || `${e.name} ${e.title} ${e.blurb}`.toLowerCase().includes(needle)),
    );
  }, [kind, realm, q]);

  const reset = () => {
    setKind('all');
    setRealm('all');
    setQ('');
  };

  return (
    <div>
      <header className="page-head">
        <p className="eyebrow">Discover</p>
        <h1>The Immortal Archive</h1>
        <p className="lede">
          {progress.entries.length} of {ARCHIVE.length} entries opened. Everything in this archive is <strong>original lore</strong> written for this
          site, never taken from a drama.
        </p>
      </header>

      <div className="filters" role="search">
        <label className="search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search the archive</span>
          <input type="search" placeholder="Search names, titles, secrets…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="chips" role="group" aria-label="Type">
          {(['all', 'character', 'artifact'] as Kind[]).map((k) => (
            <button key={k} className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>
              {k === 'all' ? 'All' : k === 'character' ? 'Characters' : 'Artifacts'}
            </button>
          ))}
        </div>
        <div className="chips" role="group" aria-label="Realm">
          <button className="chip" aria-pressed={realm === 'all'} onClick={() => setRealm('all')}>
            Every realm
          </button>
          {REALM_LIST.map((r) => (
            <button key={r.id} className="chip" aria-pressed={realm === r.id} onClick={() => setRealm(r.id)}>
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid grid--3" aria-live="polite">
          {results.map((e) => (
            <EntryCard key={e.id} entry={e} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p>Nothing in the archive matches that.</p>
          <button className="linkish" onClick={reset}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
