import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WIDGET_CATALOG, KPI_VALUES } from '../types';
import { ChartGrowth, ChartViews, ChartDevices, ChartRevenue, TableRegions, TableOffline, ListAlerts, ListActivity, TableCampaigns, TablePoints } from './widgets';

interface WidgetCardProps {
  type: string;
  onRemove?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}

export function WidgetCard({ type, onRemove, onDragStart }: WidgetCardProps) {
  const def = WIDGET_CATALOG.find(w => w.type === type);
  const kpi = KPI_VALUES[type];

  if (!def) return null;

  const Icon = def.icon;

  const renderContent = () => {
    if (def.category === 'kpis' && kpi) {
      return (
        <>
          <p className="text-3xl font-semibold text-foreground tracking-tight leading-none mt-2">
            {kpi.value}
          </p>
          <span className={cn('flex items-center gap-1 text-[11px] font-semibold mt-auto', kpi.up ? 'text-green-500' : 'text-red-500')}>
            {kpi.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {kpi.change}
          </span>
        </>
      );
    }
    // Handle charts, tables and lists
    switch (type) {
      case 'chart-views': return <ChartViews />;
      case 'chart-devices': return <ChartDevices />;
      case 'chart-growth': return <ChartGrowth />;
      case 'chart-revenue': return <ChartRevenue />;
      case 'table-campaigns': return <TableCampaigns />;
      case 'table-points': return <TablePoints />;
      case 'table-regions': return <TableRegions />;
      case 'table-offline': return <TableOffline />;
      case 'list-alerts': return <ListAlerts />;
      case 'list-activity': return <ListActivity />;
      default:
        // Mock fallback for unknown charts and tables
        return (
          <div className="flex flex-1 items-center justify-center mt-2 border-2 border-dashed border-border rounded-xl bg-card/50">
            <div className="flex flex-col items-center gap-2 text-muted-foreground opacity-50">
              <Icon size={24} strokeWidth={1.5} />
              <span className="text-[11px] font-medium tracking-wide">Em Construção</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
        "group/widget relative flex flex-col h-full w-full select-none",
        onDragStart ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      )}
    >
      {/* Remove button */}
      {onRemove && (
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={onRemove}
          className="absolute top-0 right-0 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover/widget:opacity-100 transition-all z-10"
          aria-label="Remover widget"
        >
          <X size={12} />
        </button>
      )}

      {/* Icon + label header */}
      <div className="flex items-start gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-accent/30">
          <Icon size={24} className="text-primary" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col pt-0.5 min-w-0">
          <span className="text-[13px] font-bold text-foreground leading-snug truncate">
            {def.label}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-0.5">
            {def.category}
          </span>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
