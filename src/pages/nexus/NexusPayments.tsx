import { useState, useMemo } from 'react';
import {
  Search, Filter, Download, MoreHorizontal,
  ArrowUpRight, ArrowDownLeft, TrendingUp, DollarSign,
  ChevronDown, ChevronUp, ChevronsUpDown, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { hslToHex } from '@/lib/color-utils';

// ─── Types ───────────────────────────────────────────────────────────────────
type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
type SortKey = 'date' | 'amount' | 'merchant' | 'status';
type SortDir = 'asc' | 'desc';

interface Payment {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  type: 'credit' | 'debit';
  avatar: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const PAYMENTS: Payment[] = [
  { id: 'TXN-0291', merchant: 'Stripe Inc.', category: 'SaaS', amount: 4820.00, date: '2024-03-14', status: 'completed', type: 'credit', avatar: 'S' },
  { id: 'TXN-0290', merchant: 'AWS Services', category: 'Infrastructure', amount: -1240.50, date: '2024-03-13', status: 'completed', type: 'debit', avatar: 'A' },
  { id: 'TXN-0289', merchant: 'Figma', category: 'Design Tools', amount: -120.00, date: '2024-03-13', status: 'pending', type: 'debit', avatar: 'F' },
  { id: 'TXN-0288', merchant: 'Acme Corp.', category: 'Enterprise', amount: 12500.00, date: '2024-03-12', status: 'completed', type: 'credit', avatar: 'AC' },
  { id: 'TXN-0287', merchant: 'Vercel', category: 'Infrastructure', amount: -79.00, date: '2024-03-12', status: 'completed', type: 'debit', avatar: 'V' },
  { id: 'TXN-0286', merchant: 'Linear', category: 'Productivity', amount: -189.00, date: '2024-03-11', status: 'failed', type: 'debit', avatar: 'L' },
  { id: 'TXN-0285', merchant: 'TechStart Ltd.', category: 'Startup', amount: 3200.00, date: '2024-03-10', status: 'completed', type: 'credit', avatar: 'T' },
  { id: 'TXN-0284', merchant: 'Notion', category: 'Productivity', amount: -96.00, date: '2024-03-10', status: 'refunded', type: 'debit', avatar: 'N' },
  { id: 'TXN-0283', merchant: 'HubSpot', category: 'CRM', amount: -890.00, date: '2024-03-09', status: 'completed', type: 'debit', avatar: 'H' },
  { id: 'TXN-0282', merchant: 'DataSync Co.', category: 'Analytics', amount: 7400.00, date: '2024-03-08', status: 'pending', type: 'credit', avatar: 'D' },
  { id: 'TXN-0281', merchant: 'GitHub', category: 'Dev Tools', amount: -420.00, date: '2024-03-07', status: 'completed', type: 'debit', avatar: 'G' },
  { id: 'TXN-0280', merchant: 'Salesforce', category: 'CRM', amount: 5600.00, date: '2024-03-06', status: 'completed', type: 'credit', avatar: 'SF' },
];

const STATUS_CONFIG: Record<PaymentStatus, { label: string; classes: string }> = {
  completed: { label: 'Completed', classes: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  pending:   { label: 'Pending',   classes: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  failed:    { label: 'Failed',    classes: 'bg-red-500/10 text-red-500 dark:text-red-400' },
  refunded:  { label: 'Refunded', classes: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
};

// ─── Sub-components ──────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, trend }: { label: string; value: string; sub: string; icon: React.ReactNode; trend?: 'up' | 'down' }) => {
  const { dashboardConfig } = useTheme();
  const { cardOpacity, cardBlur, cardBlurIntensity, cardGradientEnabled, cardGradientColor, cardGradientOpacity } = dashboardConfig;
  const gradHex = cardGradientEnabled && cardGradientColor ? hslToHex(cardGradientColor) : null;
  const gradAlpha = Math.round((cardGradientOpacity / 100) * 255).toString(16).padStart(2, '0');

  const cardStyle: React.CSSProperties = {
    backgroundColor: `hsl(var(--card) / ${cardOpacity / 100})`,
    backdropFilter: cardBlur ? `blur(${cardBlurIntensity}px)` : undefined,
    WebkitBackdropFilter: cardBlur ? `blur(${cardBlurIntensity}px)` : undefined,
    ...(gradHex ? { backgroundImage: `radial-gradient(ellipse 80% 80% at 0% 0%, ${gradHex}${gradAlpha}, transparent 70%)` } : {}),
  };

  return (
    <div className="p-4 rounded-2xl border border-border flex flex-col gap-3" style={cardStyle}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground tracking-wide">{label}</span>
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-medium tracking-tight text-foreground">{value}</p>
        <p className={cn('text-[11px] mt-0.5', trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground')}>{sub}</p>
      </div>
    </div>
  );
};

const SortIcon = ({ col, sort }: { col: SortKey; sort: { key: SortKey; dir: SortDir } }) => {
  if (sort.key !== col) return <ChevronsUpDown size={12} className="text-muted-foreground/40" />;
  return sort.dir === 'asc' ? <ChevronUp size={12} className="text-foreground" /> : <ChevronDown size={12} className="text-foreground" />;
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export const NexusPayments = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('all');
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'date', dir: 'desc' });
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSort = (key: SortKey) =>
    setSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));

  const toggleSelect = (id: string) =>
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleAll = () =>
    setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)));

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return PAYMENTS
      .filter(p => (filter === 'all' || p.status === filter) && (p.merchant.toLowerCase().includes(term) || p.id.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)))
      .sort((a, b) => {
        const dir = sort.dir === 'asc' ? 1 : -1;
        if (sort.key === 'date') return dir * a.date.localeCompare(b.date);
        if (sort.key === 'amount') return dir * (a.amount - b.amount);
        if (sort.key === 'merchant') return dir * a.merchant.localeCompare(b.merchant);
        if (sort.key === 'status') return dir * a.status.localeCompare(b.status);
        return 0;
      });
  }, [search, filter, sort]);

  const totals = useMemo(() => ({
    income: PAYMENTS.filter(p => p.type === 'credit').reduce((s, p) => s + p.amount, 0),
    spent: Math.abs(PAYMENTS.filter(p => p.type === 'debit').reduce((s, p) => s + p.amount, 0)),
    pending: PAYMENTS.filter(p => p.status === 'pending').length,
  }), []);

  return (
    <div className="flex flex-col gap-5 w-full h-full animate-in fade-in zoom-in-95 duration-500 font-sans">

      {/* Header */}
      <div className="flex items-end justify-between shrink-0">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mb-1 block">Financial Overview</span>
          <h1 className="text-4xl font-medium tracking-tight text-foreground" style={{ letterSpacing: '-0.03em' }}>Payments</h1>
        </div>
        <button className="h-9 px-4 flex items-center gap-2 text-xs font-semibold bg-primary text-primary-foreground rounded-xl hover:brightness-110 transition-all">
          <Download size={13} /> Export
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <StatCard label="Total Income" value={`$${totals.income.toLocaleString()}`} sub="+18.2% this month" icon={<TrendingUp size={14} />} trend="up" />
        <StatCard label="Total Spent" value={`$${totals.spent.toLocaleString()}`} sub="-6.1% vs last month" icon={<DollarSign size={14} />} trend="down" />
        <StatCard label="Transactions" value={String(PAYMENTS.length)} sub={`${totals.pending} pending`} icon={<ArrowUpRight size={14} />} />
        <StatCard label="Net Balance" value={`$${(totals.income - totals.spent).toLocaleString()}`} sub="Updated just now" icon={<ArrowDownLeft size={14} />} trend="up" />
      </div>

      {/* Table Card */}
      <TableCard
        filtered={filtered} search={search} setSearch={setSearch}
        filter={filter} setFilter={setFilter} sort={sort} toggleSort={toggleSort}
        selected={selected} toggleSelect={toggleSelect} toggleAll={toggleAll}
      />
    </div>
  );
};

