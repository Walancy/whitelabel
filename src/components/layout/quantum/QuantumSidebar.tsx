import { useState, type ElementType } from 'react';
import { 
  Layout as LayoutIcon, 
  Folder, 
  CheckSquare, 
  Mail, 
  MessageSquare, 
  Settings, 
  User, 
  Activity, 
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface SidebarItemProps {
  icon: ElementType;
  label: string;
  active?: boolean;
  hasDropdown?: boolean;
  isOpen?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, hasDropdown, isOpen, collapsed }: SidebarItemProps) => (
  <div className={cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all mb-1 group min-h-[42px]",
    active ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
    collapsed && "justify-center px-1"
  )}>
    <Icon size={18} className={cn("transition-colors shrink-0", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
    {!collapsed && (
      <>
        <span className={cn("text-[13px] font-semibold truncate flex-1 tracking-tight", active ? "text-primary-foreground" : "text-foreground")}>{label}</span>
        {hasDropdown ? (
          <ChevronDown size={14} className={cn("transition-transform opacity-50", isOpen && "rotate-180", active && "text-primary-foreground opacity-100")} />
        ) : (
          active && <ChevronRight size={14} className="text-primary-foreground animate-in slide-in-from-left-1 duration-300" />
        )}
      </>
    )}
  </div>
);

export const QuantumSidebar = () => {
  const { theme } = useTheme();
  const [repoOpen, setRepoOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col bg-card border-r border-border font-sans transition-colors duration-300 sticky top-0 z-40 overflow-hidden",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Brand - Height Aligned to h-16, Logo Left */}
      <div className={cn(
        "flex items-center h-16 px-6 border-b border-border shadow-sm mb-6 transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
         <div className="flex items-center justify-start min-w-8 overflow-hidden">
            <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain shrink-0" />
         </div>
         {!collapsed && (
            <button 
              onClick={() => setCollapsed(true)}
              className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground shrink-0 border border-border"
            >
              <ChevronsLeft size={16} />
            </button>
         )}
      </div>

      {collapsed && (
        <div className="px-5 mb-4">
           <button 
           onClick={() => setCollapsed(false)}
           className="w-10 h-10 flex items-center justify-center bg-accent hover:bg-primary hover:text-primary-foreground rounded-lg transition-all shadow-sm group"
         >
           <ChevronsRight size={18} className="text-primary group-hover:text-primary-foreground" />
         </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 scrollbar-hide py-2">
        <div className="space-y-1">
          <SidebarItem icon={LayoutIcon} label="Console" active collapsed={collapsed} />
          
          <div onClick={() => !collapsed && setRepoOpen(!repoOpen)}>
            <SidebarItem icon={Folder} label="Repository" hasDropdown isOpen={repoOpen} collapsed={collapsed} />
          </div>
          {repoOpen && !collapsed && (
            <div className="ml-4 pl-4 border-l border-border mb-2 flex flex-col gap-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
               <SidebarItem icon={() => null} label="Main Branch" />
               <SidebarItem icon={() => null} label="Archive" />
            </div>
          )}

          <SidebarItem icon={CheckSquare} label="Backlog" collapsed={collapsed} />
          <SidebarItem icon={Mail} label="Comms" collapsed={collapsed} />
          <SidebarItem icon={MessageSquare} label="Feedback" collapsed={collapsed} />
        </div>

        {!collapsed && (
           <>
            <div className="my-8 border-t border-border mx-2" />
            <div className="space-y-1">
               <SidebarItem icon={Activity} label="Activity" />
               <SidebarItem icon={User} label="Profile" />
               <SidebarItem icon={Settings} label="Preferences" />
            </div>
           </>
        )}
      </nav>

      {/* Bottom Profile Bar */}
      <div className="mt-auto p-4 border-t border-border bg-card">
         <div className={cn(
           "flex items-center bg-accent/20 rounded-lg border border-border group cursor-pointer hover:bg-accent transition-all",
           collapsed ? "justify-center p-2" : "gap-3 p-2"
         )}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm border border-border">
                <span className="text-primary-foreground text-xs font-bold leading-none">QH</span>
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-[11px] font-semibold text-foreground truncate">Quantum High</p>
                <p className="text-[9px] text-muted-foreground truncate uppercase tracking-widest">Operator</p>
              </div>
            )}
         </div>
      </div>
    </aside>
  );
};
