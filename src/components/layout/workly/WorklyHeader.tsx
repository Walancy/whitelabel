import { Bell, Search, Settings, Grid, Sun, Moon, Plus } from 'lucide-react';
import { useTheme, useChromeStyle } from '@/context/ThemeContext';

export const WorklyHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const chromeStyle = useChromeStyle();

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-border text-foreground font-poppins sticky top-0 z-40 transition-colors duration-300" style={chromeStyle}>
      <div className="flex-1 max-lg:hidden max-w-md">
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-all" />
          <input 
            type="text" 
            placeholder="Search tasks, projects..." 
            className="w-full bg-transparent rounded-lg py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-border outline-none transition-all h-9 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="workly-btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold hover:brightness-110 active:scale-95 transition-all">
          <Plus size={16} className="opacity-90" /> New Task
        </button>
        
        <div className="h-4 w-px bg-muted-foreground/30 mx-1" />
        
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground bg-background"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-foreground" />}
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors relative bg-background group">
            <Bell size={18} className="dark:text-foreground group-hover:text-foreground" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-muted-foreground rounded-full ring-2 ring-card shadow-sm" />
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors bg-background group">
            <Grid size={18} className="dark:text-foreground group-hover:text-foreground" />
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors bg-background group">
            <Settings size={18} className="dark:text-foreground group-hover:text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};
