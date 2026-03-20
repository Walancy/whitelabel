import { Search, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCardStyle } from '@/context/ThemeContext';

type Status = 'Received' | 'Failed' | 'Processed';

interface Payment {
    id: string;
    user: string;
    avatar: string;
    amount: string;
    period: string;
    status: Status;
}

const PAYMENTS: Payment[] = [
    { id: 'PAY-12345XYZ', user: 'Savannah Nguyen', avatar: 'https://i.pravatar.cc/28?u=savannah', amount: '$1,164.99 USD', period: 'Jun 10 - Jun 15', status: 'Received' },
    { id: 'TXN-98765A9', user: 'Jordan Lee', avatar: 'https://i.pravatar.cc/28?u=jordanl', amount: '$1,072.98 USD', period: 'Jun 16 - Jun 17', status: 'Failed' },
    { id: 'INV-56789LMN', user: 'Alexis Kim', avatar: 'https://i.pravatar.cc/28?u=alexisk', amount: '$977.98 USD', period: 'Jun 20 - Jun 29', status: 'Processed' },
];

const STATUS_STYLES: Record<Status, string> = {
    Received: 'bg-green-500/15 text-green-500',
    Failed: 'bg-red-500/15 text-red-500',
    Processed: 'bg-blue-500/15 text-blue-500',
};

const COLS = ['Payment ID', 'User', 'Total Amount', 'Payment Period', 'Status'];

export const WorklyPaymentTable = () => {
    const cardStyle = useCardStyle();

    return (
        <div className="p-4 border border-border shrink-0" style={cardStyle}>
            <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 flex items-center gap-2 px-3 rounded-xl bg-background border border-border">
                    <Search size={14} className="text-muted-foreground shrink-0" />
                    <input
                        type="text"
                        placeholder="Search Anything..."
                        className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                        aria-label="Search payments"
                    />
                </div>
                <button type="button" className="px-3 rounded-xl bg-background border border-border text-xs font-medium text-foreground flex items-center gap-1.5 hover:bg-accent transition-colors">
                    <Download size={13} /> Export
                </button>
                <button type="button" className="px-3 rounded-xl bg-background border border-border text-xs font-medium text-foreground flex items-center gap-1.5 hover:bg-accent transition-colors">
                    <Download size={13} /> Export
                </button>
            </div>

            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        <th className="w-8 py-2.5">
                            <input type="checkbox" className="w-4 h-4 rounded accent-primary" aria-label="Select all" />
                        </th>
                        {COLS.map(c => (
                            <th key={c} className="text-left text-[11px] font-medium text-muted-foreground py-2.5 px-3">{c}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {PAYMENTS.map(p => (
                        <tr key={p.id} className="border-b border-border/40 hover:bg-accent/30 transition-colors">
                            <td className="py-3">
                                <input type="checkbox" className="w-4 h-4 rounded accent-primary" aria-label={`Select ${p.id}`} />
                            </td>
                            <td className="text-xs font-medium text-foreground py-3 px-3">{p.id}</td>
                            <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                    <img src={p.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                                    <span className="text-xs text-foreground">{p.user}</span>
                                </div>
                            </td>
                            <td className="text-xs text-foreground py-3 px-3">{p.amount}</td>
                            <td className="text-xs text-muted-foreground py-3 px-3">{p.period}</td>
                            <td className="py-3 px-3">
                                <span className={cn('text-[11px] font-medium px-2.5 py-1 rounded-full', STATUS_STYLES[p.status])}>
                                    {p.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
