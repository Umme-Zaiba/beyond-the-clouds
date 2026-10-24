# Beyond the Clouds

An interactive xianxia world. Scroll up through a sea of clouds on a flying sword, then pass memory, breath, scale and lore trials across three realms, win materials, and forge a weapon at the Divine Forge. **Every realm, character and artifact is original** and is not canon from any drama.

## The experience

1. **Scroll first.** A pinned stage carries a flying sword through seven scenes: the sea of clouds and a whale of white mist, the floating isle of the red maple, the crescent moon gate, the flower arch, the golden court and the trial gate. Each scene is a hand-built SVG, and the text of each chapter is fair game later.
2. **Then the trials.** Nine trials in three realms: *Seal Memory*, *Steady Breath*, a *Spirit-Stone Scale* puzzle and the *Lore Trial*, a quiz on what you just read. Up to three stars each. Stars open the next realm and award forge materials.
3. **Then the forge.** Pick a form, two materials and an element; the same choices always forge the same weapon (135 in all), with a shareable 1080x1350 card.
4. **Come back daily.** One seeded puzzle a day, the same for everyone, with a copyable result and a streak.

## The sky follows your clock

Morning, afternoon, evening and night are real themes: bright and airy in the morning and afternoon, a rose-and-plum dusk in the evening, deep indigo at night. The site reads the visitor's local time by default and can be pinned to any sky with the button in the nav. Every realm keeps its own colours at every hour.

## Interaction language

| Element | Behaviour |
| --- | --- |
| Cursor | A sword with a fading qi trail, sparks on movement, ripple on tap. Touch devices get the trail without the sword. |
| Buttons | Seals that crack when pressed |
| Page change | A talisman burns across the screen |
| Seal circle | Eight trigrams, a ring of characters and a lotus, turning slowly |
| Scroll | A sword flies a path through the scenes, leaving a trail; layers drift at different depths |

Everything respects `prefers-reduced-motion`, and the qi trail can be switched off in the footer. Sound is off by default (synthesised with Web Audio, no audio files).

## Stack

React 18, TypeScript, Vite, React Router, Motion, Lucide. No backend: progress lives in `localStorage` (validated on load). The forge rules, star rules, puzzle generators and daily challenge are pure functions with Vitest tests.

```
src/
  app/            routes
  components/     layout, motion (cursor, mist, landscape, seals, petals), cards
  features/       home (ascent + scenes), world, play, daily, forge, archive, collection
  data/           realms and trials, story chapters, archive entries, forge tables
  lib/            forge and game rules, time of day, storage, share card, audio
  state/          progress and time-of-day contexts
  styles/         global, night, time (tokens per hour), game, ascent
```

## Develop

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # typecheck + production build
npm test        # forge, star and puzzle rules
npm run og      # regenerate public/og.png
```

## Content registry

Archive entries carry a `provenance` field (`original` or `drama-canon`). Everything shipped is `original`, and the UI labels it on every card.

## Other directions

A calmer, non-fantasy version (lands, instruments and an almanac, with nature-only sound) is kept on the local `islamic-journey` branch for a possible separate site.

## Deploy

`render.yaml` defines a static site (build `npm ci && npm run build`, publish `dist`, SPA rewrite to `index.html`).
