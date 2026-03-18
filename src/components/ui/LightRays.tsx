import { useRef, useEffect, useState } from 'react';
import { Renderer, Program, Triangle, Mesh } from 'ogl';

type Origin = 'top-center'|'top-left'|'top-right'|'left'|'right'|'bottom-left'|'bottom-center'|'bottom-right';

interface LightRaysProps {
  raysOrigin?: Origin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

const hexToRgb = (h: string): [number,number,number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  return m ? [parseInt(m[1],16)/255,parseInt(m[2],16)/255,parseInt(m[3],16)/255] : [1,1,1];
};

const getAnchorAndDir = (origin: Origin, w: number, h: number) => {
  const o = 0.2;
  const m: Record<Origin, { anchor: number[]; dir: number[] }> = {
    'top-left': { anchor:[0,-o*h], dir:[0,1] },
    'top-right': { anchor:[w,-o*h], dir:[0,1] },
    'left': { anchor:[-o*w,0.5*h], dir:[1,0] },
    'right': { anchor:[(1+o)*w,0.5*h], dir:[-1,0] },
    'bottom-left': { anchor:[0,(1+o)*h], dir:[0,-1] },
    'bottom-center': { anchor:[0.5*w,(1+o)*h], dir:[0,-1] },
    'bottom-right': { anchor:[w,(1+o)*h], dir:[0,-1] },
    'top-center': { anchor:[0.5*w,-o*h], dir:[0,1] },
  };
  return m[origin] ?? m['top-center'];
};

const vert = `attribute vec2 position; varying vec2 vUv; void main(){ vUv=position*0.5+0.5; gl_Position=vec4(position,0,1); }`;
const frag = `precision highp float;
uniform float iTime; uniform vec2 iResolution; uniform vec2 rayPos; uniform vec2 rayDir;
uniform vec3 raysColor; uniform float raysSpeed; uniform float lightSpread; uniform float rayLength;
uniform float pulsating; uniform float fadeDistance; uniform float saturation;
uniform vec2 mousePos; uniform float mouseInfluence; uniform float noiseAmount; uniform float distortion;
float noise(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
float rayStrength(vec2 src,vec2 dir,vec2 coord,float sA,float sB,float spd){
  vec2 s2c=coord-src; vec2 dn=normalize(s2c);
  float ca=dot(dn,dir)+distortion*sin(iTime*2.0+length(s2c)*0.01)*0.2;
  float sp=pow(max(ca,0.0),1.0/max(lightSpread,0.001));
  float dist=length(s2c); float maxD=iResolution.x*rayLength;
  float lf=clamp((maxD-dist)/maxD,0.0,1.0);
  float ff=clamp((iResolution.x*fadeDistance-dist)/(iResolution.x*fadeDistance),0.5,1.0);
  float pulse=pulsating>0.5?(0.8+0.2*sin(iTime*spd*3.0)):1.0;
  float bs=clamp((0.45+0.15*sin(ca*sA+iTime*spd))+(0.3+0.2*cos(-ca*sB+iTime*spd)),0.0,1.0);
  return bs*lf*ff*sp*pulse;
}
void mainImage(out vec4 fc, in vec2 fco){
  vec2 coord=vec2(fco.x,iResolution.y-fco.y);
  vec2 frd=rayDir;
  if(mouseInfluence>0.0){vec2 mp=mousePos*iResolution.xy;frd=normalize(mix(rayDir,normalize(mp-rayPos),mouseInfluence));}
  vec4 r1=vec4(1.0)*rayStrength(rayPos,frd,coord,36.2214,21.11349,1.5*raysSpeed);
  vec4 r2=vec4(1.0)*rayStrength(rayPos,frd,coord,22.3991,18.0234,1.1*raysSpeed);
  fc=r1*0.5+r2*0.4;
  if(noiseAmount>0.0){float n=noise(coord*0.01+iTime*0.1);fc.rgb*=(1.0-noiseAmount+noiseAmount*n);}
  float br=1.0-(coord.y/iResolution.y);
  fc.x*=0.1+br*0.8; fc.y*=0.3+br*0.6; fc.z*=0.5+br*0.5;
  if(saturation!=1.0){float g=dot(fc.rgb,vec3(0.299,0.587,0.114));fc.rgb=mix(vec3(g),fc.rgb,saturation);}
  fc.rgb*=raysColor;
}
void main(){ vec4 c; mainImage(c,gl_FragCoord.xy); gl_FragColor=c; }`;

const LightRays = ({
  raysOrigin='top-center', raysColor='#ffffff', raysSpeed=1, lightSpread=1,
  rayLength=2, pulsating=false, fadeDistance=1, saturation=1, followMouse=true,
  mouseInfluence=0.1, noiseAmount=0, distortion=0, className=''
}: LightRaysProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<Record<string,{value:unknown}>>({});
  const rendererRef = useRef<Renderer|null>(null);
  const mouseRef = useRef({x:0.5,y:0.5}), smoothMouseRef = useRef({x:0.5,y:0.5});
  const rafRef = useRef<number|null>(null);
  const cleanup = useRef<(()=>void)|null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold:0.1 });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !containerRef.current) return;
    cleanup.current?.(); cleanup.current = null;
    const container = containerRef.current;
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    Object.assign((gl.canvas as HTMLElement).style, { width:'100%', height:'100%' });
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(gl.canvas as Node);
    const uniforms: Record<string,{value:unknown}> = {
      iTime:{value:0}, iResolution:{value:[1,1]}, rayPos:{value:[0,0]}, rayDir:{value:[0,1]},
      raysColor:{value:hexToRgb(raysColor)}, raysSpeed:{value:raysSpeed}, lightSpread:{value:lightSpread},
      rayLength:{value:rayLength}, pulsating:{value:pulsating?1:0}, fadeDistance:{value:fadeDistance},
      saturation:{value:saturation}, mousePos:{value:[0.5,0.5]}, mouseInfluence:{value:mouseInfluence},
      noiseAmount:{value:noiseAmount}, distortion:{value:distortion}
    };
    uniformsRef.current = uniforms;
    const program = new Program(gl, { vertex:vert, fragment:frag, uniforms });
    const mesh = new Mesh(gl, { geometry:new Triangle(gl), program });
    const updatePlacement = () => {
      renderer.dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setSize(container.clientWidth, container.clientHeight);
      const w=gl.drawingBufferWidth, h=gl.drawingBufferHeight;
      uniforms.iResolution.value = [w, h];
      const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h);
      uniforms.rayPos.value = anchor; uniforms.rayDir.value = dir;
    };
    const loop = (t: number) => {
      uniforms.iTime.value = t * 0.001;
      if (followMouse && mouseInfluence > 0) {
        smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.08;
        smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.08;
        uniforms.mousePos.value = [smoothMouseRef.current.x, smoothMouseRef.current.y];
      }
      renderer.render({ scene: mesh }); rafRef.current = requestAnimationFrame(loop);
    };
    window.addEventListener('resize', updatePlacement); updatePlacement();
    rafRef.current = requestAnimationFrame(loop);
    cleanup.current = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', updatePlacement);
      try { gl.getExtension('WEBGL_lose_context')?.loseContext(); (gl.canvas as HTMLElement).remove?.(); } catch { /* noop */ }
      rendererRef.current = null;
    };
    return () => { cleanup.current?.(); cleanup.current = null; };
  }, [visible, raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, pulsating, fadeDistance, saturation, followMouse, mouseInfluence, noiseAmount, distortion]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      mouseRef.current = { x:(e.clientX-r.left)/r.width, y:(e.clientY-r.top)/r.height };
    };
    if (followMouse) { window.addEventListener('mousemove', onMove); return () => window.removeEventListener('mousemove', onMove); }
  }, [followMouse]);

  return <div ref={containerRef} className={className} style={{ position:'absolute',inset:0,overflow:'hidden' }} />;
};
export default LightRays;
