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
  skyBottom: string;
  far: string;
  mid: string;
  near: string;
  glow: string;
  mist: string;
}

export interface Realm {
  id: RealmId;
  name: string;
  native: string;
  tagline: string;
  mood: 'light' | 'dark';
  lore: string[];
  palette: Palette;
  seed: number;
  /** position on the world map, 0-100 */
  map: { x: number; y: number };
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
  /** how the gathering trial is described */
  site: string;
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
  realms: string[];
  entries: string[];
  bookmarks: string[];
  materials: MaterialId[];
  forged: ForgedRecord[];
  trail: boolean;
}
