import { Renderer, Program, Mesh, Color as OGLColor, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import './Iridescence.css';

const VERT = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0, 1); }
`;

const FRAG = `
precision highp float;
uniform float uTime; uniform vec3 uColor; uniform vec3 uResolution;
uniform vec2 uMouse; uniform float uAmplitude; uniform float uSpeed;
varying vec2 vUv;
void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
  uv += (uMouse - vec2(0.5)) * uAmplitude;
  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

export interface IridescenceProps {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
  className?: string;
}

export default function Iridescence({
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  className,
}: IridescenceProps) {
  const ctnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnRef.current;
    if (!ctn) return;

    const renderer = new Renderer();
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    const mousePos = { x: 0.5, y: 0.5 };

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new OGLColor(...color) },
        uResolution: { value: new OGLColor(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
        uMouse: { value: new Float32Array([mousePos.x, mousePos.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const s = 1;
      renderer.setSize(ctn.offsetWidth * s, ctn.offsetHeight * s);
      (program.uniforms.uResolution.value as OGLColor).r = gl.canvas.width;
      (program.uniforms.uResolution.value as OGLColor).g = gl.canvas.height;
    };
    window.addEventListener('resize', resize);
    resize();

    ctn.appendChild(gl.canvas as HTMLCanvasElement);

    let animId = 0;
    const update = (t: number) => {
      animId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };
    animId = requestAnimationFrame(update);

    const handleMove = (e: MouseEvent) => {
      const rect = ctn.getBoundingClientRect();
      (program.uniforms.uMouse.value as Float32Array)[0] = (e.clientX - rect.left) / rect.width;
      (program.uniforms.uMouse.value as Float32Array)[1] = 1 - (e.clientY - rect.top) / rect.height;
    };
    if (mouseReact) ctn.addEventListener('mousemove', handleMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (mouseReact) ctn.removeEventListener('mousemove', handleMove);
      if ((gl.canvas as HTMLCanvasElement).parentElement === ctn) ctn.removeChild(gl.canvas as HTMLCanvasElement);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [color, speed, amplitude, mouseReact]);

  return <div ref={ctnRef} className={['iridescence-container', className].filter(Boolean).join(' ')} />;
}
