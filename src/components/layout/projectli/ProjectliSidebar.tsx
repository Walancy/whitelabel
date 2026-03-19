import React, { type ElementType } from 'react';
import { 
  CheckCircle2, 
  Zap, 
  Home, 
  Folder, 
  MessageSquare, 
  Users, 
  Calendar, 
  Settings, 
  AlertCircle,
  ChevronDown,
  ArrowLeftToLine,
  ArrowRightToLine
} from 'lucide-react';
import { useTheme, useChromeStyle } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { getActiveSidebarClass, INACTIVE_SIDEBAR_CLASS } from '@/lib/sidebar-utils';
import { useState } from 'react';
import type { SidebarNavProps } from '@/types/navigation';

interface SidebarItemProps {
  icon: ElementType<{ size?: number; className?: string }>;
  label: string;
  badge?: string;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  isSubmenu?: boolean;
  active?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, badge, hasSubmenu, isOpen, isSubmenu, active, collapsed }: SidebarItemProps) => {
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
        isSubmenu ? 'ml-4 pl-8 py-1.5 text-[12px] rounded-none border-l border-border bg-transparent !border-transparent min-h-0' : '',
        collapsed && 'justify-center px-1'
      )}
      style={!isSubmenu ? {
        minHeight: `${sidebarBtnSize}px`,
        paddingLeft: collapsed ? undefined : `${sidebarBtnGap}px`,
        paddingRight: collapsed ? undefined : `${sidebarBtnGap}px`,
        gap: `${sidebarBtnGap}px`,
        ...activeBorderStyle
      } : {}}
    >
      <Icon size={isSubmenu ? 14 : 18} className={cn("shrink-0 transition-colors z-10 relative", getIconColor())} />
      {!collapsed && (
        <div className="flex items-center justify-between w-full overflow-hidden">
          <span className={cn("font-semibold truncate flex-1 tracking-tight", sidebarBtnSize > 48 ? 'text-sm' : 'text-xs', !active && "text-foreground")}>{label}</span>
          <div className="flex items-center shrink-0">
            {badge && (
              <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-2", active ? "bg-primary-foreground text-primary" : "bg-muted text-muted-foreground")}>{badge}</span>
            )}
            {hasSubmenu && (
              <ChevronDown size={14} className={cn("ml-2 opacity-50 transition-transform text-inherit", isOpen && "rotate-180", active && "opacity-100")} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const ProjectliSidebar = ({ activePage, onNavigate }: SidebarNavProps = {}) => {
  const { theme } = useTheme();
  const chromeStyle = useChromeStyle();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen text-foreground flex flex-col font-sans border-r border-border transition-all duration-300 sticky top-0 z-40 overflow-hidden",
      collapsed ? "w-20" : "w-64"
    )} style={chromeStyle}>
      {/* Header - Aligned to h-16 and logo left aligned */}
      <div className={cn(
        "px-6 border-b border-border shrink-0 flex items-center h-16 transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center justify-start min-w-8">
           <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain shrink-0" />
        </div>
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)}
            className="p-1 px-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground ml-auto bg-card border border-border"
          >
            <ArrowLeftToLine size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="p-4 flex justify-center border-b border-border mb-2">
          <button 
            onClick={() => setCollapsed(false)}
            className="p-2 bg-accent hover:bg-primary hover:text-primary-foreground rounded-lg transition-all shadow-sm group"
          >
            <ArrowRightToLine size={18} className="group-hover:text-primary-foreground text-primary" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 scrollbar-hide py-2">
        <div className={cn("space-y-0.5 mb-8", !collapsed && "px-2")}>
          <SidebarItem icon={CheckCircle2} label="My Tasks" badge="2" active collapsed={collapsed} />
          <SidebarItem icon={Zap} label="Activities" collapsed={collapsed} />
        </div>

        <div className="mb-4">
          {!collapsed && <h3 className="px-5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Core</h3>}
          <div className="space-y-0.5">
            <SidebarItem icon={Home} label="Overview" collapsed={collapsed} />
            
            <div onClick={() => !collapsed && setProjectsOpen(!projectsOpen)}>
              <SidebarItem icon={Folder} label="Projects" hasSubmenu isOpen={projectsOpen} collapsed={collapsed} />
            </div>
            {projectsOpen && !collapsed && (
              <div className="flex flex-col relative w-full mb-1 ml-2 pl-2 border-l border-border mt-1 gap-1">
                <SidebarItem icon={() => null} label="Active" isSubmenu collapsed={collapsed} />
                <SidebarItem icon={() => null} label="Archived" isSubmenu collapsed={collapsed} />
              </div>
            )}

            <SidebarItem icon={MessageSquare} label="Messages" collapsed={collapsed} />
            <div onClick={() => onNavigate?.('users')}>
              <SidebarItem icon={Users} label="Usuários" active={activePage === 'users'} collapsed={collapsed} />
            </div>
            <SidebarItem icon={Calendar} label="Calendar" collapsed={collapsed} />
          </div>
        </div>
      </div>

      <div className={cn(
        "p-4 border-t border-border mt-auto shrink-0",
        collapsed && "flex flex-col items-center px-2"
      )} style={chromeStyle}>
        <button className={cn(
          "w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-xs font-semibold shadow-md active:scale-[0.98] transition-all",
          collapsed && "w-10 h-10 px-0"
        )}>
           {!collapsed && <span className="text-primary-foreground">New Project</span>}
           {collapsed && <span className="text-primary-foreground text-lg">+</span>}
        </button>
        <div className="mt-4 space-y-0.5">
          <SidebarItem icon={Settings} label="Settings" collapsed={collapsed} />
          <SidebarItem icon={AlertCircle} label="Help" collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
};
