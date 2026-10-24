import { RuneRing } from '../motion/RuneRing';
import { WeaponArt, type Shape } from './WeaponArt';
import { AFFINITIES } from '../../data/forge';
import type { Affinity } from '../../types';

interface Props {
  shape: Shape;
  affinity: Affinity;
  glow?: number;
  runes?: number;
  title?: string;
  className?: string;
}

/** A weapon floating over a slowly turning rune circle, tinted by its element. */
export function ArtifactStage({ shape, affinity, glow = 1, runes = 0, title, className = '' }: Props) {
  const [c1, c2] = AFFINITIES[affinity].colors;
  return (
    <div className={`artifact-stage ${className}`} style={{ ['--ring-opacity' as string]: 0.25 + glow * 0.75 }}>
      <RuneRing color={c2} accent={c1} className="artifact-stage__ring" />
      <WeaponArt shape={shape} affinity={affinity} glow={glow} runes={runes} title={title} className="artifact-stage__weapon" />
    </div>
  );
}
