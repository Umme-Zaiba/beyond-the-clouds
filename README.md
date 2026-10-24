# Beyond the Clouds

An interactive xianxia world: wander three original realms, pass spiritual trials to gather materials, forge a weapon in the Divine Forge, and keep what you find. Inspired by the *mood* of xianxia dramas; **every realm, character and artifact is original** and is not canon from any drama.

## The goal

> Make a visitor feel they have stepped into a xianxia world within five seconds, give them one ritual worth doing (forging a weapon), and hand them something worth sharing.

- **First five seconds:** a luminous night sky, floating lit palaces, falling petals, a rune-circle sword that tilts toward the cursor, and a cursor that is itself a sword leaving a qi trail.
- **One ritual:** gather materials in the realms, then forge. The result is deterministic, so every one of the 135 weapons is plannable and collectable.
- **One share artifact:** each forged weapon renders to a 1080x1350 share card (Web Share, or PNG download).

## Interaction language

| Element | Behaviour |
| --- | --- |
| Cursor | A sword with a fading qi trail, sparks on movement, ripple on tap. Touch devices get the trail without the sword. |
| Buttons | Jade seals that crack when pressed |
| Page change | A talisman burns across the screen |
| Realm map | Mist parts over a realm on hover, focus or visit |
| Scrolling | Landscape layers drift at different depths |

Everything respects `prefers-reduced-motion`, and the qi trail can be switched off in the footer.

## Stack

React 18, TypeScript, Vite, React Router, Motion, Lucide. No backend: progress lives in `localStorage` (validated on load). Forge rules are pure functions in `src/lib/forge.ts` and are tested with Vitest.

```
src/
  app/            routes
  components/     layout, motion (cursor, mist, landscape, seals), cards
  features/       home, world, forge, archive, collection
  data/           realms, archive entries, forge tables (typed)
  lib/            forge rules, storage, share card, landscape generator
  state/          progress context
```

## Develop

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # typecheck + production build
npm test        # forge rule tests
```

## Content registry

Archive entries carry a `provenance` field (`original` or `drama-canon`). Everything shipped today is `original`; the UI labels it on every card and page so verified drama facts and invented lore never mix.

## Deploy

`render.yaml` defines a static site (build `npm ci && npm run build`, publish `dist`, SPA rewrite to `index.html`).

## Sound and share image

- **Sound** is off by default (toggle in the nav and footer). It is synthesised with the Web Audio API, so there are no audio files: an ambient bed of drones and wind, a soft bell now and then, and chimes, forge strikes and a reveal arpeggio for interactions.
- **OG image:** `npm run og` regenerates `public/og.png` from the same scene components the site uses, so the link preview always matches the hero.
