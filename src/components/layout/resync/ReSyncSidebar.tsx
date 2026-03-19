import React, { useState, type ElementType } from 'react';
import { 
  Plus, 
  Home, 
  HardDrive, 
  Monitor, 
  Trash2, 
  Activity,
  Columns,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, useChromeStyle } from '@/context/ThemeContext';
import { getActiveSidebarClass, INACTIVE_SIDEBAR_CLASS } from '@/lib/sidebar-utils';
import type { SidebarNavProps } from '@/types/navigation';

interface SidebarItemProps {
  icon: ElementType<{ size?: number; className?: string }>;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  hasDropdown?: boolean;
  isOpen?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, collapsed, hasDropdown, isOpen }: SidebarItemProps) => {
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
          {hasDropdown && (
            <ChevronDown size={14} className={cn("ml-2 opacity-50 transition-transform text-inherit", isOpen && "rotate-180", active && "opacity-100")} />
          )}
        </div>
      )}
    </div>
  );
};

export const ReSyncSidebar = ({ activePage, onNavigate }: SidebarNavProps = {}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const { theme } = useTheme();
  const chromeStyle = useChromeStyle();
  
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col border-r border-border font-sans transition-all duration-300 sticky top-0 z-40 overflow-hidden",
      collapsed ? "w-20" : "w-64"
    )} style={chromeStyle}>
      <div className={cn(
        "flex items-center px-6 h-16 shrink-0 border-b border-border mb-6 relative transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center justify-start min-w-8">
           <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain shrink-0" />
        </div>
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Columns size={18} />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="px-5 mb-4">
           <button 
           onClick={() => setCollapsed(false)}
           className="w-10 h-10 flex items-center justify-center bg-accent hover:bg-primary hover:text-primary-foreground rounded-lg transition-all shadow-sm group"
         >
           <Columns size={18} className="text-primary group-hover:text-primary-foreground" />
         </button>
        </div>
      )}

      <div className="px-3 mb-6">
        <button className={cn(
          "w-full bg-primary text-primary-foreground rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:brightness-110 active:scale-95 transition-all",
          collapsed ? "h-10 px-0" : "h-11"
        )}>
          <Plus size={18} className="text-primary-foreground" />
          {!collapsed && <span className="text-primary-foreground">New Sync</span>}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 scrollbar-hide py-2">
        <div className="space-y-1">
          <SidebarItem icon={Home} label="Local Hub" active collapsed={collapsed} />
          
          <div onClick={() => !collapsed && setStorageOpen(!storageOpen)}>
            <SidebarItem icon={HardDrive} label="Storage" hasDropdown isOpen={storageOpen} collapsed={collapsed} />
          </div>
          {storageOpen && !collapsed && (
            <div className="ml-4 pl-4 border-l border-border mb-2 flex flex-col gap-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
               <SidebarItem icon={() => null} label="Cloud sync" />
               <SidebarItem icon={() => null} label="External" />
            </div>
          )}

          <SidebarItem icon={Monitor} label="Devices" collapsed={collapsed} />
          <SidebarItem icon={Activity} label="Logs" collapsed={collapsed} />
          <SidebarItem icon={Trash2} label="Bin" collapsed={collapsed} />
          <div onClick={() => onNavigate?.('users')}>
            <SidebarItem icon={Columns} label="Usuários" active={activePage === 'users'} collapsed={collapsed} />
          </div>
        </div>
      </nav>
    </aside>
  );
};
