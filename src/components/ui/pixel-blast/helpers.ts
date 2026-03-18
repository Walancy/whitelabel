import * as THREE from 'three';
import { Effect } from 'postprocessing';

// ─── Touch Texture ───────────────────────────────────────────────────────────

interface TrailPoint {
  x: number; y: number; age: number;
  force: number; vx: number; vy: number;
}

export interface TouchTexture {
  texture: THREE.Texture;
  addTouch: (norm: { x: number; y: number }) => void;
  update: () => void;
  radiusScale: number;
}

export const createTouchTexture = (): TouchTexture => {
  const SIZE = 64;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const trail: TrailPoint[] = [];
  let last: { x: number; y: number } | null = null;
  let radius = 0.1 * SIZE;
  const MAX_AGE = 64;
  const SPEED = 1 / MAX_AGE;

  const clear = () => { ctx.fillStyle = 'black'; ctx.fillRect(0, 0, SIZE, SIZE); };
  const easeOut = (t: number) => Math.sin((t * Math.PI) / 2);
  const easeOutQ = (t: number) => -t * (t - 2);

  const drawPoint = (p: TrailPoint) => {
    const px = p.x * SIZE; const py = (1 - p.y) * SIZE;
    let i = p.age < MAX_AGE * 0.3 ? easeOut(p.age / (MAX_AGE * 0.3)) : easeOutQ(1 - (p.age - MAX_AGE * 0.3) / (MAX_AGE * 0.7)) || 0;
    i *= p.force;
    const col = `${((p.vx + 1) / 2) * 255},${((p.vy + 1) / 2) * 255},${i * 255}`;
    const off = SIZE * 5;
    ctx.shadowOffsetX = off; ctx.shadowOffsetY = off; ctx.shadowBlur = radius;
    ctx.shadowColor = `rgba(${col},${0.22 * i})`;
    ctx.beginPath(); ctx.fillStyle = 'rgba(255,0,0,1)';
    ctx.arc(px - off, py - off, radius, 0, Math.PI * 2); ctx.fill();
  };

  const addTouch = (norm: { x: number; y: number }) => {
    let force = 0; let vx = 0; let vy = 0;
    if (last) {
      const dx = norm.x - last.x; const dy = norm.y - last.y;
      if (dx === 0 && dy === 0) return;
      const d = Math.sqrt(dx * dx + dy * dy);
      vx = dx / d; vy = dy / d; force = Math.min((dx * dx + dy * dy) * 10000, 1);
    }
    last = { x: norm.x, y: norm.y };
    trail.push({ x: norm.x, y: norm.y, age: 0, force, vx, vy });
  };

  const update = () => {
    clear();
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      const f = p.force * SPEED * (1 - p.age / MAX_AGE);
      p.x += p.vx * f; p.y += p.vy * f; p.age++;
      if (p.age > MAX_AGE) { trail.splice(i, 1); continue; }
      drawPoint(p);
    }
    texture.needsUpdate = true;
  };

  return {
    texture,
    addTouch,
    update,
    get radiusScale() { return radius / (0.1 * SIZE); },
    set radiusScale(v: number) { radius = 0.1 * SIZE * v; },
  };
};

// ─── Liquid Effect ───────────────────────────────────────────────────────────

interface LiquidOpts { strength?: number; freq?: number; }

export const createLiquidEffect = (texture: THREE.Texture, opts?: LiquidOpts): Effect => {
  const frag = `
    uniform sampler2D uTexture; uniform float uStrength; uniform float uTime; uniform float uFreq;
    void mainUv(inout vec2 uv){
      vec4 tex=texture2D(uTexture,uv);
      float vx=tex.r*2.-1.; float vy=tex.g*2.-1.; float intensity=tex.b;
      float wave=0.5+0.5*sin(uTime*uFreq+intensity*6.2831853);
      uv+=vec2(vx,vy)*uStrength*intensity*wave;
    }`;
  return new Effect('LiquidEffect', frag, {
    uniforms: new Map<string, THREE.Uniform<unknown>>([
      ['uTexture', new THREE.Uniform(texture)],
      ['uStrength', new THREE.Uniform(opts?.strength ?? 0.025)],
      ['uTime', new THREE.Uniform(0)],
      ['uFreq', new THREE.Uniform(opts?.freq ?? 4.5)],
    ]) as never,
  });
};
