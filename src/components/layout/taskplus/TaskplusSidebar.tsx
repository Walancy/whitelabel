import React, { useState, type ElementType } from 'react';
import { 
  Zap, 
  Grid, 
  Bell, 
  Layout as LayoutIcon, 
  User,
  ChevronDown,
  Rows
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, useChromeStyle } from '@/context/ThemeContext';
import { getActiveSidebarClass, INACTIVE_SIDEBAR_CLASS } from '@/lib/sidebar-utils';
import type { SidebarNavProps } from '@/types/navigation';

interface SidebarItemProps {
  icon: ElementType<{ size?: number; className?: string }>;
  label: string;
  badge?: string;
  active?: boolean;
  hasDropdown?: boolean;
  isOpen?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, badge, active, hasDropdown, isOpen, collapsed }: SidebarItemProps) => {
  const { dashboardConfig, theme } = useTheme();
  const { sidebarActiveStyle, sidebarActiveTextColor, sidebarBtnSize, sidebarBtnGap, sidebarIconColor, sidebarBorderOpacity } = dashboardConfig;
  const activeClass = getActiveSidebarClass(sidebarActiveStyle, sidebarActiveTextColor);

  const getIconColor = () => {
    if (active) return sidebarActiveStyle === 'solid' ? 'text-primary-foreground' : 'text-primary';
    if (sidebarIconColor === 'primary') return 'text-primary opacity-80 group-hover:opacity-100';
    if (sidebarIconColor === 'background') return 'text-background opacity-70 group-hover:opacity-100';
    return 'text-foreground opacity-70 group-hover:opacity-100';
  };

  const borderRgb = theme === 'dark' ? '255 255 255' : '0 0 0';
  const activeBorderStyle: React.CSSProperties = active && !['minimal', 'workly-neon'].includes(sidebarActiveStyle)
    ? { borderColor: `rgb(${borderRgb} / ${sidebarBorderOpacity / 100})` } : {};

  return (
    <div
      className={cn(
        'flex items-center rounded-[var(--radius)] cursor-pointer transition-all relative group mb-0.5',
        active ? activeClass : INACTIVE_SIDEBAR_CLASS,
        collapsed && 'justify-center px-1'
      )}
      style={{
        minHeight: `${sidebarBtnSize}px`,
        paddingLeft: collapsed ? undefined : `${sidebarBtnGap}px`,
        paddingRight: collapsed ? undefined : `${sidebarBtnGap}px`,
        gap: `${sidebarBtnGap}px`,
        ...activeBorderStyle
      }}
    >
      <Icon size={18} className={cn("shrink-0 transition-colors z-10 relative", getIconColor())} />
      {!collapsed && (
        <div className="flex items-center justify-between w-full overflow-hidden">
          <span className={cn("font-semibold truncate flex-1 tracking-tight", sidebarBtnSize > 48 ? 'text-sm' : 'text-xs', !active && "text-foreground")}>{label}</span>
          <div className="flex items-center shrink-0">
            {badge && (
              <span className={cn("px-1.5 py-0.5 rounded-full text-[9px] font-semibold ml-2", active ? "bg-primary-foreground text-primary" : "bg-muted text-muted-foreground")}>{badge}</span>
            )}
            {hasDropdown && (
              <ChevronDown size={14} className={cn("ml-2 opacity-50 transition-transform text-inherit", isOpen && "rotate-180", active && "opacity-100")} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
            <SidebarItem icon={User} label="Usuários" active={activePage === 'users'} collapsed={collapsed} />
          </div>
        </div>
      </nav>
    </aside>
  );
};
