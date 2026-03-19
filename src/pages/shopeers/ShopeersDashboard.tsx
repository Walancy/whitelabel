import { useState } from 'react';
import {
  TrendingUp, ArrowUpRight, ChevronDown,
  MoreHorizontal, HelpCircle, Plus,
  ChevronLeft, ChevronRight, Info, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCardStyle } from '@/context/ThemeContext';

// ─── Types ────────────────────────────────────────────────────────────────────
type TimeRange = '24h' | 'Week' | 'Month';
interface Campaign {
  rank: number; name: string; admin: string; adminImg: string;
  date: string; business: string; status: 'Public' | 'Private'; action: 'Join' | 'Request';
}

// ─── Data ────────────────────────────────────────────────────────────────────
const CAMPAIGNS: Campaign[] = [
  { rank: 1, name: 'IBO Adve...', admin: 'Samuel', adminImg: 'https://i.pravatar.cc/28?u=samuel', date: '02/14/2019', business: 'Advertising', status: 'Public', action: 'Join' },
  { rank: 2, name: 'Pela Des...', admin: 'Hossein', adminImg: 'https://i.pravatar.cc/28?u=hossein', date: '09/23/2017', business: 'Design Agency', status: 'Public', action: 'Join' },
  { rank: 3, name: 'Emma Fa...', admin: 'Maria', adminImg: 'https://i.pravatar.cc/28?u=maria', date: '04/05/2023', business: 'Social Fandom', status: 'Private', action: 'Request' },
  { rank: 4, name: 'Anaco Pr...', admin: 'Stephanie', adminImg: 'https://i.pravatar.cc/28?u=stephanie', date: '11/18/2021', business: 'Programming', status: 'Public', action: 'Join' },
];

const RAW_POINTS = [28, 35, 30, 42, 32, 45, 40, 60, 48, 72, 55, 80, 68, 58, 72, 80, 64, 50, 58, 70, 56, 74, 60, 50, 62, 76, 65, 74, 80, 70];

// ─── SVG Chart ────────────────────────────────────────────────────────────────
const LineChart = ({ data }: { data: number[] }) => {
  const [hover, setHover] = useState<number | null>(18);
  const max = Math.max(...data), min = Math.min(...data);
  const W = 100, H = 100;
  const norm = (v: number) => H - 10 - ((v - min) / (max - min)) * (H - 20);
  const xs = data.map((_, i) => (i / (data.length - 1)) * W);
  const pts = data.map((v, i) => `${xs[i]},${norm(v)}`).join(' ');
  const area = `0,${H} ${pts} ${W},${H}`;
  const hx = hover !== null ? xs[hover] : null;
  const hy = hover !== null ? norm(data[hover]) : null;
  const color = 'hsl(var(--primary))';

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
      className="w-full h-full cursor-crosshair"
      style={{ overflow: 'visible' }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        setHover(Math.min(data.length - 1, Math.max(0, Math.round(ratio * (data.length - 1)))));
      }}
      onMouseLeave={() => setHover(18)}
    >
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sg)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {hx !== null && hy !== null && (
        <>
          <line x1={hx} y1="0" x2={hx} y2={H} stroke={color} strokeWidth="0.6" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          <circle cx={hx} cy={hy} r="2.5" fill={color} vectorEffect="non-scaling-stroke" />
          <circle cx={hx} cy={hy} r="5" fill={color} fillOpacity="0.2" vectorEffect="non-scaling-stroke" />
          {/* Tooltip bubble */}
          <rect x={Math.min(hx - 14, W - 30)} y={hy - 22} width="30" height="19" rx="3" fill="hsl(var(--card))" stroke={color} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <text x={Math.min(hx, W - 15)} y={hy - 14} textAnchor="middle" fontSize="3.8" fill="hsl(var(--muted-foreground))" fontWeight="500">Mar 29</text>
          <text x={Math.min(hx, W - 15)} y={hy - 8} textAnchor="middle" fontSize="3.5" fill="hsl(var(--foreground))" fontWeight="600">$ 5,538.65</text>
          <text x={Math.min(hx, W - 15)} y={hy - 2} textAnchor="middle" fontSize="3.2" fill={color}>+ 9.41 %</text>
        </>
      )}
    </svg>
  );
};

