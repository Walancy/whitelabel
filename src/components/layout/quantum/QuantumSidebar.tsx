import React, { useState, type ElementType } from 'react';
import { 
  Layout as LayoutIcon, 
  Folder, 
  CheckSquare, 
  Mail, 
  MessageSquare, 
  Settings, 
  User, 
  Activity, 
  ChevronDown,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, useChromeStyle } from '@/context/ThemeContext';
import { getActiveSidebarClass, INACTIVE_SIDEBAR_CLASS } from '@/lib/sidebar-utils';
import type { SidebarNavProps } from '@/types/navigation';

interface SidebarItemProps {
  icon: ElementType<{ size?: number; className?: string }>;
  label: string;
  active?: boolean;
  hasDropdown?: boolean;
  isOpen?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, hasDropdown, isOpen, collapsed }: SidebarItemProps) => {
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
          {hasDropdown ? (
            <ChevronDown size={14} className={cn("ml-2 opacity-50 transition-transform text-inherit", isOpen && "rotate-180", active && "opacity-100")} />
          ) : (
            active && null
          )}
        </div>
      )}
    </div>
  );
};

export const QuantumSidebar = ({ activePage, onNavigate }: SidebarNavProps = {}) => {
  const { theme } = useTheme();
  const chromeStyle = useChromeStyle();
  const [repoOpen, setRepoOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col border-r border-border font-sans transition-colors duration-300 sticky top-0 z-40 overflow-hidden",
      collapsed ? "w-20" : "w-64"
    )} style={chromeStyle}>
      <div className={cn(
        "flex items-center h-16 px-6 border-b border-border shadow-sm mb-6 transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
         <div className="flex items-center justify-start min-w-8 overflow-hidden">
            <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain shrink-0" />
         </div>
         {!collapsed && (
            <button 
              onClick={() => setCollapsed(true)}
              className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground shrink-0 border border-border"
            >
              <ChevronsLeft size={16} />
            </button>
         )}
      </div>

      {collapsed && (
        <div className="px-5 mb-4">
           <button 
           onClick={() => setCollapsed(false)}
           className="w-10 h-10 flex items-center justify-center bg-accent hover:bg-primary hover:text-primary-foreground rounded-lg transition-all shadow-sm group"
         >
           <ChevronsRight size={18} className="text-primary group-hover:text-primary-foreground" />
         </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 scrollbar-hide py-2">
        <div className="space-y-1">
          <SidebarItem icon={LayoutIcon} label="Console" active collapsed={collapsed} />
          
          <div onClick={() => !collapsed && setRepoOpen(!repoOpen)}>
            <SidebarItem icon={Folder} label="Repository" hasDropdown isOpen={repoOpen} collapsed={collapsed} />
          </div>
          {repoOpen && !collapsed && (
            <div className="ml-4 pl-4 border-l border-border mb-2 flex flex-col gap-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
               <SidebarItem icon={() => null} label="Main Branch" />
               <SidebarItem icon={() => null} label="Archive" />
            </div>
          )}

          <SidebarItem icon={CheckSquare} label="Backlog" collapsed={collapsed} />
          <SidebarItem icon={Mail} label="Comms" collapsed={collapsed} />
          <SidebarItem icon={MessageSquare} label="Feedback" collapsed={collapsed} />
          <div onClick={() => onNavigate?.('users')}>
            <SidebarItem icon={User} label="Usuários" active={activePage === 'users'} collapsed={collapsed} />
          </div>
        </div>

        {!collapsed && (
           <>
            <div className="my-8 border-t border-border mx-2" />
            <div className="space-y-1">
               <SidebarItem icon={Activity} label="Activity" />
               <SidebarItem icon={User} label="Profile" />
               <SidebarItem icon={Settings} label="Preferences" />
            </div>
           </>
        )}
      </nav>

      <div className="mt-auto p-4 border-t border-border" style={chromeStyle}>
         <div className={cn(
           "flex items-center bg-accent/20 rounded-lg border border-border group cursor-pointer hover:bg-accent transition-all",
           collapsed ? "justify-center p-2" : "gap-3 p-2"
         )}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm border border-border">
                <span className="text-primary-foreground text-xs font-bold leading-none">QH</span>
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-[11px] font-semibold text-foreground truncate">Quantum High</p>
                <p className="text-[9px] text-muted-foreground truncate uppercase tracking-widest">Operator</p>
              </div>
            )}
         </div>
      </div>
    </aside>
  );
};
