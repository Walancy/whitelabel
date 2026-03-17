import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type VisualPattern = 'nexus' | 'shopeers' | 'projectli' | 'magika' | 'workly' | 'taskplus' | 'eevo' | 'quantum' | 'resync';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  visualPattern: VisualPattern;
  togglePattern: () => void;
  setVisualPattern: React.Dispatch<React.SetStateAction<VisualPattern>>;
  accentColor: string;
  setAccentColor: (color: string) => void;
  useCustomAccent: boolean;
  setUseCustomAccent: (use: boolean) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  showShadows: boolean;
  setShowShadows: (show: boolean) => void;
  authFormWidth: number;
  setAuthFormWidth: (width: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Pattern defaults
const PATTERN_DEFAULTS: Record<VisualPattern, string> = {
  nexus: '240 5.9% 10%',
  shopeers: '221 83% 53%',
  projectli: '142 71% 45%',
  magika: '262 83% 58%',
  workly: '263 70% 58%',
  taskplus: '0 84.2% 60.2%',
  eevo: '84 100% 59%',
  quantum: '221 83% 53%',
  resync: '142 71% 45%'
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'light'
  );
  const [visualPattern, setVisualPattern] = useState<VisualPattern>(
    () => (localStorage.getItem('visualPattern') as VisualPattern) || 'nexus'
  );
  const [accentColor, setAccentColorState] = useState<string>(
    () => localStorage.getItem('accentColor') || '240 5.9% 10%'
  );
  const [useCustomAccent, setUseCustomAccent] = useState<boolean>(
    () => localStorage.getItem('useCustomAccent') === 'true'
  );
  const [borderRadius, setBorderRadius] = useState<number>(
    () => Number(localStorage.getItem('borderRadius')) || 50
  );
  const [showShadows, setShowShadows] = useState<boolean>(
    () => localStorage.getItem('showShadows') !== 'false'
  );
  const [authFormWidth, setAuthFormWidth] = useState<number>(
    () => Math.min(60, Math.max(35, Number(localStorage.getItem('authFormWidth')) || 50))
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-pattern', visualPattern);
    localStorage.setItem('theme', theme);
  }, [theme, visualPattern]);

  useEffect(() => {
    localStorage.setItem('visualPattern', visualPattern);
    localStorage.setItem('useCustomAccent', String(useCustomAccent));
    localStorage.setItem('borderRadius', String(borderRadius));
    localStorage.setItem('showShadows', String(showShadows));
    localStorage.setItem('authFormWidth', String(authFormWidth));
  }, [visualPattern, useCustomAccent, borderRadius, showShadows, authFormWidth]);

  useEffect(() => {
    const root = window.document.documentElement;
    const activeColor = useCustomAccent ? accentColor : PATTERN_DEFAULTS[visualPattern];
    
    // Primary/Accent colors
    root.style.setProperty('--primary', activeColor);
    root.style.setProperty('--accent', activeColor);
    
    // STRICT Y-AXIS CONTRAST (Lightness only)
    // parts[2] is the Lightness (Y axis) in HSL.
    // We ignore parts[1] (Saturation / X axis).
    const parts = activeColor.split(' ');
    const lightnessPart = parts[2] || '0%';
    const lightness = parseInt(lightnessPart.replace('%', '')) || 0;
    
    // Threshold usually around 50-60%. 
    // If lightness is high (top of Y axis), use dark text.
    // If lightness is low (bottom of Y axis), use white text.
    const foreground = lightness > 60 ? '240 10% 3.9%' : '0 0% 98%';
    
    root.style.setProperty('--primary-foreground', foreground);
    root.style.setProperty('--accent-foreground', foreground);
    
    // Border Radius mapping
    const radiusInPx = (borderRadius / 100) * 24;
    root.style.setProperty('--radius', `${radiusInPx}px`);
    root.style.setProperty('--auth-form-width', String(authFormWidth));

    if (showShadows) {
      root.classList.remove('no-shadows');
    } else {
      root.classList.add('no-shadows');
    }
    
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor, visualPattern, useCustomAccent, borderRadius, showShadows, authFormWidth]);

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
    setUseCustomAccent(true);
  };

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const togglePattern = () => setVisualPattern(prev => {
    const patterns: VisualPattern[] = ['nexus', 'shopeers', 'projectli', 'magika', 'workly', 'taskplus', 'eevo', 'quantum', 'resync'];
    const currentIndex = patterns.indexOf(prev);
    return patterns[(currentIndex + 1) % patterns.length];
  });

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      visualPattern, 
      togglePattern, 
      setVisualPattern,
      accentColor,
      setAccentColor,
      useCustomAccent,
      setUseCustomAccent,
      borderRadius,
      setBorderRadius,
      showShadows,
      setShowShadows,
      authFormWidth,
      setAuthFormWidth
    }}>
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
