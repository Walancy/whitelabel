import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

interface LiquidEtherProps {
  colors?: string[];
  mouseForce?: number;
  cursorSize?: number;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  resolution?: number;
}

const hexToVec3 = (hex: string): [number,number,number] => {
  const h = hex.replace('#','');
  return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255];
};

const VERT = `attribute vec2 position; attribute vec2 uv; varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,0.0,1.0); }`;

const FRAG = `precision highp float;
uniform float uTime; uniform vec3 uResolution;
uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3;
uniform float uIntensity; uniform float uSpeed;
uniform vec2 uMouse; varying vec2 vUv;

float noise(vec2 p){
  vec2 i=floor(p); vec2 f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),u.x),
             mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),u.x),u.y);
}

vec3 liquidColor(vec2 uv, float t){
  float n1=noise(uv*2.5+vec2(t*0.3,-t*0.2));
  float n2=noise(uv*1.8+vec2(-t*0.25,t*0.35)+3.7);
  float n3=noise(uv*3.2+vec2(t*0.18,t*0.28)+7.3);
  float blend1=smoothstep(0.3,0.7,n1);
  float blend2=smoothstep(0.25,0.75,n2)*0.7;
  float blend3=smoothstep(0.35,0.65,n3)*0.5;
  vec3 c=mix(uColor1,uColor2,blend1);
  c=mix(c,uColor3,blend2);
  c=mix(c,uColor1,blend3*0.4);
  return c;
}

void main(){
  vec2 uv=vUv*2.-1.;
  uv.x*=uResolution.x/uResolution.y;
  vec2 mouseInfluence=(uMouse*2.-1.)*vec2(uResolution.x/uResolution.y,1.)-uv;
  float mDist=length(mouseInfluence);
  float t=uTime*uSpeed;
  uv+=mouseInfluence*0.08*exp(-mDist*1.5);
  uv*=1.+0.05*sin(t*0.3+length(uv)*2.);
  vec3 col=liquidColor(uv,t);
  float luma=dot(col,vec3(0.299,0.587,0.114));
  col=mix(col,col*1.4,smoothstep(0.3,0.7,luma));
  col*=uIntensity;
  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}`;

export default function LiquidEther({
  colors=['#5227FF','#FF9FFC','#B19EEF'],
  autoSpeed=0.5, autoIntensity=2.2, resolution=0.5,
}: LiquidEtherProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ref.current; if (!ctn) return;
    const renderer = new Renderer({ antialias:true, alpha:true, dpr:Math.min(window.devicePixelRatio,2)*resolution });
    const gl = renderer.gl;
    gl.clearColor(0,0,0,0);
    const [c1,c2,c3] = [(colors[0]||'#5227FF'),(colors[1]||'#FF9FFC'),(colors[2]||'#B19EEF')];
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex:VERT, fragment:FRAG,
      uniforms: {
        uTime:{value:0},
        uResolution:{value:new Float32Array([gl.canvas.width,gl.canvas.height,gl.canvas.width/gl.canvas.height])},
        uColor1:{value:hexToVec3(c1)},
        uColor2:{value:hexToVec3(c2)},
        uColor3:{value:hexToVec3(c3)},
        uIntensity:{value:autoIntensity*0.4},
        uSpeed:{value:autoSpeed},
        uMouse:{value:new Float32Array([0.5,0.5])},
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    const resize = () => {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      const r = program.uniforms.uResolution.value as Float32Array;
      r[0]=gl.canvas.width; r[1]=gl.canvas.height; r[2]=gl.canvas.width/gl.canvas.height;
    };
    window.addEventListener('resize', resize); resize();
    const onMove = (e: MouseEvent) => {
      const rect=ctn.getBoundingClientRect();
      const m=program.uniforms.uMouse.value as Float32Array;
      m[0]=(e.clientX-rect.left)/rect.width; m[1]=1-(e.clientY-rect.top)/rect.height;
    };
    ctn.addEventListener('mousemove', onMove);
    ctn.appendChild(gl.canvas as HTMLCanvasElement);
    Object.assign((gl.canvas as HTMLElement).style, { position:'absolute',inset:0,width:'100%',height:'100%' });
    let raf=0;
    const update=(t:number)=>{ raf=requestAnimationFrame(update); program.uniforms.uTime.value=t*0.001; renderer.render({scene:mesh}); };
    raf=requestAnimationFrame(update);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',resize); ctn.removeEventListener('mousemove',onMove); try{ctn.removeChild(gl.canvas as HTMLCanvasElement);}catch{/**/} gl.getExtension('WEBGL_lose_context')?.loseContext(); };
  }, [colors, autoSpeed, autoIntensity, resolution]);

  return <div ref={ref} style={{ position:'relative',width:'100%',height:'100%',overflow:'hidden',background:'transparent' }} />;
}
