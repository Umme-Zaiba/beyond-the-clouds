import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { currentTime, isDark, TIMES } from '../lib/time';
import type { TimeOfDay } from '../types';

export type SkyMode = 'auto' | TimeOfDay;

const KEY = 'btc:sky:v1';

interface TimeApi {
  /** the sky being shown right now */
  time: TimeOfDay;
  mode: SkyMode;
  setMode: (m: SkyMode) => void;
  /** auto -> morning -> afternoon -> evening -> night -> auto */
  cycle: () => void;
}

const Ctx = createContext<TimeApi | null>(null);

function readMode(): SkyMode {
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === 'auto' || (v && (TIMES as string[]).includes(v))) return v as SkyMode;
  } catch {
    /* storage unavailable */
  }
  return 'auto';
}

/**
 * Follows the visitor's local clock by default, so the world is lit for the hour they are
 * actually in, and can be pinned to any time of day by hand.
 */
export function TimeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<SkyMode>(readMode);
  const [clock, setClock] = useState<TimeOfDay>(() => currentTime());

  useEffect(() => {
    const tick = () => setClock(currentTime());
    const id = window.setInterval(tick, 60_000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);

  const time = mode === 'auto' ? clock : mode;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.time = time;
    root.dataset.tone = isDark(time) ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', { morning: '#eef6f4', afternoon: '#fbf7ec', evening: '#2b2046', night: '#070a1c' }[time]);
  }, [time]);

  const setMode = useCallback((m: SkyMode) => {
    setModeState(m);
    try {
      window.localStorage.setItem(KEY, m);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const cycle = useCallback(() => {
    const order: SkyMode[] = ['auto', ...TIMES];
    setMode(order[(order.indexOf(mode) + 1) % order.length]);
  }, [mode, setMode]);

  const api = useMemo(() => ({ time, mode, setMode, cycle }), [time, mode, setMode, cycle]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useTime(): TimeApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTime must be used inside TimeProvider');
  return ctx;
}
