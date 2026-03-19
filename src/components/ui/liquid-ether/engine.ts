import * as THREE from 'three';
import {
  face_vert, line_vert, mouse_vert,
  advection_frag, color_frag, divergence_frag,
  externalForce_frag, poisson_frag, pressure_frag, viscous_frag,
} from './shaders';

// ─── types ───────────────────────────────────────────────────────────────────
export interface EngineOptions {
  mouseForce: number; cursorSize: number; isViscous: boolean; viscous: number;
  iterationsViscous: number; iterationsPoisson: number; dt: number; BFECC: boolean;
  resolution: number; isBounce: boolean; autoDemo: boolean; autoSpeed: number;
  autoIntensity: number; takeoverDuration: number; autoResumeDelay: number;
  autoRampDuration: number;
}
export interface Engine {
  start(): void; stop(): void; resize(): void; dispose(): void;
  updateOptions(o: Partial<EngineOptions>): void;
  updatePalette(colors: string[]): void;
  updateFluidBg(hex: string): void;
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function hexToVec4(hex: string): [number, number, number, number] {
  if (!hex || hex === 'transparent') return [0, 0, 0, 0];
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255, 1];
}
function makePaletteTexture(stops: string[]) {
  const arr = stops.length ? stops : ['#fff', '#fff'];
  const data = new Uint8Array(arr.length * 4);
  arr.forEach((s, i) => {
    const c = new THREE.Color(s);
    data[i * 4] = Math.round(c.r * 255); data[i * 4 + 1] = Math.round(c.g * 255);
    data[i * 4 + 2] = Math.round(c.b * 255); data[i * 4 + 3] = 255;
  });
  const t = new THREE.DataTexture(data, arr.length, 1, THREE.RGBAFormat);
  t.magFilter = t.minFilter = THREE.LinearFilter;
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.generateMipmaps = false; t.needsUpdate = true; return t;
}

// ─── ShaderPass ───────────────────────────────────────────────────────────────
type FBO = THREE.WebGLRenderTarget;
type Uniforms = Record<string, { value: unknown }>;

class ShaderPass {
  scene = new THREE.Scene(); camera = new THREE.Camera();
  material!: THREE.RawShaderMaterial; geometry!: THREE.PlaneGeometry;
  uniforms!: Uniforms; output?: FBO;
  constructor(vert: string, frag: string, uniforms: Uniforms, output?: FBO) {
    this.uniforms = uniforms; this.output = output;
    this.material = new THREE.RawShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms });
    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.scene.add(new THREE.Mesh(this.geometry, this.material));
  }
  run(renderer: THREE.WebGLRenderer, output?: FBO) {
    renderer.setRenderTarget(output ?? this.output ?? null);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(null);
  }
}

// ─── simulation passes ────────────────────────────────────────────────────────
function makeFBO(w: number, h: number): FBO {
  const isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
  return new THREE.WebGLRenderTarget(w, h, {
    type: isIOS ? THREE.HalfFloatType : THREE.FloatType,
    depthBuffer: false, stencilBuffer: false,
    minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping,
  });
}

