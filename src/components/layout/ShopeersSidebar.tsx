import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp,
  LayoutGrid,
  Compass,
  ShoppingBag,
  Box,
  Users,
  Image as ImageIcon,
  Store,
  Banknote,
  BarChart3,
  Percent,
  Settings,
  HelpCircle,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  badge?: string | number;
  active?: boolean;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  isSubmenu?: boolean;
}

const SidebarItem = ({ icon: Icon, label, badge, active, hasSubmenu, isOpen, isSubmenu }: SidebarItemProps) => {
  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all relative group mb-0.5",
      active 
        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
        : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50",
      isSubmenu && "pl-11 py-2 text-[13px]"
    )}>
      {active && !isSubmenu && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
      )}
      <Icon size={isSubmenu ? 16 : 20} className={cn("shrink-0", active ? "text-blue-600 dark:text-blue-400" : "text-slate-400")} />
      <span className={cn("text-sm font-medium flex-1", active && "font-semibold")}>{label}</span>
      {badge && (
        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold dark:bg-emerald-900/20 dark:text-emerald-400">
          {badge}
        </span>
      )}
      {hasSubmenu && (
        isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />
      )}
    </div>
  );
};

export const ShopeersSidebar = () => {
  const [financesOpen, setFinancesOpen] = useState(true);


  return (
    <aside className="h-screen w-64 flex flex-col border-r bg-white dark:bg-slate-950 transition-colors shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-16 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-600 rounded-lg transform rotate-45 flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Shopeers</span>
        </div>
        <button className="p-1.5 border rounded-lg hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors">
          <LayoutGrid size={16} className="text-slate-500" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2 px-3 scrollbar-hide">
        <SidebarItem icon={Compass} label="Dashboard" active />
        <SidebarItem icon={ShoppingBag} label="Orders" badge="46" />
        <SidebarItem icon={Box} label="Products" />
        <SidebarItem icon={Users} label="Customers" />
        <SidebarItem icon={ImageIcon} label="Content" />
        <SidebarItem icon={Store} label="Online Store" />

        <div className="my-4 border-t border-slate-100 dark:border-slate-800/50" />

        <div onClick={() => setFinancesOpen(!financesOpen)}>
          <SidebarItem 
            icon={Banknote} 
            label="Finances" 
            hasSubmenu 
            isOpen={financesOpen} 
          />
        </div>
        
        {financesOpen && (
          <div className="flex flex-col relative">
             <div className="absolute left-5 top-0 bottom-3 w-[1px] bg-slate-100 dark:bg-slate-800 ml-0.5" />
             <SidebarItem icon={() => null} label="Invoices" isSubmenu />
             <SidebarItem icon={() => null} label="Transactions" isSubmenu />
             <SidebarItem icon={() => null} label="Reports" isSubmenu />
          </div>
        )}

        <SidebarItem icon={BarChart3} label="Analytics" />
        <SidebarItem icon={Percent} label="Discounts" />

        <div className="mt-auto pt-4 space-y-1">
          <SidebarItem icon={Settings} label="Settings" />
          <SidebarItem icon={HelpCircle} label="Help & Support" />
        </div>
      </div>

      {/* Promo Card */}
      <div className="p-4">
        <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 p-5 text-white shadow-lg shadow-blue-500/20">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 mb-4 shadow-lg">
            <Trophy size={20} />
          </div>
          <h4 className="font-bold text-base mb-1">Upgrade to Premium!</h4>
          <p className="text-blue-100 text-[11px] leading-relaxed mb-4">
            Upgrade your account and unlock all of the benefits.
          </p>
          <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-full text-xs font-bold transition-all shadow-md active:scale-95">
            Upgrade premium
          </button>
        </div>
      </div>
    </aside>
  );
};
