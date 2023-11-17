'use client';
import { createContext, useEffect, useState } from 'react';

type Themes = 'system' | 'light' | 'dark';
export const ThemeContext = createContext<{
  theme: Themes;
  handleThemeChange: (theme: Themes) => void;
}>({ theme: 'system', handleThemeChange: () => {} });

const LS_THEME_KEY = 'theme';
export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Themes>('system');

  const setToDarkTheme = () => {
    document.documentElement.classList.add('dark');
  };
  const setToLightTheme = () => {
    document.documentElement.classList.remove('dark');
  };
  const handleThemeChange = (theme: Themes) => {
    localStorage.setItem(LS_THEME_KEY, theme);
    setTheme(theme);
    if (theme === 'dark') setToDarkTheme();
    if (theme === 'light') setToLightTheme();
    if (theme === 'system') {
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? setToDarkTheme()
        : setToLightTheme();
    }
  };

  useEffect(() => {
    // Defaults to 'system' if there's no saved theme
    const savedTheme = (localStorage.getItem(LS_THEME_KEY) ||
      'system') as Themes;
    handleThemeChange(savedTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
}
