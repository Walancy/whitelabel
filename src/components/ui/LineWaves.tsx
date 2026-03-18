import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

interface LineWavesProps {
  speed?: number;
  innerLineCount?: number;
  outerLineCount?: number;
  warpIntensity?: number;
  rotation?: number;
  edgeFadeWidth?: number;
  colorCycleSpeed?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
}

const hexToVec3 = (hex: string): [number,number,number] => {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255];
};

const vert = `attribute vec2 uv; attribute vec2 position; varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,0,1); }`;

const frag = `precision highp float;
#define HALF_PI 1.5707963
uniform float uTime; uniform vec3 uResolution; uniform float uSpeed; uniform float uInnerLines; uniform float uOuterLines;
uniform float uWarpIntensity; uniform float uRotation; uniform float uEdgeFadeWidth; uniform float uColorCycleSpeed;
uniform float uBrightness; uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3;
uniform vec2 uMouse; uniform float uMouseInfluence; uniform bool uEnableMouse;
float hashF(float n){return fract(sin(n*127.1)*43758.5453123);}
float smoothNoise(float x){float i=floor(x);float f=fract(x);float u=f*f*(3.0-2.0*f);return mix(hashF(i),hashF(i+1.0),u);}
float displaceA(float c,float t){return sin(c*2.123)*0.2+sin(c*3.234+t*4.345)*0.1+sin(c*0.589+t*0.934)*0.5;}
float displaceB(float c,float t){return sin(c*1.345)*0.3+sin(c*2.734+t*3.345)*0.2+sin(c*0.189+t*0.934)*0.3;}
vec2 rotate2D(vec2 p,float a){float c=cos(a),s=sin(a);return vec2(p.x*c-p.y*s,p.x*s+p.y*c);}
void main(){
  vec2 co=gl_FragCoord.xy/uResolution.xy*2.0-1.0;
  co=rotate2D(co,uRotation);
  float halfT=uTime*uSpeed*0.5,fullT=uTime*uSpeed;
  float mw=0.0;
  if(uEnableMouse){vec2 mp=rotate2D(uMouse*2.0-1.0,uRotation);float md=length(co-mp);mw=uMouseInfluence*exp(-md*md*4.0);}
  float wax=co.x+displaceA(co.y,halfT)*uWarpIntensity+mw,way=co.y-displaceA(co.x*cos(fullT)*1.235,halfT)*uWarpIntensity;
  float wbx=co.x+displaceB(co.y,halfT)*uWarpIntensity+mw,wby=co.y-displaceB(co.x*sin(fullT)*1.235,halfT)*uWarpIntensity;
  vec2 fa=vec2(wax,way),fb=vec2(wbx,wby);
  vec2 bl=mix(fa,fb,mix(fa,fb,0.5));
  float fadeT=smoothstep(uEdgeFadeWidth,uEdgeFadeWidth+0.4,bl.y);
  float fadeB=smoothstep(-uEdgeFadeWidth,-(uEdgeFadeWidth+0.4),bl.y);
  float vMask=1.0-max(fadeT,fadeB);
  float tc=mix(uOuterLines,uInnerLines,vMask),sy=bl.y*tc;
  float nY=smoothNoise(abs(sy));
  float ridge=pow(step(abs(nY-bl.x)*2.0,HALF_PI)*cos(2.0*(nY-bl.x)),5.0);
  float lines=0.0;
  for(float i=1.0;i<3.0;i+=1.0)lines+=pow(max(fract(sy),fract(-sy)),i*2.0);
  float pat=vMask*lines,cyc=fullT*uColorCycleSpeed;
  float r=(pat+lines*ridge)*(cos(bl.y+cyc*0.234)*0.5+1.0);
  float g=(pat+vMask*ridge)*(sin(bl.x+cyc*1.745)*0.5+1.0);
  float b=(pat+lines*ridge)*(cos(bl.x+cyc*0.534)*0.5+1.0);
  vec3 col=(r*uColor1+g*uColor2+b*uColor3)*uBrightness;
  gl_FragColor=vec4(col,clamp(length(col),0.0,1.0));
}`;

export default function LineWaves({
  speed=0.3, innerLineCount=32, outerLineCount=36, warpIntensity=1, rotation=-45,
  edgeFadeWidth=0, colorCycleSpeed=1, brightness=0.2,
  color1='#ffffff', color2='#ffffff', color3='#ffffff',
  enableMouseInteraction=true, mouseInfluence=2
}: LineWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current; if (!container) return;
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0,0,0,0);
    let currentMouse = [0.5,0.5], targetMouse = [0.5,0.5];

    const onMove = (e: MouseEvent) => {
      const rect = (gl.canvas as HTMLCanvasElement).getBoundingClientRect();
      targetMouse = [(e.clientX-rect.left)/rect.width, 1-(e.clientY-rect.top)/rect.height];
    };
    const onLeave = () => { targetMouse = [0.5,0.5]; };

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      if (program) program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height, gl.canvas.width/gl.canvas.height];
    };
    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    const rotRad = (rotation*Math.PI)/180;
    const program = new Program(gl, {
      vertex: vert, fragment: frag,
      uniforms: {
        uTime:{value:0},
        uResolution:{value:[gl.canvas.width,gl.canvas.height,gl.canvas.width/gl.canvas.height]},
        uSpeed:{value:speed}, uInnerLines:{value:innerLineCount}, uOuterLines:{value:outerLineCount},
        uWarpIntensity:{value:warpIntensity}, uRotation:{value:rotRad},
        uEdgeFadeWidth:{value:edgeFadeWidth}, uColorCycleSpeed:{value:colorCycleSpeed},
        uBrightness:{value:brightness}, uColor1:{value:hexToVec3(color1)},
        uColor2:{value:hexToVec3(color2)}, uColor3:{value:hexToVec3(color3)},
        uMouse:{value:new Float32Array([0.5,0.5])}, uMouseInfluence:{value:mouseInfluence},
        uEnableMouse:{value:enableMouseInteraction}
      }
    });
    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas as HTMLElement);
    Object.assign((gl.canvas as HTMLElement).style, { position:'absolute',inset:'0',width:'100%',height:'100%' });
    if (enableMouseInteraction) {
      (gl.canvas as HTMLElement).addEventListener('mousemove', onMove);
      (gl.canvas as HTMLElement).addEventListener('mouseleave', onLeave);
    }
    resize();

    let rafId: number;
    const update = (t: number) => {
      rafId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      if (enableMouseInteraction) {
        currentMouse[0] += 0.05*(targetMouse[0]-currentMouse[0]);
        currentMouse[1] += 0.05*(targetMouse[1]-currentMouse[1]);
        (program.uniforms.uMouse.value as Float32Array)[0] = currentMouse[0];
        (program.uniforms.uMouse.value as Float32Array)[1] = currentMouse[1];
      }
      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId); window.removeEventListener('resize', resize);
      if (enableMouseInteraction) {
        (gl.canvas as HTMLElement).removeEventListener('mousemove', onMove);
        (gl.canvas as HTMLElement).removeEventListener('mouseleave', onLeave);
      }
      if (container.contains(gl.canvas as Node)) container.removeChild(gl.canvas as Node);
    };
  }, [speed,innerLineCount,outerLineCount,warpIntensity,rotation,edgeFadeWidth,colorCycleSpeed,brightness,color1,color2,color3,enableMouseInteraction,mouseInfluence]);

  return <div ref={containerRef} style={{ position:'absolute',inset:0,overflow:'hidden' }} />;
}
