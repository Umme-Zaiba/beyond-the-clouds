import type { Palette, Realm, SceneFeatures, TimeOfDay } from '../types';

export const TIMES: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];

export const TIME_LABEL: Record<TimeOfDay, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
};

/** Local clock to a sky: dawn light, bright day, sunset, and the long night. */
export function timeForHour(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 16) return 'afternoon';
  if (hour >= 16 && hour < 20) return 'evening';
  return 'night';
}

export const currentTime = (d = new Date()): TimeOfDay => timeForHour(d.getHours());

/** The base sky for each time of day. Morning and afternoon are light themes; evening and night are dark. */
export const BASE_PALETTES: Record<TimeOfDay, Palette> = {
  morning: {
    skyTop: '#8fc7e4',
    skyMid: '#d3ebee',
    skyBottom: '#fff1d8',
    far: '#b5d4dc',
    mid: '#8dbcc4',
    near: '#6aa0a8',
    glow: '#fff6cc',
    glow2: '#ffc9d8',
    mist: '#ffffff',
  },
  afternoon: {
    skyTop: '#62aee6',
    skyMid: '#b4dbf3',
    skyBottom: '#fff7e0',
    far: '#9bc7e6',
    mid: '#76aed7',
    near: '#4d8dbd',
    glow: '#fffbdc',
    glow2: '#ffdf9a',
    mist: '#ffffff',
  },
  evening: {
    skyTop: '#43347f',
    skyMid: '#d3719b',
    skyBottom: '#ffc597',
    far: '#8a68a8',
    mid: '#68488e',
    near: '#3b2b66',
    glow: '#ffe1ae',
    glow2: '#ff9dbf',
    mist: '#ffd5da',
  },
  night: {
    skyTop: '#070a28',
    skyMid: '#2c2a84',
    skyBottom: '#7a5fc9',
    far: '#3a469c',
    mid: '#272e86',
    near: '#12164d',
    glow: '#e4f0ff',
    glow2: '#9fe6ff',
    mist: '#8fa6ff',
  },
};

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
const parse = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
};

/** Linear mix of two hex colours; t = 0 gives `a`, t = 1 gives `b`. */
export function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const to = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${to(ar + (br - ar) * t)}${to(ag + (bg - ag) * t)}${to(ab + (bb - ab) * t)}`;
}

/** A realm keeps its own colour at every hour: the base sky of the time, tinted toward the realm's accent. */
export function realmPalette(realm: Realm, time: TimeOfDay): Palette {
  if (time === 'night') return realm.palette;
  const base = BASE_PALETTES[time];
  const k = 0.3;
  return {
    ...base,
    skyMid: mixHex(base.skyMid, realm.accent, 0.18),
    far: mixHex(base.far, realm.accent, k),
    mid: mixHex(base.mid, realm.accent, k + 0.05),
    near: mixHex(base.near, realm.accent, k + 0.1),
    glow2: mixHex(base.glow2, realm.accent, 0.4),
  };
}

/** Stars only come out once the sky has darkened. */
export function sceneFeatures(features: SceneFeatures, time: TimeOfDay): SceneFeatures {
  return { ...features, stars: time === 'night' || (time === 'evening' && !!features.stars) };
}

export const isDark = (time: TimeOfDay) => time === 'evening' || time === 'night';
