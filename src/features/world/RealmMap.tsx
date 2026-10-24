import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { REALM_LIST } from '../../data/realms';
import { useProgress } from '../../state/ProgressContext';
import { Mist } from '../../components/motion/Mist';

/** The world map. Mist sits over each undiscovered realm and parts when you reach for it. */
export function RealmMap() {
  const { progress } = useProgress();
  const found = progress.realms.length;

  return (
    <div className="map-page">
      <header className="page-head">
        <p className="eyebrow">Explore</p>
        <h1>The Known Realms</h1>
        <p className="lede">
          Choose a place to enter. {found === 0 ? 'Nothing here has been discovered yet.' : `${found} of ${REALM_LIST.length} discovered.`} Hover or tap a peak and the mist will part.
        </p>
      </header>

      <div className="map" role="group" aria-label="World map">
        <Mist className="map__mist" count={18} />
        <svg className="map__paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M24 30 C 36 36, 42 54, 52 62" />
          <path d="M52 62 C 62 52, 70 38, 78 28" />
          <path d="M24 30 C 44 14, 62 14, 78 28" />
        </svg>
        {REALM_LIST.map((r) => {
          const visited = progress.realms.includes(r.id);
          return (
            <Link
              key={r.id}
              to={`/realms/${r.id}`}
              className={`map__pin${visited ? ' is-visited' : ''}`}
              style={{ left: `${r.map.x}%`, top: `${r.map.y}%` }}
              data-mood={r.mood}
            >
              <span className="map__cloud map__cloud--l" aria-hidden="true" />
              <span className="map__cloud map__cloud--r" aria-hidden="true" />
              <span className="map__peak" aria-hidden="true" style={{ background: `linear-gradient(160deg, ${r.palette.mid}, ${r.palette.near})` }}>
                {r.native.charAt(0)}
              </span>
              <span className="map__label">
                <strong>{r.name}</strong>
                <small>{visited ? <><Check size={12} /> Visited</> : 'Undiscovered'}</small>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
