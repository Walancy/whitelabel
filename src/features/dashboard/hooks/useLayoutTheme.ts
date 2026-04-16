import { useState, useCallback } from 'react';
import type { DashboardTheme } from '../types';
import { DEFAULT_THEME } from '../types';

const KEY = 'whitelabel:layout-theme:v1';

function loadTheme(): DashboardTheme {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function useLayoutTheme() {
  const [theme, setThemeState] = useState<DashboardTheme>(loadTheme);

  const setTheme = useCallback((newTheme: Partial<DashboardTheme> | ((prev: DashboardTheme) => DashboardTheme)) => {
    setThemeState(prev => {
      const updated = typeof newTheme === 'function' ? newTheme(prev) : { ...prev, ...newTheme };
      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { theme, setTheme };
}
