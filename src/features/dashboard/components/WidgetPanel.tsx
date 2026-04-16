import { X, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { WIDGET_CATALOG } from '../types';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  usedWidgets?: string[];
}

export function WidgetPanel({ open, onClose, usedWidgets = [] }: Props) {
  const [search, setSearch] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handleClick), 100);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClick); };
  }, [open, onClose]);

  const filtered = WIDGET_CATALOG.filter(w =>
    w.label.toLowerCase().includes(search.toLowerCase()) ||
    w.description.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, typeof WIDGET_CATALOG>);

  return (
    <div
      ref={panelRef}
      className={cn(
        'fixed top-0 right-0 h-full w-[290px] z-[100] bg-card border-l border-border flex flex-col transition-transform duration-300 ease-out shadow-2xl',
        open ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div>
          <h2 className="text-[13px] font-semibold text-foreground">Widgets disponíveis</h2>
          <p className="text-[11px] text-muted-foreground">Arraste para uma célula do dashboard</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Fechar painel">
          <X size={14} />
        </button>
      </div>

      <div className="px-3 pt-3 pb-2 shrink-0">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar widget..."
            className="w-full h-8 pl-7 pr-3 text-[12px] rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-all" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-stylized px-3 pb-6 flex flex-col gap-6">
        {filtered.length === 0 && <p className="text-center text-[12px] text-muted-foreground py-8">Nenhum widget encontrado</p>}
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="flex flex-col gap-2">
            <h3 className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-1">
              {category}
            </h3>
            <div className="flex flex-col gap-1.5">
              {items.map(w => {
                const Icon = w.icon;
                const isUsed = usedWidgets.includes(w.type);
                return (
                  <div
                    key={w.type}
                    draggable={!isUsed}
                    onDragStart={e => !isUsed && e.dataTransfer.setData('widget-type', w.type)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all",
                      isUsed 
                        ? "border-muted bg-muted/20 opacity-60 cursor-not-allowed" 
                        : "border-border bg-background hover:border-primary/50 hover:bg-accent/30 cursor-grab active:cursor-grabbing"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-accent/30">
                      <Icon size={16} className="text-primary" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-foreground flex items-center gap-2">
                        {w.label}
                        {isUsed && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20">Em uso</span>}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-snug">{w.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