class Simulation {
  fbos = {} as Record<string, FBO>;
  cellScale = new THREE.Vector2(); fboSize = new THREE.Vector2();
  boundarySpace = new THREE.Vector2();
  advection!: ShaderPass; force!: THREE.Mesh; divergence!: ShaderPass;
  poisson!: ShaderPass; pressurePass!: ShaderPass; viscous!: ShaderPass;
  forceScene = new THREE.Scene(); forceCamera = new THREE.Camera();
  constructor(private opts: EngineOptions, private renderer: THREE.WebGLRenderer, private w: number, private h: number) {
    this.calcSize(); this.createFBOs(); this.createPasses();
  }
  calcSize() {
    const fw = Math.max(1, Math.round(this.opts.resolution * this.w));
    const fh = Math.max(1, Math.round(this.opts.resolution * this.h));
    this.cellScale.set(1 / fw, 1 / fh); this.fboSize.set(fw, fh);
  }
  createFBOs() {
    const keys = ['vel0', 'vel1', 'vis0', 'vis1', 'div', 'p0', 'p1'];
    keys.forEach(k => { this.fbos[k] = makeFBO(this.fboSize.x, this.fboSize.y); });
  }
  createPasses() {
    const cs = this.cellScale, bs = this.boundarySpace, fs = this.fboSize;
    this.advection = new ShaderPass(face_vert, advection_frag, {
      boundarySpace: { value: cs }, px: { value: cs }, fboSize: { value: fs },
      velocity: { value: this.fbos.vel0.texture }, dt: { value: this.opts.dt }, isBFECC: { value: true },
    }, this.fbos.vel1);
    // boundary lines
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0]), 3));
    const bm = new THREE.RawShaderMaterial({ vertexShader: line_vert, fragmentShader: advection_frag, uniforms: this.advection.uniforms });
    const bl = new THREE.LineSegments(bg, bm); this.advection.scene.add(bl);
    (this.advection as unknown as { boundary: THREE.LineSegments }).boundary = bl;

    const fmesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.RawShaderMaterial({
      vertexShader: mouse_vert, fragmentShader: externalForce_frag,
      blending: THREE.AdditiveBlending, depthWrite: false,
      uniforms: { px: { value: cs }, force: { value: new THREE.Vector2() }, center: { value: new THREE.Vector2() }, scale: { value: new THREE.Vector2(this.opts.cursorSize, this.opts.cursorSize) } }
    }));
    this.forceScene.add(fmesh); this.force = fmesh;

    this.divergence = new ShaderPass(face_vert, divergence_frag, {
      boundarySpace: { value: bs }, velocity: { value: this.fbos.vel1.texture }, px: { value: cs }, dt: { value: this.opts.dt },
    }, this.fbos.div);
    this.poisson = new ShaderPass(face_vert, poisson_frag, {
      boundarySpace: { value: bs }, pressure: { value: this.fbos.p0.texture }, divergence: { value: this.fbos.div.texture }, px: { value: cs },
    });
    this.viscous = new ShaderPass(face_vert, viscous_frag, {
      boundarySpace: { value: bs }, velocity: { value: this.fbos.vel1.texture }, velocity_new: { value: this.fbos.vis0.texture }, v: { value: this.opts.viscous }, px: { value: cs }, dt: { value: this.opts.dt },
    });
    this.pressurePass = new ShaderPass(face_vert, pressure_frag, {
      boundarySpace: { value: bs }, pressure: { value: this.fbos.p0.texture }, velocity: { value: this.fbos.vis0.texture }, px: { value: cs }, dt: { value: this.opts.dt },
    }, this.fbos.vel0);
  }
  resize(w: number, h: number) {
    this.w = w; this.h = h; this.calcSize();
    Object.values(this.fbos).forEach(f => f.setSize(this.fboSize.x, this.fboSize.y));
  }
  step(mouse: { coords: THREE.Vector2; diff: THREE.Vector2; mouseMoved: boolean }) {
    const opts = this.opts; const R = this.renderer;
    if (opts.isBounce) this.boundarySpace.set(0, 0); else this.boundarySpace.copy(this.cellScale);
    this.advection.uniforms.velocity.value = this.fbos.vel0.texture;
    this.advection.uniforms.dt.value = opts.dt;
    this.advection.uniforms.isBFECC.value = opts.BFECC;
    (this.advection as unknown as { boundary: THREE.LineSegments }).boundary.visible = opts.isBounce;
    this.advection.run(R, this.fbos.vel1);

    const cu = this.opts.cursorSize, cs = this.cellScale;
    const cx = Math.min(Math.max(mouse.coords.x, -1 + cu * cs.x * 2 + cs.x * 2), 1 - cu * cs.x * 2 - cs.x * 2);
    const cy = Math.min(Math.max(mouse.coords.y, -1 + cu * cs.y * 2 + cs.y * 2), 1 - cu * cs.y * 2 - cs.y * 2);
    const fu = (this.force.material as THREE.RawShaderMaterial).uniforms;
    fu.force.value.set((mouse.diff.x / 2) * opts.mouseForce, (mouse.diff.y / 2) * opts.mouseForce);
    fu.center.value.set(cx, cy); fu.scale.value.set(cu, cu);
    R.setRenderTarget(this.fbos.vel1); R.render(this.forceScene, this.forceCamera); R.setRenderTarget(null);

    let vel = this.fbos.vel1;
    if (opts.isViscous) {
      this.viscous.uniforms.v.value = opts.viscous; this.viscous.uniforms.dt.value = opts.dt;
      for (let i = 0; i < opts.iterationsViscous; i++) {
        const fi = i % 2 === 0; const inp = fi ? this.fbos.vis0 : this.fbos.vis1; const out = fi ? this.fbos.vis1 : this.fbos.vis0;
        this.viscous.uniforms.velocity_new.value = inp.texture; this.viscous.run(R, out); vel = out;
      }
    }
    this.divergence.uniforms.velocity.value = vel.texture; this.divergence.run(R);
    let pressure = this.fbos.p0;
    for (let i = 0; i < opts.iterationsPoisson; i++) {
      const fi = i % 2 === 0; const pi = fi ? this.fbos.p0 : this.fbos.p1; const po = fi ? this.fbos.p1 : this.fbos.p0;
      this.poisson.uniforms.pressure.value = pi.texture; this.poisson.run(R, po); pressure = po;
    }
    this.pressurePass.uniforms.velocity.value = vel.texture;
    this.pressurePass.uniforms.pressure.value = pressure.texture;
    this.pressurePass.run(R, this.fbos.vel0);
  }
}

