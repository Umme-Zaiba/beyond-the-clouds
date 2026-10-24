import { motion } from 'motion/react';
import { ArtifactStage } from '../../components/cards/ArtifactStage';
import { STAT_LABELS } from '../../data/forge';
import { useReducedMotion } from '../../lib/hooks';
import type { StatKey, WeaponResult } from '../../types';

const KEYS: StatKey[] = ['might', 'grace', 'resonance', 'spirit'];
const MAX = 18;

export function StatBars({ weapon, animate = true }: { weapon: WeaponResult; animate?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <dl className="stats">
      {KEYS.map((k, i) => (
        <div key={k} className="stats__row">
          <dt>{STAT_LABELS[k]}</dt>
          <dd>
            <span className="stats__track">
              <motion.span
                className="stats__fill"
                style={{ background: `linear-gradient(90deg, ${weapon.affinity.colors[0]}, ${weapon.affinity.colors[1]})` }}
                initial={animate && !reduced ? { width: 0 } : false}
                animate={{ width: `${Math.min(100, (weapon.stats[k] / MAX) * 100)}%` }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            <span className="stats__num">{weapon.stats[k]}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

interface Props {
  weapon: WeaponResult;
  compact?: boolean;
  children?: React.ReactNode;
}

export function WeaponCard({ weapon, compact = false, children }: Props) {
  return (
    <article className={`weapon-card${compact ? ' weapon-card--compact' : ''}`} data-rarity={weapon.rarity.id}>
      <div className="weapon-card__art">
        <ArtifactStage shape={weapon.form.id} affinity={weapon.affinity.id} runes={weapon.rarity.runes} title={`${weapon.name} ${weapon.title}`} />
      </div>
      <div className="weapon-card__info">
        <p className="weapon-card__rarity" style={{ color: weapon.rarity.color }}>
          {weapon.rarity.name} · {weapon.affinity.name}
        </p>
        <h3 className="weapon-card__name">{weapon.name}</h3>
        <p className="weapon-card__title">{weapon.title}</p>
        <p className="weapon-card__recipe">
          {weapon.form.name} · {weapon.materials[0].name} + {weapon.materials[1].name}
        </p>
        <StatBarsWrap weapon={weapon} compact={compact} />
        {children}
      </div>
    </article>
  );
}

function StatBarsWrap({ weapon, compact }: { weapon: WeaponResult; compact: boolean }) {
  return <StatBars weapon={weapon} animate={!compact} />;
}
