export type Affinity = 'wind' | 'ice' | 'flame';
export type FormId = 'sword' | 'spear' | 'fan';
export type StatKey = 'might' | 'grace' | 'resonance' | 'spirit';
export type Stats = Record<StatKey, number>;
export type RealmId = 'cloudsea' | 'jade' | 'ember';
export type MaterialId =
  | 'moonstone'
  | 'stormglass'
  | 'celestial-jade'
  | 'frostbloom-resin'
  | 'phoenix-ember'
  | 'cinder-iron';
export type RarityId = 'mortal' | 'spirit' | 'earth' | 'heaven';

/** Every entry in the archive is original unless a verified source says otherwise. */
export type Provenance = 'original' | 'drama-canon';

export interface Palette {
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  far: string;
  mid: string;
  near: string;
  /** main light source: sun, moon, window light */
  glow: string;
  /** secondary light: crystals, blossoms, orbs */
  glow2: string;
  mist: string;
}

export interface SceneFeatures {
  stars?: boolean;
  petals?: boolean;
  vines?: boolean;
  embers?: boolean;
  islands?: boolean;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type GameKind = 'memory' | 'steady' | 'scale' | 'quiz';

export interface QuizQuestion {
  q: string;
  options: string[];
  /** index of the correct option */
  answer: number;
  /** one line shown after answering */
  why: string;
}

export interface LevelDef {
  id: string;
  title: string;
  kind: GameKind;
  /** one line shown before the level starts */
  brief: string;
  length?: number;
  hits?: number;
  arc?: number;
  speed?: number;
  weights?: number;
  seed?: number;
  quiz?: QuizQuestion[];
}

export interface Realm {
  id: RealmId;
  name: string;
  native: string;
  tagline: string;
  mood: 'light' | 'dark';
  lore: string[];
  /** the night palette; other times of day are derived from it */
  palette: Palette;
  /** the realm's own colour, mixed into the scene at every time of day */
  accent: string;
  features: SceneFeatures;
  seed: number;
  /** position on the world map, 0-100 */
  map: { x: number; y: number };
  levels: LevelDef[];
  /** stars needed in the previous realm to enter */
  entryStars: number;
  materials: MaterialId[];
  characters: string[];
  artifacts: string[];
}

export interface Material {
  id: MaterialId;
  name: string;
  epithet: string;
  realm: RealmId;
  affinity: Affinity;
  profile: Stats;
  blurb: string;
  starter: boolean;
  /** stars earned in this realm needed to receive it */
  unlockStars: number;
}

export interface WeaponForm {
  id: FormId;
  name: string;
  blurb: string;
  base: Stats;
}

export interface AffinityInfo {
  id: Affinity;
  name: string;
  title: string;
  stat: StatKey;
  colors: [string, string];
  blurb: string;
}

export interface Rarity {
  id: RarityId;
  name: string;
  min: number;
  color: string;
  runes: number;
}

export interface Recipe {
  form: FormId;
  materials: [MaterialId, MaterialId];
  affinity: Affinity;
}

export interface WeaponResult {
  id: string;
  name: string;
  title: string;
  form: WeaponForm;
  affinity: AffinityInfo;
  materials: [Material, Material];
  stats: Stats;
  total: number;
  rarity: Rarity;
  notes: string[];
}

export interface ForgedRecord {
  id: string;
  recipe: Recipe;
  forgedAt: number;
}

export interface Relation {
  id: string;
  kind: string;
}

export interface Character {
  kind: 'character';
  id: string;
  name: string;
  title: string;
  realm: RealmId;
  provenance: Provenance;
  spoiler: 0 | 1 | 2;
  blurb: string;
  story: string[];
  secret: string;
  relations: Relation[];
  artifact?: string;
}

export interface Artifact {
  kind: 'artifact';
  id: string;
  name: string;
  title: string;
  realm: RealmId;
  provenance: Provenance;
  spoiler: 0 | 1 | 2;
  affinity: Affinity;
  shape: 'sword' | 'spear' | 'fan' | 'lantern' | 'seal';
  blurb: string;
  story: string[];
  secret: string;
  bearer?: string;
}

export type ArchiveEntry = Character | Artifact;

export interface Progress {
  /** best stars per level id, 0-3 */
  levels: Record<string, number>;
  /** best stars per daily date (YYYY-MM-DD) */
  daily: Record<string, number>;
  entries: string[];
  bookmarks: string[];
  forged: ForgedRecord[];
  trail: boolean;
  sound: boolean;
}
