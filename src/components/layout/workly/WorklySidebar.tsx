import React, { useState, type ElementType } from 'react';
import { 
  Home, 
  Bell, 
  CheckSquare, 
  Settings, 
  FileText, 
  Users, 
  Inbox, 
  MessageSquare,
  Sparkles,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, useChromeStyle } from '@/context/ThemeContext';
import { getActiveSidebarClass, INACTIVE_SIDEBAR_CLASS } from '@/lib/sidebar-utils';
import type { SidebarNavProps } from '@/types/navigation';

interface NavItemProps {
  icon: ElementType<{ size?: number; className?: string }>;
  label: string;
  active?: boolean;
  hasDropdown?: boolean;
  isOpen?: boolean;
  collapsed?: boolean;
}

const NavItem = ({ icon: Icon, label, active, hasDropdown, isOpen, collapsed }: NavItemProps) => {
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
        active
          ? sidebarActiveStyle === 'workly-neon'
            ? 'workly-neon-active font-semibold overflow-hidden'
            : activeClass
          : INACTIVE_SIDEBAR_CLASS,
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
      <Icon size={18} className={cn("shrink-0 relative z-10 transition-colors", getIconColor())} />
      {!collapsed && (
        <div className="flex items-center justify-between w-full overflow-hidden">
          <span className={cn("font-semibold relative z-10 truncate flex-1 tracking-tight", sidebarBtnSize > 48 ? 'text-sm' : 'text-xs', !active && "text-foreground")}>{label}</span>
          {hasDropdown && (
            <ChevronDown size={14} className={cn("ml-2 transition-transform opacity-50 text-inherit", isOpen && "rotate-180", active && "opacity-100")} />
          )}
        </div>
      )}
    </div>
  );
};

export const WorklySidebar = ({ activePage, onNavigate }: SidebarNavProps = {}) => {
  const { theme } = useTheme();
  const chromeStyle = useChromeStyle();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col border-r border-border font-poppins text-foreground sticky top-0 transition-all duration-300 overflow-hidden",
      collapsed ? "w-20 px-2" : "w-64 px-3"
    )} style={chromeStyle}>
      <div className={cn(
        "flex items-center h-16 border-b border-border shrink-0 mb-6 px-3 transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center justify-start min-w-8">
           <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain" />
        </div>
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)}
            className="workly-surface w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-all"
          >
            <ArrowLeft size={14} />
          </button>
        )}
      </div>

      {collapsed && (
         <div className="px-2 mb-4">
           <button 
            onClick={() => setCollapsed(false)}
            className="workly-btn-primary w-full h-10 flex items-center justify-center rounded-full active:scale-95 transition-all group"
          >
            <ArrowRight size={18} className="text-primary-foreground" />
          </button>
         </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-hide py-2 px-1">
        <NavItem icon={Home} label="Home" collapsed={collapsed} />
        <NavItem icon={Bell} label="Notifications" collapsed={collapsed} />
        <NavItem icon={CheckSquare} label="Tasks" active collapsed={collapsed} />
        
        <div onClick={() => !collapsed && setProjectsOpen(!projectsOpen)}>
          <NavItem icon={FolderOpen} label="Projects" hasDropdown isOpen={projectsOpen} collapsed={collapsed} />
        </div>
        {projectsOpen && !collapsed && (
          <div className="ml-4 pl-4 mb-2 flex flex-col gap-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
            <NavItem icon={() => null} label="Active Work" />
            <NavItem icon={() => null} label="Roadmap" />
          </div>
        )}

        <NavItem icon={Settings} label="Settings" collapsed={collapsed} />

        {!collapsed && (
           <div className="mt-8 mb-4">
            <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Core</p>
            <NavItem icon={FileText} label="Docs" />
            <div onClick={() => onNavigate?.('users')}>
              <NavItem icon={Users} label="Usuários" active={activePage === 'users'} />
            </div>
            <NavItem icon={Inbox} label="Inbox" />
            <NavItem icon={MessageSquare} label="Help" />
          </div>
        )}
      </nav>

      <div className={cn("mt-auto px-1 pb-4 pt-4", collapsed && "hidden")}>
         <div className="workly-glass workly-plan-card p-4 rounded-lg relative overflow-hidden group">
            <Sparkles size={14} className="text-primary mb-2" />
            <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">Unlock premium.</p>
            <button className="workly-btn-primary w-full py-2 rounded-lg text-[11px] font-semibold active:scale-95 transition-all">
              Upgrade Now
            </button>
         </div>
      </div>

      <div className={cn(
        "workly-glass mt-2 mb-4 rounded-lg group cursor-pointer transition-all flex items-center overflow-hidden",
        collapsed ? "justify-center p-2" : "justify-between p-2"
      )}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center p-0.5 overflow-hidden shrink-0">
             <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&q=80" alt="Avatar" className="w-full h-full object-cover rounded-sm" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold leading-tight text-foreground truncate">Damir S.</span>
              <span className="text-[9px] text-muted-foreground truncate">Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
