import { useState, type ElementType } from 'react';
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
import { useTheme } from '@/context/ThemeContext';

interface SidebarItemProps {
  icon: ElementType;
  label: string;
  badge?: string | number;
  active?: boolean;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  isSubmenu?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, badge, active, hasSubmenu, isOpen, isSubmenu, collapsed }: SidebarItemProps) => {
  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all relative group mb-0.5 min-h-[44px]",
      active 
        ? "bg-primary text-primary-foreground font-semibold shadow-sm border border-border" 
        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      isSubmenu && !collapsed && "ml-4 pl-8 py-2 text-[13px] rounded-none border-l border-border",
      collapsed && "justify-center px-1"
    )}>
      <Icon size={isSubmenu ? 16 : 18} className={cn("shrink-0 transition-colors", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
      {!collapsed && (
        <>
          <span className={cn("text-xs font-semibold flex-1 tracking-tight truncate", active ? "text-primary-foreground" : "text-foreground")}>{label}</span>
          {badge && (
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-semibold", 
              active ? "bg-primary-foreground text-primary border border-transparent" : "bg-muted"
            )}>
              {badge}
            </span>
          )}
          {hasSubmenu && (
            <ChevronDown size={14} className={cn("opacity-50 transition-transform", isOpen && "rotate-180", active && "text-primary-foreground opacity-100")} />
          )}
        </>
      )}
    </div>
  );
};

export const ShopeersSidebar = () => {
  const [financesOpen, setFinancesOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();

  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col bg-card border-r border-border font-poppins text-foreground transition-all duration-300 shrink-0 sticky top-0 z-40 overflow-hidden",
      collapsed ? "w-20 px-2" : "w-64 px-1"
    )}>
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
            <SidebarItem icon={Users} label="Customers" collapsed={collapsed} />
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