// ─── Table Card ──────────────────────────────────────────────────────────────
type TableCardProps = {
  filtered: Payment[]; search: string; setSearch: (v: string) => void;
  filter: PaymentStatus | 'all'; setFilter: (v: PaymentStatus | 'all') => void;
  sort: { key: SortKey; dir: SortDir }; toggleSort: (k: SortKey) => void;
  selected: Set<string>; toggleSelect: (id: string) => void; toggleAll: () => void;
};

const TableCard = ({ filtered, search, setSearch, filter, setFilter, sort, toggleSort, selected, toggleSelect, toggleAll }: TableCardProps) => {
  const { dashboardConfig } = useTheme();
  const { cardOpacity, cardBlur, cardBlurIntensity } = dashboardConfig;

  const tableCardStyle: React.CSSProperties = {
    backgroundColor: `hsl(var(--card) / ${cardOpacity / 100})`,
    backdropFilter: cardBlur ? `blur(${cardBlurIntensity}px)` : undefined,
    WebkitBackdropFilter: cardBlur ? `blur(${cardBlurIntensity}px)` : undefined,
  };

  const filters: { value: PaymentStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' }, { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' }, { value: 'failed', label: 'Failed' }, { value: 'refunded', label: 'Refunded' },
  ];

  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  return (
    <div className="flex-1 flex flex-col min-h-0 rounded-2xl border border-border overflow-hidden" style={tableCardStyle}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border shrink-0 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={cn('h-7 px-3 text-[11px] font-semibold rounded-lg transition-all', filter === f.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60')}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search payments…"
              className="h-8 pl-8 pr-3 text-xs bg-transparent border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-48" />
            {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={11} /></button>}
          </div>
          <button className="h-8 px-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border rounded-lg hover:text-foreground hover:bg-accent transition-all">
            <Filter size={12} /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto scrollbar-stylized">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card/80 backdrop-blur-sm z-10">
            <tr className="border-b border-border">
              <th className="w-10 px-4 py-3 text-left">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-primary cursor-pointer" />
              </th>
              {([
                { key: 'merchant', label: 'Merchant' },
                { key: 'date', label: 'Date' },
                { key: 'amount', label: 'Amount' },
                { key: 'status', label: 'Status' },
              ] as { key: SortKey; label: string }[]).map(col => (
                <th key={col.key} onClick={() => toggleSort(col.key)}
                  className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-muted-foreground uppercase cursor-pointer hover:text-foreground transition-colors select-none">
                  <span className="flex items-center gap-1">{col.label}<SortIcon col={col.key} sort={sort} /></span>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Category</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((payment, i) => (
              <PaymentRow key={payment.id} payment={payment} selected={selected.has(payment.id)} onSelect={toggleSelect} isEven={i % 2 === 0} />
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">No payments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3 flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
        <span>{selected.size > 0 ? `${selected.size} selected` : `${filtered.length} transactions`}</span>
        <span>Showing {filtered.length} of {PAYMENTS.length}</span>
      </div>
    </div>
  );
};

// ─── Payment Row ─────────────────────────────────────────────────────────────
const PaymentRow = ({ payment, selected, onSelect, isEven }: { payment: Payment; selected: boolean; onSelect: (id: string) => void; isEven: boolean }) => {
  const { status, amount, type } = payment;
  const statusCfg = STATUS_CONFIG[status];
  const isPositive = type === 'credit';

  return (
    <tr className={cn('border-b border-border/50 transition-colors hover:bg-accent/30 group cursor-pointer', selected && 'bg-primary/5', isEven && 'bg-accent/5')}>
      <td className="px-4 py-3.5">
        <input type="checkbox" checked={selected} onChange={() => onSelect(payment.id)} className="accent-primary cursor-pointer" />
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0', isPositive ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-accent text-foreground')}>
            {payment.avatar}
          </div>
          <div>
            <p className="font-semibold text-foreground tracking-tight">{payment.merchant}</p>
            <p className="text-[10px] text-muted-foreground">{payment.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 text-muted-foreground">{new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
      <td className="px-4 py-3.5">
        <span className={cn('font-semibold tabular-nums', isPositive ? 'text-green-600 dark:text-green-400' : 'text-foreground')}>
          {isPositive ? '+' : '-'}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold', statusCfg.classes)}>
          {statusCfg.label}
        </span>
      </td>
      <td className="px-4 py-3.5 text-muted-foreground">{payment.category}</td>
      <td className="px-4 py-3.5">
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
          <MoreHorizontal size={14} />
        </button>
      </td>
    </tr>
  );
};
