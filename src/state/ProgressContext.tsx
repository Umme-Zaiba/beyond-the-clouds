import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { initialProgress, loadProgress, saveProgress } from '../lib/storage';
import { normalizeRecipe, recipeId } from '../lib/forge';
import type { Progress, Recipe } from '../types';

type Action =
  | { type: 'level'; id: string; stars: number }
  | { type: 'daily'; date: string; stars: number }
  | { type: 'entry'; id: string }
  | { type: 'bookmark'; id: string }
  | { type: 'forge'; recipe: Recipe }
  | { type: 'trail'; on: boolean }
  | { type: 'sound'; on: boolean }
  | { type: 'reset' };

const addOnce = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);

function reducer(state: Progress, action: Action): Progress {
  switch (action.type) {
    case 'level':
      // only ever improve a best result
      return (state.levels[action.id] ?? 0) >= action.stars ? state : { ...state, levels: { ...state.levels, [action.id]: action.stars } };
    case 'daily':
      return (state.daily[action.date] ?? 0) >= action.stars ? state : { ...state, daily: { ...state.daily, [action.date]: action.stars } };
    case 'entry':
      return state.entries.includes(action.id) ? state : { ...state, entries: addOnce(state.entries, action.id) };
    case 'bookmark':
      return {
        ...state,
        bookmarks: state.bookmarks.includes(action.id) ? state.bookmarks.filter((b) => b !== action.id) : [...state.bookmarks, action.id],
      };
    case 'forge': {
      const recipe = normalizeRecipe(action.recipe);
      const id = recipeId(recipe);
      if (state.forged.some((f) => f.id === id)) return state;
      return { ...state, forged: [{ id, recipe, forgedAt: Date.now() }, ...state.forged] };
    }
    case 'trail':
      return { ...state, trail: action.on };
    case 'sound':
      return { ...state, sound: action.on };
    case 'reset':
      return { ...initialProgress(), trail: state.trail, sound: state.sound };
  }
}

interface ProgressApi {
  progress: Progress;
  recordLevel: (id: string, stars: number) => void;
  recordDaily: (date: string, stars: number) => void;
  discoverEntry: (id: string) => void;
  toggleBookmark: (id: string) => void;
  saveWeapon: (recipe: Recipe) => boolean;
  setTrail: (on: boolean) => void;
  setSound: (on: boolean) => void;
  reset: () => void;
}

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, dispatch] = useReducer(reducer, undefined, loadProgress);

  useEffect(() => saveProgress(progress), [progress]);

  // dispatch is stable, so these callbacks are too and are safe to use as effect dependencies
  const recordLevel = useCallback((id: string, stars: number) => dispatch({ type: 'level', id, stars }), []);
  const recordDaily = useCallback((date: string, stars: number) => dispatch({ type: 'daily', date, stars }), []);
  const discoverEntry = useCallback((id: string) => dispatch({ type: 'entry', id }), []);
  const toggleBookmark = useCallback((id: string) => dispatch({ type: 'bookmark', id }), []);
  const setTrail = useCallback((on: boolean) => dispatch({ type: 'trail', on }), []);
  const setSound = useCallback((on: boolean) => dispatch({ type: 'sound', on }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const api = useMemo<ProgressApi>(
    () => ({
      progress,
      recordLevel,
      recordDaily,
      discoverEntry,
      toggleBookmark,
      saveWeapon: (recipe) => {
        const isNew = !progress.forged.some((f) => f.id === recipeId(recipe));
        dispatch({ type: 'forge', recipe });
        return isNew;
      },
      setTrail,
      setSound,
      reset,
    }),
    [progress, recordLevel, recordDaily, discoverEntry, toggleBookmark, setTrail, setSound, reset],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
