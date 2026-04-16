import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LayoutNode } from '../types';
import { WidgetCard } from './WidgetCard';
import type { SplitSide } from '../hooks/useLayoutTree';
import type { DashboardTheme } from '../types';

interface NodeProps {
  node: LayoutNode;
  isRoot?: boolean;
  theme: DashboardTheme;
  isEditing?: boolean;
  configMode?: boolean;
  onSplit: (id: string, side: SplitSide) => void;
  onRemove: (id: string) => void;
  onAddWidget: (nodeId: string, type: string) => void;
  onRemoveWidget: (nodeId: string, widgetId: string) => void;
  onMoveWidget: (sourceNodeId: string, widgetId: string, targetNodeId: string, type: string) => void;
  onChangeContentDir: (nodeId: string, contentDir: 'row' | 'col') => void;
  onResizeChildren: (parentId: string, newSizes: number[]) => void;
}

const DRAG_KEY = 'dashboard:widget-move';

/* ─── Control button for split ─── */
function Btn({ onClick, title, children, className }: { onClick: () => void; title: string; children: React.ReactNode; className?: string }) {
  return (
    <button
      onPointerDown={e => e.stopPropagation()}
      onClick={e => { e.stopPropagation(); onClick(); }}
      title={title}
      className={cn(
        'flex items-center justify-center transition-all opacity-0 group-hover/leaf:opacity-100 absolute z-50 bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/60 shadow-md',
        className
      )}
    >
      {children}
    </button>
  );
}

/* ─── Leaf node ─── */
function LeafNode({ node, isRoot, theme, isEditing, configMode, onSplit, onRemove, onAddWidget, onRemoveWidget, onMoveWidget, onChangeContentDir }: NodeProps) {
  const isStructuralEditing = isEditing && !configMode;
  const [over, setOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setOver(false);
    if (!isStructuralEditing) return;
    const fromPanel = e.dataTransfer.getData('widget-type');
    if (fromPanel) { onAddWidget(node.id, fromPanel); return; }
    const fromCell = e.dataTransfer.getData(DRAG_KEY);
    if (fromCell) { 
      const { type, cellId, widgetId } = JSON.parse(fromCell); 
      if (cellId !== node.id) {
        onMoveWidget(cellId, widgetId, node.id, type);
      }
    }
  };

  const hasWidgets = node.widgets && node.widgets.length > 0;

  return (
    <div
      className={cn(
        'relative flex flex-1 transition-all duration-300 w-full h-full',
        isStructuralEditing ? 'group/leaf min-w-[50px] min-h-[50px] bg-card' : 'bg-transparent',
        isStructuralEditing && over ? 'ring-inset ring-2 ring-primary bg-primary/5' : '',
        isStructuralEditing && !hasWidgets ? 'bg-card/50 hover:bg-card/80' : ''
      )}
      onDragOver={isStructuralEditing ? e => { e.preventDefault(); e.stopPropagation(); setOver(true); } : undefined}
      onDragLeave={isStructuralEditing ? () => setOver(false) : undefined}
      onDrop={handleDrop}
    >
      {/* Content */}
      <div className={cn(
        "flex-1 w-full h-full relative transition-all duration-300 overflow-hidden",
        isStructuralEditing && "p-4",
        hasWidgets && isStructuralEditing && 'flex gap-4'
      )}
      style={!isStructuralEditing && hasWidgets ? { gap: `${theme.gap}px`, flexDirection: node.contentDir === 'col' ? 'column' : 'row', display: 'flex' } : { flexDirection: node.contentDir === 'col' ? 'column' : 'row' }}>
        {hasWidgets ? (
          node.widgets.map((w) => (
            <div 
              key={w.id} 
              className={cn("flex flex-1 min-w-0 min-h-0 border-border overflow-hidden group/widget-container relative", 
                isStructuralEditing ? "ring-offset-background transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2" : "shadow-sm"
              )}
              style={{
                padding: `${theme.padding}px`,
                borderRadius: `${theme.borderRadius}px`,
                borderWidth: `${theme.borderWidth}px`,
                borderStyle: theme.borderWidth > 0 ? 'solid' : 'none',
                backgroundColor: `hsla(var(--card), ${theme.opacity / 100})`,
                backdropFilter: theme.blur > 0 ? `blur(${theme.blur}px)` : undefined,
                WebkitBackdropFilter: theme.blur > 0 ? `blur(${theme.blur}px)` : undefined,
                transform: 'translateZ(0)'
              }}
            >
              <WidgetCard
                type={w.type}
                onRemove={isStructuralEditing ? () => onRemoveWidget(node.id, w.id) : undefined}
                onDragStart={isStructuralEditing ? (e: React.DragEvent) => { e.stopPropagation(); e.dataTransfer.setData(DRAG_KEY, JSON.stringify({ type: w.type, cellId: node.id, widgetId: w.id })); } : undefined}
              />
            </div>
          ))
        ) : (
          isStructuralEditing && (
            <div className="flex flex-col items-center justify-center w-full h-full gap-2 text-muted-foreground/30 pointer-events-none">
              <Plus size={18} strokeWidth={1.5} />
              <span className="text-[11px] font-semibold tracking-wide uppercase text-center">Vazia</span>
            </div>
          )
        )}
      </div>

      {/* Internal Cell Actions */}
      {isStructuralEditing && (
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/leaf:opacity-100 transition-all z-40">
          {hasWidgets && (
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); onChangeContentDir(node.id, node.contentDir === 'row' ? 'col' : 'row'); }}
              title="Alternar distribuição interna (Linha/Coluna)"
              className="w-6 h-6 flex items-center justify-center rounded-md bg-background/80 backdrop-blur-sm border border-border text-foreground hover:bg-accent focus:bg-accent transition-colors shadow-sm"
            >
              <LayoutList size={12} className={node.contentDir === 'row' ? "rotate-90" : ""} />
            </button>
          )}
          {!isRoot && (
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); onRemove(node.id); }}
              title="Excluir espaço inteiro"
              className="w-6 h-6 flex items-center justify-center rounded-md bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-[#dc2626] hover:bg-red-500/10 focus:bg-red-500/10 transition-colors shadow-sm"
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}

      {/* Split buttons */}
      {isStructuralEditing && (
        <>
          <Btn onClick={() => onSplit(node.id, 'top')} title="Dividir / Adicionar acima" className="rounded-b top-0 left-1/2 -translate-x-1/2 w-8 h-4 border-t-0"><ChevronUp size={12} /></Btn>
          <Btn onClick={() => onSplit(node.id, 'bottom')} title="Dividir / Adicionar abaixo" className="rounded-t bottom-0 left-1/2 -translate-x-1/2 w-8 h-4 border-b-0"><ChevronDown size={12} /></Btn>
          <Btn onClick={() => onSplit(node.id, 'left')} title="Dividir / Adicionar à esquerda" className="rounded-r left-0 top-1/2 -translate-y-1/2 w-4 h-8 border-l-0"><ChevronLeft size={12} /></Btn>
          <Btn onClick={() => onSplit(node.id, 'right')} title="Dividir / Adicionar à direita" className="rounded-l right-0 top-1/2 -translate-y-1/2 w-4 h-8 border-r-0"><ChevronRight size={12} /></Btn>
        </>
      )}
    </div>
  );
}

