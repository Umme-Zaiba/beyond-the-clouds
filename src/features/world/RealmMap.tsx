import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { REALM_LIST, MAX_STARS } from '../../data/realms';
import { isRealmUnlocked, rankFor, realmStars, totalStars } from '../../lib/game';
import { useProgress } from '../../state/ProgressContext';
import { Mist } from '../../components/motion/Mist';
import { StarsRow } from '../play/StarsRow';

/** The trial map. Locked realms stay under cloud until you have earned enough stars to enter. */
export function RealmMap() {
  const { progress } = useProgress();
  const total = totalStars(progress);
  const rank = rankFor(total);

  return (
    <div className="map-page">
      <header className="page-head">
        <p className="eyebrow">The trials</p>
        <h1>The Three Realms</h1>
        <p className="lede">
          Three realms, three trials each: memory, steadiness and lore. Earn stars to open the next realm and to receive materials for the forge.
          You are a <strong>{rank.title}</strong> with {total} of {MAX_STARS} stars
          {rank.next ? `. ${rank.next.need} more to become a ${rank.next.title}.` : '.'}
        </p>
      </header>

      <div className="map" role="group" aria-label="Map of the realms">
        <Mist className="map__mist" count={18} color="200,210,255" />
        <svg className="map__paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M24 30 C 36 36, 42 54, 52 62" />
          <path d="M52 62 C 62 52, 70 38, 78 28" />
        </svg>
        {REALM_LIST.map((r, i) => {
          const open = isRealmUnlocked(progress, r);
          const stars = realmStars(progress, r);
          return (
            <Link
              key={r.id}
              to={`/realms/${r.id}`}
              className={`map__pin${open ? '' : ' is-locked'}`}
              style={{ left: `${r.map.x}%`, top: `${r.map.y}%` }}
              aria-label={`${r.name}${open ? `, ${stars} of 9 stars` : ', locked'}`}
            >
              <span className="map__cloud map__cloud--l" aria-hidden="true" />
              <span className="map__cloud map__cloud--r" aria-hidden="true" />
              <span className="map__peak" aria-hidden="true" style={{ background: `linear-gradient(160deg, ${r.palette.skyBottom}, ${r.palette.mid})` }}>
                {open ? r.native.charAt(0) : <Lock size={20} />}
              </span>
              <span className="map__label">
                <strong>
                  {i + 1}. {r.name}
                </strong>
                <small>{open ? <StarsRow stars={Math.min(3, Math.floor(stars / 3))} size={13} animate={false} /> : 'Locked'}</small>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
