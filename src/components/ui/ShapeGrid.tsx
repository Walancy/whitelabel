import { useRef, useEffect } from 'react';

interface ShapeGridProps {
  direction?: 'right' | 'left' | 'up' | 'down' | 'diagonal';
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  shape?: 'square' | 'circle' | 'hexagon' | 'triangle';
  hoverTrailAmount?: number;
  className?: string;
}

const ShapeGrid = ({
  direction = 'right', speed = 1, borderColor = '#999',
  squareSize = 40, hoverFillColor = '#222',
  shape = 'square', hoverTrailAmount = 0, className = ''
}: ShapeGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquare = useRef<{ x: number; y: number } | null>(null);
  const trailCells = useRef<{ x: number; y: number }[]>([]);
  const cellOpacities = useRef(new Map<string, number>());

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const isHex = shape === 'hexagon';
    const isTri = shape === 'triangle';
    const hexH = squareSize * 1.5;
    const hexV = squareSize * Math.sqrt(3);

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const drawHex = (cx: number, cy: number, s: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        i === 0 ? ctx.moveTo(cx + s * Math.cos(a), cy + s * Math.sin(a))
                : ctx.lineTo(cx + s * Math.cos(a), cy + s * Math.sin(a));
      }
      ctx.closePath();
    };
    const drawCircle = (cx: number, cy: number, s: number) => {
      ctx.beginPath(); ctx.arc(cx, cy, s / 2, 0, Math.PI * 2); ctx.closePath();
    };
    const drawTri = (cx: number, cy: number, s: number, flip: boolean) => {
      ctx.beginPath();
      if (flip) { ctx.moveTo(cx, cy + s / 2); ctx.lineTo(cx + s / 2, cy - s / 2); ctx.lineTo(cx - s / 2, cy - s / 2); }
      else       { ctx.moveTo(cx, cy - s / 2); ctx.lineTo(cx + s / 2, cy + s / 2); ctx.lineTo(cx - s / 2, cy + s / 2); }
      ctx.closePath();
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const offX = ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
      const offY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize;
      const cols = Math.ceil(canvas.width / squareSize) + 3;
      const rows = Math.ceil(canvas.height / squareSize) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const key = `${col},${row}`;
          const alpha = cellOpacities.current.get(key);
          let cx: number, cy: number;
          if (isHex) {
            const hOffX = ((gridOffset.current.x % hexH) + hexH) % hexH;
            const hOffY = ((gridOffset.current.y % hexV) + hexV) % hexV;
            cx = col * hexH + hOffX; cy = row * hexV + ((col) % 2 !== 0 ? hexV / 2 : 0) + hOffY;
            if (alpha) { ctx.globalAlpha = alpha; drawHex(cx, cy, squareSize); ctx.fillStyle = hoverFillColor; ctx.fill(); ctx.globalAlpha = 1; }
            drawHex(cx, cy, squareSize); ctx.strokeStyle = borderColor; ctx.stroke();
          } else if (shape === 'circle') {
            cx = col * squareSize + squareSize / 2 + offX; cy = row * squareSize + squareSize / 2 + offY;
            if (alpha) { ctx.globalAlpha = alpha; drawCircle(cx, cy, squareSize); ctx.fillStyle = hoverFillColor; ctx.fill(); ctx.globalAlpha = 1; }
            drawCircle(cx, cy, squareSize); ctx.strokeStyle = borderColor; ctx.stroke();
          } else if (isTri) {
            const hw = squareSize / 2;
            const tOffX = ((gridOffset.current.x % hw) + hw) % hw;
            const tOffY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize;
            cx = col * hw + tOffX; cy = row * squareSize + squareSize / 2 + tOffY;
            const flip = ((col + row) % 2 + 2) % 2 !== 0;
            if (alpha) { ctx.globalAlpha = alpha; drawTri(cx, cy, squareSize, flip); ctx.fillStyle = hoverFillColor; ctx.fill(); ctx.globalAlpha = 1; }
            drawTri(cx, cy, squareSize, flip); ctx.strokeStyle = borderColor; ctx.stroke();
          } else {
            cx = col * squareSize + offX; cy = row * squareSize + offY;
            if (alpha) { ctx.globalAlpha = alpha; ctx.fillStyle = hoverFillColor; ctx.fillRect(cx, cy, squareSize, squareSize); ctx.globalAlpha = 1; }
            ctx.strokeStyle = borderColor; ctx.strokeRect(cx, cy, squareSize, squareSize);
          }
        }
      }
    };

    const updateCellOpacities = () => {
      const targets = new Map<string, number>();
      if (hoveredSquare.current) targets.set(`${hoveredSquare.current.x},${hoveredSquare.current.y}`, 1);
      if (hoverTrailAmount > 0) {
        trailCells.current.forEach((t, i) => {
          const k = `${t.x},${t.y}`;
          if (!targets.has(k)) targets.set(k, (trailCells.current.length - i) / (trailCells.current.length + 1));
        });
      }
      for (const [key] of targets) { if (!cellOpacities.current.has(key)) cellOpacities.current.set(key, 0); }
      for (const [key, o] of cellOpacities.current) {
        const tgt = targets.get(key) || 0;
        const next = o + (tgt - o) * 0.15;
        if (next < 0.005) cellOpacities.current.delete(key);
        else cellOpacities.current.set(key, next);
      }
    };

    const animate = () => {
      const sp = Math.max(speed, 0.1);
      const wX = squareSize; const wY = squareSize;
      if (direction === 'right') gridOffset.current.x = (gridOffset.current.x - sp + wX) % wX;
      else if (direction === 'left') gridOffset.current.x = (gridOffset.current.x + sp + wX) % wX;
      else if (direction === 'up') gridOffset.current.y = (gridOffset.current.y + sp + wY) % wY;
      else if (direction === 'down') gridOffset.current.y = (gridOffset.current.y - sp + wY) % wY;
      else { gridOffset.current.x = (gridOffset.current.x - sp + wX) % wX; gridOffset.current.y = (gridOffset.current.y - sp + wY) % wY; }
      updateCellOpacities(); drawGrid();
      raf.current = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const offX = ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
      const offY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize;
      const col = Math.floor((mx - offX) / squareSize);
      const row = Math.floor((my - offY) / squareSize);
      if (!hoveredSquare.current || hoveredSquare.current.x !== col || hoveredSquare.current.y !== row) {
        if (hoveredSquare.current && hoverTrailAmount > 0) { trailCells.current.unshift({ ...hoveredSquare.current }); if (trailCells.current.length > hoverTrailAmount) trailCells.current.length = hoverTrailAmount; }
        hoveredSquare.current = { x: col, y: row };
      }
    };
    const onLeave = () => { hoveredSquare.current = null; };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf.current);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize, shape, hoverTrailAmount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
};

export default ShapeGrid;
