import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../lib/hooks';

interface Props {
  colors?: string[];
  count?: number;
  className?: string;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  rot: number;
  vr: number;
  vy: number;
  vx: number;
  phase: number;
  color: string;
}

/** Drifting blossom petals. A single static frame when reduced motion is requested. */
export function Petals({ colors = ['#ffc2dc', '#ffe0ee', '#ffd6a5'], count = 34, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let petals: Petal[] = [];
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const make = (spread: boolean): Petal => ({
      x: Math.random() * w,
      y: spread ? Math.random() * h : -20,
      size: 5 + Math.random() * 9,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.03,
      vy: 0.35 + Math.random() * 0.7,
      vx: 0.15 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      petals = Array.from({ length: count }, () => make(true));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.phase)));
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size * 0.9, -p.size * 0.2, 0, p.size);
        ctx.quadraticCurveTo(-p.size * 0.9, -p.size * 0.2, 0, -p.size);
        ctx.fill();
        ctx.restore();
      }
    };

    const tick = () => {
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.phase += 0.03;
        p.x += p.vx + Math.sin(p.phase) * 0.5;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h + 24 || p.x > w + 24) petals[i] = { ...make(false), x: Math.random() * w * 0.9 - 40 };
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
  }, [colors, count, reduced]);

  return <canvas ref={ref} className={`petals ${className}`} aria-hidden="true" />;
}
