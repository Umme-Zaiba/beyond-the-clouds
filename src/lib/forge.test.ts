import { describe, expect, it } from 'vitest';
import { MATERIAL_LIST } from '../data/forge';
import { computeWeapon, recipeId, TOTAL_WEAPONS, validateRecipe } from './forge';
import type { Affinity, FormId, Recipe } from '../types';

const forms: FormId[] = ['sword', 'spear', 'fan'];
const affinities: Affinity[] = ['wind', 'ice', 'flame'];

function allRecipes(): Recipe[] {
  const out: Recipe[] = [];
  for (const form of forms)
    for (const affinity of affinities)
      for (let i = 0; i < MATERIAL_LIST.length; i++)
        for (let j = i + 1; j < MATERIAL_LIST.length; j++)
          out.push({ form, affinity, materials: [MATERIAL_LIST[i].id, MATERIAL_LIST[j].id] });
  return out;
}

describe('forge rules', () => {
  it('is deterministic and order-insensitive', () => {
    const a = computeWeapon({ form: 'sword', affinity: 'ice', materials: ['moonstone', 'celestial-jade'] });
    const b = computeWeapon({ form: 'sword', affinity: 'ice', materials: ['celestial-jade', 'moonstone'] });
    expect(a).toEqual(b);
    expect(a.id).toBe(recipeId({ form: 'sword', affinity: 'ice', materials: ['celestial-jade', 'moonstone'] }));
  });

  it('produces a distinct id for every recipe', () => {
    const ids = new Set(allRecipes().map(recipeId));
    expect(ids.size).toBe(TOTAL_WEAPONS);
  });

  it('can reach every rarity, with Heaven grade staying rare', () => {
    const counts: Record<string, number> = {};
    for (const r of allRecipes()) {
      const grade = computeWeapon(r).rarity.id;
      counts[grade] = (counts[grade] ?? 0) + 1;
    }
    expect(Object.keys(counts).sort()).toEqual(['earth', 'heaven', 'mortal', 'spirit']);
    expect(counts.heaven).toBeLessThan(TOTAL_WEAPONS * 0.25);
  });

  it('rewards matching affinity', () => {
    const matched = computeWeapon({ form: 'spear', affinity: 'flame', materials: ['phoenix-ember', 'cinder-iron'] });
    const off = computeWeapon({ form: 'spear', affinity: 'ice', materials: ['phoenix-ember', 'cinder-iron'] });
    expect(matched.total).toBeGreaterThan(off.total);
  });

  it('validates incomplete or locked selections', () => {
    const owned = ['moonstone', 'celestial-jade'] as const;
    expect(validateRecipe({ materials: [] }, owned)).toMatch(/form/);
    expect(validateRecipe({ form: 'fan', materials: ['moonstone'] }, owned)).toMatch(/two/);
    expect(validateRecipe({ form: 'fan', materials: ['moonstone', 'moonstone'] }, owned)).toMatch(/different/);
    expect(validateRecipe({ form: 'fan', materials: ['moonstone', 'cinder-iron'] }, owned)).toMatch(/gathered/);
    expect(validateRecipe({ form: 'fan', materials: ['moonstone', 'celestial-jade'] }, owned)).toMatch(/affinity/);
    expect(
      validateRecipe({ form: 'fan', affinity: 'wind', materials: ['moonstone', 'celestial-jade'] }, owned),
    ).toBeNull();
  });
});
