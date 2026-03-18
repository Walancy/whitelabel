import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

export interface PlasmaProps {
  color?: string;
  speed?: number;
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255] : [1, 0.5, 0.2];
};

const VERT = `#version 300 es
precision highp float;
in vec2 position; in vec2 uv; out vec2 vUv;
void main(){ vUv=uv; gl_Position=vec4(position,0.0,1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 iResolution; uniform float iTime; uniform vec3 uCustomColor;
uniform float uSpeed; uniform float uScale; uniform float uOpacity;
uniform vec2 uMouse; uniform float uMouseInteractive;
out vec4 fragColor;
bool finite1(float x){ return !(isnan(x)||isinf(x)); }
vec3 sanitize(vec3 c){ return vec3(finite1(c.r)?c.r:0.,finite1(c.g)?c.g:0.,finite1(c.b)?c.b:0.); }
void mainImage(out vec4 o, vec2 C){
  vec2 center=iResolution*.5; C=(C-center)/uScale+center;
  vec2 mouseOffset=(uMouse-center)*.0002;
  C+=mouseOffset*length(C-center)*step(0.5,uMouseInteractive);
  float i,d,z,T=iTime*uSpeed;
  vec3 O,p,S;
  for(vec2 r=iResolution,Q;++i<60.;O+=o.w/d*o.xyz){
    p=z*normalize(vec3(C-.5*r,r.y)); p.z-=4.; S=p; d=p.y-T;
    p.x+=.4*(1.+p.y)*sin(d+p.x*0.1)*cos(.34*d+p.x*.05);
    Q=p.xz*=mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+=d=abs(sqrt(length(Q*Q))-.25*(5.+S.y))/3.+8e-4;
    o=1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  o.xyz=tanh(O/1.5e2);
}
void main(){
  vec4 o=vec4(0.0); mainImage(o,gl_FragCoord.xy);
  vec3 rgb=sanitize(o.rgb);
  float intensity=(rgb.r+rgb.g+rgb.b)/3.;
  vec3 finalColor=intensity*uCustomColor;
  fragColor=vec4(finalColor,min(1.0,length(rgb)*3.0)*uOpacity);
}`;

export default function Plasma({
  color = '#ffffff', speed = 1, scale = 1, opacity = 1, mouseInteractive = true,
}: PlasmaProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ref.current;
    if (!ctn) return;
    const renderer = new Renderer({ webgl: 2, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio, 2) } as ConstructorParameters<typeof Renderer>[0]);
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    Object.assign(canvas.style, { display: 'block', width: '100%', height: '100%' });
    ctn.appendChild(canvas);
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT, fragment: FRAG,
      uniforms: {
        iTime: { value: 0 }, iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(hexToRgb(color)) },
        uSpeed: { value: speed * 0.4 }, uScale: { value: scale },
        uOpacity: { value: opacity }, uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: mouseInteractive ? 1 : 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    const setSize = () => {
      const rect = ctn.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height));
      (program.uniforms.iResolution.value as Float32Array).set([canvas.width, canvas.height]);
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(ctn);
    const onMove = (e: MouseEvent) => {
      const m = program.uniforms.uMouse.value as Float32Array;
      const rect = ctn.getBoundingClientRect();
      m[0] = e.clientX - rect.left; m[1] = e.clientY - rect.top;
    };
    if (mouseInteractive) ctn.addEventListener('mousemove', onMove);
    let raf = 0;
    const update = (t: number) => {
      raf = requestAnimationFrame(update);
      program.uniforms.iTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (mouseInteractive) ctn.removeEventListener('mousemove', onMove);
      if (canvas.parentElement === ctn) ctn.removeChild(canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [color, speed, scale, opacity, mouseInteractive]);

  return <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }} />;
}
