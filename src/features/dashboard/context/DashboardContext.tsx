import { createContext, useContext, useState, type ReactNode } from 'react';

interface DashboardActions {
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  isConfigOpen: boolean;
  setIsConfigOpen: (v: boolean) => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (v: boolean) => void;
  onReset: () => void;
  setOnReset: (fn: () => void) => void;
  isModularPage: boolean;
  setIsModularPage: (v: boolean) => void;
}

const DashboardContext = createContext<DashboardActions | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isModularPage, setIsModularPage] = useState(false);

  // We'll let the page set its own reset function through the context if needed, 
  // but for simplicity, we'll just have the page consume the context.
  const [onResetCallback, setOnResetCallback] = useState<() => void>(() => () => {});

  return (
    <DashboardContext.Provider 
      value={{ 
        isEditing, setIsEditing, 
        isConfigOpen, setIsConfigOpen, 
        isPanelOpen, setIsPanelOpen,
        isModularPage, setIsModularPage,
        onReset: onResetCallback,
        // Helper to register the reset function from the page
        setOnReset: (fn: () => void) => setOnResetCallback(() => fn)
      } as any}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) return { isEditing: false, setIsEditing: () => {}, isConfigOpen: false, setIsConfigOpen: () => {}, isPanelOpen: false, setIsPanelOpen: () => {}, onReset: () => {}, isModularPage: false, setIsModularPage: () => {}, setOnReset: () => {} } as any;
  return ctx;
}
