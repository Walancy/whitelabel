import { useEffect, useRef } from 'react';
import { Renderer, Triangle, Program, Mesh } from 'ogl';

interface PrismProps {
  height?: number;
  baseWidth?: number;
  animationType?: 'rotate' | 'hover' | '3drotate';
  glow?: number;
  noise?: number;
  transparent?: boolean;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  hoverStrength?: number;
  inertia?: number;
  bloom?: number;
  timeScale?: number;
}

const vert = `attribute vec2 position; void main(){ gl_Position = vec4(position,0,1); }`;
const frag = `precision highp float;
uniform vec2 iResolution; uniform float iTime;
uniform float uHeight; uniform float uBaseHalf; uniform mat3 uRot; uniform int uUseBaseWobble;
uniform float uGlow; uniform vec2 uOffsetPx; uniform float uNoise; uniform float uSaturation;
uniform float uScale; uniform float uHueShift; uniform float uColorFreq; uniform float uBloom;
uniform float uCenterShift; uniform float uInvBaseHalf; uniform float uInvHeight;
uniform float uMinAxis; uniform float uPxScale; uniform float uTimeScale;

float rand(vec2 c){return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453123);}
float sdOctaAnisoInv(vec3 p){vec3 q=vec3(abs(p.x)*uInvBaseHalf,abs(p.y)*uInvHeight,abs(p.z)*uInvBaseHalf);return(q.x+q.y+q.z-1.0)*uMinAxis*0.5773502691896258;}
float sdPyramidUpInv(vec3 p){return max(sdOctaAnisoInv(p),-p.y);}
mat3 hueRotation(float a){float c=cos(a),s=sin(a);return mat3(0.299,0.587,0.114,0.299,0.587,0.114,0.299,0.587,0.114)+mat3(0.701,-0.587,-0.114,-0.299,0.413,-0.114,-0.300,-0.588,0.886)*c+mat3(0.168,-0.331,0.500,0.328,0.035,-0.500,-0.497,0.296,0.201)*s;}
void main(){
  vec2 f=(gl_FragCoord.xy-0.5*iResolution.xy-uOffsetPx)*uPxScale;
  float z=5.0,d=0.0; vec3 p; vec4 o=vec4(0.0);
  mat2 wob=mat2(1.0);
  if(uUseBaseWobble==1){float t=iTime*uTimeScale;wob=mat2(cos(t),cos(t+33.0),cos(t+11.0),cos(t));}
  // Optimized iteration count to 40 for stability on broad hardware
  for(int i=0;i<40;i++){
    p=vec3(f,z); p.xz=p.xz*wob; p=uRot*p; vec3 q=p; q.y+=uCenterShift;
    d=0.1+0.2*abs(sdPyramidUpInv(q)); z-=d;
    o+=(sin((p.y+z)*uColorFreq+vec4(0,1,2,3))+1.0)/d;
  }
  // Simplified coloring and intensity calculation
  o=clamp(o*o*(uGlow*uBloom)/1e5, 0.0, 1.0);
  vec3 col=o.rgb; float n=rand(gl_FragCoord.xy+vec2(iTime)); col+=(n-0.5)*uNoise;
  col=clamp(col,0.0,1.0); float L=dot(col,vec3(0.2126,0.7152,0.0722));
  col=clamp(mix(vec3(L),col,uSaturation),0.0,1.0);
  if(abs(uHueShift)>0.0001) col=clamp(hueRotation(uHueShift)*col,0.0,1.0);
  gl_FragColor=vec4(col,o.a);
}`;

