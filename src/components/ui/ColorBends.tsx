import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ColorBends.css';

const MAX_COLORS = 8;

const FRAG = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas; uniform float uTime; uniform float uSpeed;
uniform vec2 uRot; uniform int uColorCount; uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent; uniform float uScale; uniform float uFrequency;
uniform float uWarpStrength; uniform vec2 uPointer; uniform float uMouseInfluence;
uniform float uParallax; uniform float uNoise;
varying vec2 vUv;

void main(){
  float t=uTime*uSpeed;
  vec2 p=vUv*2.0-1.0;
  p+=uPointer*uParallax*0.1;
  vec2 rp=vec2(p.x*uRot.x-p.y*uRot.y,p.x*uRot.y+p.y*uRot.x);
  vec2 q=vec2(rp.x*(uCanvas.x/uCanvas.y),rp.y);
  q/=max(uScale,0.0001);
  q/=0.5+0.2*dot(q,q);
  q+=0.2*cos(t)-7.56;
  q+=(uPointer-rp)*uMouseInfluence*0.2;

  vec3 col=vec3(0.0); float a=1.0;
  if(uColorCount>0){
    vec2 s=q; vec3 sumCol=vec3(0.0); float cover=0.0;
    for(int i=0;i<MAX_COLORS;++i){
      if(i>=uColorCount)break;
      s-=0.01;
      vec2 r=sin(1.5*(s.yx*uFrequency)+2.0*cos(s*uFrequency));
      float m0=length(r+sin(5.0*r.y*uFrequency-3.0*t+float(i))/4.0);
      float kB=clamp(uWarpStrength,0.0,1.0); float kM=pow(kB,0.3);
      float gain=1.0+max(uWarpStrength-1.0,0.0);
      vec2 warped=s+(r-s)*kB*gain;
      float m1=length(warped+sin(5.0*warped.y*uFrequency-3.0*t+float(i))/4.0);
      float m=mix(m0,m1,kM);
      float w=1.0-exp(-6.0/exp(6.0*m));
      sumCol+=uColors[i]*w; cover=max(cover,w);
    }
    col=clamp(sumCol,0.0,1.0);
    a=uTransparent>0?cover:1.0;
  } else {
    vec2 s=q;
    for(int k=0;k<3;++k){
      s-=0.01;
      vec2 r=sin(1.5*(s.yx*uFrequency)+2.0*cos(s*uFrequency));
      float m0=length(r+sin(5.0*r.y*uFrequency-3.0*t+float(k))/4.0);
      float kB=clamp(uWarpStrength,0.0,1.0); float kM=pow(kB,0.3);
      float gain=1.0+max(uWarpStrength-1.0,0.0);
      vec2 warped=s+(r-s)*kB*gain;
      float m1=length(warped+sin(5.0*warped.y*uFrequency-3.0*t+float(k))/4.0);
      col[k]=1.0-exp(-6.0/exp(6.0*mix(m0,m1,kM)));
    }
    a=uTransparent>0?max(max(col.r,col.g),col.b):1.0;
  }
  if(uNoise>0.0001){
    float n=fract(sin(dot(gl_FragCoord.xy+vec2(uTime),vec2(12.9898,78.233)))*43758.5453123);
    col=clamp(col+(n-0.5)*uNoise,0.0,1.0);
  }
  vec3 rgb=uTransparent>0?col*a:col;
  gl_FragColor=vec4(rgb,a);
}
`;

const VERT = `
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=vec4(position,1.0); }
`;

const hexToVec3 = (hex: string): THREE.Vector3 => {
  const h = hex.replace('#', '').trim();
  const r = h.length === 3
    ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
    : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  return new THREE.Vector3(r[0] / 255, r[1] / 255, r[2] / 255);
};

export interface ColorBendsProps {
  className?: string;
  style?: React.CSSProperties;
  rotation?: number;
  speed?: number;
  colors?: string[];
  transparent?: boolean;
  autoRotate?: number;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
  mouseInfluence?: number;
  parallax?: number;
  noise?: number;
}

export default function ColorBends({
  className,
  style,
  rotation = 45,
  speed = 0.2,
  colors = [],
  transparent = true,
  autoRotate = 0,
  scale = 1,
  frequency = 1,
  warpStrength = 1,
  mouseInfluence = 1,
  parallax = 0.5,
  noise = 0.1,
}: ColorBendsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rafRef = useRef<number>(0);
  const roRef = useRef<ResizeObserver | null>(null);
  const rotationRef = useRef(rotation);
  const autoRotateRef = useRef(autoRotate);
  const pointerTargetRef = useRef(new THREE.Vector2(0, 0));
  const pointerCurrentRef = useRef(new THREE.Vector2(0, 0));

  // Mount: create renderer + scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3());

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uCanvas: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uRot: { value: new THREE.Vector2(1, 0) },
        uColorCount: { value: 0 },
        uColors: { value: uColorsArray },
        uTransparent: { value: transparent ? 1 : 0 },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: mouseInfluence },
        uParallax: { value: parallax },
        uNoise: { value: noise },
      },
      premultipliedAlpha: true,
      transparent: true,
    });
    materialRef.current = material;
    scene.add(new THREE.Mesh(geometry, material));

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, transparent ? 0 : 1);
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
    container.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

    const handleResize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      material.uniforms.uCanvas.value.set(w, h);
    };
    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    roRef.current = ro;

    rafRef.current = requestAnimationFrame(function loop() {
      const dt = clock.getDelta();
      material.uniforms.uTime.value = clock.elapsedTime;
      const deg = (rotationRef.current % 360) + autoRotateRef.current * clock.elapsedTime;
      const rad = (deg * Math.PI) / 180;
      material.uniforms.uRot.value.set(Math.cos(rad), Math.sin(rad));
      pointerCurrentRef.current.lerp(pointerTargetRef.current, Math.min(1, dt * 8));
      material.uniforms.uPointer.value.copy(pointerCurrentRef.current);
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
    };
  }, [frequency, mouseInfluence, noise, parallax, scale, speed, transparent, warpStrength]);

  // Update uniforms on prop changes
  useEffect(() => {
    const mat = materialRef.current;
    if (!mat) return;
    rotationRef.current = rotation;
    autoRotateRef.current = autoRotate;
    mat.uniforms.uSpeed.value = speed;
    mat.uniforms.uScale.value = scale;
    mat.uniforms.uFrequency.value = frequency;
    mat.uniforms.uWarpStrength.value = warpStrength;
    mat.uniforms.uMouseInfluence.value = mouseInfluence;
    mat.uniforms.uParallax.value = parallax;
    mat.uniforms.uNoise.value = noise;
    mat.uniforms.uTransparent.value = transparent ? 1 : 0;
    rendererRef.current?.setClearColor(0x000000, transparent ? 0 : 1);

    const arr = (colors ?? []).filter(Boolean).slice(0, MAX_COLORS).map(hexToVec3);
    for (let i = 0; i < MAX_COLORS; i++) {
      const vec = mat.uniforms.uColors.value[i] as THREE.Vector3;
      if (i < arr.length) vec.copy(arr[i]);
      else vec.set(0, 0, 0);
    }
    mat.uniforms.uColorCount.value = arr.length;
  }, [rotation, autoRotate, speed, scale, frequency, warpStrength,
      mouseInfluence, parallax, noise, colors, transparent]);

  // Pointer interaction
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerTargetRef.current.set(
        ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1,
        -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1)
      );
    };
    container.addEventListener('pointermove', onMove);
    return () => container.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={['color-bends-container', className].filter(Boolean).join(' ')}
      style={style}
    />
  );
}
