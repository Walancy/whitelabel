/* eslint-disable react/no-unknown-property */
import { forwardRef, useImperativeHandle, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { degToRad } from 'three/src/math/MathUtils.js';

const NOISE_GLSL = `
float random(in vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
float noise(in vec2 st){
  vec2 i=floor(st);vec2 f=fract(st);
  float a=random(i);float b=random(i+vec2(1.0,0.0));
  float c=random(i+vec2(0.0,1.0));float d=random(i+vec2(1.0,1.0));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
vec3 fade(vec3 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec3 P){
  vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.0);
  Pi0=mod(Pi0,289.0);Pi1=mod(Pi1,289.0);
  vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.0);
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=Pi0.zzzz;vec4 iz1=Pi1.zzzz;
  vec4 ixy=permute(permute(ix)+iy);
  vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);
  vec4 gx0=ixy0/7.0;vec4 gy0=fract(floor(gx0)/7.0)-0.5;gx0=fract(gx0);
  vec4 gz0=vec4(0.5)-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.0));
  gx0-=sz0*(step(0.0,gx0)-0.5);gy0-=sz0*(step(0.0,gy0)-0.5);
  vec4 gx1=ixy1/7.0;vec4 gy1=fract(floor(gx1)/7.0)-0.5;gx1=fract(gx1);
  vec4 gz1=vec4(0.5)-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.0));
  gx1-=sz1*(step(0.0,gx1)-0.5);gy1-=sz1*(step(0.0,gy1)-0.5);
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;
  vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;
  float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
  float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011=dot(g011,vec3(Pf0.x,Pf1.yz));float n111=dot(g111,Pf1);
  vec3 fade_xyz=fade(Pf0);
  vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2*n_xyz;
}
`;

function createStackedPlanesGeometry(n: number, w: number, h: number, sp: number, seg: number): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const vNum = n * (seg + 1) * 2, fNum = n * seg * 2;
  const pArr = new Float32Array(vNum * 3), uArr = new Float32Array(vNum * 2), iArr = new Uint32Array(fNum * 3);
  let vO = 0, iO = 0, uO = 0; const totalW = n * w + (n - 1) * sp, xB = -totalW / 2;
  for (let i = 0; i < n; i++) {
    const x = xB + i * (w + sp), uX = Math.random() * 300, uYOffset = Math.random() * 300;
    for (let j = 0; j <= seg; j++) {
      const y = h * (j / seg - 0.5), uvY = j / seg;
      pArr.set([x, y, 0, x + w, y, 0], vO * 3);
      uArr.set([uX, uvY + uYOffset, uX + 1, uvY + uYOffset], uO);
      if (j < seg) { const a = vO, b = vO + 1, c = vO + 2, d = vO + 3; iArr.set([a, b, c, c, b, d], iO); iO += 6; }
      vO += 2; uO += 4;
    }
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uArr, 2));
  geo.setIndex(new THREE.BufferAttribute(iArr, 1));
  geo.computeVertexNormals();
  return geo;
}

function buildBeamMaterial() {
  const phys = THREE.ShaderLib.physical;
  const uniforms = THREE.UniformsUtils.clone(phys.uniforms);
  uniforms['time'] = { value: 0 };
  uniforms['uSpeed'] = { value: 1 };
  uniforms['uNoiseIntensity'] = { value: 1 };
  uniforms['uScale'] = { value: 1 };
  uniforms['uRippleShadow'] = { value: 0.5 };
  uniforms['uColorIntensity'] = { value: 1 };
  const head = `varying vec3 vEye; varying float vNoise; varying vec2 vUv; varying vec3 vPosition; uniform float time; uniform float uSpeed; uniform float uNoiseIntensity; uniform float uScale; uniform float uRippleShadow; uniform float uColorIntensity; ${NOISE_GLSL}`;
  const vHead = `float getPos(vec3 p){ return cnoise(vec3(p.x*0.,p.y-uv.y,p.z+time*uSpeed*3.)*uScale); } vec3 getCP(vec3 p){vec3 q=p;q.z+=getPos(p);return q;} vec3 getN(vec3 p){vec3 c=getCP(p),nx=getCP(p+vec3(0.01,0,0)),nz=getCP(p+vec3(0,-0.01,0));return normalize(cross(normalize(nz-c),normalize(nx-c)));}`;
  let vert = `${head}\n${vHead}\n${phys.vertexShader}`, frag = `${head}\n${phys.fragmentShader}`;
  vert = vert.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.z+=getPos(transformed.xyz);\nvNoise=getPos(position.xyz);').replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nobjectNormal=getN(position.xyz);');
  frag = frag.replace('#include <dithering_fragment>', '#include <dithering_fragment>\nfloat rn=noise(gl_FragCoord.xy);gl_FragColor.rgb-=rn/15.*uNoiseIntensity;gl_FragColor.rgb*=mix(1.0,max(0.0,vNoise*0.5+0.6),uRippleShadow)*uColorIntensity;');
  return new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag, lights: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
}

