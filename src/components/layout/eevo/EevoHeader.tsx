import { Search, Bell, Grid, Plus, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const EevoHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b bg-card border-border sticky top-0 z-40 font-sans transition-colors duration-300">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative max-w-sm w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search platform..." 
            className="w-full bg-transparent border border-border rounded-lg py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-border outline-none h-9 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:brightness-110 active:scale-95 transition-all mr-4">
          <Plus size={16} className="text-primary-foreground" /> Create New
        </button>

        <button 
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-all text-muted-foreground hover:text-foreground border border-border bg-background"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-foreground" />}
        </button>
        
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-all relative border border-border bg-background group">
          <Bell size={18} className="dark:text-foreground group-hover:text-foreground" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-muted-foreground rounded-full ring-2 ring-card shadow-sm" />
        </button>
        
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-all border border-border bg-background group">
          <Grid size={18} className="dark:text-foreground group-hover:text-foreground" />
        </button>
      </div>
    </header>
  );
};
