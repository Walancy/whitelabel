import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { 
  ChevronLeft, 
  ChevronRight, 
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
  Gem
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  badge?: string | number;
  active?: boolean;
  collapsed?: boolean;
  tag?: string;
}

const SidebarItem = ({ icon: Icon, label, badge, active, collapsed, tag }: SidebarItemProps) => {
  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors group",
      active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      collapsed && "justify-center px-2"
    )}>
      <Icon size={20} className={cn("shrink-0", active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
      {!collapsed && (
        <div className="flex items-center justify-between w-full overflow-hidden">
          <span className="text-sm font-medium truncate">{label}</span>
          {badge && <span className="bg-accent px-1.5 py-0.5 rounded text-[10px] font-bold text-foreground ml-2">{badge}</span>}
          {tag && <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold ml-2">{tag}</span>}
        </div>
      )}
    </div>
  );
};

const SidebarSection = ({ title, children, collapsed }: { title: string; children: React.ReactNode; collapsed?: boolean }) => {
  return (
    <div className="flex flex-col gap-1 px-3 mb-4">
      {!collapsed && <h3 className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{title}</h3>}
      {children}
    </div>
  );
};

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();

  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col border-r bg-card transition-all duration-300 relative",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-16 shrink-0 border-b">
        {!collapsed ? (
          <div className="flex items-center gap-2 overflow-hidden">
             <img src={logoSrc} alt="Nexus Logo" className="h-8 w-auto max-w-[140px] object-contain" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
             <img src={logoSrc} alt="Nexus Logo" className="h-8 w-8 object-contain" />
          </div>
        )}

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 border rounded-md hover:bg-accent transition-colors absolute -right-3 top-5 bg-card z-10"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <SidebarSection title="General" collapsed={collapsed}>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active collapsed={collapsed} />
          <SidebarItem icon={CreditCard} label="Payment" collapsed={collapsed} />
          <SidebarItem icon={Users} label="Customers" collapsed={collapsed} />
          <SidebarItem icon={MessageSquare} label="Message" badge="8" collapsed={collapsed} />
        </SidebarSection>

        <SidebarSection title="Tools" collapsed={collapsed}>
          <SidebarItem icon={Package} label="Product" collapsed={collapsed} />
          <SidebarItem icon={FileText} label="Invoice" collapsed={collapsed} />
          <SidebarItem icon={BarChart3} label="Analytics" collapsed={collapsed} />
          <SidebarItem icon={Zap} label="Automation" tag="BETA" collapsed={collapsed} />
        </SidebarSection>

        <SidebarSection title="Support" collapsed={collapsed}>
          <SidebarItem icon={Settings} label="Settings" collapsed={collapsed} />
          <SidebarItem icon={ShieldCheck} label="Security" collapsed={collapsed} />
          <SidebarItem icon={HelpCircle} label="Help" collapsed={collapsed} />
        </SidebarSection>
      </div>

      {/* Footer */}
      <div className="p-4 border-t flex flex-col gap-3">
        {!collapsed && (
          <div className="bg-accent/50 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Gem size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-medium">Team</span>
                <span className="text-sm font-semibold">Marketing</span>
              </div>
            </div>
            <div className="text-muted-foreground">
              <ChevronRight size={16} />
            </div>
          </div>
        )}

        {!collapsed && (
          <button className="w-full py-2 border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
            Upgrade Plan
          </button>
        )}

        <div className="text-center">
          <span className="text-[10px] text-muted-foreground font-medium">
            {collapsed ? "©" : "@ 2023 Nexus.io, Inc."}
          </span>
        </div>
      </div>
    </aside>
  );
};
