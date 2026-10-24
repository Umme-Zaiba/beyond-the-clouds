import { useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotion } from '../../lib/hooks';
import { useProgress } from '../../state/ProgressContext';

interface TrailPoint {
  x: number;
  y: number;
  t: number;
}
interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  size: number;
}
interface Ring {
  x: number;
  y: number;
  born: number;
}

const TRAIL_MS = 620;
const REST_ANGLE = Math.PI / 4;

/**
 * The world's cursor: a sword whose qi leaves a fading trail, sparks on movement and a
 * ripple on every tap. On touch screens there is no sword, but dragging and tapping still glow.
 */
export function QiCursor() {
  const { progress } = useProgress();
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const enabled = progress.trail && !reduced;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const swordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const useSword = enabled && fine;
    root.classList.toggle('qi-on', useSword);
    return () => root.classList.remove('qi-on');
  }, [enabled, fine]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sword = swordRef.current;
    const ctx = canvas?.getContext('2d');
    if (!enabled || !canvas || !ctx || !sword) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const trail: TrailPoint[] = [];
    const sparks: Spark[] = [];
    const rings: Ring[] = [];
    let mx = -100;
    let my = -100;
    let sx = mx;
    let sy = my;
    let angle = REST_ANGLE;
    let seen = false;
    let colorA = '#B69A61';
    let colorB = '#91B8AC';
    let colorTick = 0;
    let raf = 0;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colorA = cs.getPropertyValue('--trail-a').trim() || colorA;
      colorB = cs.getPropertyValue('--trail-b').trim() || colorB;
    };
    readColors();

    const burst = (x: number, y: number, n: number, speed: number, now: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = (0.3 + Math.random()) * speed;
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, born: now, life: 500 + Math.random() * 500, size: 1 + Math.random() * 2 });
      }
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dx = e.clientX - mx;
      const dy = e.clientY - my;
      mx = e.clientX;
      my = e.clientY;
      if (!seen) {
        seen = true;
        sx = mx;
        sy = my;
      }
      trail.push({ x: mx, y: my, t: now });
      if (trail.length > 80) trail.shift();
      const speed = Math.hypot(dx, dy);
      if (speed > 4) {
        angle = Math.atan2(dy, dx) + Math.PI;
        if (Math.random() < Math.min(speed / 40, 0.9)) burst(mx, my, 1, 0.8, now);
      }
      const hot = (e.target as Element | null)?.closest?.('a,button,label,[role="button"],input,select');
      sword.dataset.hot = hot ? '1' : '0';
    };
    const onDown = (e: PointerEvent) => {
      const now = performance.now();
      rings.push({ x: e.clientX, y: e.clientY, born: now });
      burst(e.clientX, e.clientY, 14, 2.4, now);
      if (!seen) {
        mx = sx = e.clientX;
        my = sy = e.clientY;
      }
    };
    const onLeave = () => {
      sword.style.opacity = '0';
    };
    const onEnter = () => {
      sword.style.opacity = '1';
    };

    const frame = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      if (++colorTick % 30 === 0) readColors();

      while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1];
          const p1 = trail[i];
          const age = (now - p1.t) / TRAIL_MS;
          const taper = i / trail.length;
          const life = Math.max(0, 1 - age);
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = taper > 0.55 ? colorA : colorB;
          if (pass === 0) {
            ctx.globalAlpha = life * 0.22;
            ctx.lineWidth = 3 + taper * 16;
          } else {
            ctx.globalAlpha = life * 0.9;
            ctx.lineWidth = 0.6 + taper * 3.6;
          }
          ctx.stroke();
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        const age = (now - s.born) / s.life;
        if (age >= 1) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.015;
        s.vx *= 0.985;
        ctx.globalAlpha = (1 - age) * 0.9;
        ctx.fillStyle = Math.random() < 0.5 ? colorA : colorB;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (1 - age * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        const age = (now - r.born) / 700;
        if (age >= 1) {
          rings.splice(i, 1);
          continue;
        }
        const e = 1 - Math.pow(1 - age, 3);
        ctx.globalAlpha = (1 - age) * 0.8;
        ctx.strokeStyle = colorA;
        ctx.lineWidth = 2 - age;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 6 + e * 46, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = (1 - age) * 0.5;
        ctx.strokeStyle = colorB;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 4 + e * 28, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // The sword eases toward the pointer and relaxes back to its resting angle when still.
      sx += (mx - sx) * 0.38;
      sy += (my - sy) * 0.38;
      const idle = trail.length === 0;
      let target = idle ? REST_ANGLE : angle;
      let diff = target - angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      angle += diff * (idle ? 0.04 : 0.25);
      sword.style.transform = `translate3d(${sx}px, ${sy}px, 0) rotate(${angle}rad)`;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('resize', resize);
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.documentElement.addEventListener('pointerenter', onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', resize);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.removeEventListener('pointerenter', onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <canvas ref={canvasRef} className="qi-canvas" aria-hidden="true" />
      <div ref={swordRef} className="qi-sword" data-hot="0" aria-hidden="true" style={{ display: fine ? 'block' : 'none' }}>
        <svg width="46" height="16" viewBox="0 -8 46 16" overflow="visible">
          <path className="qi-sword__blade" d="M0 0 L7 -2.6 L28 -2.6 L28 2.6 L7 2.6 Z" />
          <path className="qi-sword__edge" d="M2 0 L28 0" />
          <rect className="qi-sword__guard" x="28" y="-6.5" width="3" height="13" rx="1.5" />
          <rect className="qi-sword__grip" x="31" y="-1.6" width="10" height="3.2" rx="1.2" />
          <circle className="qi-sword__guard" cx="43" cy="0" r="2.6" />
        </svg>
      </div>
    </>
  );
}
