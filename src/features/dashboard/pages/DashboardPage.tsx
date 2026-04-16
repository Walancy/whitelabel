import { useEffect } from 'react';
import { Layout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLayoutTree } from '../hooks/useLayoutTree';
import { useLayoutTheme } from '../hooks/useLayoutTheme';
import { LayoutNodeView } from '../components/LayoutNodeView';
import { WidgetPanel } from '../components/WidgetPanel';
import { ConfigPanel } from '../components/ConfigPanel';
import { useDashboard } from '../context/DashboardContext';

export function DashboardPage() {
  const { 
    isEditing, 
    setIsEditing,
    isConfigOpen, 
    setIsConfigOpen, 
    isPanelOpen, 
    setIsPanelOpen, 
    setIsModularPage,
    setOnReset
  } = useDashboard();

  const { 
    root, 
    usedWidgets, 
    split, 
    remove, 
    addWidget, 
    removeWidget, 
    moveWidget, 
    setContentDir, 
    resizeChildren,
    reset 
  } = useLayoutTree();
  
  const { theme, setTheme } = useLayoutTheme();

  useEffect(() => {
    setIsModularPage(true);
    setOnReset(() => reset);
    return () => {
      setIsModularPage(false);
      // Ensure we clean up controls when leaving
      setIsEditing(false);
    };
  }, [setIsModularPage, setOnReset, reset]);

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 relative">
      {/* Page Title - Now separate from global actions */}
      <div className="flex items-center justify-between mb-6 shrink-0 px-1">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Layout size={24} className="text-primary" /> Dashboard Customizável
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">Configure o seu espaço de trabalho ideal com widgets modulares</p>
        </div>
      </div>

      {/* Workspace Arena */}
      <div className={cn(
        "flex-1 h-full min-h-0 relative rounded-2xl transition-all duration-500",
        isEditing && !isConfigOpen ? "p-8 bg-black/5 dark:bg-white/5 overflow-auto ring-1 ring-border shadow-inner" : "overflow-hidden"
      )}>
        <div className={cn(
          "flex h-full min-h-0 bg-background relative transition-all duration-500 shadow-sm",
          isEditing && !isConfigOpen 
            ? "mx-auto w-full max-w-[1400px] aspect-video border-[12px] border-border shadow-2xl rounded-tr-[40px] rounded-bl-[40px] rounded-tl-lg rounded-br-lg p-1 bg-background" 
            : "w-full rounded-xl border border-border/50"
        )}>
          <LayoutNodeView
            node={root}
            isRoot={true}
            theme={theme}
            isEditing={isEditing}
            configMode={isConfigOpen}
            onSplit={split}
            onRemove={remove}
            onAddWidget={addWidget}
            onRemoveWidget={removeWidget}
            onMoveWidget={moveWidget}
            onChangeContentDir={setContentDir}
            onResizeChildren={resizeChildren}
          />
        </div>
      </div>

      {/* Panels */}
      <WidgetPanel
        open={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        usedWidgets={usedWidgets}
      />
      
      <ConfigPanel
        open={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}
