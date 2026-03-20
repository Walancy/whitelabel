import React, { useState, type ElementType } from 'react';
import {
  Compass,
  ShoppingBag,
  Users,
  Box,
  Store,
  Banknote,
  BarChart3,
  Percent,
  Settings,
  HelpCircle,
  ChevronDown,
  Plus,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, useChromeStyle } from '@/context/ThemeContext';
import { getActiveSidebarClass, INACTIVE_SIDEBAR_CLASS } from '@/lib/sidebar-utils';
import type { SidebarNavProps } from '@/types/navigation';

interface SidebarItemProps {
  icon: ElementType<{ size?: number; className?: string }>;
  label: string;
  badge?: string | number;
  active?: boolean;
  collapsed?: boolean;
  hasDropdown?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, badge, active, collapsed, hasDropdown, isOpen, onClick }: SidebarItemProps) => {
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
      onClick={onClick}
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

export const MagikaSidebar = ({ activePage, onNavigate }: SidebarNavProps = {}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [financesOpen, setFinancesOpen] = useState(false);
  const { theme } = useTheme();
  const chromeStyle = useChromeStyle();

  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col border-r border-border font-sans text-foreground transition-all duration-300 sticky top-0 z-40 overflow-hidden",
      collapsed ? "w-20" : "w-64"
    )} style={chromeStyle}>
      {/* Header - h-16 and logo left aligned */}
      <div className={cn(
        "flex items-center px-6 h-16 shrink-0 border-b border-border transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center justify-start min-w-8 overflow-hidden">
          <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain shrink-0" />
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="p-4 flex justify-center border-b border-border mb-2">
          <button
            onClick={() => setCollapsed(false)}
            className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-full transition-all shadow-md group"
          >
            <Plus size={20} className="rotate-45" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 scrollbar-hide py-4">
        <SidebarItem icon={Compass} label="Dashboard" active={activePage === 'dashboard'} collapsed={collapsed} onClick={() => onNavigate?.('dashboard')} />
        <SidebarItem icon={ShoppingBag} label="Orders" badge="46" collapsed={collapsed} />
        <SidebarItem icon={Box} label="Products" collapsed={collapsed} />
        <div onClick={() => onNavigate?.('users')}>
          <SidebarItem icon={Users} label="Usuários" active={activePage === 'users'} collapsed={collapsed} />
        </div>
        <SidebarItem icon={Store} label="Online Store" collapsed={collapsed} />

        <div className="my-6 border-t border-border mx-2" />

        <div onClick={() => !collapsed && setFinancesOpen(!financesOpen)}>
          <SidebarItem icon={Banknote} label="Finances" hasDropdown isOpen={financesOpen} collapsed={collapsed} />
        </div>
        {financesOpen && !collapsed && (
          <div className="ml-4 pl-4 border-l border-border mb-4 flex flex-col gap-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
            <SidebarItem icon={() => null} label="Invoices" />
            <SidebarItem icon={() => null} label="Transactions" />
          </div>
        )}

        <SidebarItem icon={BarChart3} label="Analytics" collapsed={collapsed} />
        <SidebarItem icon={Percent} label="Discounts" collapsed={collapsed} />

        <div className="my-6 border-t border-border mx-2" />

        <div className="space-y-1">
          {!collapsed && <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Support</p>}
          <SidebarItem icon={Settings} label="Settings" collapsed={collapsed} />
          <SidebarItem icon={HelpCircle} label="Help & Support" collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
};
