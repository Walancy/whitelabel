import { Renderer, Program, Mesh, Color as OGLColor, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

export interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  speed?: number;
}

const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform float uTime; uniform float uAmplitude; uniform vec3 uColorStops[3];
uniform vec2 uResolution; uniform float uBlend;
out vec4 fragColor;
vec3 permute(vec3 x){ return mod(((x*34.)+1.)*x,289.); }
float snoise(vec2 v){
  const vec4 C=vec4(.211325,.366025,-.577350,.024390);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1,0):vec2(0,1);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod(i,289.);
  vec3 p=permute(permute(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m; m=m*m;
  vec3 x=2.*fract(p*C.www)-1.; vec3 h=abs(x)-.5; vec3 ox=floor(x+.5); vec3 a0=x-ox;
  m*=1.79284-.85373*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}
struct ColorStop { vec3 color; float position; };
#define COLOR_RAMP(colors,factor,finalColor) { int idx=0; for(int i=0;i<2;i++){ bool b=colors[i].position<=factor; idx=int(mix(float(idx),float(i),float(b))); } ColorStop cur=colors[idx]; ColorStop nxt=colors[idx+1]; float range=nxt.position-cur.position; float lf=(factor-cur.position)/range; finalColor=mix(cur.color,nxt.color,lf); }
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution;
  ColorStop colors[3];
  colors[0]=ColorStop(uColorStops[0],0.0);
  colors[1]=ColorStop(uColorStops[1],0.5);
  colors[2]=ColorStop(uColorStops[2],1.0);
  vec3 rampColor; COLOR_RAMP(colors,uv.x,rampColor);
  float height=snoise(vec2(uv.x*2.+uTime*.1,uTime*.25))*.5*uAmplitude;
  height=exp(height); height=(uv.y*2.-height+0.2);
  float intensity=0.6*height;
  float midPoint=0.20;
  float auroraAlpha=smoothstep(midPoint-uBlend*.5,midPoint+uBlend*.5,intensity);
  vec3 auroraColor=intensity*rampColor;
  fragColor=vec4(auroraColor*auroraAlpha,auroraAlpha);
}`;

export default function Aurora({
  colorStops = ['#5227FF', '#7cff67', '#5227FF'],
  amplitude = 1.0, blend = 0.5, speed = 1.0,
}: AuroraProps) {
  const ref = useRef<HTMLDivElement>(null);
  const propsRef = useRef({ colorStops, amplitude, blend, speed });
  propsRef.current = { colorStops, amplitude, blend, speed };

  useEffect(() => {
    const ctn = ref.current;
    if (!ctn) return;
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    let program: ReturnType<typeof Program.prototype.constructor> | null = null;
    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete (geometry.attributes as Record<string, unknown>).uv;
    const toStops = (stops: string[]) => stops.map(hex => { const c = new OGLColor(hex); return [c.r, c.g, c.b]; });
    program = new Program(gl, {
      vertex: VERT, fragment: FRAG,
      uniforms: {
        uTime: { value: 0 }, uAmplitude: { value: amplitude },
        uColorStops: { value: toStops(colorStops) },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas as HTMLCanvasElement);
    const resize = () => { renderer.setSize(ctn.offsetWidth, ctn.offsetHeight); (program!.uniforms.uResolution.value as number[]).splice(0, 2, ctn.offsetWidth, ctn.offsetHeight); };
    window.addEventListener('resize', resize); resize();
    let raf = 0;
    const update = (t: number) => {
      raf = requestAnimationFrame(update);
      const p = propsRef.current;
      program!.uniforms.uTime.value = t * 0.01 * p.speed * 0.1;
      program!.uniforms.uAmplitude.value = p.amplitude;
      program!.uniforms.uBlend.value = p.blend;
      program!.uniforms.uColorStops.value = toStops(p.colorStops);
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      if ((gl.canvas as HTMLCanvasElement).parentElement === ctn) ctn.removeChild(gl.canvas as HTMLCanvasElement);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }} />;
}
