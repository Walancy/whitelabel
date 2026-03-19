import React, { useState, type ElementType } from 'react';
import { 
  ChevronDown, 
  Compass, 
  ShoppingBag, 
  Box, 
  Users, 
  Store, 
  Banknote, 
  BarChart3, 
  Percent, 
  Settings, 
  HelpCircle, 
  SquareChevronLeft, 
  SquareChevronRight 
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
  hasSubmenu?: boolean;
  isOpen?: boolean;
  isSubmenu?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, badge, active, hasSubmenu, isOpen, isSubmenu, collapsed }: SidebarItemProps) => {
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
        <>
          <span className={cn("font-semibold truncate flex-1 tracking-tight", sidebarBtnSize > 48 ? 'text-sm' : 'text-xs', !active && "text-foreground")}>{label}</span>
          {badge && (
            <span className={cn("px-1.5 py-0.5 rounded-full text-[9px] font-semibold ml-2", active ? "bg-primary-foreground text-primary" : "bg-muted text-muted-foreground")}>
              {badge}
            </span>
          )}
          {hasSubmenu && (
            <ChevronDown size={14} className={cn("ml-2 opacity-50 transition-transform text-inherit", isOpen && "rotate-180", active && "opacity-100")} />
          )}
        </>
      )}
    </div>
  );
};

export const ShopeersSidebar = ({ activePage, onNavigate }: SidebarNavProps = {}) => {
  const [financesOpen, setFinancesOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const chromeStyle = useChromeStyle();
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col border-r border-border font-poppins text-foreground transition-all duration-300 shrink-0 sticky top-0 z-40 overflow-hidden",
      collapsed ? "w-20 px-2" : "w-64 px-1"
    )} style={chromeStyle}>
      {/* Header - h-16 alignment and logo left aligned */}
      <div className={cn(
        "flex items-center px-6 h-16 shrink-0 border-b border-border mb-4 relative transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center justify-start min-w-8">
           <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain shrink-0" />
        </div>
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)}
            className="p-1 px-1.5 hover:text-primary transition-all text-muted-foreground shrink-0"
          >
            <SquareChevronLeft size={22} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="px-3 mb-4 flex justify-center">
           <button 
            onClick={() => setCollapsed(false)}
            className="text-primary hover:scale-110 transition-all"
          >
            <SquareChevronRight size={24} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 scrollbar-hide py-2">
        <div className="space-y-0.5">
            <SidebarItem icon={Compass} label="Dashboard" active collapsed={collapsed} />
            <SidebarItem icon={ShoppingBag} label="Orders" badge="46" collapsed={collapsed} />
            <SidebarItem icon={Box} label="Products" collapsed={collapsed} />
            <div onClick={() => onNavigate?.('users')}>
              <SidebarItem icon={Users} label="Usuários" active={activePage === 'users'} collapsed={collapsed} />
            </div>
            <SidebarItem icon={Store} label="Online Store" collapsed={collapsed} />
        </div>

        <div className="my-6 border-t border-border mx-3" />

        <div onClick={() => !collapsed && setFinancesOpen(!financesOpen)}>
          <SidebarItem 
            icon={Banknote} 
            label="Finances" 
            hasSubmenu 
            isOpen={financesOpen} 
            collapsed={collapsed}
          />
        </div>
        
        {financesOpen && !collapsed && (
          <div className="flex flex-col relative mb-4">
             <SidebarItem icon={() => null} label="Invoices" isSubmenu collapsed={collapsed} />
             <SidebarItem icon={() => null} label="Transactions" isSubmenu collapsed={collapsed} />
          </div>
        )}

        <div className="space-y-0.5">
            <SidebarItem icon={BarChart3} label="Analytics" collapsed={collapsed} />
            <SidebarItem icon={Percent} label="Discounts" collapsed={collapsed} />
        </div>

        <div className="mt-8 pt-6 space-y-0.5 border-t border-border mb-4">
          <SidebarItem icon={Settings} label="Settings" collapsed={collapsed} />
          <SidebarItem icon={HelpCircle} label="Help & Support" collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
};
