import React, { useState } from 'react';
import { useTheme, useChromeStyle } from '@/context/ThemeContext';
import { type AppPage } from '@/App';
import { getActiveSidebarClass, INACTIVE_SIDEBAR_CLASS } from '@/lib/sidebar-utils';
import {
  PanelLeftClose,
  PanelLeft,
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
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: any;
  label: string;
  badge?: string | number;
  active?: boolean;
  collapsed?: boolean;
  tag?: string;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  isSubmenu?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, badge, active, collapsed, tag, hasSubmenu, isOpen, isSubmenu, onClick }: SidebarItemProps) => {
  const { dashboardConfig, theme } = useTheme();
  const { sidebarActiveStyle, sidebarBtnSize, sidebarBtnGap, sidebarIconColor, sidebarActiveTextColor, sidebarBorderOpacity } = dashboardConfig;

  const activeClass = getActiveSidebarClass(sidebarActiveStyle, sidebarActiveTextColor);

  const getIconColor = () => {
    if (active) {
      if (sidebarActiveStyle === 'solid') return 'text-primary-foreground';
      return 'text-primary';
    }
    if (sidebarIconColor === 'primary') return 'text-primary opacity-80 group-hover:opacity-100';
    if (sidebarIconColor === 'foreground') return 'text-foreground opacity-70 group-hover:opacity-100';
    if (sidebarIconColor === 'background') return 'text-background opacity-70 group-hover:opacity-100';
    return 'text-muted-foreground group-hover:text-foreground';
  };

  const borderRgb = theme === 'dark' ? '255 255 255' : '0 0 0';
  const activeBorderStyle = active && !['minimal', 'workly-neon'].includes(sidebarActiveStyle)
    ? { borderColor: `rgb(${borderRgb} / ${sidebarBorderOpacity / 100})` }
    : {};


  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center rounded-[var(--radius)] cursor-pointer transition-all group mb-0.5 relative',
        active ? activeClass : INACTIVE_SIDEBAR_CLASS,
        collapsed && 'justify-center px-1',
        isSubmenu && 'ml-4 pl-8 py-1.5 text-[12px] rounded-none border-l border-border bg-transparent !border-transparent min-h-0'
      )}
      style={!isSubmenu ? {
        minHeight: `${sidebarBtnSize}px`,
        paddingLeft: collapsed ? undefined : `${sidebarBtnGap}px`,
        paddingRight: collapsed ? undefined : `${sidebarBtnGap}px`,
        gap: `${sidebarBtnGap}px`,
        ...activeBorderStyle
      } : {}}
    >
      <Icon size={isSubmenu ? 14 : 20} className={cn("shrink-0 transition-colors z-10 relative", getIconColor())} />
      {!collapsed && (
        <div className="flex items-center justify-between w-full overflow-hidden">
          <span className={cn(
            "font-semibold truncate flex-1 tracking-tight",
            dashboardConfig.sidebarBtnSize > 48 ? 'text-sm' : 'text-xs',
            !active && "text-foreground"
          )}>
            {label}
          </span>
          <div className="flex items-center shrink-0">
            {badge && (
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-[9px] font-semibold ml-2",
                active ? "bg-primary-foreground text-primary" : "bg-muted text-muted-foreground"
              )}>
                {badge}
              </span>
            )}
            {tag && <span className={cn("bg-muted border border-border text-muted-foreground px-1.5 py-0.5 rounded-sm text-[9px] font-semibold ml-2", active && "bg-primary-foreground/20 text-inherit border-transparent")}>{tag}</span>}
            {hasSubmenu && (
              <ChevronDown size={14} className={cn("ml-2 opacity-50 transition-transform text-inherit", isOpen && "rotate-180", active && "opacity-100")} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarSection = ({ title, children, collapsed }: { title: string; children: React.ReactNode; collapsed?: boolean }) => {
  return (
    <div className="flex flex-col gap-0.5 px-3 mb-6">
      {!collapsed && <h3 className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-3">{title}</h3>}
      {children}
    </div>
  );
};

export const Sidebar = ({ activePage = 'dashboard', onNavigate }: { activePage?: AppPage; onNavigate?: (p: AppPage) => void }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [financesOpen, setFinancesOpen] = useState(false);
  const { theme } = useTheme();
  const chromeStyle = useChromeStyle();

  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside
      className={cn(
        "h-screen flex flex-col border-r text-foreground transition-all duration-300 relative sticky top-0 font-sans z-40 overflow-visible",
        collapsed ? "w-16" : "w-60"
      )}
      style={chromeStyle}
    >
      {/* Header - Aligned to h-16 and logo left aligned */}
      <div className={cn(
        "flex items-center px-6 h-16 shrink-0 border-b border-border transition-all duration-300",
        collapsed ? "justify-center" : "justify-start"
      )}>
        <div className="flex items-center justify-start min-w-8 overflow-hidden">
          <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain shrink-0" />
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 border border-border rounded-lg hover:bg-accent transition-all absolute -right-3.5 top-8 -translate-y-1/2 bg-background z-[60] shadow-sm text-muted-foreground hover:text-foreground flex items-center justify-center animate-in fade-in duration-500"
        >
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide px-1">
        <SidebarSection title="General" collapsed={collapsed}>
          <SidebarItem icon={Compass} label="Dashboard" active={activePage === 'dashboard'} collapsed={collapsed} onClick={() => onNavigate?.('dashboard')} />
          <SidebarItem icon={ShoppingBag} label="Orders" badge="46" collapsed={collapsed} />
          <SidebarItem icon={Box} label="Products" collapsed={collapsed} />
          <SidebarItem icon={Users} label="Usuários" active={activePage === 'users'} collapsed={collapsed} onClick={() => onNavigate?.('users')} />
          <SidebarItem icon={Store} label="Online Store" collapsed={collapsed} />
        </SidebarSection>

        <SidebarSection title="Finances" collapsed={collapsed}>
          <div onClick={() => !collapsed && setFinancesOpen(!financesOpen)}>
            <SidebarItem icon={Banknote} label="Finances" hasSubmenu isOpen={financesOpen} collapsed={collapsed} />
          </div>
          {financesOpen && !collapsed && (
            <div className="flex flex-col mb-1 gap-1">
              <SidebarItem icon={() => null} label="Invoices" isSubmenu collapsed={collapsed} />
              <SidebarItem icon={() => null} label="Transactions" isSubmenu collapsed={collapsed} />
            </div>
          )}
          <SidebarItem icon={BarChart3} label="Analytics" collapsed={collapsed} />
          <SidebarItem icon={Percent} label="Discounts" collapsed={collapsed} />
        </SidebarSection>

        <SidebarSection title="System" collapsed={collapsed}>
          <SidebarItem icon={Settings} label="Settings" collapsed={collapsed} />
          <SidebarItem icon={HelpCircle} label="Help & Support" collapsed={collapsed} />
        </SidebarSection>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border shrink-0 bg-background">
        {!collapsed ? (
          <div className="p-3.5 relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card/80 to-background shadow-sm hover:border-border transition-all group">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all pointer-events-none" />
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <Sparkles size={16} className="text-foreground shrink-0 fill-foreground/20" />
              <span className="text-[13px] font-semibold tracking-tight text-foreground truncate">Boost with AI</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-[1.4] mb-4 relative z-10">
              AI-powered replies, tag insights, and tools that save hours.
            </p>
            <button className="w-full bg-primary text-primary-foreground rounded-lg text-xs font-bold transition-all hover:brightness-110 active:scale-[0.98] py-2 relative z-10 shadow-[0_0_12px_rgba(var(--primary),0.3)] hover:shadow-[0_0_16px_rgba(var(--primary),0.4)]">
              Upgrade to Pro
            </button>
          </div>
        ) : (
          <button className="w-full flex justify-center items-center bg-primary text-primary-foreground rounded-lg transition-all hover:brightness-110 active:scale-[0.98] py-2 relative overflow-hidden group">
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Sparkles size={16} className="relative z-10 fill-primary-foreground/20" />
          </button>
        )}
      </div>
    </aside>
  );
};
