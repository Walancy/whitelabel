import { useState, type ElementType } from 'react';
import { 
  Plus, 
  Search, 
  Zap, 
  Grid, 
  Bell, 
  Layout as LayoutIcon, 
  Inbox, 
  Folder, 
  Calendar, 
  BarChart2, 
  HelpCircle, 
  Settings,
  ChevronDown,
  Rows
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, useChromeStyle } from '@/context/ThemeContext';
import type { SidebarNavProps } from '@/types/navigation';

interface SidebarItemProps {
  icon: ElementType;
  label: string;
  badge?: string;
  active?: boolean;
  hasDropdown?: boolean;
  isOpen?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, badge, active, hasDropdown, isOpen, collapsed }: SidebarItemProps) => (
  <div className={cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all mb-0.5 group min-h-[44px]",
    active ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
    collapsed && "justify-center px-1"
  )}>
    <Icon size={18} className={cn("transition-colors shrink-0", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
    {!collapsed && (
      <>
        <span className={cn("text-xs font-semibold truncate flex-1", active ? "text-primary-foreground" : "text-foreground")}>{label}</span>
        {badge && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full",
            active ? "bg-primary-foreground text-primary" : "bg-muted text-muted-foreground"
          )}>
            {badge}
          </span>
        )}
        {hasDropdown && (
          <ChevronDown size={14} className={cn("transition-transform opacity-50", isOpen && "rotate-180", active && "text-primary-foreground opacity-100")} />
        )}
      </>
    )}
  </div>
);

export const TaskplusSidebar = ({ activePage, onNavigate }: SidebarNavProps = {}) => {
  const { theme } = useTheme();
  const chromeStyle = useChromeStyle();
  const [boardsOpen, setBoardsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col border-r border-border font-sans sticky top-0 z-40 overflow-hidden transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )} style={chromeStyle}>
      {/* Brand - Header Height Aligned to h-16, Logo Left */}
      <div className={cn(
        "flex items-center h-16 px-6 border-b border-border shrink-0 mb-6 transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
         <div className="flex items-center justify-start min-w-8 overflow-hidden">
            <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain shrink-0" />
         </div>
         {!collapsed && (
            <button 
              onClick={() => setCollapsed(true)}
              className="p-1 px-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground"
            >
              <Rows size={18} />
            </button>
         )}
      </div>

      {collapsed && (
        <div className="px-5 mb-4">
           <button 
           onClick={() => setCollapsed(false)}
           className="w-10 h-10 flex items-center justify-center bg-accent hover:bg-primary hover:text-primary-foreground rounded-lg transition-all shadow-sm group"
         >
           <Rows size={18} className="rotate-90 text-primary group-hover:text-primary-foreground" />
         </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 scrollbar-hide py-2">
        <div className="space-y-1">
          <SidebarItem icon={Zap} label="Overview" active collapsed={collapsed} />
          
          <div onClick={() => !collapsed && setBoardsOpen(!boardsOpen)}>
            <SidebarItem icon={Grid} label="Boards" hasDropdown isOpen={boardsOpen} collapsed={collapsed} />
          </div>
          {boardsOpen && !collapsed && (
            <div className="ml-4 flex flex-col gap-0.5 mb-2 mt-1 animate-in slide-in-from-top-1 duration-200">
               <SidebarItem icon={() => null} label="Design Team" />
               <SidebarItem icon={() => null} label="Marketing" />
            </div>
          )}

          <SidebarItem icon={Bell} label="Activities" badge="8" collapsed={collapsed} />
          <SidebarItem icon={LayoutIcon} label="Templates" collapsed={collapsed} />
          <div onClick={() => onNavigate?.('users')}>
            <SidebarItem icon={Users} label="Usuários" active={activePage === 'users'} collapsed={collapsed} />
          </div>
        </div>
      </nav>
    </aside>
  );
};
