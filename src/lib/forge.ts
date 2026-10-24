import { AFFINITIES, FORMS, MATERIALS, MATERIAL_LIST, RARITIES } from '../data/forge';
import type { Affinity, FormId, Material, MaterialId, Recipe, Stats, WeaponResult } from '../types';

const STAT_KEYS = ['might', 'grace', 'resonance', 'spirit'] as const;

const sumStats = (s: Stats) => STAT_KEYS.reduce((n, k) => n + s[k], 0);

/** Order-insensitive: the same two materials always make the same weapon. */
export function normalizeRecipe(recipe: Recipe): Recipe {
  const [a, b] = [...recipe.materials].sort() as [MaterialId, MaterialId];
  return { ...recipe, materials: [a, b] };
}

export function recipeId(recipe: Recipe): string {
  const r = normalizeRecipe(recipe);
  return `${r.form}:${r.materials.join('+')}:${r.affinity}`;
}

export function validateRecipe(
  partial: { form?: FormId; materials: MaterialId[]; affinity?: Affinity },
  owned: readonly MaterialId[],
): string | null {
  if (!partial.form) return 'Choose a weapon form.';
  if (partial.materials.length < 2) return 'Choose two different materials.';
  if (partial.materials[0] === partial.materials[1]) return 'The two materials must be different.';
  if (partial.materials.some((m) => !owned.includes(m))) return 'You have not gathered that material yet.';
  if (!partial.affinity) return 'Choose an elemental affinity.';
  return null;
}

export function computeWeapon(input: Recipe): WeaponResult {
  const recipe = normalizeRecipe(input);
  const form = FORMS[recipe.form];
  const affinity = AFFINITIES[recipe.affinity];
  const materials = recipe.materials.map((id) => MATERIALS[id]) as [Material, Material];
  const notes: string[] = [];

  const stats: Stats = { ...form.base };
  for (const m of materials) for (const k of STAT_KEYS) stats[k] += m.profile[k];

  stats[affinity.stat] += 2;
  notes.push(`${affinity.name} affinity lends +2 ${affinity.stat}.`);

  for (const m of materials) {
    if (m.affinity === affinity.id) {
      stats[affinity.stat] += 2;
      notes.push(`${m.name} sings in tune with ${affinity.name}: +2 ${affinity.stat}.`);
    }
  }
  if (materials[0].realm === materials[1].realm) {
    stats.spirit += 1;
    notes.push('Both materials share a realm and answer each other: +1 spirit.');
  }

  const total = sumStats(stats);
  const rarity = RARITIES.find((r) => total >= r.min) ?? RARITIES[RARITIES.length - 1];

  // The strongest material names the weapon; ties fall back to id order for stability.
  const primary = [...materials].sort((a, b) => sumStats(b.profile) - sumStats(a.profile) || a.id.localeCompare(b.id))[0];

  return {
    id: recipeId(recipe),
    name: `${primary.epithet} ${form.name}`,
    title: `of the ${affinity.title}`,
    form,
    affinity,
    materials,
    stats,
    total,
    rarity,
    notes,
  };
}

/** Number of distinct weapons that can be forged: forms x material pairs x affinities. */
export const TOTAL_WEAPONS =
  Object.keys(FORMS).length *
  ((MATERIAL_LIST.length * (MATERIAL_LIST.length - 1)) / 2) *
  Object.keys(AFFINITIES).length;

export function isRecipe(value: unknown): value is Recipe {
  if (!value || typeof value !== 'object') return false;
  const r = value as Recipe;
  return (
    r.form in FORMS &&
    r.affinity in AFFINITIES &&
    Array.isArray(r.materials) &&
    r.materials.length === 2 &&
    r.materials[0] in MATERIALS &&
    r.materials[1] in MATERIALS &&
    r.materials[0] !== r.materials[1]
  );
}
