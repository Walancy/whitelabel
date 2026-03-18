import { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(InertiaPlugin);

interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
}

type Dot = { cx: number; cy: number; xOffset: number; yOffset: number; _inertiaApplied: boolean };

const hexToRgb = (hex: string) => {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : { r:0,g:0,b:0 };
};
const throttle = (fn: (...a: unknown[]) => void, ms: number) => {
  let last = 0;
  return (...args: unknown[]) => { const now = performance.now(); if (now-last >= ms) { last=now; fn(...args); } };
};

const DotGrid = ({
  dotSize = 16, gap = 32, baseColor = '#5227FF', activeColor = '#5227FF',
  proximity = 150, speedTrigger = 100, shockRadius = 250, shockStrength = 5,
  maxSpeed = 5000, resistance = 750, returnDuration = 1.5, className = ''
}: DotGridProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, speed: 0, lastTime: 0, lastX: 0, lastY: 0 });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null;
    const p = new window.Path2D(); p.arc(0, 0, dotSize / 2, 0, Math.PI * 2); return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current, canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;
    const startX = (width - (cell * cols - gap)) / 2 + dotSize / 2;
    const startY = (height - (cell * rows - gap)) / 2 + dotSize / 2;
    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++)
        dots.push({ cx: startX + x * cell, cy: startY + y * cell, xOffset: 0, yOffset: 0, _inertiaApplied: false });
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;
    let rafId: number;
    const proxSq = proximity * proximity;
    const draw = () => {
      const canvas = canvasRef.current; if (!canvas) return;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: px, y: py } = pointerRef.current;
      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset, oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px, dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;
        let style = baseColor;
        if (dsq <= proxSq) {
          const t = 1 - Math.sqrt(dsq) / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          style = `rgb(${r},${g},${b})`;
        }
        ctx.save(); ctx.translate(ox, oy); ctx.fillStyle = style; ctx.fill(circlePath); ctx.restore();
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

  useEffect(() => {
    buildGrid();
    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(buildGrid);
      if (wrapperRef.current) ro.observe(wrapperRef.current);
    } else window.addEventListener('resize', buildGrid);
    return () => { ro ? ro.disconnect() : window.removeEventListener('resize', buildGrid); };
  }, [buildGrid]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now(), pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      let vx = (e.clientX - pr.lastX) / dt * 1000, vy = (e.clientY - pr.lastY) / dt * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) { vx *= maxSpeed/speed; vy *= maxSpeed/speed; speed = maxSpeed; }
      pr.lastTime = now; pr.lastX = e.clientX; pr.lastY = e.clientY; pr.vx = vx; pr.vy = vy; pr.speed = speed;
      const rect = canvasRef.current!.getBoundingClientRect();
      pr.x = e.clientX - rect.left; pr.y = e.clientY - rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          gsap.to(dot, { inertia: { xOffset: dot.cx-pr.x+vx*0.005, yOffset: dot.cy-pr.y+vy*0.005, resistance },
            onComplete: () => { gsap.to(dot, { xOffset:0, yOffset:0, duration:returnDuration, ease:'elastic.out(1,0.75)' }); dot._inertiaApplied=false; }
          });
        }
      }
    };
    const onClick = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const cx = e.clientX-rect.left, cy = e.clientY-rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx-cx, dot.cy-cy);
        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true; gsap.killTweensOf(dot);
          const falloff = Math.max(0, 1-dist/shockRadius);
          gsap.to(dot, { inertia: { xOffset:(dot.cx-cx)*shockStrength*falloff, yOffset:(dot.cy-cy)*shockStrength*falloff, resistance },
            onComplete: () => { gsap.to(dot, { xOffset:0, yOffset:0, duration:returnDuration, ease:'elastic.out(1,0.75)' }); dot._inertiaApplied=false; }
          });
        }
      }
    };
    const throttledMove = throttle(onMove as Parameters<typeof throttle>[0], 50);
    window.addEventListener('mousemove', throttledMove as EventListener, { passive: true });
    window.addEventListener('click', onClick);
    return () => { window.removeEventListener('mousemove', throttledMove as EventListener); window.removeEventListener('click', onClick); };
  }, [maxSpeed, speedTrigger, proximity, resistance, returnDuration, shockRadius, shockStrength]);

  return (
    <div ref={wrapperRef} className={className} style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <canvas ref={canvasRef} style={{ display:'block' }} />
    </div>
  );
};
export default DotGrid;
