import { Search, Bell, Settings, Sun, Moon, Plus } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const MagikaHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b bg-card text-foreground font-sans sticky top-0 z-40 transition-colors duration-300">
      <div className="flex-1 max-w-md">
        {/* Search - Transparent background & Dynamic Radius */}
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-all" />
          <input 
            type="text" 
            placeholder="Search Magika..." 
            className="w-full bg-transparent border border-border rounded-lg py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-border outline-none transition-all h-9 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:brightness-110 active:scale-95 transition-all">
          <Plus size={16} className="text-primary-foreground" /> New Workspace
        </button>
        
        <div className="flex items-center gap-1.5 ml-2">
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors border border-border bg-background"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-foreground" />}
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors relative border border-border bg-background group">
            <Bell size={18} className="dark:text-foreground group-hover:text-foreground" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-muted-foreground rounded-full ring-2 ring-card shadow-sm" />
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors border border-border bg-background group">
            <Settings size={18} className="dark:text-foreground group-hover:text-foreground" />
          </button>
        </div>

        <div className="w-9 h-9 rounded-lg bg-accent border border-border flex items-center justify-center overflow-hidden ml-2 cursor-pointer group hover:border-border transition-all">
           <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&q=80" 
            alt="User" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
