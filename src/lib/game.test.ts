import { describe, expect, it } from 'vitest';
import { REALM_LIST } from '../data/realms';
import { initialProgress } from './storage';
import {
  dailySpec,
  dailyStreak,
  isRealmUnlocked,
  isLevelUnlocked,
  makeScalePuzzle,
  memorySequence,
  ownedMaterials,
  rankFor,
  starsForMistakes,
  starsForMoves,
} from './game';

const [heights, garden] = REALM_LIST;

describe('progression', () => {
  it('starts with only the first land and first level open', () => {
    const p = initialProgress();
    expect(isRealmUnlocked(p, heights)).toBe(true);
    expect(isRealmUnlocked(p, garden)).toBe(false);
    expect(isLevelUnlocked(p, heights, 0)).toBe(true);
    expect(isLevelUnlocked(p, heights, 1)).toBe(false);
  });

  it('opens levels in order and the next land at three stars', () => {
    const p = { ...initialProgress(), levels: { c1: 1 } };
    expect(isLevelUnlocked(p, heights, 1)).toBe(true);
    expect(isRealmUnlocked(p, garden)).toBe(false);
    const q = { ...p, levels: { c1: 3, c2: 1 } };
    expect(isRealmUnlocked(q, garden)).toBe(true);
  });

  it('grants starter materials at once and the rest by stars', () => {
    expect(ownedMaterials(initialProgress()).sort()).toEqual(['celestial-jade', 'moonstone']);
    const p = { ...initialProgress(), levels: { c1: 3, c2: 2 } };
    expect(ownedMaterials(p)).toContain('stormglass');
  });

  it('ranks by stars', () => {
    expect(rankFor(0).title).toBe('Wanderer');
    expect(rankFor(8).title).toBe('Adept');
    expect(rankFor(27).next).toBeNull();
  });
});

describe('star rules', () => {
  it('rewards clean play', () => {
    expect([0, 1, 2, 3, 4].map((m) => starsForMistakes(m))).toEqual([3, 2, 1, 1, 0]);
    expect(starsForMistakes(3, 2)).toBe(0);
    expect(starsForMoves(2, 2)).toBe(3);
    expect(starsForMoves(3, 2)).toBe(2);
    expect(starsForMoves(7, 2)).toBe(1);
  });
});

describe('puzzles', () => {
  it('builds the same memory path every time, with no immediate repeats', () => {
    const a = memorySequence(42, 8);
    expect(a).toEqual(memorySequence(42, 8));
    for (let i = 1; i < a.length; i++) expect(a[i]).not.toBe(a[i - 1]);
  });

  it('always makes solvable scale puzzles with a correct best count', () => {
    for (let seed = 1; seed < 60; seed++) {
      for (const count of [5, 6, 7]) {
        const p = makeScalePuzzle(seed, count);
        expect(new Set(p.weights).size).toBe(count);
        expect(p.best).toBeGreaterThanOrEqual(1);
        expect(p.best).toBeLessThanOrEqual(4);
      }
    }
  });

  it('picks the same daily challenge for the same date', () => {
    expect(dailySpec('2026-10-24')).toEqual(dailySpec('2026-10-24'));
    expect(dailySpec('2026-10-24').kind).not.toBe(dailySpec('2026-10-25').kind);
  });

  it('counts a daily streak, allowing today to be unplayed', () => {
    const d = { '2026-10-22': 3, '2026-10-23': 2, '2026-10-24': 1 };
    expect(dailyStreak(d, '2026-10-24')).toBe(3);
    expect(dailyStreak({ '2026-10-22': 3, '2026-10-23': 2 }, '2026-10-24')).toBe(2);
    expect(dailyStreak({ '2026-10-20': 3 }, '2026-10-24')).toBe(0);
  });
});
