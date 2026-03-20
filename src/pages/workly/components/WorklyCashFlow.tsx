import { useState } from 'react';
import { ChevronDown, BarChart2, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCardStyle } from '@/context/ThemeContext';

interface Props {
    accentHex: string;
}

const CHART_DATA = [4.2, 6.8, 5.1, 7.3, 4.8, 8.2, 6.5, 9.1, 11.5, 16.2, 8.3, 7.1];
const Y_LABELS = ['$15', '$10', '$5'];
const HIGHLIGHT_IDX = 9;

type FlowTab = 'Income' | 'Expense' | 'Saving';

export const WorklyCashFlow = ({ accentHex }: Props) => {
    const [tab, setTab] = useState<FlowTab>('Income');
    const cardStyle = useCardStyle();
    const maxVal = Math.max(...CHART_DATA);

    return (
        <div className="p-4 border border-border flex-1 min-h-0 flex flex-col" style={cardStyle}>
            <div className="flex items-center justify-between mb-2 shrink-0">
                <div>
                    <p className="text-xs text-muted-foreground">Cash Flow</p>
                    <p className="text-xl font-semibold text-foreground tracking-tight">$19,270.56</p>
                </div>
                <button type="button" className="px-3 rounded-xl bg-background border border-border text-xs font-medium text-foreground flex items-center gap-1.5">
                    Weekly <ChevronDown size={12} />
                </button>
            </div>

            <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex bg-card border border-border rounded-xl p-0.5">
                    {(['Income', 'Expense', 'Saving'] as FlowTab[]).map(t => (
                        <button key={t} type="button" onClick={() => setTab(t)}
                            className={cn('px-4 rounded-lg text-xs font-medium transition-all',
                                tab === t ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground')}>
                            {t}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <BarChart2 size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                    <Smile size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                </div>
            </div>

            <div className="flex gap-2 flex-1 min-h-[140px]">
                <div className="flex flex-col justify-between text-[10px] text-muted-foreground shrink-0 pb-2">
                    {Y_LABELS.map(l => <span key={l}>{l}</span>)}
                </div>
                <div className="flex-1 flex items-end gap-1.5 relative">
                    {Y_LABELS.map((_, i) => (
                        <div key={i} className="absolute w-full border-t border-dashed border-muted-foreground/10"
                            style={{ bottom: `${((i + 1) / 4) * 100}%` }} />
                    ))}
                    {CHART_DATA.map((val, i) => {
                        const isHigh = i === HIGHLIGHT_IDX;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                                {isHigh && (
                                    <span className="text-[10px] font-medium text-foreground mb-1">
                                        ${(val * 1000).toLocaleString()}
                                    </span>
                                )}
                                <div
                                    className={cn('w-full rounded-t transition-all cursor-pointer',
                                        !isHigh && 'bg-muted-foreground/12 group-hover:bg-muted-foreground/25')}
                                    style={{
                                        height: `${(val / maxVal) * 85}%`,
                                        ...(isHigh ? { background: `linear-gradient(to top, ${accentHex}90, ${accentHex})` } : {}),
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
