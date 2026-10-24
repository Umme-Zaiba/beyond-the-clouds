import { MATERIALS, STARTER_MATERIALS } from '../data/forge';
import type { ForgedRecord, MaterialId, Progress } from '../types';
import { isRecipe, normalizeRecipe, recipeId } from './forge';

const KEY = 'btc:progress:v1';

export const initialProgress = (): Progress => ({
  realms: [],
  entries: [],
  bookmarks: [],
  materials: [...STARTER_MATERIALS],
  forged: [],
  trail: true,
});

const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

/** Browser storage can be empty, blocked or hand-edited, so every field is re-validated. */
export function loadProgress(): Progress {
  const base = initialProgress();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return base;
    const data = JSON.parse(raw) as Partial<Record<keyof Progress, unknown>>;

    const materials = strings(data.materials).filter((m): m is MaterialId => m in MATERIALS);
    const forged: ForgedRecord[] = [];
    if (Array.isArray(data.forged)) {
      for (const f of data.forged as ForgedRecord[]) {
        if (f && isRecipe(f.recipe)) {
          const recipe = normalizeRecipe(f.recipe);
          forged.push({ id: recipeId(recipe), recipe, forgedAt: Number(f.forgedAt) || Date.now() });
        }
      }
    }
    return {
      realms: strings(data.realms),
      entries: strings(data.entries),
      bookmarks: strings(data.bookmarks),
      materials: Array.from(new Set([...STARTER_MATERIALS, ...materials])),
      forged: forged.filter((f, i) => forged.findIndex((g) => g.id === f.id) === i),
      trail: typeof data.trail === 'boolean' ? data.trail : true,
    };
  } catch {
    return base;
  }
}

export function saveProgress(p: Progress): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable: the session still works, it just will not persist */
  }
}
