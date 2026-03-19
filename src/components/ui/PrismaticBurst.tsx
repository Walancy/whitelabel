import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';

type AnimType = 'rotate' | 'rotate3d' | 'hover';

interface PrismaticBurstProps {
  intensity?: number;
  speed?: number;
  animationType?: AnimType;
  colors?: string[];
  distort?: number;
  hoverDampness?: number;
  rayCount?: number;
}

const vert = `#version 300 es\nin vec2 position;\nin vec2 uv;\nout vec2 vUv;\nvoid main(){\nvUv=uv;\ngl_Position=vec4(position,0.0,1.0);\n}`;

const frag = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;
uniform float uSpeed;
uniform int uAnimType;
uniform vec2 uMouse;
uniform int uColorCount;
uniform float uDistort;
uniform vec2 uOffset;
uniform sampler2D uGradient;
uniform float uNoiseAmount;
uniform int uRayCount;

float hash21(vec2 p){p=floor(p);float f=52.9829189*fract(dot(p,vec2(0.065,0.005)));return fract(f);}
mat2 rot30(){return mat2(0.8,-0.5,0.5,0.8);}
float layeredNoise(vec2 fp){
  vec2 p=mod(fp+vec2(uTime*30.0,-uTime*21.0),1024.0);
  vec2 q=rot30()*p;
  float n=0.40*hash21(q)+0.25*hash21(q*2.0+17.0)+0.20*hash21(q*4.0+47.0)+0.10*hash21(q*8.0+113.0)+0.05*hash21(q*16.0+191.0);
  return n;
}
vec3 rayDir(vec2 frag,vec2 res,vec2 offset,float dist){float focal=res.y*max(dist,1e-3);return normalize(vec3(2.0*(frag-offset)-res,focal));}
float edgeFade(vec2 frag,vec2 res,vec2 offset){
  vec2 toC=frag-0.5*res-offset;
  float r=length(toC)/(0.5*min(res.x,res.y));
  float x=clamp(r,0.0,1.0);
  float q=x*x*x*(x*(x*6.0-15.0)+10.0);
  float s=q*0.5;
  s=pow(s,1.5);
  float tail=1.0-pow(1.0-s,2.0);
  s=mix(s,tail,0.2);
  float dn=(layeredNoise(frag*0.15)-0.5)*0.0015*s;
  return clamp(s+dn,0.0,1.0);
}
mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1,0,0,0,c,-s,0,s,c);}
mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0,s,0,1,0,-s,0,c);}
mat3 rotZ(float a){float c=cos(a),s=sin(a);return mat3(c,-s,0,s,c,0,0,0,1);}
vec3 sampleGradient(float t){return texture(uGradient,vec2(clamp(t,0.0,1.0),0.5)).rgb;}
vec2 rot2(vec2 v,float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c)*v;}
float bendAngle(vec3 q,float t){return 0.8*sin(q.x*0.55+t*0.6)+0.7*sin(q.y*0.50-t*0.5)+0.6*sin(q.z*0.60+t*0.7);}
void main(){
  vec2 frag=gl_FragCoord.xy;
  float t=uTime*uSpeed;
  float jitterAmp=0.1*clamp(uNoiseAmount,0.0,1.0);
  vec3 dir=rayDir(frag,uResolution,uOffset,1.0);
  float marchT=0.0;
  vec3 col=vec3(0.0);
  float n=layeredNoise(frag);
  vec4 c=cos(t*0.2+vec4(0.0,33.0,11.0,0.0));
  mat2 M2=mat2(c.x,c.y,c.z,c.w);
  float amp=clamp(uDistort,0.0,50.0)*0.15;
  mat3 rot3dMat=mat3(1.0);
  if(uAnimType==1){vec3 ang=vec3(t*0.31,t*0.21,t*0.17);rot3dMat=rotZ(ang.z)*rotY(ang.y)*rotX(ang.x);}
  mat3 hoverMat=mat3(1.0);
  if(uAnimType==2){vec2 m=uMouse*2.0-1.0;vec3 ang=vec2(m.y*0.6,m.x*0.6).x?rotY(m.x*0.6)*rotX(m.y*0.6):mat3(1.0);}
  for(int i=0;i<44;++i){
    vec3 P=marchT*dir;P.z-=2.0;
    float rad=length(P);vec3 Pl=P*(10.0/max(rad,1e-6));
    if(uAnimType==0){Pl.xz*=M2;}else if(uAnimType==1){Pl=rot3dMat*Pl;}else{Pl=hoverMat*Pl;}
    float stepLen=min(rad-0.3,n*jitterAmp)+0.1;
    float grow=smoothstep(0.35,3.0,marchT);
    float a1=amp*grow*bendAngle(Pl*0.6,t);float a2=0.5*amp*grow*bendAngle(Pl.zyx*0.5+3.1,t*0.9);
    vec3 Pb=Pl;Pb.xz=rot2(Pb.xz,a1);Pb.xy=rot2(Pb.xy,a2);
    float rayPattern=smoothstep(0.5,0.7,sin(Pb.x+cos(Pb.y)*cos(Pb.z))*sin(Pb.z+sin(Pb.y)*cos(Pb.x+t)));
    if(uRayCount>0){float ang=atan(Pb.y,Pb.x);float comb=pow(0.5+0.5*cos(float(uRayCount)*ang),3.0);rayPattern*=smoothstep(0.15,0.95,comb);}
    vec3 spectralDefault=1.0+vec3(cos(marchT*3.0+0.0),cos(marchT*3.0+1.0),cos(marchT*3.0+2.0));
    float saw=fract(marchT*0.25);float tRay=saw*saw*(3.0-2.0*saw);
    vec3 userGradient=2.0*sampleGradient(tRay);
    vec3 spectral=(uColorCount>0)?userGradient:spectralDefault;
    col+=(0.05/(0.4+stepLen))*smoothstep(5.0,0.0,rad)*spectral*rayPattern;
    marchT+=stepLen;
  }
  col*=edgeFade(frag,uResolution,uOffset)*uIntensity;
  fragColor=vec4(clamp(col,0.0,1.0),1.0);
}`;

const hexToRgb01 = (hex: string): [number, number, number] => {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const iv = parseInt(h, 16);
  return [(iv >> 16 & 255) / 255, (iv >> 8 & 255) / 255, (iv & 255) / 255];
};

const animTypeMap: Record<AnimType, number> = { rotate: 0, rotate3d: 1, hover: 2 };

const PrismaticBurst = ({
  intensity = 2, speed = 0.5, animationType = 'rotate3d', colors,
  distort = 0, hoverDampness = 0, rayCount = 0
}: PrismaticBurstProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<Program | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const gradTexRef = useRef<Texture | null>(null);
  const mouseTargetRef = useRef([0.5, 0.5]);
  const mouseSmoothRef = useRef([0.5, 0.5]);
  const pausedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current; if (!container) return;
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 1.25), alpha: false, antialias: false });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    Object.assign(gl.canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' });
    container.appendChild(gl.canvas);

    const white = new Uint8Array([255, 255, 255, 255]);
    const gradientTex = new Texture(gl, { image: white, width: 1, height: 1, generateMipmaps: false, flipY: false });
    gradTexRef.current = gradientTex;

    const program = new Program(gl, {
      vertex: vert, fragment: frag,
      uniforms: {
        uResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight] }, uTime: { value: 0 },
        uIntensity: { value: intensity }, uSpeed: { value: speed }, uAnimType: { value: animTypeMap[animationType] },
        uMouse: { value: [0.5, 0.5] }, uColorCount: { value: 0 }, uDistort: { value: distort },
        uOffset: { value: [0, 0] }, uGradient: { value: gradientTex },
        uNoiseAmount: { value: 0.8 }, uRayCount: { value: rayCount }
      }
    });
    programRef.current = program;
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const w = container.clientWidth || 1, h = container.clientHeight || 1;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };
    const ro = new ResizeObserver(resize); ro.observe(container); resize();

    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      const y = (e.clientY - rect.top) / Math.max(rect.height, 1);
      mouseTargetRef.current = [Math.max(0, Math.min(x, 1)), Math.max(0, Math.min(y, 1))];
    };
    container.addEventListener('pointermove', onPointer, { passive: true });

    let rafId = 0, lastFrameTime = 0, acc = 0;
    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      if (!lastFrameTime) lastFrameTime = now;
      const dt = (now - lastFrameTime) * 0.001;
      if (dt < 0.016) return;
      lastFrameTime = now - ((now - lastFrameTime) % 16);

      if (!pausedRef.current) acc += dt;
      const tau = 0.02 + Math.max(0, Math.min(1, hoverDampness)) * 0.5;
      const alpha = 1 - Math.exp(-dt / tau);
      const tgt = mouseTargetRef.current, sm = mouseSmoothRef.current;
      sm[0] += (tgt[0] - sm[0]) * alpha; sm[1] += (tgt[1] - sm[1]) * alpha;
      program.uniforms.uMouse.value = sm;
      program.uniforms.uTime.value = acc;
      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId); ro.disconnect();
      container.removeEventListener('pointermove', onPointer);
      try { container.removeChild(gl.canvas); } catch { /* noop */ }
      programRef.current = null; rendererRef.current = null; gradTexRef.current = null;
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const program = programRef.current, renderer = rendererRef.current, gradTex = gradTexRef.current;
    if (!program || !renderer || !gradTex) return;
    program.uniforms.uIntensity.value = intensity ?? 1;
    program.uniforms.uSpeed.value = speed ?? 1;
    program.uniforms.uAnimType.value = animTypeMap[animationType ?? 'rotate3d'] ?? 1;
    program.uniforms.uDistort.value = typeof distort === 'number' ? distort : 0;
    program.uniforms.uRayCount.value = Math.max(0, Math.floor(rayCount ?? 0));
    let count = 0;
    if (Array.isArray(colors) && colors.length > 0) {
      const gl2 = renderer.gl, capped = colors.slice(0, 64); count = capped.length;
      const data = new Uint8Array(count * 4);
      for (let i = 0; i < count; i++) { const [r, g, b] = hexToRgb01(capped[i]); data[i * 4] = Math.round(r * 255); data[i * 4 + 1] = Math.round(g * 255); data[i * 4 + 2] = Math.round(b * 255); data[i * 4 + 3] = 255; }
      gradTex.image = data; gradTex.width = count; gradTex.height = 1;
      (gradTex as unknown as { needsUpdate: boolean }).needsUpdate = true;
    }
    program.uniforms.uColorCount.value = count;
  }, [intensity, speed, animationType, colors, distort, rayCount]);

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} />;
};
export default PrismaticBurst;
