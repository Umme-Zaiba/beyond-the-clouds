import type { Affinity, AffinityInfo, FormId, Material, MaterialId, Rarity, WeaponForm } from '../types';

export const FORMS: Record<FormId, WeaponForm> = {
  sword: {
    id: 'sword',
    name: 'Skyward Sword',
    blurb: 'Balanced and honest. A blade that answers the hand that raises it.',
    base: { might: 6, grace: 5, resonance: 4, spirit: 4 },
  },
  spear: {
    id: 'spear',
    name: 'Cloudpiercer Spear',
    blurb: 'Reach and ruin. Its head was made to open the sky, and sometimes does.',
    base: { might: 8, grace: 3, resonance: 4, spirit: 3 },
  },
  fan: {
    id: 'fan',
    name: 'Moonveil Fan',
    blurb: 'Quiet, elegant, unreadable. Half of its power is what you think it hides.',
    base: { might: 3, grace: 7, resonance: 5, spirit: 5 },
  },
};

export const AFFINITIES: Record<Affinity, AffinityInfo> = {
  wind: {
    id: 'wind',
    name: 'Wind',
    title: 'Rising Gale',
    stat: 'grace',
    colors: ['#cfe9e1', '#7fc4b4'],
    blurb: 'Light, quick, hard to pin down. Sharpens Grace.',
  },
  ice: {
    id: 'ice',
    name: 'Ice',
    title: 'Winter Veil',
    stat: 'resonance',
    colors: ['#dbe8f5', '#8fb4e0'],
    blurb: 'Still and exact. Deepens Resonance.',
  },
  flame: {
    id: 'flame',
    name: 'Flame',
    title: 'Vermilion Flame',
    stat: 'might',
    colors: ['#ffd9a8', '#e8743b'],
    blurb: 'Bright, hungry, final. Raises Might.',
  },
};

export const MATERIALS: Record<MaterialId, Material> = {
  moonstone: {
    id: 'moonstone',
    name: 'Moonstone',
    epithet: 'Moonlit',
    realm: 'cloudsea',
    affinity: 'ice',
    profile: { might: 1, grace: 3, resonance: 3, spirit: 3 },
    blurb: 'Pale stone that holds a little night inside it, even at noon.',
    starter: true,
    unlockStars: 0,
  },
  stormglass: {
    id: 'stormglass',
    name: 'Stormglass',
    epithet: 'Tempest-Born',
    realm: 'cloudsea',
    affinity: 'wind',
    profile: { might: 2, grace: 4, resonance: 2, spirit: 2 },
    blurb: 'Glass fused where lightning struck the terrace rail, still humming.',
    starter: false,
    unlockStars: 5,
  },
  'celestial-jade': {
    id: 'celestial-jade',
    name: 'Celestial Jade',
    epithet: 'Jade-Wrought',
    realm: 'jade',
    affinity: 'wind',
    profile: { might: 2, grace: 3, resonance: 2, spirit: 4 },
    blurb: 'Jade that grew toward the sky instead of the ground.',
    starter: true,
    unlockStars: 0,
  },
  'frostbloom-resin': {
    id: 'frostbloom-resin',
    name: 'Frostbloom Resin',
    epithet: 'Frostbound',
    realm: 'jade',
    affinity: 'ice',
    profile: { might: 1, grace: 2, resonance: 4, spirit: 3 },
    blurb: 'Amber from the one tree in the hollow that flowers in winter.',
    starter: false,
    unlockStars: 5,
  },
  'phoenix-ember': {
    id: 'phoenix-ember',
    name: 'Phoenix Ember',
    epithet: 'Ember-Crowned',
    realm: 'ember',
    affinity: 'flame',
    profile: { might: 4, grace: 2, resonance: 3, spirit: 3 },
    blurb: 'A coal that remembers being a bird. It will not go out.',
    starter: false,
    unlockStars: 3,
  },
  'cinder-iron': {
    id: 'cinder-iron',
    name: 'Cinder Iron',
    epithet: 'Ashen',
    realm: 'ember',
    affinity: 'flame',
    profile: { might: 5, grace: 1, resonance: 2, spirit: 2 },
    blurb: 'Black iron that has been hammered by more than one lifetime.',
    starter: false,
    unlockStars: 6,
  },
};

export const MATERIAL_LIST: Material[] = Object.values(MATERIALS);
export const STARTER_MATERIALS: MaterialId[] = MATERIAL_LIST.filter((m) => m.starter).map((m) => m.id);

/** Highest first. A weapon takes the best grade whose threshold its total power meets. */
export const RARITIES: Rarity[] = [
  { id: 'heaven', name: 'Heaven Grade', min: 47, color: '#d8b45a', runes: 4 },
  { id: 'earth', name: 'Earth Grade', min: 45, color: '#7fc4b4', runes: 3 },
  { id: 'spirit', name: 'Spirit Grade', min: 43, color: '#8fb4e0', runes: 2 },
  { id: 'mortal', name: 'Mortal Grade', min: 0, color: '#b9b3a6', runes: 1 },
];

export const STAT_LABELS: Record<string, string> = {
  might: 'Might',
  grace: 'Grace',
  resonance: 'Resonance',
  spirit: 'Spirit',
};
