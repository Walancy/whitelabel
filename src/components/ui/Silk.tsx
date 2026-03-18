import * as THREE from 'three';
import { useRef, useMemo, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color } from 'three';

const hexToRGB = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255];
};

const VERT = `
varying vec2 vUv; varying vec3 vPosition;
void main() { vPosition = position; vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const FRAG = `
varying vec2 vUv; varying vec3 vPosition;
uniform float uTime; uniform vec3 uColor; uniform float uSpeed; uniform float uScale; uniform float uRotation; uniform float uNoiseIntensity;
const float e = 2.71828182845904523536;
float noise(vec2 t){ float G=e; vec2 r=(G*sin(G*t)); return fract(r.x*r.y*(1.0+t.x)); }
vec2 rotateUvs(vec2 uv,float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c)*uv; }
void main(){
  float rnd=noise(gl_FragCoord.xy);
  vec2 uv=rotateUvs(vUv*uScale,uRotation);
  vec2 tex=uv*uScale;
  float tOffset=uSpeed*uTime;
  tex.y+=0.03*sin(8.0*tex.x-tOffset);
  float pattern=0.6+0.4*sin(5.0*(tex.x+tex.y+cos(3.0*tex.x+5.0*tex.y)+0.02*tOffset)+sin(20.0*(tex.x+tex.y-0.1*tOffset)));
  vec4 col=vec4(uColor,1.0)*vec4(pattern)-rnd/15.0*uNoiseIntensity;
  col.a=1.0; gl_FragColor=col;
}
`;

interface SilkPlaneProps {
  uniforms: Record<string, { value: unknown }>;
}

// Simple component — NO forwardRef needed, uses its own ref internally
function SilkPlane({ uniforms }: SilkPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { viewport } = useThree();
  useLayoutEffect(() => {
    if (meshRef.current) meshRef.current.scale.set(viewport.width, viewport.height, 1);
  }, [viewport]);
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value += 0.1 * delta;
  });
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} />
    </mesh>
  );
}

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}

export default function Silk({
  speed = 5, scale = 1, color = '#7B7481', noiseIntensity = 1.5, rotation = 0,
}: SilkProps) {
  const uniforms = useMemo(() => ({
    uSpeed: { value: speed }, uScale: { value: scale },
    uNoiseIntensity: { value: noiseIntensity },
    uColor: { value: new Color(...hexToRGB(color)) },
    uRotation: { value: rotation }, uTime: { value: 0 },
  }), [speed, scale, noiseIntensity, color, rotation]);

  return (
    <Canvas dpr={[1, 2]} frameloop="always" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <SilkPlane uniforms={uniforms} />
    </Canvas>
  );
}
