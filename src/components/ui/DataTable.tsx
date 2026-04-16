import { useState, useMemo, useCallback } from 'react';
import {
  Search, ChevronUp, ChevronDown, Filter,
  Trash2, Download, RefreshCw,
  ChevronLeft, ChevronRight, X, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCardStyle, useTheme } from '@/context/ThemeContext';

// ─── Checkbox ─────────────────────────────────────────────────────────────────
interface TableCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
}

function TableCheckbox({ checked, indeterminate, onChange, label }: TableCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'relative w-[14px] !h-[14px] shrink-0 rounded-[3px] border transition-all duration-150 flex items-center justify-center outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
        checked || indeterminate
          ? 'border-primary bg-primary'
          : 'border-border bg-transparent hover:border-primary/60'
      )}
    >
      {indeterminate && !checked && (
        <span className="block w-[7px] h-[1.5px] rounded-full bg-primary-foreground" />
      )}
      {checked && (
        <Check
          size={9}
          strokeWidth={3}
          className="text-primary-foreground animate-in zoom-in-50 duration-100"
        />
      )}
    </button>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type SortDir = 'asc' | 'desc' | null;
export type TableVariant =
  | 'default'    // nexus: cards modernos
  | 'minimal'    // shopeers: linhas limpas sem bordas internas
  | 'striped'    // workly: zebrado
  | 'bordered'   // projectli: todas as bordas
  | 'pill'       // magika: badges em pills, linhas arredondadas
  | 'compact'    // taskplus: ultra compacto
  | 'soft'       // eevo: fundo suave nos headers
  | 'neon'       // quantum: bordas neon
  | 'clean';     // resync: super limpo sem bordas laterais

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T extends { id: string | number }> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  filterOptions?: { key: keyof T; label: string; options: string[] }[];
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => React.ReactNode;
  pageSize?: number;
  variant?: TableVariant;
}

