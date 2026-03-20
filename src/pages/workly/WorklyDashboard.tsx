import { Plus, Download, Sliders } from 'lucide-react';
import { useTheme, useCardStyle } from '@/context/ThemeContext';
import { hslToHex } from '@/lib/color-utils';
import { WorklyCashFlow } from './components/WorklyCashFlow';
import { WorklyPaymentTable } from './components/WorklyPaymentTable';
import { WorklyRightPanel } from './components/WorklyRightPanel';

interface StatCardProps {
    label: string;
    value: string;
    change: string;
}

const StatCard = ({ label, value, change }: StatCardProps) => {
    const cardStyle = useCardStyle();
    return (
        <div className="flex-1 p-4 border border-border" style={cardStyle}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <div className="flex items-center justify-between mt-2">
                <p className="text-xl font-semibold text-foreground tracking-tight">{value}</p>
                <span className="text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {change}
                </span>
            </div>
        </div>
    );
};

export const WorklyDashboard = () => {
    const { activeAccentColor } = useTheme();
    const accentHex = hslToHex(activeAccentColor);

    return (
        <div className="flex gap-4 w-full h-full min-h-0 animate-in fade-in duration-300">
            <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto scrollbar-stylized pr-1">
                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                    <button type="button" className="px-4 rounded-xl bg-card border border-border text-xs font-medium text-foreground flex items-center gap-2 hover:bg-accent transition-colors">
                        <Sliders size={14} /> Manage Balance
                    </button>
                    <button type="button" className="px-4 rounded-xl bg-card border border-border text-xs font-medium text-foreground flex items-center gap-2 hover:bg-accent transition-colors">
                        <Download size={14} /> Export
                    </button>
                    <button type="button" className="workly-btn-primary px-4 rounded-xl text-xs font-medium flex items-center gap-2 transition-all">
                        <Plus size={14} /> New Payment
                    </button>
                </div>

                <div className="flex gap-3 shrink-0">
                    <StatCard label="Total Revenue" value="$19,270.56" change="+8%" />
                    <StatCard label="Total Saving" value="$19,270.56" change="+8%" />
                    <StatCard label="Monthly Expense" value="$19,270.56" change="+8%" />
                </div>

                <WorklyCashFlow accentHex={accentHex} />
                <WorklyPaymentTable />
            </div>

            <WorklyRightPanel accentHex={accentHex} />
        </div>
    );
};
