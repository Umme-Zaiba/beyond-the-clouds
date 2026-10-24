import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../lib/hooks';

interface Props {
  /** rgb triplet, e.g. "255,255,255" */
  color?: string;
  count?: number;
  className?: string;
}

interface Puff {
  x: number;
  y: number;
  r: number;
  vx: number;
  a: number;
}

/** Slow drifting mist and motes. Static when reduced motion is requested. */
export function Mist({ color = '255,255,255', count = 26, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let puffs: Puff[] = [];
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      puffs = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: h * (0.35 + Math.random() * 0.65),
        r: 60 + Math.random() * 140,
        vx: (Math.random() * 0.25 + 0.05) * (Math.random() < 0.5 ? -1 : 1),
        a: 0.04 + Math.random() * 0.07,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of puffs) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(${color},${p.a})`);
        g.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
    };

    const tick = () => {
      for (const p of puffs) {
        p.x += p.vx;
        if (p.x < -p.r) p.x = w + p.r;
        if (p.x > w + p.r) p.x = -p.r;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    resize();
    draw();
    if (!reduced) raf = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [color, count, reduced]);

  return <canvas ref={ref} className={`mist ${className}`} aria-hidden="true" />;
}
