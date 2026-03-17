import type { ElementType } from 'react';
import { 
  CheckCircle2, 
  Zap, 
  Home, 
  Folder, 
  MessageSquare, 
  Users, 
  Calendar, 
  Settings, 
  AlertCircle,
  ChevronDown,
  ArrowLeftToLine,
  ArrowRightToLine
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarItemProps {
  icon: ElementType;
  label: string;
  badge?: string;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  isSubmenu?: boolean;
  active?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, badge, hasSubmenu, isOpen, isSubmenu, active, collapsed }: SidebarItemProps) => {
  return (
    <div className={cn(
      "flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all group min-h-[44px] mb-0.5",
      active ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
      isSubmenu && "py-1.5 text-[12px] opacity-80",
      collapsed && "justify-center px-1"
    )}>
      <div className="flex items-center gap-3 overflow-hidden">
        <Icon size={isSubmenu ? 14 : 18} className={cn("transition-colors shrink-0", active ? "text-primary-foreground font-bold" : "text-muted-foreground group-hover:text-foreground")} />
        {!collapsed && <span className={cn("text-xs font-semibold transition-colors truncate", active ? "text-primary-foreground" : "text-foreground")}>{label}</span>}
      </div>
      {!collapsed && (
        <div className="flex items-center gap-2 shrink-0">
          {badge && (
            <span className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground",
              active && "bg-primary-foreground text-primary border-transparent"
            )}>
              {badge}
            </span>
          )}
          {hasSubmenu && (
             <ChevronDown size={14} className={cn("transition-transform opacity-50", isOpen && "rotate-180", active && "text-primary-foreground opacity-100")} />
          )}
        </div>
      )}
    </div>
  );
};

export const ProjectliSidebar = () => {
  const { theme } = useTheme();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <aside className={cn(
      "h-screen bg-card text-foreground flex flex-col font-sans border-r border-border transition-all duration-300 sticky top-0 z-40 overflow-hidden",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Header - Aligned to h-16 and logo left aligned */}
      <div className={cn(
        "px-6 border-b border-border shrink-0 flex items-center h-16 transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center justify-start min-w-8">
           <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain shrink-0" />
        </div>
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)}
            className="p-1 px-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground ml-auto bg-card border border-border"
          >
            <ArrowLeftToLine size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="p-4 flex justify-center border-b border-border mb-2">
          <button 
            onClick={() => setCollapsed(false)}
            className="p-2 bg-accent hover:bg-primary hover:text-primary-foreground rounded-lg transition-all shadow-sm group"
          >
            <ArrowRightToLine size={18} className="group-hover:text-primary-foreground text-primary" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 scrollbar-hide py-2">
        <div className={cn("space-y-0.5 mb-8", !collapsed && "px-2")}>
          <SidebarItem icon={CheckCircle2} label="My Tasks" badge="2" active collapsed={collapsed} />
          <SidebarItem icon={Zap} label="Activities" collapsed={collapsed} />
        </div>

        <div className="mb-4">
          {!collapsed && <h3 className="px-5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Core</h3>}
          <div className="space-y-0.5">
            <SidebarItem icon={Home} label="Overview" collapsed={collapsed} />
            
            <div onClick={() => !collapsed && setProjectsOpen(!projectsOpen)}>
              <SidebarItem icon={Folder} label="Projects" hasSubmenu isOpen={projectsOpen} collapsed={collapsed} />
            </div>
            {projectsOpen && !collapsed && (
              <div className="flex flex-col relative w-full mb-1 ml-2 pl-2 border-l border-border mt-1 gap-1">
                <SidebarItem icon={() => null} label="Active" isSubmenu collapsed={collapsed} />
                <SidebarItem icon={() => null} label="Archived" isSubmenu collapsed={collapsed} />
              </div>
            )}

            <SidebarItem icon={MessageSquare} label="Messages" collapsed={collapsed} />
            <SidebarItem icon={Users} label="Team" collapsed={collapsed} />
            <SidebarItem icon={Calendar} label="Calendar" collapsed={collapsed} />
          </div>
        </div>
      </div>

      <div className={cn(
        "p-4 border-t border-border mt-auto shrink-0 bg-card",
        collapsed && "flex flex-col items-center px-2"
      )}>
        <button className={cn(
          "w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-xs font-semibold shadow-md active:scale-[0.98] transition-all",
          collapsed && "w-10 h-10 px-0"
        )}>
           {!collapsed && <span className="text-primary-foreground">New Project</span>}
           {collapsed && <span className="text-primary-foreground text-lg">+</span>}
        </button>
        <div className="mt-4 space-y-0.5">
          <SidebarItem icon={Settings} label="Settings" collapsed={collapsed} />
          <SidebarItem icon={AlertCircle} label="Help" collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
};