// ─── Variant Helpers ──────────────────────────────────────────────────────────
function getVariantClasses(variant: TableVariant) {
  switch (variant) {
    case 'minimal':
      return {
        wrapper: 'rounded-[var(--radius)] overflow-hidden',
        thead: 'bg-transparent border-b-2 border-border',
        th: 'text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1.5',
        tr: 'border-b border-border/30 hover:bg-accent/20 transition-colors',
        td: 'px-4 py-2',
      };
    case 'striped':
      return {
        wrapper: 'rounded-[var(--radius)] overflow-hidden',
        thead: 'bg-primary/8',
        th: 'text-[10px] font-semibold text-foreground uppercase tracking-wider px-3 py-1.5',
        tr: 'odd:bg-transparent even:bg-accent/20 hover:bg-primary/5 transition-colors',
        td: 'px-3 py-2',
      };
    case 'bordered':
      return {
        wrapper: 'rounded-[var(--radius)] overflow-hidden border border-border',
        thead: 'bg-accent/30',
        th: 'text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1.5 border-r border-border last:border-r-0',
        tr: 'border-b border-border hover:bg-accent/30 transition-colors',
        td: 'px-3 py-2 border-r border-border/50 last:border-r-0',
      };
    case 'pill':
      return {
        wrapper: 'rounded-[var(--radius)] overflow-hidden',
        thead: 'bg-primary/10',
        th: 'text-[10px] font-semibold text-primary uppercase tracking-wider px-4 py-1.5 first:rounded-tl-[var(--radius)] last:rounded-tr-[var(--radius)]',
        tr: 'mb-1 hover:bg-primary/5 transition-colors rounded-[var(--radius)]',
        td: 'px-4 py-2.5',
      };
    case 'compact':
      return {
        wrapper: 'rounded-[var(--radius)] overflow-hidden',
        thead: 'bg-accent/40',
        th: 'text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-2 py-1',
        tr: 'border-b border-border/20 hover:bg-accent/20 transition-colors',
        td: 'px-2 py-1',
      };
    case 'soft':
      return {
        wrapper: 'rounded-[var(--radius)] overflow-hidden',
        thead: 'bg-primary/15',
        th: 'text-[10px] font-semibold text-primary uppercase tracking-wider px-4 py-1.5',
        tr: 'border-b border-border/20 hover:bg-primary/5 transition-colors',
        td: 'px-4 py-2.5',
      };
    case 'neon':
      return {
        wrapper: 'rounded-[var(--radius)] overflow-hidden ring-1 ring-primary/30',
        thead: 'bg-primary/10 border-b border-primary/20',
        th: 'text-[10px] font-semibold text-primary uppercase tracking-wider px-3 py-1.5',
        tr: 'border-b border-primary/10 hover:bg-primary/5 transition-colors',
        td: 'px-3 py-2',
      };
    case 'clean':
      return {
        wrapper: 'rounded-[var(--radius)] overflow-hidden',
        thead: 'border-b-2 border-border',
        th: 'text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1.5 first:pl-0 last:pr-0',
        tr: 'border-b border-border/20 hover:bg-accent/10 transition-colors last:border-b-0',
        td: 'px-4 py-2 first:pl-0 last:pr-0',
      };
    default: // nexus
      return {
        wrapper: 'rounded-[var(--radius)] overflow-hidden',
        thead: 'border-b border-border',
        th: 'text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1.5',
        tr: 'border-b border-border/50 hover:bg-accent/30 transition-colors',
        td: 'px-3 py-2 text-foreground',
      };
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function DataTable<T extends { id: string | number }>({
  data, columns, title = 'Dados', searchable = true,
  filterOptions = [], onRowClick, rowActions, pageSize = 10,
  variant = 'default',
}: DataTableProps<T>) {
  const { dashboardConfig } = useTheme();
  const cardStyle = useCardStyle();
  const baseVc = getVariantClasses(variant);
  
  const tableStyle = dashboardConfig.tableStyle;
  const isGus = tableStyle === 'tablegus';
  
  const getStyleClasses = () => {
    switch (tableStyle) {
      case 'tablegus':
        return {
          wrapper: "rounded-[16px] border border-border bg-card overflow-hidden",
          thead: "bg-[#F5F3EF] dark:bg-[#1C1C22]",
          th: "px-4 py-3 font-semibold text-foreground text-[11px] uppercase",
          tr: "border-b border-border/80 transition-colors hover:bg-muted/60 last:border-b-0",
          td: "px-4 py-3 text-sm",
          table: "w-full border-collapse",
          pagination: "flex items-center justify-between px-4 py-3 border-t border-border/80 shrink-0 text-xs text-muted-foreground rounded-b-[16px] bg-[#F5F3EF]/30 dark:bg-[#1C1C22]/30",
          paginationBtn: "h-7 min-w-[28px] px-1 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-foreground border border-transparent hover:border-border/30",
          paginationBtnActive: "bg-black/10 dark:bg-white/10 font-bold border-border/40",
        };
      case 'glass':
        return {
          wrapper: "rounded-[var(--radius)] border border-white/20 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden",
          thead: "bg-white/5",
          th: "px-3 py-2 font-medium text-foreground/80 text-xs tracking-wider",
          tr: "border-b border-white/10 transition-colors hover:bg-white/10 last:border-b-0",
          td: "px-3 py-2 text-foreground/90 text-[13px]",
          table: "w-full border-collapse",
          pagination: "flex items-center justify-between px-4 py-2.5 border-t border-white/20 shrink-0 text-xs text-foreground/70 bg-white/5 rounded-b-[var(--radius)]",
          paginationBtn: "h-7 w-7 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white backdrop-blur-md",
          paginationBtnActive: "bg-white/30 font-bold border-white/50",
        };
      case 'corporate':
        return {
          wrapper: "rounded-md border border-border bg-background shadow-sm overflow-hidden",
          thead: "bg-muted/80 text-foreground",
          th: "px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider",
          tr: "border-b border-border transition-colors hover:bg-muted/60 even:bg-muted/20",
          td: "px-4 py-2.5 text-[13px]",
          table: "w-full border-collapse",
          pagination: "flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30 shrink-0 text-xs text-muted-foreground",
          paginationBtn: "h-7 min-w-[28px] px-1.5 flex items-center justify-center rounded-sm border border-border bg-card hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium",
          paginationBtnActive: "border-primary text-primary bg-primary/10 shadow-sm",
        };
      case 'modern':
        return {
          wrapper: "bg-background/40 border border-border rounded-xl p-1",
          thead: "bg-transparent",
          th: "px-4 py-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wider",
          tr: "bg-card border border-border rounded-lg shadow-sm hover:shadow-md hover:border-primary/40 transition-all",
          td: "px-4 py-3 first:rounded-l-lg last:rounded-r-lg text-[13px]",
          table: "w-full border-separate border-spacing-y-2",
          pagination: "flex items-center justify-between px-2 py-3 mt-2 border-t border-border shrink-0 text-xs text-muted-foreground bg-transparent",
          paginationBtn: "h-8 w-8 flex items-center justify-center rounded-lg bg-card border border-border shadow-sm hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all",
          paginationBtnActive: "border-primary bg-primary text-primary-foreground shadow-md",
        };
      case 'sleek':
        return {
          wrapper: "rounded-2xl border border-border bg-background/50 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.01)] overflow-hidden",
          thead: "bg-transparent",
          th: "px-6 py-4 font-medium text-muted-foreground text-xs",
          tr: "border-b border-border/50 transition-all hover:bg-accent/40 last:border-b-0",
          td: "px-6 py-4 text-[13px]",
          table: "w-full border-collapse",
          pagination: "flex items-center justify-between px-6 py-4 border-t border-border shrink-0 text-[13px] text-muted-foreground rounded-b-2xl",
          paginationBtn: "h-8 min-w-[32px] px-2 flex items-center justify-center rounded-md border border-transparent hover:border-border hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium",
          paginationBtnActive: "border-border/80 text-foreground bg-accent/80 font-semibold shadow-sm",
        };
      case 'minimalist':
        return {
          wrapper: "bg-transparent border border-border/80 rounded-lg px-2 overflow-hidden",
          thead: "bg-transparent",
          th: "px-2 py-3 font-medium text-muted-foreground text-xs",
          tr: "hover:bg-accent/10 hover:text-primary transition-colors border-b border-border/40 border-dashed",
          td: "px-2 py-3 text-[13px]",
          table: "w-full border-collapse",
          pagination: "flex items-center justify-between py-4 border-t-2 border-border/80 shrink-0 text-xs text-muted-foreground",
          paginationBtn: "h-6 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all px-2 font-medium flex items-center justify-center rounded border border-transparent hover:border-border/50",
          paginationBtnActive: "text-primary border-primary",
        };
      case 'striped':
        return {
          wrapper: "rounded-md border border-border bg-card overflow-hidden shadow-sm",
          thead: "bg-muted/40",
          th: "px-4 py-2.5 font-medium text-muted-foreground text-[11px] uppercase",
          tr: "even:bg-muted/20 border-b border-border/40 hover:bg-muted/40 transition-colors last:border-b-0",
          td: "px-4 py-2.5 text-[13px]",
          table: "w-full border-collapse",
          pagination: "flex items-center justify-between px-4 py-2.5 border-t border-border shrink-0 text-xs text-muted-foreground",
          paginationBtn: "h-7 min-w-[28px] px-1 flex items-center justify-center rounded-sm border border-border bg-card hover:bg-accent disabled:opacity-30 transition-all font-medium",
          paginationBtnActive: "border-primary bg-primary text-primary-foreground",
        };
      case 'cards':
        return {
          wrapper: "bg-transparent border border-border/60 rounded-[16px] p-2 overflow-hidden",
          thead: "bg-transparent",
          th: "px-4 py-2 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider",
          tr: "hover:-translate-y-[1px] transition-all relative group",
          td: "bg-card px-4 py-4 first:rounded-l-[16px] last:rounded-r-[16px] text-[13px]",
          table: "w-full border-separate border-spacing-y-3",
          pagination: "flex items-center justify-between px-2 py-3 mt-2 shrink-0 text-xs text-muted-foreground bg-transparent",
          paginationBtn: "h-8 w-8 flex items-center justify-center rounded-xl bg-card border border-border hover:border-primary/40 hover:text-primary transition-all",
          paginationBtnActive: "bg-primary text-primary-foreground border-primary",
        };
      case 'compact':
        return {
          wrapper: "rounded-sm border border-border bg-card overflow-hidden",
          thead: "bg-muted/50",
          th: "px-2 py-1.5 font-semibold text-foreground text-[10px] uppercase tracking-tight",
          tr: "border-b border-border/80 hover:bg-muted/50 transition-colors last:border-b-0",
          td: "px-2 py-1.5 text-[11px]",
          table: "w-full border-collapse",
          pagination: "flex items-center justify-between px-2 py-1.5 border-t border-border shrink-0 text-[10px] text-muted-foreground",
          paginationBtn: "h-5 min-w-[24px] px-1 flex items-center justify-center rounded border border-transparent hover:border-border hover:bg-accent disabled:opacity-30 transition-all font-medium",
          paginationBtnActive: "bg-accent/80 border-border text-foreground",
        };
      case 'glow':
        return {
           wrapper: "rounded-[var(--radius)] border border-primary/20 bg-background overflow-hidden relative shadow-[0_0_15px_rgba(var(--primary),0.05)]",
           thead: "bg-primary/5",
           th: "px-4 py-3 font-semibold text-primary/80 text-[11px] uppercase tracking-widest",
           tr: "border-b border-primary/10 transition-all hover:bg-primary/5 hover:shadow-[inset_0_0_15px_rgba(var(--primary),0.1)] last:border-b-0",
           td: "px-4 py-3 text-[13px] text-foreground/90",
           table: "w-full border-collapse",
           pagination: "flex items-center justify-between px-4 py-3 border-t border-primary/10 bg-primary/5 shrink-0 text-xs text-primary/70",
           paginationBtn: "h-7 min-w-[28px] px-1 flex items-center justify-center rounded border border-primary/20 bg-background hover:bg-primary/10 hover:shadow-[0_0_10px_rgba(var(--primary),0.2)] disabled:opacity-30 transition-all text-primary",
           paginationBtnActive: "bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(var(--primary),0.4)] border-primary",
        };
      case 'futuristic':
        return {
          wrapper: "rounded-[24px] border border-white/10 bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-3xl shadow-2xl overflow-hidden",
          thead: "bg-transparent",
          th: "px-5 py-4 font-bold text-foreground/70 text-[10px] uppercase tracking-[0.2em]",
          tr: "border-b border-white/5 transition-all hover:bg-white/5 hover:scale-[1.005] last:border-b-0",
          td: "px-5 py-4 text-[13px] text-foreground/90 font-light",
          table: "w-full border-collapse",
          pagination: "flex items-center justify-between px-6 py-4 border-t border-white/10 shrink-0 text-xs text-foreground/60 backdrop-blur-xl",
          paginationBtn: "h-8 min-w-[32px] px-2 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 hover:bg-white/10 disabled:opacity-30 transition-all text-foreground/80",
          paginationBtnActive: "bg-white/20 border-white/40 text-white font-medium",
        };
      default:
        return {
          wrapper: cn("border border-border bg-card overflow-hidden", baseVc.wrapper),
          thead: baseVc.thead,
          th: "px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider",
          tr: baseVc.tr,
          td: "px-3 py-2 text-foreground text-[13px]",
          table: "w-full border-collapse",
          pagination: "flex items-center justify-between px-4 py-2.5 border-t border-border shrink-0 text-xs text-muted-foreground",
          paginationBtn: "h-7 min-w-[28px] px-1 flex items-center justify-center rounded-[var(--radius)] border border-border hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all",
          paginationBtnActive: "border-primary bg-primary text-primary-foreground",
        };
    }
  };

  const sc = getStyleClasses();

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const handleSort = useCallback((key: keyof T) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return; }
    setSortDir(d => d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc');
    if (sortDir === 'desc') setSortKey(null);
  }, [sortKey, sortDir]);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(r => columns.some(c => String(r[c.key] ?? '').toLowerCase().includes(q)));
    }
    Object.entries(activeFilters).forEach(([k, v]) => {
      if (v) rows = rows.filter(r => String(r[k as keyof T]) === v);
    });
    if (sortKey && sortDir) {
      rows.sort((a, b) => {
        const cmp = String(a[sortKey]).localeCompare(String(b[sortKey]), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return rows;
  }, [data, search, activeFilters, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const tbodyKey = `${page}-${String(sortKey)}-${sortDir}-${search}-${JSON.stringify(activeFilters)}`;

  const allSelected = pageData.length > 0 && pageData.every(r => selected.has(r.id));
  const toggleAll = () => setSelected(prev => {
    const n = new Set(prev);
    allSelected ? pageData.forEach(r => n.delete(r.id)) : pageData.forEach(r => n.add(r.id));
    return n;
  });
  const toggleOne = (id: string | number) => setSelected(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  return (
    <div className="flex flex-col h-full min-h-0 gap-3">
      {/* ─── Toolbar ─── */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {title && <h2 className="text-sm font-semibold text-foreground mr-2">{title}</h2>}

        {searchable && (
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar..."
              aria-label="Buscar na tabela"
              className="w-full h-8 pl-7 pr-3 text-xs rounded-[var(--radius)] border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={11} />
              </button>
            )}
          </div>
        )}

        {filterOptions.length > 0 && (
          <button
            onClick={() => setShowFilters(f => !f)}
            className={cn('h-8 px-2.5 flex items-center gap-1.5 text-xs rounded-[var(--radius)] border transition-all font-medium',
              showFilters ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:bg-accent')}
          >
            <Filter size={12} /> Filtros
            {Object.values(activeFilters).filter(Boolean).length > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                {Object.values(activeFilters).filter(Boolean).length}
              </span>
            )}
          </button>
        )}

        {selected.size > 0 && (
          <div className="flex items-center gap-1.5 ml-auto animate-in fade-in duration-200">
            <span className="text-xs text-muted-foreground">{selected.size} selecionado{selected.size > 1 ? 's' : ''}</span>
            <button className="h-8 px-2.5 flex items-center gap-1.5 text-xs rounded-[var(--radius)] border border-border text-muted-foreground hover:bg-accent transition-all">
              <Download size={12} /> Exportar
            </button>
            <button onClick={() => setSelected(new Set())} className="h-8 px-2.5 flex items-center gap-1.5 text-xs rounded-[var(--radius)] border border-red-500/30 text-red-500 hover:bg-red-500/5 transition-all">
              <Trash2 size={12} /> Excluir
            </button>
          </div>
        )}

        <button className={cn("h-8 w-8 flex items-center justify-center rounded-[var(--radius)] border border-border text-muted-foreground hover:bg-accent transition-all", selected.size === 0 && "ml-auto")}
          aria-label="Atualizar tabela">
          <RefreshCw size={12} />
        </button>
      </div>

      {/* ─── Filter Bar ─── */}
      {showFilters && filterOptions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap shrink-0 p-2.5 rounded-[var(--radius)] border border-border animate-in fade-in slide-in-from-top-2 duration-200" style={cardStyle}>
          {filterOptions.map(f => (
            <div key={String(f.key)} className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-muted-foreground">{f.label}:</span>
              <select
                value={activeFilters[String(f.key)] ?? ''}
                onChange={e => { setActiveFilters(p => ({ ...p, [f.key]: e.target.value })); setPage(1); }}
                className="h-7 px-2 text-xs rounded-[var(--radius)] border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                aria-label={`Filtrar por ${f.label}`}
              >
                <option value="">Todos</option>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          {Object.values(activeFilters).some(Boolean) && (
            <button onClick={() => setActiveFilters({})} className="h-7 px-2 text-[10px] text-muted-foreground hover:text-foreground border border-border rounded-[var(--radius)] flex items-center gap-1">
              <X size={10} /> Limpar
            </button>
          )}
        </div>
      )}

      {/* ─── Table ─── */}
      <div 
        className={cn(
          "flex-1 min-h-0 flex flex-col relative", 
          tableStyle !== 'modern' && "overflow-hidden",
          sc.wrapper
        )} 
      >
        {isGus && (
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-[44px] w-4 bg-[#F5F3EF] dark:bg-[#1C1C22]" />
        )}
        <div className={cn(
          "flex-1 overflow-auto scrollbar-stylized min-h-0 px-1 -mx-1",
          isGus && "[&::-webkit-scrollbar-track]:mt-[44px] [&::-webkit-scrollbar-track]:mb-1",
          tableStyle === 'modern' && "px-2"
        )}>
          <table className={cn(sc.table, "whitespace-nowrap")} role="grid">
            <thead className={cn("sticky top-0 z-10", sc.thead)}>
              <tr>
                <th className={cn(sc.th, "w-8 px-2.5 py-1.5")}>
                  <TableCheckbox
                    checked={allSelected}
                    indeterminate={selected.size > 0 && !allSelected}
                    onChange={toggleAll}
                    label="Selecionar todos"
                  />
                </th>
                {columns.map(col => (
                  <th
                    key={String(col.key)}
                    className={cn(sc.th, col.width)}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-1.5 !h-auto hover:text-foreground transition-all duration-200 group hover:bg-foreground/5 py-1 px-1.5 -ml-1.5 rounded-md active:scale-95"
                        aria-label={`Ordenar por ${col.label}`}
                      >
                        {col.label}
                        <span className="flex flex-col gap-[1px]">
                          <ChevronUp size={8} className={cn('transition-colors', sortKey === col.key && sortDir === 'asc' ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-muted-foreground')} />
                          <ChevronDown size={8} className={cn('transition-colors', sortKey === col.key && sortDir === 'desc' ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-muted-foreground')} />
                        </span>
                      </button>
                    ) : col.label}
                  </th>
                ))}
                {rowActions && <th className={cn(sc.th, "w-16 px-3 py-1.5")} />}
              </tr>
            </thead>
            <tbody key={tbodyKey} className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="py-12 text-center text-sm text-muted-foreground">
                    Nenhum resultado encontrado.
                  </td>
                </tr>
              ) : pageData.map(row => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    sc.tr,
                    onRowClick && 'cursor-pointer',
                    selected.has(row.id) && 'bg-primary/5'
                  )}
                >
                  <td className={cn(sc.td, "w-8 px-2.5 py-2")} onClick={e => { e.stopPropagation(); toggleOne(row.id); }}>
                    <TableCheckbox
                      checked={selected.has(row.id)}
                      onChange={() => toggleOne(row.id)}
                      label="Selecionar linha"
                    />
                  </td>
                  {columns.map(col => (
                    <td key={String(col.key)} className={sc.td}>
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                  {rowActions && (
                    <td className={sc.td} onClick={e => e.stopPropagation()}>
                      {rowActions(row)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ─── */}
        <div className={sc.pagination}>
          <span>{filtered.length} registro{filtered.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-1.5 pl-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={cn(sc.paginationBtn, "w-8 h-8")}
              aria-label="Página anterior"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(p); return acc;
              }, [])
              .map((p, i) => p === '...' ? (
                <span key={`e${i}`} className="px-1 text-muted-foreground text-xs font-serif">…</span>
              ) : (
                <button key={p} onClick={() => setPage(p as number)}
                  className={cn(sc.paginationBtn, page === p && sc.paginationBtnActive)}
                  aria-label={`Página ${p}`} aria-current={page === p ? 'page' : undefined}
                >
                  {p}
                </button>
              ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={cn(sc.paginationBtn, "w-8 h-8")}
              aria-label="Próxima página"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
