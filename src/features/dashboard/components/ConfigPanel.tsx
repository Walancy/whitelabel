import { X, Settings2, GripHorizontal } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import type { DashboardTheme } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  theme: DashboardTheme;
  setTheme: (t: Partial<DashboardTheme>) => void;
}

const Slider = ({ label, value, min, max, unit = 'px', onChange }: { label: string, value: number, min: number, max: number, unit?: string, onChange: (v: number) => void }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <label className="text-[12px] font-semibold text-foreground">{label}</label>
      <span className="text-[11px] font-medium text-muted-foreground bg-accent px-1.5 py-0.5 rounded">
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
    />
  </div>
);

export function ConfigPanel({ open, onClose, theme, setTheme }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posStartX: 0, posStartY: 0 });

  useEffect(() => {
    setPos({ x: window.innerWidth - 350, y: 80 });
  }, []);

  if (!open) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, posStartX: pos.x, posStartY: pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPos({
      x: dragStart.current.posStartX + (e.clientX - dragStart.current.x),
      y: dragStart.current.posStartY + (e.clientY - dragStart.current.y),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className="fixed z-[110] w-[300px] flex flex-col bg-card border border-border rounded-xl shadow-2xl overflow-hidden touch-none"
      style={{
        left: pos.x,
        top: pos.y,
      }}
    >
      <div 
        className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0 bg-muted/30 cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-start gap-2">
          <GripHorizontal size={14} className="text-muted-foreground mt-0.5" />
          <div className="flex flex-col">
            <h2 className="text-[13px] font-semibold text-foreground flex items-center gap-1.5 pointer-events-none">
              <Settings2 size={14} className="text-primary" /> Ajustes Visuais
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5 pointer-events-none">Estilize o seu dashboard</p>
          </div>
        </div>
        <button onPointerDown={e => e.stopPropagation()} onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto scrollbar-stylized p-4 flex flex-col gap-6">
        <Slider label="Espaçamento (Gap)" value={theme.gap} min={0} max={60} onChange={v => setTheme({ gap: v })} />
        <Slider label="Padding Interno" value={theme.padding} min={0} max={60} onChange={v => setTheme({ padding: v })} />
        <Slider label="Arredondamento (Radius)" value={theme.borderRadius} min={0} max={60} onChange={v => setTheme({ borderRadius: v })} />
        <Slider label="Espessura da Borda" value={theme.borderWidth} min={0} max={10} onChange={v => setTheme({ borderWidth: v })} />
        
        <div className="h-px bg-border w-full" />
        
        <Slider label="Opacidade" value={theme.opacity} min={10} max={100} unit="%" onChange={v => setTheme({ opacity: v })} />
        <Slider label="Background Blur" value={theme.blur} min={0} max={40} onChange={v => setTheme({ blur: v })} />
      </div>
    </div>
  );
}