const Prism = ({
  height = 3.5, baseWidth = 5.5, animationType = 'rotate', glow = 1,
  noise = 0.5, transparent = true, scale = 3.6, hueShift = 0,
  colorFrequency = 1, hoverStrength = 2, inertia = 0.05, bloom = 1, timeScale = 0.5
}: PrismProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<Program | null>(null);

  useEffect(() => {
    const container = containerRef.current; if (!container) return;
    const H = Math.max(0.001, height), BW = Math.max(0.001, baseWidth);
    const BASE_HALF = BW * 0.5, GLOW = Math.max(0, glow), NOISE = Math.max(0, noise);
    const SAT = transparent ? 1.5 : 1, SCALE = Math.max(0.001, scale);
    const HUE = hueShift || 0, CFREQ = Math.max(0, colorFrequency || 1);
    const BLOOM = Math.max(0, bloom || 1), TS = Math.max(0, timeScale || 1);
    // Forced DPR to 1.0 as this effect is high-intensity raymarching
    const dpr = 1.0;
    const renderer = new Renderer({ dpr, alpha: transparent, antialias: false });
    const gl = renderer.gl;
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE); gl.disable(gl.BLEND);
    Object.assign(gl.canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
    container.appendChild(gl.canvas);
    const iResBuf = new Float32Array(2), offsetPxBuf = new Float32Array(2);
    const program = new Program(gl, {
      vertex: vert, fragment: frag,
      uniforms: {
        iResolution: { value: iResBuf }, iTime: { value: 0 },
        uHeight: { value: H }, uBaseHalf: { value: BASE_HALF },
        uUseBaseWobble: { value: animationType === 'rotate' ? 1 : 0 }, uRot: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) },
        uGlow: { value: GLOW }, uOffsetPx: { value: offsetPxBuf }, uNoise: { value: NOISE },
        uSaturation: { value: SAT }, uScale: { value: SCALE }, uHueShift: { value: HUE },
        uColorFreq: { value: CFREQ }, uBloom: { value: BLOOM }, uCenterShift: { value: H * 0.25 },
        uInvBaseHalf: { value: 1 / BASE_HALF }, uInvHeight: { value: 1 / H },
        uMinAxis: { value: Math.min(BASE_HALF, H) },
        uPxScale: { value: 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE) },
        uTimeScale: { value: TS }
      }
    });
    programRef.current = program;
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const rotBuf = new Float32Array(9);
    const setMat3 = (yaw: number, pitch: number, roll: number, out: Float32Array) => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch), cz = Math.cos(roll), sz = Math.sin(roll);
      out[0] = cy * cz + sy * sx * sz; out[1] = cx * sz; out[2] = -sy * cz + cy * sx * sz;
      out[3] = -cy * sz + sy * sx * cz; out[4] = cx * cz; out[5] = sy * sz + cy * sx * cz;
      out[6] = sy * cx; out[7] = -sx; out[8] = cy * cx; return out;
    };
    const resize = () => {
      const w = container.clientWidth || 1, h = container.clientHeight || 1;
      renderer.setSize(w, h); iResBuf[0] = gl.drawingBufferWidth; iResBuf[1] = gl.drawingBufferHeight;
      if (programRef.current) programRef.current.uniforms.uPxScale.value = 1 / ((gl.drawingBufferHeight || 1) * 0.1 * scale);
    };
    const ro = new ResizeObserver(resize); ro.observe(container); resize();
    const rnd = () => Math.random();
    const wX = (0.3 + rnd() * 0.6), wY = (0.2 + rnd() * 0.7), wZ = (0.1 + rnd() * 0.5);
    const phX = rnd() * Math.PI * 2, phZ = rnd() * Math.PI * 2;
    let yaw = 0, pitch = 0, roll = 0, targetYaw = 0, targetPitch = 0, rafId = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const ww = Math.max(1, window.innerWidth), wh = Math.max(1, window.innerHeight);
      pointer.x = Math.max(-1, Math.min(1, (e.clientX - ww * 0.5) / (ww * 0.5)));
      pointer.y = Math.max(-1, Math.min(1, (e.clientY - wh * 0.5) / (wh * 0.5)));
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let lastTime = 0;
    const fps = 60;
    const interval = 1000 / fps;

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);
      if (!lastTime) lastTime = now;
      const delta = now - lastTime;
      if (delta < interval) return;
      lastTime = now - (delta % interval);

      const time = now * 0.001;
      program.uniforms.iTime.value = time;
      if (animationType === 'hover') {
        const my = hoverStrength * 0.6; targetYaw = -pointer.x * my; targetPitch = pointer.y * my;
        yaw = lerp(yaw, targetYaw, inertia); pitch = lerp(pitch, targetPitch, inertia); roll = lerp(roll, 0, 0.1);
        program.uniforms.uRot.value = setMat3(yaw, pitch, roll, rotBuf);
      } else if (animationType === '3drotate') {
        const ts = time * timeScale; yaw = ts * wY; pitch = Math.sin(ts * wX + phX) * 0.6; roll = Math.sin(ts * wZ + phZ) * 0.5;
        program.uniforms.uRot.value = setMat3(yaw, pitch, roll, rotBuf);
      } else {
        rotBuf[0] = 1; rotBuf[4] = 1; rotBuf[8] = 1; program.uniforms.uRot.value = rotBuf;
      }
      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId); ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      if (gl.canvas.parentElement === container) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      programRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const p = programRef.current;
    if (!p) return;
    p.uniforms.uHeight.value = height;
    p.uniforms.uBaseHalf.value = baseWidth * 0.5;
    p.uniforms.uGlow.value = glow;
    p.uniforms.uNoise.value = noise;
    p.uniforms.uSaturation.value = transparent ? 1.5 : 1;
    p.uniforms.uScale.value = scale;
    p.uniforms.uHueShift.value = hueShift;
    p.uniforms.uColorFreq.value = colorFrequency;
    p.uniforms.uBloom.value = bloom;
    p.uniforms.uTimeScale.value = timeScale;
    p.uniforms.uUseBaseWobble.value = animationType === 'rotate' ? 1 : 0;
  }, [height, baseWidth, glow, noise, transparent, scale, hueShift, colorFrequency, bloom, timeScale, animationType]);

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} />;
};
export default Prism;