const MergedPlanes = forwardRef<THREE.Mesh, { material: THREE.ShaderMaterial; width: number; count: number; height: number }>(
  ({ material, width, count, height }, ref) => {
    const mesh = useRef<THREE.Mesh>(null!);
    useImperativeHandle(ref, () => mesh.current);
    const geo = useMemo(() => createStackedPlanesGeometry(count, width, height, 0, 75), [count, width, height]);
    useFrame((_, d) => { (mesh.current.material as THREE.ShaderMaterial).uniforms.time.value += 0.1 * d; });
    return <mesh ref={mesh} geometry={geo} material={material} />;
  }
);
MergedPlanes.displayName = 'MergedPlanes';

const DirLight = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const dir = useRef<THREE.DirectionalLight>(null!);
  useEffect(() => { if (dir.current) { const c = dir.current.shadow.camera as THREE.OrthographicCamera; c.top = 24; c.bottom = -24; c.left = -24; c.right = 24; c.far = 64; dir.current.shadow.bias = -0.004; } }, []);
  return <directionalLight ref={dir} color={color} intensity={0.9} position={position} />;
};

export interface BeamsProps {
  beamWidth?: number; beamHeight?: number; beamNumber?: number; lightColor?: string; speed?: number; noiseIntensity?: number; scale?: number; rotation?: number; bgColor?: string; rippleShadow?: number; colorIntensity?: number; vignette?: number;
}

export default function Beams({
  beamWidth = 2, beamHeight = 21, beamNumber = 11, lightColor = '#ffffff', speed = 8, noiseIntensity = 1.6, scale = 0.27, rotation = 0, bgColor = '#000000', rippleShadow = 1, colorIntensity = 1.6, vignette = 1,
}: BeamsProps) {
  // Static material to prevent recompilation lag (2fps issue)
  const material = useMemo(() => buildBeamMaterial(), []);

  useEffect(() => {
    const u = material.uniforms;
    u.uSpeed.value = speed;
    u.uNoiseIntensity.value = noiseIntensity;
    u.uScale.value = scale;
    u.uRippleShadow.value = rippleShadow;
    u.uColorIntensity.value = colorIntensity;
  }, [material, speed, noiseIntensity, scale, rippleShadow, colorIntensity]);

  const bgRgb = useMemo(() => {
    const h = bgColor.replace('#', '');
    return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
  }, [bgColor]);

  return (
    <>
      <Canvas dpr={Math.min(window.devicePixelRatio, 1.25)} frameloop="always" style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <group rotation={[0, 0, degToRad(rotation)]}>
          <MergedPlanes material={material} count={beamNumber} width={beamWidth} height={beamHeight} />
          <DirLight color={lightColor} position={[0, 3, 10]} />
        </group>
        <ambientLight intensity={0.0} />
        <color attach="background" args={[bgColor as unknown as THREE.ColorRepresentation]} />
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={30} />
      </Canvas>
      {vignette > 0 && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, background: `radial-gradient(ellipse at 50% 50%, transparent ${Math.max(2, 35 - (vignette - 1) * 16)}%, rgba(${bgRgb},${Math.min(1, vignette)}) 100%)` }} />
      )}
    </>
  );
}
