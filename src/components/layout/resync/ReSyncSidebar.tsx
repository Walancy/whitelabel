import { useState, type ElementType } from 'react';
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
import { useTheme } from '@/context/ThemeContext';

interface SidebarItemProps {
  icon: ElementType;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  hasDropdown?: boolean;
  isOpen?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, collapsed, hasDropdown, isOpen }: SidebarItemProps) => (
  <div className={cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all mb-1 group min-h-[44px]",
    active ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
    collapsed && "justify-center px-1"
  )}>
    <Icon size={18} className={cn("transition-colors shrink-0", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
    {!collapsed && (
      <>
        <span className={cn("text-xs font-semibold truncate flex-1 tracking-tight", active ? "text-primary-foreground" : "text-foreground")}>{label}</span>
        {hasDropdown && (
          <ChevronDown size={14} className={cn("transition-transform opacity-50", isOpen && "rotate-180", active && "text-primary-foreground opacity-100")} />
        )}
      </>
    )}
  </div>
);

export const ReSyncSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const { theme } = useTheme();
  
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col bg-card border-r border-border font-sans transition-all duration-300 sticky top-0 z-40 overflow-hidden",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Header - h-16 alignment and logo left aligned */}
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
          "w-full bg-primary text-primary-foreground rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:brightness-110 active:scale-95 transition-all text-primary-foreground",
          collapsed ? "h-10 px-0" : "h-11"
        )}>
          <Plus size={18} className="text-primary-foreground" />
          {!collapsed && <span className="text-primary-foreground">New Sync</span>}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 scrollbar-hide py-2">
        <div className="space-y-1">
          <SidebarItem icon={Home} label="Local Hub" active collapsed={collapsed} />
          
          {/* Dropdown for Storage */}
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
        </div>
      </nav>
    </aside>
  );
};
