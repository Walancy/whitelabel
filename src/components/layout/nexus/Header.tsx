import { Search, Gift, Bell, Plus, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-card sticky top-0 z-30 font-sans transition-colors duration-300">
      {/* Search - Transparent background & Dynamic Radius */}
      <div className="flex-1 max-md:hidden max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-transparent border border-border rounded-lg pl-10 pr-16 text-xs focus:outline-none focus:ring-1 focus:ring-border transition-all h-9 text-foreground placeholder:text-muted-foreground"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-semibold text-muted-foreground border border-border px-1.5 py-0.5 rounded-sm bg-card">
            <span>⌘K</span>
          </div>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-muted-foreground mr-4 border-r border-border pr-6">
          <button 
            onClick={toggleTheme}
            className="hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent flex items-center justify-center h-9 w-9"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-foreground" />}
          </button>
          <button className="hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent flex items-center justify-center h-9 w-9">
            <Gift size={18} className="dark:text-foreground" />
          </button>
          <button className="hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent relative flex items-center justify-center h-9 w-9">
            <Bell size={18} className="dark:text-foreground" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-muted-foreground rounded-full ring-2 ring-card"></span>
          </button>
          <button className="text-primary-foreground bg-primary hover:brightness-110 transition-colors h-9 w-9 flex items-center justify-center rounded-lg shadow-sm">
            <Plus size={18} className="text-primary-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center overflow-hidden border border-border group-hover:border-border transition-all">
             <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&q=80" alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold leading-none truncate dark:text-foreground">Young Alaska</span>
            <span className="text-[10px] text-muted-foreground font-semibold mt-1">Business Account</span>
          </div>
          <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
        </div>
      </div>
    </header>
  );
};
