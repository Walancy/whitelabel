import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './GridDistortion.css';

const vertex = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragment = /* glsl */`
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
varying vec2 vUv;
void main() {
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, vUv - 0.02 * offset.rg);
}`;

function makeGradientUrl(c1: string, c2: string, c3: string): string {
    if (typeof document === 'undefined') return '';
    const cv = document.createElement('canvas');
    cv.width = cv.height = 512;
    const ctx = cv.getContext('2d');
    if (!ctx) return '';
    const g = ctx.createLinearGradient(0, 0, 512, 512);
    g.addColorStop(0, c1);
    g.addColorStop(0.5, c2);
    g.addColorStop(1, c3);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    return cv.toDataURL('image/jpeg', 0.9);
}

export interface GridDistortionProps {
    imageSrc?: string;
    color1?: string;
    color2?: string;
    color3?: string;
    grid?: number;
    mouse?: number;
    strength?: number;
    relaxation?: number;
}

const SIZE = 15; // fixed data-texture resolution

export default function GridDistortion({
    imageSrc,
    color1 = '#5227FF',
    color2 = '#FF9FFC',
    color3 = '#B19EEF',
    grid = 10,
    mouse = 0.25,
    strength = 0.15,
    relaxation = 0.9,
}: GridDistortionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const uniformsRef = useRef<Record<string, { value: unknown }> | null>(null);
    const paramsRef = useRef({ grid, mouse, strength, relaxation });
    paramsRef.current = { grid, mouse, strength, relaxation };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // ── Renderer ──────────────────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        renderer.domElement.style.cssText =
            'position:absolute;inset:0;width:100%;height:100%;display:block;';

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
        camera.position.z = 2;

        // ── Data texture (distortion grid) ────────────────────────────────────────
        const data = new Float32Array(4 * SIZE * SIZE);
        for (let i = 0; i < SIZE * SIZE; i++) {
            data[i * 4] = (Math.random() - 0.5) * 20;
            data[i * 4 + 1] = (Math.random() - 0.5) * 20;
        }
        const dataTex = new THREE.DataTexture(data, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType);
        dataTex.needsUpdate = true;

        // ── Uniforms ──────────────────────────────────────────────────────────────
        const uniforms: Record<string, { value: unknown }> = {
            uTexture: { value: new THREE.Texture() }, // placeholder
            uDataTexture: { value: dataTex },
        };
        uniformsRef.current = uniforms;

        // ── Load image / gradient ─────────────────────────────────────────────────
        const loadTexture = (src: string) => {
            if (!src) return;
            new THREE.TextureLoader().load(src, (tex) => {
                tex.minFilter = THREE.LinearFilter;
                tex.magFilter = THREE.LinearFilter;
                tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
                const old = uniforms.uTexture.value as THREE.Texture;
                uniforms.uTexture.value = tex;
                if (old && old.image) old.dispose();
            });
        };
        loadTexture(imageSrc ?? makeGradientUrl(color1, color2, color3));

        // ── Mesh ──────────────────────────────────────────────────────────────────
        const geometry = new THREE.PlaneGeometry(1, 1, SIZE - 1, SIZE - 1);
        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: uniforms as THREE.ShaderMaterialParameters['uniforms'],
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true,
        });
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // ── Resize ────────────────────────────────────────────────────────────────
        const resize = () => {
            const { width, height } = container.getBoundingClientRect();
            if (!width || !height) return;
            const aspect = width / height;
            renderer.setSize(width, height);
            plane.scale.set(aspect, 1, 1);
            camera.left = -aspect / 2; camera.right = aspect / 2;
            camera.top = 0.5; camera.bottom = -0.5;
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(container);
        resize();

        // ── Mouse — on window to bypass z-index ───────────────────────────────────
        // Store only the absolute position — velocity is computed per-frame
        const cursor = { x: 0.5, y: 0.5 };
        const prevCursor = { x: 0.5, y: 0.5 };
        const onMove = (e: MouseEvent) => {
            const r = container.getBoundingClientRect();
            cursor.x = (e.clientX - r.left) / r.width;
            cursor.y = 1 - (e.clientY - r.top) / r.height;
        };
        window.addEventListener('mousemove', onMove, { passive: true });

        // ── Animation loop (no FPS cap — matches original) ────────────────────────
        let raf = 0, running = true;

        const animate = () => {
            if (!running) return;
            raf = requestAnimationFrame(animate);

            const { mouse: mRad, strength: str, relaxation: rel } = paramsRef.current;

            // Velocity = position delta since last frame (smooth at any frame rate)
            const vX = cursor.x - prevCursor.x;
            const vY = cursor.y - prevCursor.y;
            prevCursor.x = cursor.x;
            prevCursor.y = cursor.y;

            // Decay distortion toward zero
            for (let i = 0; i < SIZE * SIZE; i++) {
                data[i * 4] *= rel;
                data[i * 4 + 1] *= rel;
            }

            // Add mouse-velocity distortion around cursor
            const gx = SIZE * cursor.x;
            const gy = SIZE * cursor.y;
            const maxDist = SIZE * mRad;

            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    const distSq = (gx - i) ** 2 + (gy - j) ** 2;
                    if (distSq < maxDist * maxDist) {
                        const idx = 4 * (i + SIZE * j);
                        const power = Math.min(maxDist / (Math.sqrt(distSq) || 0.001), 10);
                        data[idx] += str * 100 * vX * power;
                        data[idx + 1] -= str * 100 * vY * power;
                    }
                }
            }

            dataTex.needsUpdate = true;
            renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(animate);

        // ── Cleanup ───────────────────────────────────────────────────────────────
        return () => {
            running = false;
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            ro.disconnect();
            renderer.dispose();
            if (renderer.domElement.parentElement === container) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            dataTex.dispose();
            uniformsRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Reload texture when accent colors change ───────────────────────────────
    useEffect(() => {
        const uniforms = uniformsRef.current;
        if (!uniforms || imageSrc) return;
        const src = makeGradientUrl(color1, color2, color3);
        new THREE.TextureLoader().load(src, (tex) => {
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
            const old = uniforms.uTexture.value as THREE.Texture;
            uniforms.uTexture.value = tex;
            if (old && old.image) old.dispose();
        });
    }, [color1, color2, color3, imageSrc]);

    return <div ref={containerRef} className="grid-distortion-container" />;
}