// ─── Avatars Stack ────────────────────────────────────────────────────────────
const AvatarStack = ({ seeds, withPlus }: { seeds: string[]; withPlus?: boolean }) => (
  <div className="flex items-center">
    <div className="flex -space-x-2">
      {seeds.map(s => <img key={s} src={`https://i.pravatar.cc/20?u=${s}`} className="w-6 h-6 rounded-full border-2 border-card object-cover" alt="" />)}
      <div className="w-6 h-6 rounded-full border-2 border-card bg-muted text-[7px] font-bold text-muted-foreground flex items-center justify-center">99+</div>
    </div>
    {withPlus && (
      <button className="ml-2 w-7 h-7 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all shrink-0">
        <Plus size={12} />
      </button>
    )}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export const ShopeersDashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('Month');
  const [joined, setJoined] = useState<Set<number>>(new Set());
  const cardStyle = useCardStyle();

  const toggle = (rank: number) =>
    setJoined(prev => { const n = new Set(prev); n.has(rank) ? n.delete(rank) : n.add(rank); return n; });

  return (
    <div className="flex gap-4 h-full w-full min-h-0 animate-in fade-in duration-400">

      {/* ══════════ LEFT COLUMN ══════════ */}
      <div className="flex flex-col gap-3 w-[290px] shrink-0 min-h-0">

        {/* Header */}
        <div className="shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-foreground tracking-tight">My Campaigns</h1>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-medium text-foreground cursor-pointer hover:bg-accent transition-colors">
              Finance <ChevronDown size={12} />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            3 persons and <span className="text-primary font-medium">@yerimaldo</span> have access.
          </p>
        </div>

        {/* Overview Card */}
        <div className="flex-1 flex flex-col rounded-2xl border border-border p-4 min-h-0" style={cardStyle}>
          {/* Overview header */}
          <div className="flex items-center justify-between shrink-0 mb-3">
            <span className="text-xs font-semibold text-foreground">Overview</span>
            <Info size={14} className="text-muted-foreground" />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between shrink-0 mb-3">
            <div>
              <p className="text-[10px] text-muted-foreground">Max records</p>
              <p className="text-[10px] text-muted-foreground">Comparative rates</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-foreground">2 times increase to the last month</p>
              <p className="text-[10px] text-primary font-semibold">+ 12.83 %</p>
            </div>
          </div>

          {/* Time tabs */}
          <div className="flex bg-muted/30 rounded-xl p-0.5 mb-3 shrink-0">
            {(['24h', 'Week', 'Month'] as TimeRange[]).map(t => (
              <button key={t} onClick={() => setTimeRange(t)}
                className={cn('flex-1 text-[10px] py-1.5 rounded-lg font-semibold transition-all',
                  timeRange === t ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground')}>
                {t}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="flex-1 min-h-0 w-full">
            <LineChart data={RAW_POINTS} />
          </div>

          {/* Chart dates */}
          <div className="flex items-center justify-between mt-1 shrink-0">
            {['Mar 8', 'Mar 18', 'Mar 28', 'Apr 8'].map(d => (
              <span key={d} className="text-[9px] text-muted-foreground">{d}</span>
            ))}
          </div>

          {/* Growth + Last updated */}
          <div className="flex items-end justify-between mt-3 shrink-0">
            <div className="flex items-baseline gap-1">
              <TrendingUp size={16} className="text-primary mb-0.5" />
              <span className="text-2xl font-medium text-primary tracking-tight">+ 19.23</span>
              <span className="text-lg font-medium text-primary">%</span>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-semibold text-muted-foreground">Last updated</p>
              <p className="text-[9px] text-foreground font-semibold">Today, 06:49 AM</p>
            </div>
          </div>
        </div>

        {/* Top Campaigns Card */}
        <div className="rounded-2xl border border-border p-4 shrink-0" style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-foreground">My Top Campaigns</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">02 of 5</span>
              <button className="w-6 h-6 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors">
                <ChevronLeft size={11} className="text-muted-foreground" />
              </button>
              <button className="w-6 h-6 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors">
                <ChevronRight size={11} className="text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { name: 'Pela Design', followers: '3,074', growth: '9.23' },
              { name: 'Elixir Ads', followers: '2,931', growth: '7.59' },
            ].map(c => (
              <div key={c.name} className="flex-1 rounded-xl border border-border p-2.5" style={{ backgroundColor: 'hsl(var(--background) / 0.4)' }}>
                <div className="flex items-start justify-between mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary mt-0.5" />
                  <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={11} /></button>
                </div>
                <p className="text-[11px] font-semibold text-foreground truncate">{c.name}</p>
                <p className="text-[10px] text-muted-foreground"># {c.followers} Followers</p>
                <p className="text-[10px] text-primary font-semibold mt-0.5">+ {c.growth} %</p>
                <div className="mt-2">
                  <AvatarStack seeds={[c.name + 'a', c.name + 'b', c.name + 'c']} withPlus />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ CENTER COLUMN ══════════ */}
      <div className="flex flex-col gap-3 flex-1 min-w-0 min-h-0">

        {/* Header */}
        <div className="shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-foreground tracking-tight">Total Balance</h1>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-medium text-foreground cursor-pointer hover:bg-accent transition-colors">
              US Dollar <ChevronDown size={12} />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            The sum of all amounts on <span className="text-primary font-medium">my wallet</span>
          </p>
        </div>

        {/* Balance Card */}
        <div className="rounded-2xl border border-border p-4 shrink-0" style={cardStyle}>
          {/* Amount row */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-1.5">
              <span className="text-primary text-xl font-medium mt-1.5">$</span>
              <span className="text-4xl font-medium tracking-tight text-foreground">23,094.57</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Compared to last month</p>
              <p className="text-[10px] font-semibold text-red-500">- 37.16 %</p>
            </div>
          </div>

          {/* Yearly avg row */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-muted-foreground">Yearly avg:</span>
              <span className="text-foreground font-semibold">$ 34,502.19</span>
              <ArrowUpRight size={12} className="text-primary" />
            </div>
            <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle size={11} /> How it works?
            </button>
          </div>

          {/* AI Assistant visual */}
          <div className="mt-3 rounded-xl overflow-hidden relative" style={{ height: '120px', background: 'linear-gradient(135deg, hsl(var(--primary)/0.08), hsl(var(--background)))' }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-[11px] font-semibold text-primary">Ai Assistant</p>
              </div>
              <p className="text-[10px] text-muted-foreground">is updating the balance amount now...</p>
            </div>
            {/* Decorative sphere gradient */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-primary/20 blur-2xl" />
          </div>
        </div>

        {/* Popular Campaigns Table Card */}
        <div className="flex-1 flex flex-col rounded-2xl border border-border overflow-hidden min-h-0" style={cardStyle}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <span className="text-xs font-semibold text-foreground">Popular Campaigns</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border text-[10px] font-medium text-muted-foreground cursor-pointer hover:bg-accent transition-colors">
              <kbd className="text-[9px] px-1 rounded bg-muted">⌘2</kbd> as List <ChevronDown size={10} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-stylized min-h-0">
            <table className="w-full">
              <thead className="sticky top-0 z-10" style={cardStyle}>
                <tr className="border-b border-border">
                  {['Rank', 'Name', 'Admin', 'Date Added', 'Business', 'Followers', 'Status', 'Operation'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAMPAIGNS.map(c => (
                  <tr key={c.rank} className="border-b border-border/40 hover:bg-accent/20 transition-colors">
                    <td className="px-3 py-3 text-[11px] font-semibold text-muted-foreground">#{c.rank}</td>
                    <td className="px-3 py-3 text-[11px] font-semibold text-foreground">{c.name}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <img src={c.adminImg} className="w-6 h-6 rounded-full object-cover" alt={c.admin} />
                        <span className="text-[11px] text-foreground">{c.admin}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[11px] text-muted-foreground whitespace-nowrap">{c.date}</td>
                    <td className="px-3 py-3 text-[11px] text-muted-foreground">{c.business}</td>
                    <td className="px-3 py-3">
                      <AvatarStack seeds={[c.name + 'x', c.name + 'y', c.name + 'z']} />
                    </td>
                    <td className="px-3 py-3">
                      {c.status === 'Private' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-muted text-foreground">🔒 Private</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Public</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <button onClick={() => toggle(c.rank)}
                        className={cn(
                          'text-[11px] font-semibold px-4 py-1.5 rounded-xl transition-all border',
                          joined.has(c.rank)
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : c.action === 'Request'
                              ? 'border-2 border-foreground text-foreground hover:bg-accent font-bold'
                              : 'border-border text-foreground hover:bg-accent'
                        )}>
                        {joined.has(c.rank) ? '✓ Joined' : c.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT COLUMN ══════════ */}
      <div className="flex flex-col gap-3 w-[240px] shrink-0 min-h-0">

        {/* Ads Card */}
        <div className="rounded-2xl border border-border p-4 shrink-0" style={cardStyle}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[11px] font-semibold text-foreground">Ads</p>
              <p className="text-[10px] text-muted-foreground">Powered by <span className="font-semibold text-foreground">Carbon</span></p>
            </div>
            <button className="text-[11px] text-foreground font-semibold hover:text-primary transition-colors">Next →</button>
          </div>
          <button className="w-full rounded-xl text-[11px] font-semibold transition-all py-2" style={{ backgroundColor: 'hsl(var(--foreground) / 0.08)', color: 'hsl(var(--foreground))' }}>
            Just for today!
          </button>
        </div>

        {/* Premium Card */}
        <div className="flex-1 rounded-2xl border border-border p-4 flex flex-col relative overflow-hidden" style={cardStyle}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none rounded-2xl" />

          <div className="relative z-10 flex-1 flex flex-col">
            {/* Title row */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Zap size={12} className="text-primary-foreground" fill="currentColor" />
              </div>
              <p className="text-[11px] font-semibold text-foreground leading-tight">Let's Go Premium with</p>
              <span className="shrink-0 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-lg">40%</span>
            </div>

            <p className="text-[11px] font-semibold text-foreground mb-2">This is your amazing chance!</p>

            <p className="text-[10px] text-muted-foreground leading-relaxed flex-1">
              Our premium subscription elevate your experience and unlock a range of benefits tailored to your preferences.
            </p>

            <button className="mt-3 text-[11px] text-primary font-semibold text-left hover:underline transition-colors">
              Learn more →
            </button>
          </div>

          {/* Bottom row */}
          <div className="relative z-10 mt-4 pt-3 border-t border-border flex items-center justify-between">
            <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Don't show again</button>
            <button className="px-4 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
              style={{ backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}>
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