// ─── factory ──────────────────────────────────────────────────────────────────
export function createEngine(container: HTMLElement, opts: EngineOptions, colors: string[], fluidBg = 'transparent'): Engine {
  let running = false, raf = 0;
  const mouse = { coords: new THREE.Vector2(), diff: new THREE.Vector2(), old: new THREE.Vector2(), mouseMoved: false, tmr: 0, isInside: false };
  let autoActive = false, autoTarget = new THREE.Vector2(), autoCurrent = new THREE.Vector2();
  let lastUserTime = performance.now(), autoActivationTime = 0;
  const margin = 0.2;
  const pickTarget = () => autoTarget.set((Math.random() * 2 - 1) * (1 - margin), (Math.random() * 2 - 1) * (1 - margin));
  pickTarget();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.autoClear = false; renderer.setClearColor(0, 0); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });

  const getSize = () => ({ w: Math.max(1, container.clientWidth), h: Math.max(1, container.clientHeight) });
  const { w, h } = getSize(); renderer.setSize(w, h);
  container.appendChild(renderer.domElement);

  const palette = makePaletteTexture(colors);
  let sim = new Simulation(opts, renderer, w, h);

  const [fbr, fbg, fbb, fba] = hexToVec4(fluidBg);
  const scene = new THREE.Scene(), camera = new THREE.Camera();
  const output = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.RawShaderMaterial({
    vertexShader: face_vert, fragmentShader: color_frag, transparent: true, depthWrite: false,
    uniforms: { velocity: { value: sim.fbos.vel0.texture }, boundarySpace: { value: new THREE.Vector2() }, palette: { value: palette }, bgColor: { value: new THREE.Vector4(fbr, fbg, fbb, fba) } },
  }));
  scene.add(output);

  // mouse
  const onMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect(); if (!rect.width) return;
    const nx = (e.clientX - rect.left) / rect.width * 2 - 1, ny = -((e.clientY - rect.top) / rect.height * 2 - 1);
    mouse.isInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!mouse.isInside) return;
    lastUserTime = performance.now(); autoActive = false;
    mouse.coords.set(nx, ny); mouse.mouseMoved = true;
    clearTimeout(mouse.tmr); mouse.tmr = window.setTimeout(() => { mouse.mouseMoved = false; }, 100);
  };
  const onLeave = () => { mouse.isInside = false; };
  window.addEventListener('mousemove', onMove); document.addEventListener('mouseleave', onLeave);

  let lastTime = performance.now();
  const tick = () => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    const now = performance.now();
    const elapsed = now - lastTime;
    if (elapsed < 16) return; // Cap at ~60fps
    lastTime = now - (elapsed % 16);

    // auto demo
    const idleMs = now - lastUserTime;
    const rampMs = opts.autoRampDuration * 1000;
    if (opts.autoDemo && idleMs > opts.autoResumeDelay && !mouse.isInside) {
      if (!autoActive) { autoActive = true; autoCurrent.copy(mouse.coords); autoActivationTime = performance.now(); pickTarget(); }
      const elapsedAuto = now - autoActivationTime;
      const ramp = rampMs > 0 ? Math.min(1, elapsedAuto / rampMs) : 1;
      const rampE = ramp * ramp * (3 - 2 * ramp);
      const dist = autoCurrent.distanceTo(autoTarget);
      if (dist < 0.01) pickTarget();
      else { const step = opts.autoSpeed * 0.016 * rampE; autoCurrent.lerp(autoTarget, Math.min(step / dist, 1)); mouse.coords.copy(autoCurrent); mouse.mouseMoved = true; }
    }
    mouse.diff.subVectors(mouse.coords, mouse.old).multiplyScalar(autoActive ? opts.autoIntensity : 1);
    mouse.old.copy(mouse.coords);
    sim.step(mouse);
    output.material.uniforms.velocity.value = sim.fbos.vel0.texture;
    renderer.setRenderTarget(null); renderer.render(scene, camera);
  };

  const ro = new ResizeObserver(() => {
    const { w: rw, h: rh } = getSize(); renderer.setSize(rw, rh); sim.resize(rw, rh);
    output.material.uniforms.velocity.value = sim.fbos.vel0.texture;
  });
  ro.observe(container);

  const io = new IntersectionObserver(entries => {
    const v = entries[0].isIntersecting; running = v; if (v) tick(); else cancelAnimationFrame(raf);
  }, { threshold: 0.01 });
  io.observe(container);

  return {
    start() { if (running) return; running = true; tick(); },
    stop() { running = false; cancelAnimationFrame(raf); },
    resize() { const { w: rw, h: rh } = getSize(); renderer.setSize(rw, rh); sim.resize(rw, rh); },
    dispose() {
      running = false; cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove); document.removeEventListener('mouseleave', onLeave);
      ro.disconnect(); io.disconnect(); renderer.dispose();
      try { container.removeChild(renderer.domElement); } catch { /**/ }
    },
    updateOptions(o: Partial<EngineOptions>) { Object.assign(opts, o); },
    updateFluidBg(hex: string) {
      const [r, g, b, a] = hexToVec4(hex);
      (output.material.uniforms.bgColor.value as THREE.Vector4).set(r, g, b, a);
    },
    updatePalette(c: string[]) {
      const arr = c.length ? c : ['#fff', '#fff'];
      const d = palette.image.data as Uint8Array;
      for (let i = 0; i < (palette.image.width as number); i++) {
        const col = new THREE.Color(arr[i % arr.length]);
        d[i * 4] = Math.round(col.r * 255);
        d[i * 4 + 1] = Math.round(col.g * 255);
        d[i * 4 + 2] = Math.round(col.b * 255);
        d[i * 4 + 3] = 255;
      }
      palette.needsUpdate = true;
    },
  };
}
