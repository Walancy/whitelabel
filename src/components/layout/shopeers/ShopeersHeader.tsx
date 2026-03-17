import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const ShopeersHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-card border-b border-border transition-colors sticky top-0 z-40 font-poppins">
      {/* Search - Transparent background & Dynamic Radius */}
      <div className="flex-1 max-w-sm">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-transparent border border-border rounded-lg pl-10 pr-12 text-xs focus:outline-none focus:ring-1 focus:ring-border transition-all h-10 text-foreground placeholder:text-muted-foreground"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-semibold text-muted-foreground border border-border px-1.5 py-0.5 rounded-sm bg-card">
            <span>⌘K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all border border-border bg-background"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-foreground" />}
        </button>
        
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all border border-border bg-background relative group">
          <Bell size={18} className="dark:text-foreground group-hover:text-foreground" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-muted-foreground rounded-full ring-2 ring-card shadow-sm" />
        </button>

        <div className="ml-2 pl-4 border-l border-border group cursor-pointer">
          <div className="w-9 h-9 rounded-lg bg-accent p-0.5 border border-border group-hover:border-border transition-all overflow-hidden flex items-center justify-center">
             <img 
               src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&q=80" 
               alt="User Profile" 
               className="w-full h-full object-cover group-hover:scale-110 transition-transform"
             />
          </div>
        </div>
      </div>
    </header>
  );
};
