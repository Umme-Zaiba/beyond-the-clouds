import { motion } from 'motion/react';
import { blossomPath } from '../../components/motion/Blossom';
import { useReducedMotion } from '../../lib/hooks';

/** Earned stars, drawn as plum blossoms that open one after another. */
export function StarsRow({ stars, max = 3, size = 44, animate = true }: { stars: number; max?: number; size?: number; animate?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <span className="stars-row" role="img" aria-label={`${stars} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const on = i < stars;
        return (
          <motion.svg
            key={i}
            viewBox="-14 -14 28 28"
            width={size}
            height={size}
            className={`star-icon${on ? ' is-on' : ''}`}
            initial={animate && !reduced && on ? { scale: 0, rotate: -45, opacity: 0 } : false}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.25 + i * 0.28, type: 'spring', stiffness: 260, damping: 14 }}
          >
            <path d={blossomPath(12)} />
            <circle r="2.2" />
          </motion.svg>
        );
      })}
    </span>
  );
}
