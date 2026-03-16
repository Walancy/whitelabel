import { Palette, RefreshCw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export const LayoutSwitcher = () => {
  const { visualPattern, togglePattern } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={togglePattern}
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all active:scale-95 group",
          visualPattern === 'nexus' 
            ? "bg-foreground text-background" 
            : "bg-blue-600 text-white"
        )}
      >
        <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
        <span className="text-sm font-bold capitalize">
           Switch to {visualPattern === 'nexus' ? 'Shopeers' : 'Nexus'}
        </span>
        <Palette size={18} />
      </button>
    </div>
  );
};
