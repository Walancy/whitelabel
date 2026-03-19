import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { buildButtonCSS, DEFAULT_BTN_CONFIG, type ButtonStyleConfig } from '@/components/ui/buttonStyleModels';

type Theme = 'light' | 'dark';
type VisualPattern = 'nexus' | 'shopeers' | 'projectli' | 'magika' | 'workly' | 'taskplus' | 'eevo' | 'quantum' | 'resync';
export type AuthFormSide = 'left' | 'center' | 'right';
export type AuthBgKey =
  | 'none' | 'dark-veil' | 'soft-aurora' | 'aurora' | 'iridescence' | 'silk'
  | 'color-bends' | 'pixel-blast' | 'beams' | 'gradient-blinds' | 'liquid-ether'
  | 'line-waves' | 'light-rays' | 'grainient' | 'grid-distortion'
  | 'dot-grid' | 'shape-grid';

export type AuthBgConfig = Record<string, number | string | boolean>;

export type LayoutMode = 'sidebar' | 'topbar';
export type SidebarActiveStyle = 'left-border' | 'gradient' | 'solid' | 'soft' | 'glass' | 'minimal' | 'workly-neon';
export type SidebarBtnSize = number;
export type SidebarBtnGap = number;
export type SidebarIconColor = 'foreground' | 'background' | 'primary';
export type SidebarActiveTextColor = 'foreground' | 'white' | 'black' | 'primary';
export type DashboardBgEffect = 'none' | AuthBgKey;

export interface DashboardConfig {
  layoutMode: LayoutMode;
  sidebarActiveStyle: SidebarActiveStyle;
  sidebarBtnSize: SidebarBtnSize;
  sidebarBtnGap: SidebarBtnGap;
  sidebarIconColor: SidebarIconColor;
  sidebarActiveTextColor: SidebarActiveTextColor;
  sidebarBorderOpacity: number;
  // Background effect
  bgEffect: DashboardBgEffect;
  // Radial gradient
  bgGradientEnabled: boolean;
  bgGradientColor: string;
  bgGradientOpacity: number;
  bgGradientSize: number;      // % 20–200
  bgGradientX: number;         // % 0–100
  bgGradientY: number;         // % 0–100
  // Header + Sidebar chrome (unified)
  chromeOpacity: number;
  chromeBlur: boolean;
  chromeBlurIntensity: number;
  // Cards
  cardOpacity: number;
  cardBlur: boolean;
  cardBlurIntensity: number;
  cardGradientEnabled: boolean;
  cardGradientColor: string;
  cardGradientOpacity: number;
  cardGradientUseAccent: boolean;
}

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  layoutMode: 'sidebar',
  sidebarActiveStyle: 'left-border',
  sidebarBtnSize: 40,
  sidebarBtnGap: 12,
  sidebarIconColor: 'foreground',
  sidebarActiveTextColor: 'foreground',
  sidebarBorderOpacity: 20,
  bgEffect: 'none',
  bgGradientEnabled: false,
  bgGradientColor: '142 71% 45%',
  bgGradientOpacity: 30,
  bgGradientSize: 80,
  bgGradientX: 0,
  bgGradientY: 0,
  chromeOpacity: 100,
  chromeBlur: false,
  chromeBlurIntensity: 8,
  cardOpacity: 100,
  cardBlur: false,
  cardBlurIntensity: 0,
  cardGradientEnabled: false,
  cardGradientColor: '142 71% 45%',
  cardGradientOpacity: 15,
  cardGradientUseAccent: false,
};

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
  authFormSide: AuthFormSide;
  setAuthFormSide: (side: AuthFormSide) => void;
  authBg: AuthBgKey;
  setAuthBg: (bg: AuthBgKey) => void;
  authBgConfigs: Record<string, AuthBgConfig>;
  setAuthBgConfig: (bg: AuthBgKey, config: AuthBgConfig) => void;
  buttonStyleConfig: ButtonStyleConfig;
  setButtonStyleConfig: (cfg: ButtonStyleConfig) => void;
  dashboardConfig: DashboardConfig;
  setDashboardConfig: React.Dispatch<React.SetStateAction<DashboardConfig>>;
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
  const [authFormSide, setAuthFormSideState] = useState<AuthFormSide>(
    () => (localStorage.getItem('authFormSide') as AuthFormSide) || 'right');
  const [authBg, setAuthBgState] = useState<AuthBgKey>(
    () => (localStorage.getItem('authBg') as AuthBgKey) || 'none');
  const [authBgConfigs, setAuthBgConfigsState] = useState<Record<string, AuthBgConfig>>(parseConfigs);
  const [buttonStyleConfig, setButtonStyleConfigState] = useState<ButtonStyleConfig>(() => {
    try { return JSON.parse(localStorage.getItem('buttonStyleConfig') || 'null') || DEFAULT_BTN_CONFIG; }
    catch { return DEFAULT_BTN_CONFIG; }
  });
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(() => {
    try { return JSON.parse(localStorage.getItem('dashboardConfig') || 'null') || DEFAULT_DASHBOARD_CONFIG; }
    catch { return DEFAULT_DASHBOARD_CONFIG; }
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
    localStorage.setItem('authFormSide', authFormSide);
    localStorage.setItem('authBg', authBg);
    localStorage.setItem('authBgConfigs', JSON.stringify(authBgConfigs));
    localStorage.setItem('buttonStyleConfig', JSON.stringify(buttonStyleConfig));
    localStorage.setItem('dashboardConfig', JSON.stringify(dashboardConfig));
  }, [visualPattern, useCustomAccent, borderRadius, showShadows, authFormWidth, authBg, authBgConfigs, buttonStyleConfig, dashboardConfig]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--primary', activeAccentColor);
    root.style.setProperty('--accent', activeAccentColor);
    const parts = activeAccentColor.split(' ');
    const hue = parseInt(parts[0] || '0') || 0;
    const lightness = parseInt((parts[2] || '0%').replace('%', '')) || 0;
    const isCold = hue >= 40 && hue <= 200;
    const threshold = isCold ? 45 : 60;
    const fg = lightness >= threshold ? '240 10% 3.9%' : '0 0% 98%';
    root.style.setProperty('--primary-foreground', fg);
    root.style.setProperty('--accent-foreground', fg);
    root.style.setProperty('--radius', `${(borderRadius / 100) * 24}px`);
    root.style.setProperty('--auth-form-width', String(authFormWidth));
    root.style.setProperty('--auth-form-side', authFormSide);
    root.classList.toggle('no-shadows', !showShadows);
    localStorage.setItem('accentColor', accentColor);
  }, [activeAccentColor, accentColor, borderRadius, showShadows, authFormWidth, authFormSide]);

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
  const setAuthFormSide = (side: AuthFormSide) => setAuthFormSideState(side);
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
      authFormSide, setAuthFormSide,
      authBg, setAuthBg, authBgConfigs, setAuthBgConfig,
      buttonStyleConfig, setButtonStyleConfig,
      dashboardConfig, setDashboardConfig
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

