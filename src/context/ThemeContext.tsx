import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type VisualPattern = 'nexus' | 'shopeers';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  visualPattern: VisualPattern;
  togglePattern: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'light'
  );
  const [visualPattern, setVisualPattern] = useState<VisualPattern>(
    () => (localStorage.getItem('visualPattern') as VisualPattern) || 'nexus'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('visualPattern', visualPattern);
  }, [visualPattern]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const togglePattern = () => setVisualPattern(prev => (prev === 'nexus' ? 'shopeers' : 'nexus'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, visualPattern, togglePattern }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
