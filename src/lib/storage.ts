import type { ForgedRecord, Progress } from '../types';
import { isRecipe, normalizeRecipe, recipeId } from './forge';

const KEY = 'btc:progress:v3';

export const initialProgress = (): Progress => ({
  levels: {},
  daily: {},
  entries: [],
  bookmarks: [],
  forged: [],
  trail: true,
  sound: false,
});

const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

function starMap(v: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (v && typeof v === 'object') {
    for (const [k, n] of Object.entries(v as Record<string, unknown>)) {
      const stars = Math.round(Number(n));
      if (stars >= 1 && stars <= 3) out[k] = stars;
    }
  }
  return out;
}

/** Browser storage can be empty, blocked or hand-edited, so every field is re-validated. */
export function loadProgress(): Progress {
  const base = initialProgress();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return base;
    const data = JSON.parse(raw) as Partial<Record<keyof Progress, unknown>>;

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
      levels: starMap(data.levels),
      daily: starMap(data.daily),
      entries: strings(data.entries),
      bookmarks: strings(data.bookmarks),
      forged: forged.filter((f, i) => forged.findIndex((g) => g.id === f.id) === i),
      trail: typeof data.trail === 'boolean' ? data.trail : true,
      sound: typeof data.sound === 'boolean' ? data.sound : false,
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
