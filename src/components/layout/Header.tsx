import { Search, Gift, Bell, Plus, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-card sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-accent/30 border border-border rounded-lg pl-10 pr-16 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:bg-accent/50 transition-all h-9"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-muted-foreground border px-1.5 py-0.5 rounded bg-card">
            <span>⌘</span>
            <span>+</span>
            <span>F</span>
          </div>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-muted-foreground mr-4 border-r pr-6">
          <button 
            onClick={toggleTheme}
            className="hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent">
            <Gift size={20} />
          </button>
          <button className="hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
          </button>
          <button className="hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent">
            <Plus size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center overflow-hidden border">
             {/* Placeholder for avatar */}
             <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">Young Alaska</span>
            <span className="text-[11px] text-muted-foreground font-medium mt-1">Bussiness</span>
          </div>
          <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </header>
  );
};
