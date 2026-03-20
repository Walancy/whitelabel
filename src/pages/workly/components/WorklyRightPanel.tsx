import { useState } from 'react';
import { Plus, Search, ArrowUpRight, ArrowDownLeft, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCardStyle } from '@/context/ThemeContext';

interface Props {
    accentHex: string;
}

type CardType = 'Credit' | 'Debit';

const SPENDING = [
    { label: 'Shopping', pct: 27 },
    { label: 'Subscriptions', pct: 35 },
    { label: 'Dinning Out', pct: 18 },
    { label: 'Other', pct: 20 },
];

const getSpendingColor = (idx: number, accent: string): string => {
    const colors = [accent, 'hsl(var(--muted-foreground))', `${accent}80`, 'hsl(var(--muted-foreground) / 0.35)'];
    return colors[idx] ?? accent;
};

export const WorklyRightPanel = ({ accentHex }: Props) => {
    const [cardType, setCardType] = useState<CardType>('Credit');
    const cardStyle = useCardStyle();

    return (
        <div className="w-[300px] shrink-0 flex flex-col gap-3 min-h-0 overflow-y-auto scrollbar-stylized">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 rounded-xl bg-card border border-border">
                <Search size={14} className="text-muted-foreground" />
                <input type="text" placeholder="Search Anything..." aria-label="Search"
                    className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none" />
            </div>

            {/* Card toggle */}
            <div className="flex items-center gap-2 shrink-0">
                <div className="flex bg-card border border-border rounded-full p-0.5 flex-1">
                    {(['Credit', 'Debit'] as CardType[]).map(t => (
                        <button key={t} type="button" onClick={() => setCardType(t)}
                            className={cn('flex-1 text-xs font-medium py-2 rounded-full transition-all',
                                cardType === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                            {t}
                        </button>
                    ))}
                </div>
                <button type="button" className="workly-btn-primary px-3 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all">
                    <Plus size={13} /> Add Card
                </button>
            </div>

            {/* Card visual */}
            <div className="p-4 border border-border relative overflow-hidden" style={cardStyle}>
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-5 rounded bg-amber-400/50" />
                        <svg width="18" height="18" viewBox="0 0 24 24" className="text-muted-foreground/40">
                            <path d="M2 12A10 10 0 0012 22a10 10 0 000-20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M6 12A6 6 0 0012 18a6 6 0 000-12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M10 12a2 2 0 004 0 2 2 0 00-4 0" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground font-medium">**** **** 6541</p>
                        <p className="text-[11px] text-muted-foreground">12/27</p>
                    </div>
                </div>
                <div className="w-8 h-8 mb-4 grid grid-cols-2 gap-0.5 opacity-20">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-foreground rounded-[1px]" />)}
                </div>
                <p className="text-[11px] text-muted-foreground">Card Holder Name</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-medium text-foreground">Anjuman Sharear</p>
                    <p className="text-sm font-semibold text-foreground tracking-wider">VISA</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="shrink-0">
                <p className="text-xs font-medium text-foreground mb-2">Quick Action</p>
                <div className="flex gap-1.5">
                    {[
                        { icon: Plus, label: 'Top up' },
                        { icon: ArrowUpRight, label: 'Transfers' },
                        { icon: ArrowDownLeft, label: 'Request' },
                    ].map(({ icon: Icon, label }) => (
                        <button key={label} type="button" className="flex-1 rounded-xl bg-card border border-border text-xs font-medium text-foreground flex items-center justify-center gap-1.5 hover:bg-accent transition-colors">
                            <Icon size={13} /> {label}
                        </button>
                    ))}
                    <button type="button" className="w-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 hover:bg-accent transition-colors" aria-label="History">
                        <Clock size={14} className="text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Daily Limit */}
            <div className="shrink-0 p-4 border border-border" style={cardStyle}>
                <p className="text-xs font-medium text-foreground mb-1">Daily Limit</p>
                <p className="text-lg font-semibold text-foreground">
                    $1200 used <span className="text-xs font-normal text-muted-foreground">from $2,000 limit</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-2 mb-1.5">Smart Spending Limits</p>
                <div className="flex h-2.5 rounded-full overflow-hidden">
                    {SPENDING.map((s, i) => (
                        <div key={i} style={{ width: `${s.pct}%`, backgroundColor: getSpendingColor(i, accentHex) }} className="h-full" />
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
                    {SPENDING.map((s, i) => (
                        <div key={s.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getSpendingColor(i, accentHex) }} />
                            {s.label} ({s.pct}%)
                        </div>
                    ))}
                </div>
            </div>

            {/* Bill & Payment */}
            <div className="shrink-0 p-4 border border-border" style={cardStyle}>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-foreground">Bill & Payment</p>
                    <button type="button" className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center" aria-label="Add bill">
                        <Plus size={13} className="text-muted-foreground" />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">N</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">Netflix Subscription</p>
                        <p className="text-[11px] text-muted-foreground">Jul 24, 2025</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <p className="text-base font-semibold text-foreground">$25.30</p>
                    <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">Scheduled</span>
                </div>
                <button type="button" className="w-full mt-3 rounded-xl bg-background border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors">
                    View All
                </button>
            </div>
        </div>
    );
};
