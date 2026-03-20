import { useState } from 'react';
import {
  ChevronDown, ArrowUpRight, RotateCcw, EyeOff,
  TrendingUp, TrendingDown, Activity, Wallet, DollarSign, BarChart2, Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, useCardStyle } from '@/context/ThemeContext';
import { hslToHex } from '@/lib/color-utils';

// ─── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const W = 100, H = 100;
  const norm = (v: number) => H - 8 - ((v - min) / (max - min || 1)) * (H - 16);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${norm(v)}`).join(' ');
  const area = `0,${H} ${pts} ${W},${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sp-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sp-${color.replace('#', '')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

// ─── Arc Gauge ────────────────────────────────────────────────────────────────
const ArcGauge = ({ accentHex }: { accentHex: string }) => {
  const total = 100;
  const R = 78, SX = 22, EX = 178, CY = 100;
  const circumference = Math.PI * R;
  const GAP = (3 / 180) * circumference;
  const segments = [
    { pct: 20, color: '#f97316' }, { pct: 18, color: '#eab308' },
    { pct: 20, color: accentHex }, { pct: 16, color: '#a855f7' },
    { pct: 26, color: '#22c55e' },
  ];
  let offset = 0;
  const arcs = segments.map(s => {
    const len = (s.pct / total) * circumference - GAP;
    const dashOffset = -offset;
    offset += (s.pct / total) * circumference;
    return { ...s, len, dashOffset };
  });
  const d = `M${SX},${CY} A${R},${R} 0 0,1 ${EX},${CY}`;
  return (
    <svg viewBox="0 0 200 106" className="w-full max-w-[220px] mx-auto">
      <path d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14" strokeLinecap="round" />
      {arcs.map((s, i) => (
        <path key={i} d={d} fill="none" stroke={s.color} strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${s.len} ${circumference}`}
          strokeDashoffset={s.dashOffset}
          pathLength={circumference} />
      ))}
    </svg>
  );
};

// ─── Metric Card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  label: string; value: string; sub: string; change: string;
  up: boolean; icon: React.ReactNode; accentHex: string; cardStyle: React.CSSProperties;
}
const MetricCard = ({ label, value, sub, change, up, icon, accentHex, cardStyle }: MetricCardProps) => (
  <div className="p-4 flex flex-col gap-2 flex-1 min-w-0 border border-border" style={{ ...cardStyle, borderRadius: 'var(--radius)' }}>
    <div className="flex items-center justify-between">
      <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accentHex}20` }}>
        <span style={{ color: accentHex }}>{icon}</span>
      </div>
    </div>
    <p className="text-lg font-semibold text-foreground tracking-tight leading-none">{value}</p>
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground">{sub}</span>
      <span className={cn('text-[11px] font-semibold flex items-center gap-0.5', up ? 'text-green-400' : 'text-red-400')}>
        {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{change}
      </span>
    </div>
  </div>
);

// ─── Crypto Card ──────────────────────────────────────────────────────────────
interface CryptoCardProps {
  symbol: string; name: string; iconBg: string; icon: string;
  balance: string; price: string; change: string; positive: boolean;
  extra: string; chartData: number[]; chartColor: string; cardStyle: React.CSSProperties;
}
const CryptoCard = ({ symbol, name, iconBg, icon, balance, price, change, positive, extra, chartData, chartColor, cardStyle }: CryptoCardProps) => (
  <div className="flex flex-col p-4 gap-2.5 h-full border border-border" style={{ ...cardStyle, borderRadius: 'var(--radius)' }}>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: iconBg }}>{icon}</div>
        <div>
          <p className="text-[11px] text-muted-foreground leading-none mb-1">{symbol}</p>
          <p className="text-[13px] font-semibold text-foreground leading-none">{name}</p>
        </div>
      </div>
      <span className={cn('text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-0.5',
        positive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400')}>
        {positive ? <ArrowUpRight size={10} /> : null}{change}
      </span>
    </div>
    <div>
      <p className="text-xl font-semibold text-foreground tracking-tight leading-tight">{balance}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{price}</p>
    </div>
    <div className="h-10 w-full"><Sparkline data={chartData} color={chartColor} /></div>
    <p className="text-[11px] font-semibold text-green-400">{extra}</p>
  </div>
);

// ─── Profile Chart ────────────────────────────────────────────────────────────
const ProfileChart = ({ accentHex }: { accentHex: string }) => {
  const [tab, setTab] = useState('Buy Crypto');
  const tabs = ['Buy Crypto', 'Referral', 'Auto Approved', 'Bank Approved', 'Dividend'];
  const series = [
    { color: accentHex, pts: [18, 20, 16, 28, 18, 35, 22, 38, 24, 30, 20, 25, 30, 34, 29, 35, 28, 30] },
    { color: '#f97316', pts: [12, 14, 12, 20, 12, 25, 16, 28, 18, 22, 14, 18, 22, 25, 20, 26, 20, 22] },
    { color: '#a855f7', pts: [6, 8, 6, 12, 7, 14, 9, 15, 10, 12, 8, 10, 12, 14, 11, 14, 11, 12] },
    { color: '#22c55e', pts: [3, 4, 3, 6, 3, 7, 4, 8, 5, 6, 4, 5, 6, 7, 5, 7, 5, 6] },
  ];
  const xLabels = ['22.25', '02.52', '10.22', '16.01', '14.02', '11.91', '09.65', '17.88', '03.21'];
  const W = 100, H = 100;
  const norm = (v: number) => H - 5 - (v / 40) * (H - 10);
  const mkPts = (pts: number[]) => pts.map((v, i) => `${(i / (pts.length - 1)) * W},${norm(v)}`).join(' ');

  return (
    <div className="flex flex-col h-full gap-2.5 overflow-hidden min-h-0">
      <div className="flex items-center gap-1 flex-wrap shrink-0">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all !h-auto',
              tab === t ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5')}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0 flex gap-2 overflow-hidden">
        <div className="flex flex-col justify-between text-[10px] text-muted-foreground shrink-0 pb-5">
          {[40, 30, 20, 10, 0].map(l => <span key={l}>{l}</span>)}
        </div>
        <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full flex-1 min-h-0">
            {[40, 30, 20, 10, 0].map(y => (
              <line key={y} x1="0" y1={norm(y)} x2={W} y2={norm(y)}
                stroke="rgba(255,255,255,0.05)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
            ))}
            {series.map((s, i) => (
              <polyline key={i} points={mkPts(s.pts)} fill="none" stroke={s.color}
                strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
                strokeOpacity={i === 0 ? 1 : 0.7} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <div className="flex justify-between text-[10px] text-muted-foreground pt-1 shrink-0">
            {xLabels.map(l => <span key={l}>{l}</span>)}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 shrink-0">
        {[
          { color: '#ef4444', label: 'Referral', val: '$29' },
          { color: '#eab308', label: 'Bank Approved', val: '$32' },
          { color: '#a855f7', label: 'Dividend', val: '$54' },
          { color: '#22c55e', label: 'Auto Approved', val: '$06' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
            {l.label} <span className="text-foreground font-semibold ml-0.5">{l.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Token Row ────────────────────────────────────────────────────────────────
interface Token { name: string; symbol: string; icon: string; price: string; change: string; up: boolean; qty: string; bg: string; spark: number[]; }
const TokenRow = ({ t }: { t: Token }) => (
  <div className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-white/5 px-3 -mx-3 rounded-xl transition-colors group">
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
      style={{ backgroundColor: t.bg }}>{t.icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-semibold text-foreground leading-tight">{t.name}</p>
      <p className="text-[10px] text-muted-foreground">{t.symbol}</p>
    </div>
    <div className="w-16 h-7 shrink-0">
      <Sparkline data={t.spark} color={t.up ? '#22c55e' : '#ef4444'} />
    </div>
    <div className="text-right shrink-0">
      <p className="text-[12px] font-semibold text-foreground">{t.price}</p>
      <p className={cn('text-[10px] font-semibold', t.up ? 'text-green-400' : 'text-red-400')}>{t.change}</p>
    </div>
  </div>
);

// ─── Activity Row ─────────────────────────────────────────────────────────────
interface ActivityItem { type: 'buy' | 'sell' | 'swap'; coin: string; amount: string; usd: string; time: string; }
const ActivityRow = ({ a }: { a: ActivityItem }) => (
  <div className="flex items-center gap-3 py-2.5">
    <div className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0',
      a.type === 'buy' ? 'bg-green-500/20' : a.type === 'sell' ? 'bg-red-500/20' : 'bg-blue-500/20')}>
      {a.type === 'buy' ? <TrendingUp size={12} className="text-green-400" /> :
        a.type === 'sell' ? <TrendingDown size={12} className="text-red-400" /> :
          <Activity size={12} className="text-blue-400" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-semibold text-foreground capitalize leading-tight">{a.type} {a.coin}</p>
      <p className="text-[10px] text-muted-foreground">{a.time}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-[12px] font-semibold text-foreground">{a.amount}</p>
      <p className="text-[10px] text-muted-foreground">{a.usd}</p>
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export const MagikaDashboard = () => {
  const { activeAccentColor } = useTheme();
  const accentHex = hslToHex(activeAccentColor);
  const cardStyle = useCardStyle();

  const [filterTab, setFilterTab] = useState<'Buy Crypto' | 'By Exchange' | 'Via API'>('Buy Crypto');

  const btcData = [130, 128, 135, 127, 140, 132, 145, 138, 142, 150, 145, 147, 152, 155, 148, 152];
  const ethData = [105, 108, 103, 110, 107, 99, 109, 118, 113, 109, 116, 108, 103, 116, 111, 107];
  const solData = [80, 82, 78, 85, 80, 76, 82, 79, 75, 72, 76, 80, 77, 75, 73, 71];

  const tokens: Token[] = [
    { name: 'Chainlink', symbol: 'LINK', icon: '⬡', price: '$18.42', change: '+3.2%', up: true, qty: '1,000', bg: '#2563eb', spark: [14, 15, 16, 14, 17, 18, 16, 19, 18, 20, 19, 18] },
    { name: 'Binance', symbol: 'BNB', icon: 'B', price: '$624.5', change: '+1.8%', up: true, qty: '8,000', bg: '#f59e0b', spark: [60, 62, 58, 64, 60, 66, 62, 65, 63, 68, 65, 64] },
    { name: 'USDT', symbol: 'USDT', icon: '₮', price: '$1.000', change: '+0.0%', up: true, qty: '4,000', bg: '#22c55e', spark: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10] },
    { name: 'Solana', symbol: 'SOL', icon: '◎', price: '$148.3', change: '-2.1%', up: false, qty: '2,000', bg: accentHex, spark: [16, 17, 15, 16, 14, 13, 15, 14, 13, 12, 13, 14] },
  ];

  const activities: ActivityItem[] = [
    { type: 'buy', coin: 'BTC', amount: '0.024 BTC', usd: '$3,024.00', time: '2 min ago' },
    { type: 'swap', coin: 'ETH→SOL', amount: '1.5 ETH', usd: '$3,912.00', time: '15 min ago' },
    { type: 'sell', coin: 'BNB', amount: '5.0 BNB', usd: '$3,122.50', time: '1 hr ago' },
    { type: 'buy', coin: 'LINK', amount: '200 LINK', usd: '$3,684.00', time: '3 hr ago' },
  ];

  const portfolioAlloc = [
    { label: 'BTC', pct: 35, color: '#f97316' },
    { label: 'ETH', pct: 28, color: accentHex },
    { label: 'SOL', pct: 22, color: '#22c55e' },
    { label: 'Other', pct: 15, color: '#a855f7' },
  ];

  return (
    <div className="flex flex-col gap-4 w-full h-full">

      {/* ── Header ── */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[11px] text-muted-foreground">◷ All Assets</p>
            <h1 className="text-base font-semibold text-foreground tracking-tight">My Balance</h1>
          </div>
          <button className="flex items-center gap-1.5 text-[11px] font-semibold bg-card px-3 py-1.5 rounded-lg !h-auto text-foreground border border-border" style={cardStyle}>
            24h <ChevronDown size={11} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border !h-auto" style={cardStyle}>
            <EyeOff size={14} className="text-muted-foreground" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border !h-auto" style={cardStyle}>
            <RotateCcw size={14} className="text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[11px] text-muted-foreground">◷ All Assets</p>
            <h2 className="text-base font-semibold text-foreground tracking-tight">My Top Coins</h2>
          </div>
          <button className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg !h-auto text-foreground border border-border" style={cardStyle}>
            All Currencies <ChevronDown size={11} />
          </button>
          <button className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg !h-auto text-white" style={{ backgroundColor: accentHex }}>
            24h <ChevronDown size={11} />
          </button>
        </div>
      </div>

      {/* ── Row 1: Metric Cards ── */}
      <div className="flex gap-3 shrink-0">
        <MetricCard label="Portfolio Value" value="$380,005" sub="Total balance" change="+5.2%" up icon={<Wallet size={14} />} accentHex={accentHex} cardStyle={cardStyle} />
        <MetricCard label="24h PnL" value="+$2,322" sub="vs. yesterday" change="+5.03%" up icon={<BarChart2 size={14} />} accentHex={accentHex} cardStyle={cardStyle} />
        <MetricCard label="Total Invested" value="$361,200" sub="All time" change="+2.1%" up icon={<DollarSign size={14} />} accentHex={accentHex} cardStyle={cardStyle} />
        <MetricCard label="ROI" value="5.23%" sub="Return on inv." change="+0.8%" up icon={<Percent size={14} />} accentHex={accentHex} cardStyle={cardStyle} />
        <MetricCard label="Fear & Greed" value="72 / 100" sub="Market mood" change="Greed" up icon={<Activity size={14} />} accentHex={accentHex} cardStyle={cardStyle} />
      </div>

      {/* ── Row 2: Crypto Cards + Arc ── */}
      <div className="grid grid-cols-12 gap-3 shrink-0" style={{ minHeight: '190px' }}>
        <div className="col-span-2 h-full">
          <CryptoCard symbol="BTC" name="Bitcoin" iconBg="#f97316" icon="₿"
            balance="0.895" price="$126,223" change="+1.5%" positive extra="+$2020"
            chartData={btcData} chartColor="#22c55e" cardStyle={cardStyle} />
        </div>
        <div className="col-span-2 h-full">
          <CryptoCard symbol="ETH" name="Ethereum" iconBg={accentHex} icon="Ξ"
            balance="2.955" price="$126,223" change="-0.5%" positive={false} extra="+$2020"
            chartData={ethData} chartColor="#ef4444" cardStyle={cardStyle} />
        </div>
        <div className="col-span-2 h-full">
          <CryptoCard symbol="SOL" name="Solana" iconBg="#22c55e" icon="◎"
            balance="12.40" price="$148.30" change="-2.1%" positive={false} extra="-$324"
            chartData={solData} chartColor="#ef4444" cardStyle={cardStyle} />
        </div>
        {/* Center: Arc */}
        <div className="col-span-6 px-5 py-4 flex flex-col items-center justify-center gap-1 border border-border" style={{ ...cardStyle, borderRadius: 'var(--radius)' }}>
          <p className="text-xl font-semibold text-foreground tracking-tight">$380,005.00</p>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#f97316] flex items-center justify-center text-white text-[8px]">↑</span>
            <span className="text-[11px] font-semibold text-green-400">+$2322.25</span>
            <span className="text-[11px] text-muted-foreground">(5.03)</span>
          </div>
          <div className="relative flex flex-col items-center w-full">
            <ArcGauge accentHex={accentHex} />
            <p className="text-[11px] font-semibold text-foreground -mt-1">7.52% More than last week</p>
          </div>
        </div>
      </div>

      {/* ── Row 3: Charts ── */}
      <div className="grid grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">

        {/* Profile Chart */}
        <div className="col-span-5 p-4 lg:p-5 flex flex-col gap-2.5 overflow-hidden min-h-0 border border-border" style={{ ...cardStyle, borderRadius: 'var(--radius)' }}>
          <div className="flex items-center justify-between shrink-0">
            <p className="text-sm font-semibold text-foreground">Profile Chart</p>
            <button className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 !h-auto">
              See all <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <ProfileChart accentHex={accentHex} />
          </div>
        </div>

        {/* Top Token */}
        <div className="col-span-4 p-4 lg:p-5 flex flex-col gap-2.5 overflow-hidden min-h-0 border border-border" style={{ ...cardStyle, borderRadius: 'var(--radius)' }}>
          <div className="flex items-center justify-between shrink-0">
            <p className="text-sm font-semibold text-foreground">Top Token</p>
            <button className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 !h-auto">
              See all <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {(['Buy Crypto', 'By Exchange', 'Via API'] as const).map(t => (
              <button key={t} onClick={() => setFilterTab(t)}
                className={cn('px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all !h-auto',
                  filterTab === t ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-foreground/5')}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex-1 flex flex-col divide-y divide-border/20 overflow-hidden min-h-0">
            {tokens.map(t => <TokenRow key={t.name} t={t} />)}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-3 p-4 lg:p-5 flex flex-col gap-2.5 overflow-hidden min-h-0 border border-border" style={{ ...cardStyle, borderRadius: 'var(--radius)' }}>
          <div className="flex items-center justify-between shrink-0">
            <p className="text-sm font-semibold text-foreground">Recent Activity</p>
            <button className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 !h-auto">
              All <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="flex-1 flex flex-col divide-y divide-border/20 overflow-hidden min-h-0">
            {activities.map((a, i) => <ActivityRow key={i} a={a} />)}
          </div>
          {/* Portfolio bar */}
          <div className="shrink-0 pt-2">
            <p className="text-[10px] text-muted-foreground mb-1.5">Portfolio Allocation</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
              {portfolioAlloc.map(p => (
                <div key={p.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.label} <span className="text-foreground font-semibold">{p.pct}%</span>
                </div>
              ))}
            </div>
            <div className="flex h-2 rounded-full overflow-hidden">
              {portfolioAlloc.map((p, i) => (
                <div key={i} style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
