import { Bell, Search, Settings, Grid, Sun, Moon, Plus } from 'lucide-react';
import { useTheme, useChromeStyle } from '@/context/ThemeContext';

export const ProjectliHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const chromeStyle = useChromeStyle();

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b text-foreground font-sans sticky top-0 z-40 transition-colors duration-300" style={chromeStyle}>
      <div className="flex-1 max-lg:hidden max-w-lg">
        {/* Search - Transparent background & Dynamic Radius */}
        <div className="relative group bg-transparent border border-border rounded-lg h-10 flex items-center overflow-hidden transition-all">
          <Search size={16} className="ml-3 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <input 
            type="text" 
            placeholder="Search projects, tasks, or members..." 
            className="flex-1 bg-transparent border-none py-1.5 px-3 text-xs focus:ring-0 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:brightness-110 active:scale-95 transition-all">
          <Plus size={16} className="text-primary-foreground" /> New Project
        </button>
        
        <div className="h-4 w-px bg-border mx-1" />
        
        <div className="flex items-center gap-1.5">
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-all group text-muted-foreground hover:text-foreground border border-border bg-background"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-foreground" />}
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-all group relative border border-border bg-background">
            <Bell size={18} className="dark:text-foreground group-hover:text-foreground" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-muted-foreground rounded-full ring-2 ring-card shadow-sm" />
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-all group border border-border bg-background">
            <Grid size={18} className="dark:text-foreground group-hover:text-foreground" />
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-all group border border-border bg-background">
            <Settings size={18} className="dark:text-foreground group-hover:text-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-2 group cursor-pointer lg:flex hidden">
           <div className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center overflow-hidden shrink-0 group-hover:border-border transition-all">
              <img 
               src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&q=80" 
               alt="User Profile" 
               className="w-full h-full object-cover"
             />
           </div>
        </div>
      </div>
    </header>
  );
};