/** Retorna o style object para header/sidebar (chrome) com opacidade e blur configuráveis */
export function useChromeStyle(): React.CSSProperties {
  const { dashboardConfig } = useTheme();
  const { chromeOpacity, chromeBlur, chromeBlurIntensity } = dashboardConfig;
  return {
    backgroundColor: `hsl(var(--card) / ${chromeOpacity / 100})`,
    backdropFilter: chromeBlur ? `blur(${chromeBlurIntensity}px)` : undefined,
    WebkitBackdropFilter: chromeBlur ? `blur(${chromeBlurIntensity}px)` : undefined,
  };
}

/** Retorna o style object para cards do dashboard com opacidade, blur e gradiente */
export function useCardStyle(gradientPos?: { x?: number; y?: number }): React.CSSProperties {
  const { dashboardConfig } = useTheme();
  const {
    cardOpacity, cardBlur, cardBlurIntensity,
    cardGradientEnabled, cardGradientColor, cardGradientOpacity, cardGradientUseAccent
  } = dashboardConfig;
  const x = gradientPos?.x ?? 0;
  const y = gradientPos?.y ?? 0;

  let backgroundImage: string | undefined;
  if (cardGradientEnabled) {
    const alpha = Math.round((cardGradientOpacity / 100) * 255).toString(16).padStart(2, '0');
    if (cardGradientUseAccent) {
      // Use CSS custom property directly — no conversion needed
      backgroundImage = `radial-gradient(ellipse 80% 80% at ${x}% ${y}%, hsl(var(--primary) / ${cardGradientOpacity / 100}), transparent 70%)`;
    } else if (cardGradientColor) {
      const parts = cardGradientColor.split(' ').map(parseFloat);
      if (parts.length === 3 && !parts.some(isNaN)) {
        const [h, s, l] = parts;
        const ll = l / 100, a = (s / 100) * Math.min(ll, 1 - ll);
        const f = (n: number) => { const k = (n + h / 30) % 12; return Math.round(255 * (ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1))).toString(16).padStart(2, '0'); };
        const hex = `#${f(0)}${f(8)}${f(4)}`;
        backgroundImage = `radial-gradient(ellipse 80% 80% at ${x}% ${y}%, ${hex}${alpha}, transparent 70%)`;
      }
    }
  }

  return {
    backgroundColor: `hsl(var(--card) / ${cardOpacity / 100})`,
    backdropFilter: cardBlur ? `blur(${cardBlurIntensity}px)` : undefined,
    WebkitBackdropFilter: cardBlur ? `blur(${cardBlurIntensity}px)` : undefined,
    ...(backgroundImage ? { backgroundImage } : {}),
  };
}
