import type { LevelDef, Realm, RealmId } from '../types';


export const REALMS: Record<RealmId, Realm> = {
  cloudsea: {
    id: 'cloudsea',
    name: 'Cloudsea Terrace',
    native: '云海台',
    tagline: 'Where the sky keeps its oldest promises.',
    mood: 'light',
    seed: 11,
    accent: '#ff9ec0',
    entryStars: 0,
    map: { x: 24, y: 30 },
    palette: {
      skyTop: '#2c2f78',
      skyMid: '#a77bc0',
      skyBottom: '#ffd9ab',
      far: '#8a8fcc',
      mid: '#646cb0',
      near: '#3b4182',
      glow: '#fff2c9',
      glow2: '#ffb0d0',
      mist: '#fff1e4',
    },
    features: { petals: true, islands: true },
    lore: [
      'Above the last cloud line there is a floor, and on that floor a terrace the size of a small country. Nobody built it. The oldest maps simply draw it in ink and leave the margin blank.',
      'Travellers climb for days to reach it and are met by a tea pavilion, a ledger, and a rule: nobody draws steel on the Terrace. Challenges are settled by who can still hold a cup steady when the lightning walks the rail.',
      'The Terrace is where destinies get misfiled. A name written in the ledger can be quietly rewritten overnight, which is why the keepers there are the most careful, and the most curious, people in the realms.',
    ],
    levels: [
      { id: 'c1', title: 'Seals of the Terrace', kind: 'memory', length: 4, brief: 'Watch the seal stones glow in order, then touch them in the same order.' },
      {
        id: 'c2',
        title: 'The Lore Trial',
        kind: 'quiz',
        brief: 'Three questions about the road you just travelled. Read well, answer well.',
        quiz: [
          { q: 'What swims through the sea of clouds?', options: ['A whale of white mist', 'A dragon of lightning', 'A crane of jade'], answer: 0, why: 'It has been swimming toward the sunrise for a thousand years.' },
          { q: 'What grows on the lonely floating isle?', options: ['A pine that never sheds', 'A maple that is red in every season', 'A peach tree that fruits once a century'], answer: 1, why: 'Its keeper sweeps the red leaves every evening and never finishes.' },
          { q: 'What must you set down to pass beneath the crescent moon?', options: ['Your sword', 'Your name', 'Every grudge you carry'], answer: 2, why: 'The moon weighs them all, and is honest about the total.' },
        ],
      },
      { id: 'c3', title: 'Steady Breath', kind: 'steady', hits: 1, arc: 64, speed: 2.4, brief: 'Press once, as the marker crosses the bright arc.' },
    ],
    materials: ['moonstone', 'stormglass'],
    characters: ['lian-qiaoyue', 'yun-zhe', 'fei-lan'],
    artifacts: ['dawnsunder', 'mistveil-fan'],
  },
  jade: {
    id: 'jade',
    name: 'Whispering Jade Hollow',
    native: '翠玉谷',
    tagline: 'A valley that answers when you speak softly.',
    mood: 'light',
    seed: 29,
    accent: '#7fe8d0',
    entryStars: 3,
    map: { x: 52, y: 62 },
    palette: {
      skyTop: '#070b2b',
      skyMid: '#1a2878',
      skyBottom: '#5a4ac6',
      far: '#27389a',
      mid: '#1b2574',
      near: '#0c1046',
      glow: '#9aeeff',
      glow2: '#d98bff',
      mist: '#8fa6ff',
    },
    features: { stars: true, vines: true, islands: true },
    lore: [
      'The Hollow is a bowl of green stone where every wall is jade, thinly veiled in moss. Speak in it and the walls hum a half-beat later, in a voice that is nearly yours.',
      'Healers settled here because the jade remembers. Hum a remedy to a seam of stone and it will hum it back, years on, to the next patient who needs it. Whole pharmacies are kept as songs.',
      'Outsiders mistake the Hollow for the gentlest realm. The valley keeps one rule for visitors: say nothing you would not want repeated. It has never once forgotten a promise, or a threat.',
    ],
    levels: [
      { id: 'j1', title: 'Echoes in the Hollow', kind: 'memory', length: 5, brief: 'The valley walls answer in light. Repeat the order they show you.' },
      { id: 'j2', title: 'Weighing Spirit Stones', kind: 'scale', weights: 6, seed: 23, brief: 'Balance the scale with as few stones as you can.' },
      {
        id: 'j3',
        title: 'The Second Lore Trial',
        kind: 'quiz',
        brief: 'Questions about the arch, the court and the hollow.',
        quiz: [
          { q: 'How do the sects settle disputes beneath the flower arch?', options: ['With a duel of swords', 'Over tea, where the first to put down their cup loses', 'By a game of stones'], answer: 1, why: 'Nobody has ever lost loudly.' },
          { q: 'Who lights the lanterns of the golden court?', options: ['Apprentices who are not allowed to hurry', 'Spirits of the wind', 'The court’s silent musicians'], answer: 0, why: 'The oldest lantern has been lit by sixty different hands.' },
          { q: 'What happens when you speak in Whispering Jade Hollow?', options: ['The walls fall silent', 'The walls hum your words back a half-beat later', 'A bell answers you'], answer: 1, why: 'The jade remembers, and the healers keep cures as songs.' },
        ],
      },
    ],
    materials: ['celestial-jade', 'frostbloom-resin'],
    characters: ['bai-ruoshui', 'fei-lan'],
    artifacts: ['lantern-of-return'],
  },
  ember: {
    id: 'ember',
    name: 'Vermilion Ember Crater',
    native: '赤焰渊',
    tagline: 'The forge the world was hammered on.',
    mood: 'dark',
    seed: 47,
    accent: '#ff8a4a',
    entryStars: 3,
    map: { x: 78, y: 28 },
    palette: {
      skyTop: '#0b0912',
      skyMid: '#3b1526',
      skyBottom: '#cf562c',
      far: '#552028',
      mid: '#2e1218',
      near: '#120709',
      glow: '#ffb765',
      glow2: '#ff5a3c',
      mist: '#ff9a6b',
    },
    features: { embers: true, stars: true },
    lore: [
      'A crater rimmed with black terraces, each one an anvil older than any dynasty. At the bottom a vent breathes out embers that do not fall back down. They rise, and keep rising, and nobody has seen where they go.',
      'The Ember Court rules here by one law: you are what you can make. Rank is measured in ringing iron. A fine blade can buy a family a century of standing, and a poor one can end it by next season.',
      'It is also the realm where weapons are said to wake. Not all of them. Only the ones forged by someone who meant every blow, and the Crater has always had strong opinions about who that is.',
    ],
    levels: [
      { id: 'e1', title: 'Vents of the Crater', kind: 'memory', length: 6, brief: 'Embers rise from the vents in a pattern. Remember it.' },
      { id: 'e2', title: 'Hammer and Breath', kind: 'steady', hits: 3, arc: 54, speed: 2.8, brief: 'Three clean strikes. Time each one to the bright arc.' },
      {
        id: 'e3',
        title: 'The Final Lore Trial',
        kind: 'quiz',
        brief: 'The last questions, about the crater and the gate.',
        quiz: [
          { q: 'What is the law of the Ember Court?', options: ['Rank comes from birth', 'You are what you can make', 'The strongest decides'], answer: 1, why: 'Rank there is measured in ringing iron.' },
          { q: 'What stands planted in front of the Trial Gate?', options: ['A banner', 'A single sword', 'A bell'], answer: 1, why: 'It is not a weapon. It is a question.' },
          { q: 'What is that question?', options: ['Who is strongest?', 'Who sent you?', 'Who are you when nobody is watching?'], answer: 2, why: 'The trials begin there.' },
        ],
      },
    ],
    materials: ['phoenix-ember', 'cinder-iron'],
    characters: ['gu-heng', 'ye-xuanlin'],
    artifacts: ['ashfall-spear', 'emberheart-seal'],
  },
};

export const REALM_LIST: Realm[] = Object.values(REALMS);

export const REALM_ORDER: RealmId[] = ['cloudsea', 'jade', 'ember'];

export const ALL_LEVELS: Array<{ realm: Realm; level: LevelDef; index: number }> = REALM_LIST.flatMap((realm) =>
  realm.levels.map((level, index) => ({ realm, level, index })),
);
export const LEVEL_BY_ID = Object.fromEntries(ALL_LEVELS.map((l) => [l.level.id, l])) as Record<string, { realm: Realm; level: LevelDef; index: number }>;
export const MAX_STARS = ALL_LEVELS.length * 3;
