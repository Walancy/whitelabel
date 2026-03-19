import { Search, Gift, Bell, Plus, ChevronDown, Sun, Moon, LayoutDashboard, CreditCard, Users, MessageSquare } from 'lucide-react';
import { useTheme, useChromeStyle } from '@/context/ThemeContext';

export const Header = () => {
  const { theme, toggleTheme, dashboardConfig } = useTheme();
  const chromeStyle = useChromeStyle();

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 sticky top-0 z-30 font-sans transition-all duration-300" style={chromeStyle}>
      
      {dashboardConfig.layoutMode === 'topbar' ? (
        <div className="flex items-center gap-8 flex-1">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground transform rotate-3 shadow-sm">
              <span className="font-bold font-serif italic text-lg leading-none -ml-0.5">N</span>
            </div>
            <span className="font-bold text-lg tracking-tight -ml-0.5 text-foreground hidden sm:block">Nexus</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6">
            <button className="text-sm font-semibold text-foreground flex items-center gap-2 relative after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-t-full transition-colors">
              <LayoutDashboard size={16} className="text-primary" /> Overview
            </button>
            <button className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
              <CreditCard size={16} /> Finance
            </button>
            <button className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
              <Users size={16} /> Customers
            </button>
            <button className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
              <MessageSquare size={16} /> Help
            </button>
          </nav>
        </div>
      ) : (
        <div className="flex-1 max-md:hidden max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-muted/50 border border-border rounded-[var(--radius)] pl-10 pr-16 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all h-9 text-foreground placeholder:text-muted-foreground/60"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-semibold text-muted-foreground border border-border px-1.5 py-0.5 rounded-[calc(var(--radius)-2px)] bg-background">
              <span>⌘K</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions & Profile */}
      <div className="flex items-center gap-3 md:gap-6 shrink-0 z-10 pl-4">
        <div className="flex items-center text-muted-foreground mr-2 md:mr-4 md:border-r border-border md:pr-6 gap-3">
          <button 
            onClick={toggleTheme}
            className="hover:text-foreground transition-colors p-2 rounded-[var(--radius)] hover:bg-accent flex items-center justify-center h-9 w-9"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-foreground" />}
          </button>
          <button className="hover:text-foreground transition-colors p-2 rounded-[var(--radius)] hover:bg-accent flex items-center justify-center h-9 w-9">
            <Gift size={18} className="dark:text-foreground" />
          </button>
          <button className="hover:text-foreground transition-colors p-2 rounded-[var(--radius)] hover:bg-accent relative flex items-center justify-center h-9 w-9 group/btn">
            <Bell size={18} className="dark:text-foreground" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-muted-foreground rounded-full ring-2 ring-card z-10 transition-transform group-hover/btn:scale-125"></span>
          </button>
          <button className="text-primary-foreground bg-primary hover:brightness-110 active:scale-[0.98] transition-all h-9 w-9 flex items-center justify-center rounded-[var(--radius)] shadow-sm">
            <Plus size={18} className="text-primary-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer group shrink-0">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center overflow-hidden border border-border group-hover:border-border transition-all">
             <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&q=80" alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col truncate hidden sm:flex">
            <span className="text-sm font-semibold leading-none truncate dark:text-foreground">Young Alaska</span>
            <span className="text-[10px] text-muted-foreground font-semibold mt-1">Business Account</span>
          </div>
          <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
