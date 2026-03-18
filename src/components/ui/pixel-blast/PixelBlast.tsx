import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import type { Effect } from 'postprocessing';
import { VERTEX_SRC, FRAGMENT_SRC, SHAPE_MAP, MAX_CLICKS } from './shaders';
import { createTouchTexture, createLiquidEffect, type TouchTexture } from './helpers';
import '../PixelBlast.css';

interface Uniforms { [key: string]: THREE.IUniform }

interface ThreeCtx {
  renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.OrthographicCamera;
  material: THREE.ShaderMaterial; uniforms: Uniforms; clock: THREE.Clock;
  clickIx: number; resizeObserver: ResizeObserver; raf: number; quad: THREE.Mesh;
  timeOffset: number; composer?: EffectComposer; touch?: TouchTexture; liquidEffect?: Effect;
}

export interface PixelBlastProps {
  variant?: 'square' | 'circle' | 'triangle' | 'diamond';
  pixelSize?: number; color?: string; className?: string; style?: React.CSSProperties;
  antialias?: boolean; patternScale?: number; patternDensity?: number; liquid?: boolean;
  liquidStrength?: number; liquidRadius?: number; pixelSizeJitter?: number;
  enableRipples?: boolean; rippleIntensityScale?: number; rippleThickness?: number;
  rippleSpeed?: number; liquidWobbleSpeed?: number; autoPauseOffscreen?: boolean;
  speed?: number; transparent?: boolean; edgeFade?: number; noiseAmount?: number;
}

