import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { 
  PanelLeftClose, 
  PanelLeft, 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  MessageSquare, 
  Package, 
  FileText, 
  BarChart3, 
  Zap, 
  Settings, 
  ShieldCheck, 
  HelpCircle,
  Gem,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  badge?: string | number;
  active?: boolean;
  collapsed?: boolean;
  tag?: string;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  isSubmenu?: boolean;
}

const SidebarItem = ({ icon: Icon, label, badge, active, collapsed, tag, hasSubmenu, isOpen, isSubmenu }: SidebarItemProps) => {
  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all group mb-0.5 min-h-[44px]",
      active ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      collapsed && "justify-center px-1",
      isSubmenu && "ml-4 pl-8 py-1.5 text-[12px] rounded-none border-l border-border"
    )}>
      <Icon size={isSubmenu ? 14 : 20} className={cn("shrink-0 transition-colors", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
      {!collapsed && (
        <div className="flex items-center justify-between w-full overflow-hidden">
          <span className={cn("text-xs font-semibold truncate flex-1 tracking-tight", active ? "text-primary-foreground" : "text-foreground")}>{label}</span>
          <div className="flex items-center shrink-0">
            {badge && (
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-[9px] font-semibold ml-2",
                active ? "bg-primary-foreground text-primary" : "bg-muted text-muted-foreground"
              )}>
                {badge}
              </span>
            )}
            {tag && <span className={cn("bg-muted border border-border text-muted-foreground px-1.5 py-0.5 rounded-sm text-[9px] font-semibold ml-2", active && "bg-primary-foreground/20 text-primary-foreground border-transparent")}>{tag}</span>}
            {hasSubmenu && (
              <ChevronDown size={14} className={cn("ml-2 opacity-50 transition-transform", isOpen && "rotate-180", active && "text-primary-foreground opacity-100")} />
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

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [customersOpen, setCustomersOpen] = useState(false);
  const { theme } = useTheme();

  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col border-r bg-card text-foreground transition-all duration-300 relative sticky top-0 font-sans z-40 overflow-visible",
      collapsed ? "w-16" : "w-60"
    )}>
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
          className="p-1.5 border border-border rounded-lg hover:bg-accent transition-all absolute -right-3.5 top-8 -translate-y-1/2 bg-card z-[60] shadow-sm text-muted-foreground hover:text-foreground flex items-center justify-center animate-in fade-in duration-500"
        >
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide px-1">
        <SidebarSection title="General" collapsed={collapsed}>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active collapsed={collapsed} />
          <SidebarItem icon={CreditCard} label="Payments" collapsed={collapsed} />
          
          <div onClick={() => !collapsed && setCustomersOpen(!customersOpen)}>
            <SidebarItem icon={Users} label="Customers" hasSubmenu isOpen={customersOpen} collapsed={collapsed} />
          </div>
          {customersOpen && !collapsed && (
            <div className="flex flex-col mb-1 gap-1">
              <SidebarItem icon={() => null} label="List View" isSubmenu collapsed={collapsed} />
              <SidebarItem icon={() => null} label="Groups" isSubmenu collapsed={collapsed} />
            </div>
          )}

          <SidebarItem icon={MessageSquare} label="Messages" badge="3" collapsed={collapsed} />
        </SidebarSection>

        <SidebarSection title="Tools" collapsed={collapsed}>
          <SidebarItem icon={Package} label="Products" collapsed={collapsed} />
          <SidebarItem icon={FileText} label="Invoices" collapsed={collapsed} />
          <SidebarItem icon={BarChart3} label="Analytics" collapsed={collapsed} />
          <SidebarItem icon={Zap} label="Workflows" tag="BETA" collapsed={collapsed} />
        </SidebarSection>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border flex flex-col gap-3 shrink-0 bg-card">
        {!collapsed && (
          <div className="p-3 bg-accent/30 rounded-lg flex items-center justify-between border border-border group cursor-pointer hover:bg-accent/50 transition-all">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground shrink-0 border border-border group-hover:text-foreground transition-colors">
                <Gem size={20} />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider leading-none">Enterprise</span>
              </div>
            </div>
          </div>
        )}

        <button className={cn(
          "w-full bg-primary text-primary-foreground rounded-lg text-xs font-semibold transition-all hover:brightness-110 active:scale-[0.98]",
          collapsed ? "py-1.5" : "py-2"
        )}>
           {!collapsed ? "Upgrade Plan" : <Gem size={14} className="mx-auto" />}
        </button>
      </div>
    </aside>
  );
};
