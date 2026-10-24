import { MATERIAL_LIST } from '../data/forge';
import { REALM_LIST, REALM_ORDER, MAX_STARS } from '../data/realms';
import { mulberry32 } from './landscape';
import type { MaterialId, Progress, Realm } from '../types';

export { MAX_STARS };

export const levelStars = (p: Progress, id: string): number => p.levels[id] ?? 0;

export const realmStars = (p: Progress, realm: Realm): number => realm.levels.reduce((n, l) => n + levelStars(p, l.id), 0);

export const totalStars = (p: Progress): number => REALM_LIST.reduce((n, realm) => n + realmStars(p, realm), 0);

export function isRealmUnlocked(p: Progress, realm: Realm): boolean {
  const i = REALM_ORDER.indexOf(realm.id);
  if (i <= 0) return true;
  const prev = REALM_LIST.find((l) => l.id === REALM_ORDER[i - 1])!;
  return realmStars(p, prev) >= realm.entryStars;
}

/** A level opens once the one before it has been cleared with at least one star. */
export function isLevelUnlocked(p: Progress, realm: Realm, index: number): boolean {
  if (!isRealmUnlocked(p, realm)) return false;
  return index === 0 || levelStars(p, realm.levels[index - 1].id) >= 1;
}

/** Materials are earned by stars in their own realm, so the workshop rewards play. */
export function ownedMaterials(p: Progress): MaterialId[] {
  return MATERIAL_LIST.filter((m) => {
    if (m.starter) return true;
    const realm = REALM_LIST.find((l) => l.id === m.realm)!;
    return realmStars(p, realm) >= m.unlockStars;
  }).map((m) => m.id);
}

export const RANKS: Array<{ min: number; title: string }> = [
  { min: 0, title: 'Wanderer' },
  { min: 3, title: 'Disciple' },
  { min: 8, title: 'Adept' },
  { min: 14, title: 'Elder' },
  { min: 21, title: 'Sword Saint' },
];

export function rankFor(stars: number) {
  const idx = RANKS.reduce((best, r, i) => (stars >= r.min ? i : best), 0);
  const next = RANKS[idx + 1];
  return { title: RANKS[idx].title, next: next ? { title: next.title, need: next.min - stars } : null };
}

/* ── dates and the daily challenge ── */

export function todayKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

const dayNumber = (key: string) => Math.floor(Date.parse(`${key}T00:00:00Z`) / 86400000);

const keyFromDay = (n: number) => new Date(n * 86400000).toISOString().slice(0, 10);

/** Consecutive days with a daily result, ending today (or yesterday, if today is not played yet). */
export function dailyStreak(daily: Record<string, number>, today: string): number {
  let cursor = dayNumber(today);
  if (!daily[keyFromDay(cursor)]) cursor -= 1;
  let n = 0;
  while (daily[keyFromDay(cursor)]) {
    n++;
    cursor--;
  }
  return n;
}

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

export type DailySpec = { kind: 'memory'; seed: number; length: number } | { kind: 'scale'; seed: number; weights: number };

export function dailySpec(key: string): DailySpec {
  const seed = hash(`btc-${key}`);
  return dayNumber(key) % 2 === 0 ? { kind: 'memory', seed, length: 6 } : { kind: 'scale', seed, weights: 6 };
}

/* ── puzzle generators ── */

export const STAR_COUNT = 8;

/** The first few outputs of a seeded generator are weakly mixed, so discard them. */
function seeded(seed: number): () => number {
  const rand = mulberry32(seed);
  for (let i = 0; i < 12; i++) rand();
  return rand;
}

/** A path through the eight stars, never repeating a star twice in a row. */
export function memorySequence(seed: number, length: number): number[] {
  const rand = seeded(seed);
  const out: number[] = [];
  while (out.length < length) {
    const next = Math.floor(rand() * STAR_COUNT);
    if (next !== out[out.length - 1]) out.push(next);
  }
  return out;
}

export interface ScalePuzzle {
  weights: number[];
  target: number;
  /** fewest weights that balance the scale */
  best: number;
}

const POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25];

export function makeScalePuzzle(seed: number, count: number): ScalePuzzle {
  const rand = seeded(seed);
  const pool = [...POOL];
  const weights: number[] = [];
  while (weights.length < count) weights.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  weights.sort((a, b) => a - b);

  const want = Math.min(4, Math.max(2, Math.round(count / 2)));
  const picks: number[] = [];
  const idx = weights.map((_, i) => i);
  while (picks.length < want) picks.push(idx.splice(Math.floor(rand() * idx.length), 1)[0]);
  const target = picks.reduce((n, i) => n + weights[i], 0);

  let best = want;
  for (let mask = 1; mask < 1 << count; mask++) {
    let sum = 0;
    let size = 0;
    for (let i = 0; i < count; i++) {
      if (mask & (1 << i)) {
        sum += weights[i];
        size++;
      }
    }
    if (sum === target && size < best) best = size;
  }
  return { weights, target, best };
}

/** Star rules shared by the games, kept here so they can be tested. */
export const starsForMistakes = (mistakes: number, max = 3): number => (mistakes > max ? 0 : mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1);
export const starsForMoves = (moves: number, best: number): number => (moves <= best ? 3 : moves <= best + 1 ? 2 : 1);
