import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { buildButtonCSS, DEFAULT_BTN_CONFIG, type ButtonStyleConfig } from '@/components/ui/buttonStyleModels';

type Theme = 'light' | 'dark';
type VisualPattern = 'nexus' | 'shopeers' | 'projectli' | 'magika' | 'workly' | 'taskplus' | 'eevo' | 'quantum' | 'resync';
export type AuthBgKey =
  | 'none' | 'dark-veil' | 'soft-aurora' | 'aurora' | 'iridescence' | 'silk'
  | 'color-bends' | 'pixel-blast' | 'beams' | 'gradient-blinds' | 'liquid-ether'
  | 'line-waves' | 'light-rays' | 'grainient' | 'grid-distortion'
  | 'dot-grid' | 'shape-grid';

export type AuthBgConfig = Record<string, number | string | boolean>;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  visualPattern: VisualPattern;
  togglePattern: () => void;
  setVisualPattern: React.Dispatch<React.SetStateAction<VisualPattern>>;
  accentColor: string;
  activeAccentColor: string;
  setAccentColor: (color: string) => void;
  useCustomAccent: boolean;
  setUseCustomAccent: (use: boolean) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  showShadows: boolean;
  setShowShadows: (show: boolean) => void;
  authFormWidth: number;
  setAuthFormWidth: (width: number) => void;
  authBg: AuthBgKey;
  setAuthBg: (bg: AuthBgKey) => void;
  authBgConfigs: Record<string, AuthBgConfig>;
  setAuthBgConfig: (bg: AuthBgKey, config: AuthBgConfig) => void;
  buttonStyleConfig: ButtonStyleConfig;
  setButtonStyleConfig: (cfg: ButtonStyleConfig) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const PATTERN_DEFAULTS: Record<VisualPattern, string> = {
  nexus: '240 5.9% 10%', shopeers: '221 83% 53%', projectli: '142 71% 45%',
  magika: '262 83% 58%', workly: '263 70% 58%', taskplus: '0 84.2% 60.2%',
  eevo: '84 100% 59%', quantum: '221 83% 53%', resync: '142 71% 45%',
};

const parseConfigs = (): Record<string, AuthBgConfig> => {
  try { return JSON.parse(localStorage.getItem('authBgConfigs') || '{}'); }
  catch { return {}; }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'light');
  const [visualPattern, setVisualPattern] = useState<VisualPattern>(
    () => (localStorage.getItem('visualPattern') as VisualPattern) || 'nexus');
  const [accentColor, setAccentColorState] = useState<string>(
    () => localStorage.getItem('accentColor') || '240 5.9% 10%');
  const [useCustomAccent, setUseCustomAccent] = useState<boolean>(
    () => localStorage.getItem('useCustomAccent') === 'true');
  const [borderRadius, setBorderRadius] = useState<number>(
    () => Number(localStorage.getItem('borderRadius')) || 50);
  const [showShadows, setShowShadows] = useState<boolean>(
    () => localStorage.getItem('showShadows') !== 'false');
  const [authFormWidth, setAuthFormWidth] = useState<number>(
    () => Math.min(60, Math.max(35, Number(localStorage.getItem('authFormWidth')) || 50)));
  const [authBg, setAuthBgState] = useState<AuthBgKey>(
    () => (localStorage.getItem('authBg') as AuthBgKey) || 'none');
  const [authBgConfigs, setAuthBgConfigsState] = useState<Record<string, AuthBgConfig>>(parseConfigs);
  const [buttonStyleConfig, setButtonStyleConfigState] = useState<ButtonStyleConfig>(() => {
    try { return JSON.parse(localStorage.getItem('buttonStyleConfig') || 'null') || DEFAULT_BTN_CONFIG; }
    catch { return DEFAULT_BTN_CONFIG; }
  });

  const activeAccentColor = useMemo(
    () => (useCustomAccent ? accentColor : PATTERN_DEFAULTS[visualPattern]),
    [useCustomAccent, accentColor, visualPattern]
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
    localStorage.setItem('authBg', authBg);
    localStorage.setItem('authBgConfigs', JSON.stringify(authBgConfigs));
    localStorage.setItem('buttonStyleConfig', JSON.stringify(buttonStyleConfig));
  }, [visualPattern, useCustomAccent, borderRadius, showShadows, authFormWidth, authBg, authBgConfigs, buttonStyleConfig]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--primary', activeAccentColor);
    root.style.setProperty('--accent', activeAccentColor);
    const parts = activeAccentColor.split(' ');
    const lightness = parseInt((parts[2] || '0%').replace('%', '')) || 0;
    const fg = lightness > 60 ? '240 10% 3.9%' : '0 0% 98%';
    root.style.setProperty('--primary-foreground', fg);
    root.style.setProperty('--accent-foreground', fg);
    root.style.setProperty('--radius', `${(borderRadius / 100) * 24}px`);
    root.style.setProperty('--auth-form-width', String(authFormWidth));
    root.classList.toggle('no-shadows', !showShadows);
    localStorage.setItem('accentColor', accentColor);
  }, [activeAccentColor, accentColor, borderRadius, showShadows, authFormWidth]);

  // Inject button style CSS
  useEffect(() => {
    const css = buildButtonCSS(buttonStyleConfig);
    const id = 'btn-style-override';
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = css;
    const root = document.documentElement;
    if (buttonStyleConfig.model !== 'default' || css.trim()) {
      root.dataset.btnModel = buttonStyleConfig.model;
    } else {
      delete root.dataset.btnModel;
    }
  }, [buttonStyleConfig]);

  const setAccentColor = (color: string) => { setAccentColorState(color); setUseCustomAccent(true); };
  const setAuthBg = (bg: AuthBgKey) => setAuthBgState(bg);
  const setAuthBgConfig = (bg: AuthBgKey, config: AuthBgConfig) =>
    setAuthBgConfigsState(prev => ({ ...prev, [bg]: config }));
  const setButtonStyleConfig = (cfg: ButtonStyleConfig) => setButtonStyleConfigState(cfg);
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const togglePattern = () => setVisualPattern(prev => {
    const list: VisualPattern[] = ['nexus', 'shopeers', 'projectli', 'magika', 'workly', 'taskplus', 'eevo', 'quantum', 'resync'];
    return list[(list.indexOf(prev) + 1) % list.length];
  });

  return (
    <ThemeContext.Provider value={{
      theme, toggleTheme, visualPattern, togglePattern, setVisualPattern,
      accentColor, activeAccentColor, setAccentColor,
      useCustomAccent, setUseCustomAccent,
      borderRadius, setBorderRadius, showShadows, setShowShadows,
      authFormWidth, setAuthFormWidth,
      authBg, setAuthBg, authBgConfigs, setAuthBgConfig,
      buttonStyleConfig, setButtonStyleConfig,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
