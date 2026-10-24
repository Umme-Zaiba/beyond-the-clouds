import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { initialProgress, loadProgress, saveProgress } from '../lib/storage';
import { recipeId, normalizeRecipe } from '../lib/forge';
import type { MaterialId, Progress, Recipe } from '../types';

type Action =
  | { type: 'realm'; id: string }
  | { type: 'entry'; id: string }
  | { type: 'bookmark'; id: string }
  | { type: 'material'; id: MaterialId }
  | { type: 'forge'; recipe: Recipe }
  | { type: 'trail'; on: boolean }
  | { type: 'reset' };

const addOnce = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);

function reducer(state: Progress, action: Action): Progress {
  switch (action.type) {
    case 'realm':
      return state.realms.includes(action.id) ? state : { ...state, realms: addOnce(state.realms, action.id) };
    case 'entry':
      return state.entries.includes(action.id) ? state : { ...state, entries: addOnce(state.entries, action.id) };
    case 'bookmark':
      return {
        ...state,
        bookmarks: state.bookmarks.includes(action.id)
          ? state.bookmarks.filter((b) => b !== action.id)
          : [...state.bookmarks, action.id],
      };
    case 'material':
      return state.materials.includes(action.id) ? state : { ...state, materials: [...state.materials, action.id] };
    case 'forge': {
      const recipe = normalizeRecipe(action.recipe);
      const id = recipeId(recipe);
      if (state.forged.some((f) => f.id === id)) return state;
      return { ...state, forged: [{ id, recipe, forgedAt: Date.now() }, ...state.forged] };
    }
    case 'trail':
      return { ...state, trail: action.on };
    case 'reset':
      return { ...initialProgress(), trail: state.trail };
  }
}

interface ProgressApi {
  progress: Progress;
  discoverRealm: (id: string) => void;
  discoverEntry: (id: string) => void;
  toggleBookmark: (id: string) => void;
  gatherMaterial: (id: MaterialId) => void;
  saveWeapon: (recipe: Recipe) => boolean;
  setTrail: (on: boolean) => void;
  reset: () => void;
}

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, dispatch] = useReducer(reducer, undefined, loadProgress);

  useEffect(() => saveProgress(progress), [progress]);

  // dispatch is stable, so these callbacks are too and are safe to use as effect dependencies
  const discoverRealm = useCallback((id: string) => dispatch({ type: 'realm', id }), []);
  const discoverEntry = useCallback((id: string) => dispatch({ type: 'entry', id }), []);
  const toggleBookmark = useCallback((id: string) => dispatch({ type: 'bookmark', id }), []);
  const gatherMaterial = useCallback((id: MaterialId) => dispatch({ type: 'material', id }), []);
  const setTrail = useCallback((on: boolean) => dispatch({ type: 'trail', on }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const api = useMemo<ProgressApi>(
    () => ({
      progress,
      discoverRealm,
      discoverEntry,
      toggleBookmark,
      gatherMaterial,
      saveWeapon: (recipe) => {
        const isNew = !progress.forged.some((f) => f.id === recipeId(recipe));
        dispatch({ type: 'forge', recipe });
        return isNew;
      },
      setTrail,
      reset,
    }),
    [progress, discoverRealm, discoverEntry, toggleBookmark, gatherMaterial, setTrail, reset],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
