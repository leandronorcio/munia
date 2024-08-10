'use client';

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

type Themes = 'system' | 'light' | 'dark';
export const ThemeContext = createContext<{
  theme: Themes;
  handleThemeChange: (theme: Themes) => void;
}>({ theme: 'system', handleThemeChange: () => {} });

const LS_THEME_KEY = 'theme';
export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Themes>('system');

  const setToDarkTheme = useCallback(() => {
    document.documentElement.classList.add('dark');
  }, []);
  const setToLightTheme = useCallback(() => {
    document.documentElement.classList.remove('dark');
  }, []);
  const handleThemeChange = useCallback(
    (themeValue: Themes) => {
      localStorage.setItem(LS_THEME_KEY, themeValue);
      setTheme(themeValue);
      if (themeValue === 'dark') setToDarkTheme();
      if (themeValue === 'light') setToLightTheme();
      if (themeValue === 'system' && window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setToDarkTheme();
        } else {
          setToLightTheme();
        }
      }
    },
    [setToDarkTheme, setToLightTheme],
  );
  const value = useMemo(() => ({ theme, handleThemeChange }), [theme, handleThemeChange]);

  useEffect(() => {
    // Defaults to 'system' if there's no saved theme
    const savedTheme = (localStorage.getItem(LS_THEME_KEY) || 'system') as Themes;
    handleThemeChange(savedTheme);
  }, [handleThemeChange]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
