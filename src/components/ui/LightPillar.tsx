import * as THREE from 'three';
import { useEffect, useRef } from 'react';

export interface LightPillarProps {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  glowAmount?: number;
  noiseIntensity?: number;
}

const VERT = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }`;

const FRAG = `precision highp float;
uniform float uTime; uniform vec2 uResolution;
uniform vec3 uTopColor; uniform vec3 uBottomColor;
uniform float uIntensity; uniform float uGlow;
uniform float uPillarWidth; uniform float uRotationSpeed; uniform float uNoiseIntensity;
varying vec2 vUv;

float noise(vec3 p){
  vec3 i=floor(p); vec3 f=fract(p);
  f=f*f*(3.-2.*f);
  return mix(mix(mix(fract(sin(dot(i+vec3(0,0,0),vec3(127.1,311.7,74.7)))*43758.5),fract(sin(dot(i+vec3(1,0,0),vec3(127.1,311.7,74.7)))*43758.5),f.x),
             mix(fract(sin(dot(i+vec3(0,1,0),vec3(127.1,311.7,74.7)))*43758.5),fract(sin(dot(i+vec3(1,1,0),vec3(127.1,311.7,74.7)))*43758.5),f.x),f.y),
         mix(mix(fract(sin(dot(i+vec3(0,0,1),vec3(127.1,311.7,74.7)))*43758.5),fract(sin(dot(i+vec3(1,0,1),vec3(127.1,311.7,74.7)))*43758.5),f.x),
             mix(fract(sin(dot(i+vec3(0,1,1),vec3(127.1,311.7,74.7)))*43758.5),fract(sin(dot(i+vec3(1,1,1),vec3(127.1,311.7,74.7)))*43758.5),f.x),f.y),f.z);
}

void main(){
  vec2 uv=vUv*2.-1.;
  uv.x*=uResolution.x/uResolution.y;
  float t=uTime*uRotationSpeed;
  float pillar=exp(-uv.x*uv.x*uPillarWidth)*uIntensity;
  float n=noise(vec3(uv*.5,t))*0.4*uNoiseIntensity+.6;
  pillar*=n;
  float glow=exp(-uv.x*uv.x*2.)*uGlow*uIntensity;
  vec3 col=mix(uBottomColor,uTopColor,vUv.y);
  float alpha=pillar+glow*.5;
  gl_FragColor=vec4(col*alpha,alpha);
}`;

export default function LightPillar({
  topColor = '#5227FF', bottomColor = '#FF9FFC', intensity = 1.0,
  rotationSpeed = 0.3, pillarWidth = 3, pillarHeight = 0.4,
  glowAmount = 0.005, noiseIntensity = 0.5,
}: LightPillarProps) {
  const ref = useRef<HTMLDivElement>(null);

  const parseColor = (hex: string) => {
    const c = new THREE.Color(hex);
    return new THREE.Vector3(c.r, c.g, c.b);
  };

  useEffect(() => {
    const ctn = ref.current; if (!ctn) return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(ctn.clientWidth, ctn.clientHeight);
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block', position: 'absolute', top: '0', left: '0' });
    ctn.appendChild(renderer.domElement);
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(ctn.clientWidth, ctn.clientHeight) },
        uTopColor: { value: parseColor(topColor) },
        uBottomColor: { value: parseColor(bottomColor) },
        uIntensity: { value: intensity },
        uGlow: { value: glowAmount * 200 },
        uPillarWidth: { value: 1 / (pillarWidth * pillarWidth) },
        uRotationSpeed: { value: rotationSpeed },
        uNoiseIntensity: { value: noiseIntensity },
      },
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    const ro = new ResizeObserver(() => {
      renderer.setSize(ctn.clientWidth, ctn.clientHeight);
      mat.uniforms.uResolution.value.set(ctn.clientWidth, ctn.clientHeight);
    });
    ro.observe(ctn);
    let raf = 0;
    const loop = (t: number) => { raf = requestAnimationFrame(loop); mat.uniforms.uTime.value = t * 0.001; renderer.render(scene, camera); };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); mat.dispose(); renderer.dispose();
      if (renderer.domElement.parentElement === ctn) ctn.removeChild(renderer.domElement);
    };
  }, [topColor, bottomColor, intensity, rotationSpeed, pillarWidth, pillarHeight, glowAmount, noiseIntensity]);

  return <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} />;
}
