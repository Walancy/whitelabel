import { Mesh, Program, Renderer, Triangle, Vec3 } from 'ogl';
import { useEffect, useRef } from 'react';

export interface OrbProps {
  hue?: number;
  hoverIntensity?: number;
  forceHoverState?: boolean;
  rotateOnHover?: boolean;
}

const VERT = `precision highp float; attribute vec2 position; attribute vec2 uv; varying vec2 vUv;
void main(){ vUv=uv; gl_Position=vec4(position,0.0,1.0); }`;

const FRAG = `precision highp float;
uniform float iTime; uniform vec3 iResolution; uniform float hue;
uniform float hover; uniform float rot; uniform float hoverIntensity;
varying vec2 vUv;
vec3 rgb2yiq(vec3 c){return vec3(dot(c,vec3(.299,.587,.114)),dot(c,vec3(.596,-.274,-.322)),dot(c,vec3(.211,-.523,.312)));}
vec3 yiq2rgb(vec3 c){return vec3(c.x+.956*c.y+.621*c.z,c.x-.272*c.y-.647*c.z,c.x-1.106*c.y+1.703*c.z);}
vec3 adjustHue(vec3 color,float hueDeg){float hr=hueDeg*3.14159/180.;vec3 yiq=rgb2yiq(color);float c=cos(hr),s=sin(hr);float i=yiq.y*c-yiq.z*s;float q=yiq.y*s+yiq.z*c;yiq.yz=vec2(i,q);return yiq2rgb(yiq);}
vec3 hash33(vec3 p3){p3=fract(p3*vec3(.1031,.11369,.13787));p3+=dot(p3,p3.yxz+19.19);return -1.+2.*fract(vec3(p3.x+p3.y,p3.x+p3.z,p3.y+p3.z)*p3.zyx);}
float snoise3(vec3 p){const float K1=.333333,K2=.166667;vec3 i=floor(p+(p.x+p.y+p.z)*K1);vec3 d0=p-(i-(i.x+i.y+i.z)*K2);vec3 e=step(vec3(0.),d0-d0.yzx);vec3 i1=e*(1.-e.zxy);vec3 i2=1.-e.zxy*(1.-e);vec3 d1=d0-(i1-K2);vec3 d2=d0-(i2-K1);vec3 d3=d0-.5;vec4 h=max(.6-vec4(dot(d0,d0),dot(d1,d1),dot(d2,d2),dot(d3,d3)),0.);vec4 n=h*h*h*h*vec4(dot(d0,hash33(i)),dot(d1,hash33(i+i1)),dot(d2,hash33(i+i2)),dot(d3,hash33(i+1.)));return dot(vec4(31.316),n);}
vec4 extractAlpha(vec3 c){float a=max(max(c.r,c.g),c.b);return vec4(c/(a+1e-5),a);}
const vec3 bc1=vec3(.611765,.262745,.996078); const vec3 bc2=vec3(.298039,.760784,.913725); const vec3 bc3=vec3(.062745,.078431,.600000);
const float innerRadius=.6; const float noiseScale=.65;
float light1(float i,float a,float d){return i/(1.+d*a);}
float light2(float i,float a,float d){return i/(1.+d*d*a);}
void main(){
  vec2 uv=(vUv*2.-1.)*vec2(iResolution.x/iResolution.y,1.);
  float rotC=cos(rot),rotS=sin(rot);
  uv=vec2(rotC*uv.x-rotS*uv.y,rotS*uv.x+rotC*uv.y);
  vec3 c1=adjustHue(bc1,hue),c2=adjustHue(bc2,hue),c3=adjustHue(bc3,hue);
  float ang=atan(uv.y,uv.x); float len=length(uv); float invLen=len>0.?1./len:0.;
  float n0=snoise3(vec3(uv*noiseScale,iTime*.5))*.5+.5;
  float r0=mix(mix(innerRadius,1.,.4),mix(innerRadius,1.,.6),n0);
  float d0=distance(uv,(r0*invLen)*uv);
  float v0=light1(1.,10.,d0)*smoothstep(r0*1.05,r0,len);
  float cl=cos(ang+iTime*2.)*.5+.5;
  float a=-iTime; vec2 pos=vec2(cos(a),sin(a))*r0; float d=distance(uv,pos);
  float v1=light2(1.5,5.,d)*light1(1.,50.,d0);
  float v2=smoothstep(1.,mix(innerRadius,1.,n0*.5),len);
  float v3=smoothstep(innerRadius,mix(innerRadius,1.,.5),len);
  vec3 colBase=mix(c1,c2,cl);
  vec4 col1=extractAlpha(colBase*v0);
  vec4 col2=extractAlpha(c3*v1);
  vec4 col3=extractAlpha(mix(c2,c3,.5)*v2);
  vec4 col4=extractAlpha(mix(c1,c2,.5)*v3);
  float hv=hover*hoverIntensity*3.;
  vec4 result=col1+col2*hv+col3+col4;
  gl_FragColor=result;
}`;

export default function Orb({ hue = 0, hoverIntensity = 0.2, forceHoverState = false, rotateOnHover = true }: OrbProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ref.current;
    if (!ctn) return;
    const renderer = new Renderer({ antialias: true, alpha: true });
    const gl = renderer.gl;
    Object.assign((gl.canvas as HTMLCanvasElement).style, { width: '100%', height: '100%' });
    ctn.appendChild(gl.canvas as HTMLCanvasElement);
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT, fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(ctn.offsetWidth, ctn.offsetHeight, 1) },
        hue: { value: hue }, hover: { value: forceHoverState ? 1 : 0 },
        rot: { value: 0 }, hoverIntensity: { value: hoverIntensity },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    const resize = () => {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      const r = program.uniforms.iResolution.value as Vec3;
      r.x = ctn.offsetWidth; r.y = ctn.offsetHeight;
    };
    const ro = new ResizeObserver(resize); ro.observe(ctn); resize();
    let isHovered = false;
    const onEnter = () => { isHovered = true; };
    const onLeave = () => { isHovered = false; };
    ctn.addEventListener('mouseenter', onEnter);
    ctn.addEventListener('mouseleave', onLeave);
    let raf = 0;
    const update = (t: number) => {
      raf = requestAnimationFrame(update);
      program.uniforms.iTime.value = t * 0.001;
      program.uniforms.hover.value = (isHovered || forceHoverState) ? 1 : 0;
      const shouldRotate = rotateOnHover ? (isHovered || forceHoverState) : true;
      program.uniforms.rot.value = shouldRotate ? t * 0.001 * 0.5 : program.uniforms.rot.value;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      ctn.removeEventListener('mouseenter', onEnter);
      ctn.removeEventListener('mouseleave', onLeave);
      if ((gl.canvas as HTMLCanvasElement).parentElement === ctn) ctn.removeChild(gl.canvas as HTMLCanvasElement);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [hue, hoverIntensity, forceHoverState, rotateOnHover]);

  return <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }} />;
}
