import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const ShopeersHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-slate-950 transition-colors">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded-lg bg-white dark:bg-slate-950">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition-colors border border-slate-100 dark:border-slate-800"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition-colors border border-slate-100 dark:border-slate-800 relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-slate-950"></span>
        </button>

        <div className="ml-2 pl-4 border-l border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800 cursor-pointer hover:scale-105 transition-transform">
             <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <span className="text-lg">👨🏻‍💻</span>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};