/* ─── Resizer Dragger ─── */
function Resizer({
  isRow,
  baseSizes,
  index,
  getContainerPx,
  onChange,
  onEnd
}: {
  isRow: boolean;
  baseSizes: number[];
  index: number;
  getContainerPx: () => number;
  onChange: (sizes: number[]) => void;
  onEnd: () => void;
}) {
  return (
    <div
      className={cn(
        'relative z-50 flex items-center justify-center flex-shrink-0',
        isRow ? 'w-[1px] cursor-col-resize hover:bg-primary' : 'h-[1px] cursor-row-resize hover:bg-primary'
      )}
      onPointerDown={e => {
        e.preventDefault();
        const startPx = isRow ? e.clientX : e.clientY;
        let didMove = false;

        const handleMove = (em: PointerEvent) => {
          didMove = true;
          const px = isRow ? em.clientX : em.clientY;
          const deltaPx = px - startPx;

          const totalPx = getContainerPx();
          if (!totalPx) return;
          
          const totalSize = baseSizes.reduce((a, b) => a + b, 0);
          const deltaSize = (deltaPx / totalPx) * totalSize;
          
          const newSizes = [...baseSizes];
          const minSize = totalSize * 0.05; // 5% minimum size cap

          let newA = baseSizes[index] + deltaSize;
          let newB = baseSizes[index + 1] - deltaSize;

          if (newA < minSize) { newB -= (minSize - newA); newA = minSize; }
          if (newB < minSize) { newA -= (minSize - newB); newB = minSize; }

          newSizes[index] = newA;
          newSizes[index + 1] = newB;
          onChange(newSizes);
        };

        const handleUp = () => {
          if (didMove) onEnd();
          document.removeEventListener('pointermove', handleMove);
          document.removeEventListener('pointerup', handleUp);
        };

        document.addEventListener('pointermove', handleMove);
        document.addEventListener('pointerup', handleUp);
      }}
    >
      <div className={cn('absolute bg-transparent', isRow ? 'w-4 h-full -left-2' : 'h-4 w-full -top-2')} />
    </div>
  );
}

/* ─── Container Node ─── */
function ContainerNode(props: NodeProps) {
  const { node, isEditing, configMode, theme, onResizeChildren } = props;
  const isStructuralEditing = isEditing && !configMode;
  const isRow = node.dir === 'row';
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [dragSizes, setDragSizes] = useState<number[] | null>(null);

  // Clear dragging preview layer anytime the underlying tree gets externally updated (via add/remove/split)
  useEffect(() => { setDragSizes(null); }, [node.children.length]);

  const sizes = dragSizes || node.children.map(c => c.size);

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-1 w-full h-full transition-all duration-300',
        isStructuralEditing ? 'min-w-0 min-h-0 bg-border' : 'bg-transparent',
        isRow ? 'flex-row' : 'flex-col'
      )}
      style={!isStructuralEditing ? { gap: `${theme.gap}px` } : undefined}
    >
      {node.children.map((child, i) => (
        <React.Fragment key={child.id}>
          <div className="flex min-w-0 min-h-0 transition-all duration-300" style={{ flex: `${sizes[i]} ${sizes[i]} 0px` }}>
            <LayoutNodeView {...props} node={child} isRoot={false} />
          </div>

          {isStructuralEditing && i < node.children.length - 1 && (
            <Resizer
              isRow={isRow}
              baseSizes={node.children.map(c => c.size)}
              index={i}
              getContainerPx={() => containerRef.current ? (isRow ? containerRef.current.clientWidth : containerRef.current.clientHeight) : 0}
              onChange={setDragSizes}
              onEnd={() => {
                setDragSizes(prev => {
                  if (prev) onResizeChildren(node.id, prev);
                  return null;
                });
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── Recursive Switcher ─── */
export function LayoutNodeView(props: NodeProps) {
  if (props.node.children.length === 0) return <LeafNode {...props} />;
  return <ContainerNode {...props} />;
}
