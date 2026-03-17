import { useState, type ElementType } from 'react';
import { 
  Plus, 
  BarChart2, 
  Layers, 
  FileText, 
  Layout, 
  Users, 
  Monitor,
  ChevronDown,
  CircleChevronLeft,
  CircleChevronRight
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
        <span className={cn("text-xs font-semibold truncate flex-1 tracking-tight", active ? "text-primary-foreground" : "text-foreground")}>{label}</span>
        {hasDropdown && (
          <ChevronDown size={14} className={cn("transition-transform opacity-50", isOpen && "rotate-180", active && "text-primary-foreground opacity-100")} />
        )}
      </>
    )}
  </div>
);

export const EevoSidebar = () => {
  const { theme } = useTheme();
  const [layersOpen, setLayersOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen flex flex-col bg-card border-r border-border font-sans transition-all duration-300 sticky top-0 z-40 overflow-hidden",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Brand - Header Height Aligned to h-16, Logo Left */}
      <div className={cn(
        "flex items-center h-16 px-6 border-b border-border mb-6 transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center justify-start min-w-8 overflow-hidden">
           <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain shrink-0" />
        </div>
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)}
            className="p-1 hover:text-primary transition-all text-muted-foreground shrink-0"
          >
            <CircleChevronLeft size={24} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="px-4 mb-4 flex justify-center">
           <button 
            onClick={() => setCollapsed(false)}
            className="text-primary hover:scale-110 transition-all"
          >
            <CircleChevronRight size={28} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Buttons Section */}
      <div className={cn("px-3 mb-6 transition-all", collapsed && "px-4")}>
        <button className={cn(
          "bg-primary text-primary-foreground rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:brightness-110 active:scale-95 transition-all w-full",
          collapsed ? "h-10" : "h-11"
        )}>
          <Plus size={16} className="text-primary-foreground" />
          {!collapsed && <span>New Project</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 scrollbar-hide py-2">
        <div className="space-y-1">
          <SidebarItem icon={BarChart2} label="Analytics" active collapsed={collapsed} />
          
          <div onClick={() => !collapsed && setLayersOpen(!layersOpen)}>
            <SidebarItem icon={Layers} label="Layers" hasDropdown isOpen={layersOpen} collapsed={collapsed} />
          </div>
          {layersOpen && !collapsed && (
            <div className="ml-4 pl-4 border-l border-border mb-2 flex flex-col gap-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
              <SidebarItem icon={() => null} label="Visual Engine" />
              <SidebarItem icon={() => null} label="Data Source" />
            </div>
          )}

          <SidebarItem icon={FileText} label="Documentation" collapsed={collapsed} />
          <SidebarItem icon={Layout} label="Architecture" collapsed={collapsed} />
          <SidebarItem icon={Users} label="Collaborators" collapsed={collapsed} />
          <SidebarItem icon={Monitor} label="Monitoring" collapsed={collapsed} />
        </div>
      </nav>

      {/* Profile/Actions bottom */}
      <div className="mt-auto p-4 border-t border-border bg-card">
         <div className={cn(
           "flex items-center rounded-lg border border-border bg-accent/30 group cursor-pointer hover:bg-accent transition-all",
           collapsed ? "justify-center p-2" : "gap-3 p-2.5"
         )}>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border">
               <img 
                 src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&q=80" 
                 alt="User" 
                 className="w-full h-full object-cover"
               />
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-foreground truncate">Elena Rose</p>
                <p className="text-[10px] text-muted-foreground truncate">Product Manager</p>
              </div>
            )}
         </div>
      </div>
    </aside>
  );
};
