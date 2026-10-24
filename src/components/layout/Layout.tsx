import { useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, Moon, Sparkles, Sun, Sunrise, Sunset, Volume2, VolumeX, X } from 'lucide-react';
import { setSoundEnabled } from '../../lib/audio';
import { useState } from 'react';
import { QiCursor } from '../motion/QiCursor';
import { useProgress } from '../../state/ProgressContext';
import { useTime } from '../../state/TimeContext';
import { TIME_LABEL } from '../../lib/time';
import { totalStars, MAX_STARS } from '../../lib/game';
import { useReducedMotion } from '../../lib/hooks';
import { TOTAL_WEAPONS } from '../../lib/forge';
import { REALMS } from '../../data/realms';

const NAV = [
  { to: '/realms', label: 'Trials', glyph: '界' },
  { to: '/daily', label: 'Daily', glyph: '日' },
  { to: '/forge', label: 'Forge', glyph: '锻' },
  { to: '/archive', label: 'Archive', glyph: '宝' },
  { to: '/collection', label: 'Collection', glyph: '云' },
];

/** Every scene is a night scene now; `data-theme` stays on <html> so a realm can still tint its page. */
function themeFor(pathname: string): string {
  const m = pathname.match(/^\/realms\/(\w+)/);
  return m && m[1] in REALMS ? m[1] : 'night';
}

export function Layout() {
  const { pathname } = useLocation();
  const { progress, setTrail, setSound } = useProgress();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const { time, mode, cycle } = useTime();
  const SkyIcon = { morning: Sunrise, afternoon: Sun, evening: Sunset, night: Moon }[time];

  useEffect(() => {
    document.documentElement.dataset.theme = themeFor(pathname);
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => setSoundEnabled(progress.sound), [progress.sound]);

  const forged = progress.forged.length;
  const stars = totalStars(progress);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="nav">
        <Link to="/" className="nav__brand" aria-label="Beyond the Clouds, home">
          <span className="nav__mark" aria-hidden="true">
            云
          </span>
          <span className="nav__name">Beyond the Clouds</span>
        </Link>

        <nav className={`nav__links${open ? ' is-open' : ''}`} aria-label="Primary">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
              <span className="nav__glyph" aria-hidden="true">
                {n.glyph}
              </span>
              {n.label}
              {n.to === '/collection' && stars > 0 && <span className="nav__count">{stars}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="nav__tools">
          <button
            className="nav__sky"
            onClick={cycle}
            aria-label={`Sky: ${mode === 'auto' ? `automatic, now ${TIME_LABEL[time].toLowerCase()}` : TIME_LABEL[time].toLowerCase()}. Press to change.`}
            title={mode === 'auto' ? `Automatic (${TIME_LABEL[time]})` : TIME_LABEL[time]}
          >
            <SkyIcon size={17} />
            <span className="nav__sky-label">{mode === 'auto' ? 'Auto' : TIME_LABEL[time]}</span>
          </button>
          <button
            className="nav__sound"
            aria-pressed={progress.sound}
            aria-label={progress.sound ? 'Turn sound off' : 'Turn sound on'}
            title={progress.sound ? 'Sound on' : 'Sound off'}
            onClick={() => setSound(!progress.sound)}
          >
            {progress.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button className="nav__toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          key={pathname}
          className="page"
          initial={reduced ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: reduced ? 0.12 : 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {!reduced && <TalismanVeil routeKey={pathname} />}

      <footer className="footer">
        <div className="footer__inner">
          <div>
            <p className="footer__title">Beyond the Clouds</p>
            <p className="footer__note">
              An original world inspired by the <em>mood</em> of xianxia dramas. Every realm, character and artifact here is invented for this
              site and is not canon from any drama.
            </p>
          </div>
          <div className="footer__tools">
            <div className="footer__chips">
              <button className="chip" onClick={() => setTrail(!progress.trail)} aria-pressed={progress.trail}>
                <Sparkles size={14} /> Qi trail {progress.trail ? 'on' : 'off'}
              </button>
              <button className="chip" onClick={() => setSound(!progress.sound)} aria-pressed={progress.sound}>
                {progress.sound ? <Volume2 size={14} /> : <VolumeX size={14} />} Sound {progress.sound ? 'on' : 'off'}
              </button>
            </div>
            <p className="footer__stat">
              {stars} of {MAX_STARS} stars · {forged} of {TOTAL_WEAPONS} weapons forged
            </p>
          </div>
        </div>
      </footer>

      <QiCursor />
    </>
  );
}

/** A talisman paper that burns across the screen between pages. */
function TalismanVeil({ routeKey }: { routeKey: string }) {
  return (
    <motion.div
      key={routeKey}
      className="veil"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.85, times: [0, 0.3, 0.55, 1], ease: 'easeInOut' }}
      style={{ pointerEvents: 'none' }}
    >
      <div className="veil__paper">
        <span className="veil__glyph">云</span>
        <span className="veil__burn" />
      </div>
    </motion.div>
  );
}