export default function PixelBlast({
  variant = 'square', pixelSize = 3, color = '#B19EEF', className, style,
  antialias = true, patternScale = 2, patternDensity = 1, liquid = false,
  liquidStrength = 0.1, liquidRadius = 1, pixelSizeJitter = 0, enableRipples = true,
  rippleIntensityScale = 1, rippleThickness = 0.1, rippleSpeed = 0.3,
  liquidWobbleSpeed = 4.5, autoPauseOffscreen = true, speed = 0.5,
  transparent = true, edgeFade = 0.5, noiseAmount = 0,
}: PixelBlastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<ThreeCtx | null>(null);
  const prevRef = useRef<{ antialias: boolean; liquid: boolean; noiseAmount: number } | null>(null);
  const speedRef = useRef(speed);
  const visRef = useRef(true);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cfg = { antialias, liquid, noiseAmount };
    const mustReinit = !ctxRef.current || Object.keys(cfg).some(
      (k) => prevRef.current?.[k as keyof typeof cfg] !== cfg[k as keyof typeof cfg]
    );

    if (!mustReinit && ctxRef.current) {
      const t = ctxRef.current;
      t.uniforms.uShapeType.value = SHAPE_MAP[variant] ?? 0;
      t.uniforms.uPixelSize.value = pixelSize * t.renderer.getPixelRatio();
      t.uniforms.uColor.value.set(color);
      t.uniforms.uScale.value = patternScale; t.uniforms.uDensity.value = patternDensity;
      t.uniforms.uPixelJitter.value = pixelSizeJitter; t.uniforms.uEnableRipples.value = enableRipples ? 1 : 0;
      t.uniforms.uRippleIntensity.value = rippleIntensityScale; t.uniforms.uRippleThickness.value = rippleThickness;
      t.uniforms.uRippleSpeed.value = rippleSpeed; t.uniforms.uEdgeFade.value = edgeFade;
      if (transparent) t.renderer.setClearAlpha(0); else t.renderer.setClearColor(0x000000, 1);
      if (t.touch) t.touch.radiusScale = liquidRadius;
      prevRef.current = cfg; return;
    }

    if (ctxRef.current) dispose(ctxRef.current, container);

    const renderer = new THREE.WebGLRenderer({ antialias, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
    if (transparent) renderer.setClearAlpha(0); else renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms: Uniforms = {
      uResolution: { value: new THREE.Vector2(0, 0) }, uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uClickPos: { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
      uClickTimes: { value: new Float32Array(MAX_CLICKS) },
      uShapeType: { value: SHAPE_MAP[variant] ?? 0 },
      uPixelSize: { value: pixelSize * renderer.getPixelRatio() },
      uScale: { value: patternScale }, uDensity: { value: patternDensity },
      uPixelJitter: { value: pixelSizeJitter }, uEnableRipples: { value: enableRipples ? 1 : 0 },
      uRippleSpeed: { value: rippleSpeed }, uRippleThickness: { value: rippleThickness },
      uRippleIntensity: { value: rippleIntensityScale }, uEdgeFade: { value: edgeFade },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SRC, fragmentShader: FRAGMENT_SRC, uniforms,
      transparent: true, depthTest: false, depthWrite: false, glslVersion: THREE.GLSL3,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const setSize = () => {
      const w = container.clientWidth || 1; const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      (uniforms.uResolution.value as THREE.Vector2).set(renderer.domElement.width, renderer.domElement.height);
      uniforms.uPixelSize.value = pixelSize * renderer.getPixelRatio();
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    const clock = new THREE.Clock();
    const timeOffset = Math.random() * 1000;
    let touch: TouchTexture | undefined;
    let composer: EffectComposer | undefined;
    let liquidEffect: ReturnType<typeof createLiquidEffect> | undefined;

    if (liquid) {
      touch = createTouchTexture(); touch.radiusScale = liquidRadius;
      liquidEffect = createLiquidEffect(touch.texture, { strength: liquidStrength, freq: liquidWobbleSpeed });
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const ep = new EffectPass(camera, liquidEffect); ep.renderToScreen = true;
      composer.addPass(ep);
      composer.setSize(renderer.domElement.width, renderer.domElement.height);
    }

    const onDown = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const sx = renderer.domElement.width / rect.width; const sy = renderer.domElement.height / rect.height;
      const fx = (e.clientX - rect.left) * sx; const fy = (rect.height - (e.clientY - rect.top)) * sy;
      const ix = ctxRef.current?.clickIx ?? 0;
      (uniforms.uClickPos.value as THREE.Vector2[])[ix].set(fx, fy);
      (uniforms.uClickTimes.value as Float32Array)[ix] = uniforms.uTime.value as number;
      if (ctxRef.current) ctxRef.current.clickIx = (ix + 1) % MAX_CLICKS;
    };
    const onMove = (e: PointerEvent) => {
      if (!touch) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const sx = renderer.domElement.width / rect.width; const sy = renderer.domElement.height / rect.height;
      touch.addTouch({ x: (e.clientX - rect.left) * sx / renderer.domElement.width, y: (rect.height - (e.clientY - rect.top)) * sy / renderer.domElement.height });
    };
    renderer.domElement.addEventListener('pointerdown', onDown, { passive: true });
    renderer.domElement.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (autoPauseOffscreen && !visRef.current) return;
      uniforms.uTime.value = timeOffset + clock.getElapsedTime() * speedRef.current;
      if (liquidEffect) (liquidEffect.uniforms.get('uTime') as THREE.Uniform<number>).value = uniforms.uTime.value as number;
      if (composer) { touch?.update(); composer.render(); } else renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    ctxRef.current = { renderer, scene, camera, material, uniforms, clock, clickIx: 0, resizeObserver: ro, raf, quad, timeOffset, composer, touch, liquidEffect };
    prevRef.current = cfg;

    return () => { if (ctxRef.current) { dispose(ctxRef.current, container); ctxRef.current = null; } };
  }, [antialias, liquid, noiseAmount, pixelSize, patternScale, patternDensity, enableRipples,
      rippleIntensityScale, rippleThickness, rippleSpeed, pixelSizeJitter, edgeFade, transparent,
      liquidStrength, liquidRadius, liquidWobbleSpeed, autoPauseOffscreen, variant, color, speed]);

  return (
    <div ref={containerRef} className={['pixel-blast-container', className].filter(Boolean).join(' ')} style={style} aria-label="PixelBlast background" />
  );
}

function dispose(t: ThreeCtx, container: HTMLElement) {
  t.resizeObserver.disconnect();
  cancelAnimationFrame(t.raf);
  t.quad.geometry.dispose();
  t.material.dispose();
  t.composer?.dispose();
  t.renderer.dispose();
  t.renderer.forceContextLoss();
  if (t.renderer.domElement.parentElement === container) container.removeChild(t.renderer.domElement);
}
