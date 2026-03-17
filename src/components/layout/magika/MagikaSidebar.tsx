import { useState, type ElementType } from 'react';
import { 
  Home, 
  LayoutGrid, 
  Inbox, 
  FileText, 
  Folder, 
  Layout, 
  Phone, 
  Plus,
  ChevronDown,
  Grid,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface SidebarItemProps {
  icon: ElementType;
  label: string;
  badge?: string | number;
  active?: boolean;
  collapsed?: boolean;
  hasDropdown?: boolean;
  isOpen?: boolean;
}

const SidebarItem = ({ icon: Icon, label, badge, active, collapsed, hasDropdown, isOpen }: SidebarItemProps) => (
  <div className={cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all relative group mb-1 min-h-[44px]",
    active 
      ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
  )}>
    <Icon size={18} className={cn("transition-colors shrink-0", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
    {!collapsed && (
      <>
        <span className={cn("text-xs font-semibold flex-1 tracking-tight truncate", active ? "text-primary-foreground" : "text-foreground")}>{label}</span>
        {badge && (
          <span className={cn(
            "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
            active ? "bg-primary-foreground text-primary" : "bg-muted text-muted-foreground"
          )}>{badge}</span>
        )}
        {hasDropdown && (
          <ChevronDown size={14} className={cn("transition-transform opacity-50", isOpen && "rotate-180", active && "text-primary-foreground opacity-100")} />
        )}
      </>
    )}
  </div>
);

export const MagikaSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [workspacesOpen, setWorkspacesOpen] = useState(false);
  const { theme } = useTheme();

  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col bg-card border-r border-border font-sans text-foreground transition-all duration-300 sticky top-0 z-40 overflow-hidden",
      collapsed ? "w-20" : "w-64"
    )}>
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
        <SidebarItem icon={Home} label="Dashboard" active collapsed={collapsed} />
        
        <div onClick={() => !collapsed && setWorkspacesOpen(!workspacesOpen)}>
          <SidebarItem icon={LayoutGrid} label="Workspaces" hasDropdown isOpen={workspacesOpen} collapsed={collapsed} />
        </div>
        {workspacesOpen && !collapsed && (
          <div className="ml-4 pl-4 border-l border-border mb-4 flex flex-col gap-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
             <SidebarItem icon={() => null} label="Design Studio" />
             <SidebarItem icon={() => null} label="Dev Lab" />
          </div>
        )}

        <SidebarItem icon={Inbox} label="Messages" badge="12" collapsed={collapsed} />
        <SidebarItem icon={FileText} label="Documents" collapsed={collapsed} />
        <SidebarItem icon={Folder} label="Projects" collapsed={collapsed} />

        <div className="my-8 border-t border-border mx-2" />

        <div className="space-y-1">
          {!collapsed && <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Support</p>}
          <SidebarItem icon={Layout} label="Templates" collapsed={collapsed} />
          <SidebarItem icon={Phone} label="Contact" collapsed={collapsed} />
          <SidebarItem icon={Plus} label="New Feature" collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
};
